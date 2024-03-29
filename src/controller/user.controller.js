require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../config/db");

function formatarDataParaString(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

exports.signup = async (req, res) => {
  try {
    //Requisição do body
    const { username, email, password } = req.body;

    // Validação dos campos de entrada
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validação para saber se o email já está em uso
    const emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    // Validação para saber se o usaurio já está em uso
    const userExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already taken' });
    }

    // Hash da senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria novo usuario no banco de dados
    const newUser = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    // Gera um token de autenticação
    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    // Retorna o novo usuario criado
    return res.status(201).json({ user: newUser.rows[0], token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    // Requisição do body
    const { email_or_username, password } = req.body;

    // Validação dos campos de entrada
    if (!email_or_username || !password) {
      return res.status(400).json({ message: 'Email or username and password are required' });
    }

    // Consulta o usuário no banco de dados pelo email ou nome de usuário
    const user = await db.query('SELECT u.id, u.username, u.email, u.password, u.created_at, up.icon FROM users u JOIN user_profile up ON up.userid = u.id WHERE username  = $1 OR email  = $1',
      [email_or_username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or username or password' });
    }

    // Verifica se a senha fornecida corresponde à senha no banco de dados
    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or username or password' });
    }


    // Gera um token de autenticação
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ user: user.rows[0], token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userId = req.user.id;

    const user = await db.query(
      `
      UPDATE users
      SET password = $1 
      WHERE id = $2
      `,
      [
        hashedPassword,
        userId
      ]
    )
    return res.status(201).json({ user: 'Senha alterada com sucesso!'});
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.createUserProfile = async (req, res) => {
  try {
    // Requisição do body e do usuario autenticado
    const {
      name,
      familyName,
      bio,
      location,
      birthday,
      socialmediaInstagram,
      socialMediaX,
      socialMediaTikTok,
      userProfileTag,
      icon
    } = req.body;

    const userId = req.user.id;

    const { rows: [userProfile] } = await db.query(
      `INSERT INTO user_profile(name, familyName, bio, userId, location, birthday, socialmediaInstagram, socialMediaX, socialMediaTikTok, userProfile, icon) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`,
      [
        name,
        familyName,
        bio,
        userId,
        location,
        birthday,
        socialmediaInstagram,
        socialMediaX,
        socialMediaTikTok,
        userProfileTag,
        icon
      ]
    );
    res.status(201).json({
      message: 'Perfil criado com sucesso',
      body: {
        profile: userProfile
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Um erro aconteceu enquanto o perfil de usuario era criado',
      error
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // Requisição do usuario autenticado
    const userId = req.user.id;

    const { rows: [userProfile] } = await db.query(
      `SELECT u.id, u.userid, u.name as givenName, u.familyname, u.location, u.bio, u.birthday, u.socialmediainstagram, u.socialmediax, u.socialmediatiktok, u.userprofile, u.icon, 
      (SELECT COUNT(*) FROM reviews WHERE userId = $1) AS contadorreviews, 
      (SELECT COUNT(*) FROM lists WHERE userId = $1) AS contadorlists
      FROM user_profile u
      WHERE u.userId = $1
      `,
      [userId]
    );

    let { rows: [watchlistCount] } = await db.query(
      `
      SELECT 
      COUNT(DISTINCT movie) AS movies_count
      FROM lists l
      JOIN users u ON l.userId = u.id
      JOIN user_profile up ON u.id = up.userid,
      LATERAL unnest(l.moviesid) AS movie
      WHERE l.name = 'Watchlist' and u.id = $1
      GROUP BY u.username, l.name, l.moviesid,l.movies, l.description, l.created_at, up.name, up.familyname;
      `,
      [userId]
    )

    if (watchlistCount == undefined) {
      watchlistCount = {
        "movies_count": null
      };
    }


    // Formata a data de nascimento para o formato 'DD/MM/AAAA'
    if (userProfile && userProfile.birthday) {
      const dataFormatada = formatarDataParaString(new Date(userProfile.birthday));
      userProfile.birthday = dataFormatada;
    }

    res.status(200).json({
      message: 'Perfil encontrado com sucesso!',
      body: {
        profile: userProfile, watchlistCount
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Um erro aconteceu enquanto o perfil era buscado',
      error,
    });
  }
};

exports.getProfileByUser = async (req, res) => {
  try {
    const userProfileQuery = req.query.userProfile;

    // Consulta o userId baseado no userProfile
    const userIdQuery = await db.query('SELECT * FROM user_profile WHERE LOWER(userProfile) = LOWER($1)', [userProfileQuery]);

    if (userIdQuery.rows.length === 0) {
      return res.status(400).json({
        message: 'O usuário não foi encontrado'
      });
    }

    const userId = userIdQuery.rows[0].userid;

    // Consulta o perfil do usuário
    const { rows: [userProfile] } = await db.query(
      `SELECT u.id, u.userid, u.name as givenName, u.familyname, u.bio, u.location, u.birthday, u.socialmediainstagram, u.socialmediax, u.socialmediatiktok, u.userprofile, 
      l.id, l.name AS list_name, l.description, l.moviesid, l.ispublic, l.userid, u.icon, 
      (SELECT COUNT(*) FROM reviews WHERE userId = $1) AS contadorreviews, 
      (SELECT COUNT(*) FROM lists WHERE userId = $1) AS contadorlists
      FROM user_profile u
      INNER JOIN lists l ON u.userid = l.userid
      WHERE u.userId = $1 AND l.name = 'Meus filmes favoritos'`,
      [userId]
    );

    let { rows: [watchlistCount] } = await db.query(
      `
      SELECT 
      COUNT(DISTINCT movie) AS movies_count
      FROM lists l
      JOIN users u ON l.userId = u.id
      JOIN user_profile up ON u.id = up.userid,
      LATERAL unnest(l.movies) AS movie
      WHERE l.name = 'Watchlist' and u.id = $1
      GROUP BY u.username, l.name, l.moviesid,l.movies, l.description, l.created_at, up.name, up.familyname;
      `,
      [userId]
    )

    if (watchlistCount == undefined) {
      watchlistCount = {
        "movies_count": null
      };
    }

    // Formata a data de nascimento para o formato 'DD/MM/AAAA'
    if (userProfile && userProfile.birthday) {
      const dataFormatada = formatarDataParaString(new Date(userProfile.birthday));
      userProfile.birthday = dataFormatada;
    }

    res.status(200).json({
      message: 'Perfil encontrado com sucesso!',
      body: {
        profile: userProfile, watchlistCount
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Um erro aconteceu enquanto o perfil era buscado',
      error,
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.query.toLowerCase().trim();

    const { rows: users } = await db.query(
      'SELECT * FROM user_profile WHERE LOWER(userProfile) LIKE $1',
      [`%${searchQuery}%`]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: 'Nenhum usuário encontrado com a consulta fornecida',
      });
    }

    const profiles = users.map(user => {
      return {
        userId: user.userid,
        givenName: user.name,
        familyName: user.familyname,
        userProfile: user.userprofile,
        icon: user.icon || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp',
      };
    });

    res.status(200).json({
      message: 'Usuários encontrados com sucesso!',
      body: {
        users: profiles,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Um erro aconteceu durante a busca de usuários',
      error,
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    // Requisição do body e do usuario autenticado
    const {
      name,
      familyName,
      bio,
      location,
      birthday,
      socialmediaInstagram,
      socialMediaX,
      socialMediaTikTok
    } = req.body;
    const userId = req.user.id;

    // Atualiza o perfil do usuário no banco de dados
    const { rows: [newProfile] } = await db.query(
      `UPDATE user_profile
       SET name = $1,
        familyName = $2,
        bio = $3,
        location = $4,
        birthday = $5,
        socialmediaInstagram = $6, 
        socialMediaX = $7,
        socialMediaTikTok = $8
       WHERE userId = $9
       RETURNING *`,
      [
        name,
        familyName,
        bio,
        location,
        birthday,
        socialmediaInstagram,
        socialMediaX,
        socialMediaTikTok,
        userId]
    );

    return res.status(200).json({
      message: "Perfil atualizado com sucesso",
      profile: newProfile
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao atualizar a review.",
      error
    });
  }
};

exports.updateUserProfilePartially = async (req, res) => {
  try {
    //Requisição do body e do usuario autenticado
    const {
      name,
      familyName,
      bio,
      location,
      birthday,
      socialmediaInstagram,
      socialMediaX,
      socialMediaTikTok,
      icon
    } = req.body;
    const userId = req.user.id;

    // Consulta o perfil existente do usuário
    const existingProfile = await db.query(
      "SELECT * FROM user_profile WHERE userId = $1",
      [userId]
    );

    // Atualiza apenas os campos fornecidos no corpo da requisição, mantendo os valores existentes se não forem fornecidos
    const updatedProfile = {
      name: name || existingProfile.rows[0].name,
      familyName: familyName || existingProfile.rows[0].familyname,
      bio: bio || existingProfile.rows[0].bio,
      location: location || existingProfile.rows[0].location,
      birthday: birthday || existingProfile.rows[0].birthday,
      socialmediaInstagram: socialmediaInstagram || existingProfile.rows[0].socialmediaInstagram,
      socialMediaX: socialMediaX || existingProfile.rows[0].socialMediax,
      socialMediaTikTok: socialMediaTikTok || existingProfile.rows[0].socialMediatiktok,
      icon: icon || existingProfile.rows[0].icon
    };

    // Atualiza o perfil no banco de dados
    const { rows: [newProfile] } = await db.query(
      `UPDATE user_profile 
       SET name = $1, 
        familyName = $2, 
        bio = $3, 
        location = $4,
        birthday = $5, 
        socialmediaInstagram = $6, 
        socialMediaX = $7, 
        socialMediaTikTok = $8,
        icon = $9
       WHERE userId = $10 
       RETURNING *`,
      [
        updatedProfile.name,
        updatedProfile.familyName,
        updatedProfile.bio,
        updatedProfile.location,
        updatedProfile.birthday,
        updatedProfile.socialmediaInstagram,
        updatedProfile.socialMediaX,
        updatedProfile.socialMediaTikTok,
        icon,
        userId
      ]
    );
    return res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      profile: newProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao atualizar o perfil.",
      error,
    });
  }
};

exports.AuthMiddleware = async (req, res, next) => {
  try {

    // Verifica se o token está no header
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token de autorização não fornecido' });
    }

    // Verifica se o token é válido
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Consulta o usuário no banco de dados com base no ID do token decodificado
    const user = await db.query('SELECT * FROM users WHERE id = $1', [decodedToken.id]);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Define o objeto do usuário na requisição para uso nas rotas protegidas
    req.user = user.rows[0];

    // Continua com a execução das rotas protegidas
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.GetRatingCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const ratingCount = await db.query(
      `
      SELECT rating, COUNT(*) 
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE userId = $1
      GROUP BY rating
      ORDER BY rating DESC;      
      `,
      [userId]
    );

    const ratings = ratingCount.rows;

    res.status(200).json({
      rating: ratings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Um erro aconteceu enquanto o perfil era buscado',
      error,
    });
  }
}

exports.GetRatingCountByUser = async (req, res, next) => {
  try {

    const userProfile = req.query.userProfile;

    const userIdQuery = await db.query('SELECT * FROM user_profile WHERE userProfile = $1', [userProfile]);

    const userId = userIdQuery.rows[0].userid;

    const ratingCount = await db.query(
      `
      SELECT rating, COUNT(*) 
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE userId = $1
      GROUP BY rating
      ORDER BY rating DESC;      
      `,
      [userId]
    );

    const ratings = ratingCount.rows;

    res.status(200).json({
      rating: ratings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Um erro aconteceu enquanto o perfil era buscado',
      error,
    });
  }
}





















































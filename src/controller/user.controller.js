require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../config/db");
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'E:\\Programação\\Projetos em Node\\Movie review API\\public\\uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

function formatarDataParaString(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}


exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    if (!username) {
      return res.status(400).json({
        message: 'Username is required'
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Password is required'
      });
    }

    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    return res.status(201).json({ user: newUser.rows[0], token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Password is required'
      });
    }

    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

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

exports.createUserProfile = async (req, res) => {
  upload.single('icon')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }

    const { name, familyName, bio, city, country, birthday, socialmediaInstagram, socialMediaX, socialMediaTikTok, userProfileTag } = req.body;
    const icon = req.file;
    const userId = req.user.id;

    try {
      const { rows: [userProfile] } = await db.query(
        `INSERT INTO user_profile(name, familyName, bio, userId, icon, city, country, birthday, socialmediaInstagram, socialMediaX, socialMediaTikTok, userProfile) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *`,
        [name, familyName, bio, userId, icon, city, country, birthday, socialmediaInstagram, socialMediaX, socialMediaTikTok, userProfileTag]
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
  });
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows: [userProfile] } = await db.query(
      `SELECT u.id, u.userid, u.name as givenName, u.familyname, u.bio, u.city, u.country, u.birthday, u.socialmediainstagram, u.socialmediax, u.socialmediatiktok, u.userprofile, 
      l.id, l.name AS list_name, l.description, l.movies, l.ispublic, l.userid, 
      (SELECT COUNT(*) FROM reviews WHERE userId = $1) AS contadorreviews, 
      (SELECT COUNT(*) FROM lists WHERE userId = $1) AS contadorlists
      FROM user_profile u
      INNER JOIN lists l ON u.userid = l.userid
      WHERE u.userId = $1 AND l.name = 'Meus filmes favoritos'`,
      [userId]
    );

    if (userProfile && userProfile.icon) {
      const iconBase64 = userProfile.icon.toString('base64');
      userProfile.iconBase64 = iconBase64;
    }

    if (userProfile && userProfile.birthday) {
      const dataFormatada = formatarDataParaString(new Date(userProfile.birthday));
      userProfile.birthday = dataFormatada;
    }

    res.status(200).json({
      message: 'Perfil encontrado com sucesso!',
      body: {
        profile: userProfile,
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
  const userProfileQuery = req.query.userProfile;

  const userIdQuery = await db.query('SELECT * FROM user_profile WHERE userProfile = $1', [userProfileQuery]);

  if (userIdQuery.rows.length === 0) {
    return res.status(400).json({
      message: 'O usuário não foi encontrado'
    });
  }

  const userId = userIdQuery.rows[0].userid;

  try {
    const { rows: [userProfile] } = await db.query(
      `SELECT *, (SELECT COUNT(*) FROM reviews WHERE userId = $1) AS contadorreviews, (SELECT COUNT(*) FROM lists WHERE userId = $1) AS contadorlists
       FROM user_profile
       WHERE userId = $1`,
      [userId]
    );

    if (userProfile && userProfile.icon) {
      const iconBase64 = userProfile.icon.toString('base64');
      userProfile.iconBase64 = iconBase64;
    }

    if (userProfile && userProfile.birthday) {
      const dataFormatada = formatarDataParaString(new Date(userProfile.birthday));
      userProfile.birthday = dataFormatada;
    }

    res.status(200).json({
      message: 'Perfil encontrado com sucesso!',
      body: {
        profile: userProfile,
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

exports.updateUserProfile = async (req, res) => {
  const { name, familyName, bio, city, country, birthday, socialmediaInstagram, socialMediaX, socialMediaTikTok, userProfileTag } = req.body;
  const userId= req.user.id;

  try {
    const { rows: [newProfile] } = await db.query(
      `UPDATE user_profile
       SET name = $1,
        familyName = $2,
        bio = $3,
        city = $4,
        country = $5,
        birthday = $6,
        socialmediaInstagram = $7, 
        socialMediaX = $8,
        socialMediaTikTok = $9, 
        userProfile = $10
       WHERE userId = $11
       RETURNING *`,
      [name, familyName, bio, city, country, birthday, socialmediaInstagram, socialMediaX, socialMediaTikTok, userProfileTag, userId]
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
  const { name, familyName, bio, city, country, birthday, socialmediaInstagram, socialMediaX, socialMediaTikTok, userProfileTag } = req.body;
  const userId = req.user.id;

  try {
    const existingProfile = await db.query(
      "SELECT * FROM user_profile WHERE userId = $1",
      [userId]
    );

    const updatedProfile = {
      name: name || existingProfile.rows[0].name,
      familyName: familyName || existingProfile.rows[0].familyname,
      bio: bio || existingProfile.rows[0].bio,
      city: city || existingProfile.rows[0].city,
      country: country || existingProfile.rows[0].country,
      birthday: birthday || existingProfile.rows[0].birthday,
      socialmediaInstagram: socialmediaInstagram || existingProfile.rows[0].socialmediainstagram,
      socialMediaX: socialMediaX || existingProfile.rows[0].socialMediax,
      socialMediaTikTok: socialMediaTikTok || existingProfile.rows[0].socialMediatiktok,
      userProfile: userProfileTag || existingProfile.rows[0].userprofile
    };

    const { rows: [newProfile] } = await db.query(
      `UPDATE user_profile 
       SET name = $1, 
        familyName = $2, 
        bio = $3, 
        city = $4, 
        country = $5, 
        birthday = $6, 
        socialmediaInstagram = $7, 
        socialMediaX = $8, 
        socialMediaTikTok = $9, 
        userProfile = $10
       WHERE userId = $11 
       RETURNING *`,
      [updatedProfile.name, updatedProfile.familyName, updatedProfile.bio, updatedProfile.city, updatedProfile.country, updatedProfile.birthday, updatedProfile.socialmediaInstagram, updatedProfile.socialMediaX, updatedProfile.socialMediaTikTok, updatedProfile.userProfile, userId]
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
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.query('SELECT * FROM users WHERE id = $1', [decodedToken.id]);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user.rows[0];

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};





















































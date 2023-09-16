require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../config/db");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar se o email, username e password são fornecidos
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

    // Verificar se o usuário já existe pelo email
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir novo usuário no banco de dados
    const newUser = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    // Gerar o token de autenticação do usuário
    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retornar o novo usuário e o token
    return res.status(201).json({ user: newUser.rows[0], token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o email e a senha são fornecidos
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

    // Verificar se o usuário existe pelo email
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verificar se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Gerar o token de autenticação do usuário
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retornar o usuário e o token
    return res.status(200).json({ user: user.rows[0], token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createUserProfile = async (req, res) => {
  const {name, familyName, bio} = req.body;
  const userId = req.user.id;

  try{
    const { rows: [userProfile]} = await db.query(
      `INSERT INTO user_profile(name, familyName, bio, userId) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [name, familyName, bio, userId]
    );

    res.status(201).json({
      message: 'Perfil criado com sucesso',
      body: {
        profile: userProfile
      }
    });
  } catch (error){
    console.log(error);
    res.status(400).json({
      message: 'Um erro aconteceu enquanto o perfil de usuario era criado',
      error
    });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try{
    const { rows: [userProfile] } = await db.query(
      `SELECT * 
       FROM user_profile
       WHERE userId = $1`,
       [userId]
    );
    
    res.status(201).json({
      message: 'Perfil encontrado com sucesso!',
      body: {
        profile: userProfile
      }
    });
  } catch(error){
    res.status(500).json({
      message: 'Um erro aconteceu enquanto o comentário era criado',
      error
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  const {name, familyName, bio} = req.body;
  const userId = req.user.id;

  try{
    const { rows: [newProfile] } = await db.query(
      `UPDATE user_profile
       SET name = $1, 
       familyName = $2,
       bio = $3
       WHERE userId = $4 
       RETURNING *`,
       [name, familyName, bio, userId]
    );
    
    return res.status(200).json({
      message: "Perfil atualizado com sucesso",
      profile: newProfile
    });

  } catch(error){
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao atualizar a review.",
      error
    });
  }
};

exports.updateUserProfilePartially = async (req, res) => {
  const { name, familyName, bio } = req.body;
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
    };

    const { rows: [newProfile] } = await db.query(
      `UPDATE user_profile 
      SET name = $1, familyName = $2, bio = $3 
      WHERE userId = $4 
      RETURNING *`,
      [updatedProfile.name, updatedProfile.familyName, updatedProfile.bio, userId]
    );

    return res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      review: newProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ocorreu um erro ao atualizar a review.",
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

  
  


















































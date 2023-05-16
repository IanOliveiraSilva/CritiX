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
  


















































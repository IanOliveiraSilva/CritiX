require('dotenv').config();

const axios = require("axios");
const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Função para pesquisar um filme por título
exports.getMovieByTitle = async (req, res) => {
  const { title } = req.query;
  try {
    const omdbResponse = await axios.get(`http://www.omdbapi.com/?t=${title}&apikey=${OMDB_API_KEY}`);
    if (omdbResponse.status === 200 && omdbResponse.data && omdbResponse.data.Response === 'True') {
      const movieData = omdbResponse.data;
      return res.status(200).json(movieData);
    } else {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao pesquisar filme:', error);
    return res.status(500).json({ message: 'Erro ao pesquisar filme' });
  }
};

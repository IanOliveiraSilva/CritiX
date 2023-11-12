require('dotenv').config();

const axios = require("axios");
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const db = require("../config/db");

exports.getGameByTitle = async (req, res) => {
    const { title } = req.query;
    try {
        const rawgResponse = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${title}`);
        if (rawgResponse.status === 200 && rawgResponse.data.results.length > 0) {
            const game = rawgResponse.data.results[0];
            const gameData = {
                name: game.name,
                released: game.released,
                rating: game.rating,
                genres: game.genres.map(genre => genre.name),
                description: game.description,
                image: game.background_image
            };
            res.status(200).json({
                body: {
                    gameData
                }
            });
        } else {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao pesquisar jogo' });
    }
};

exports.getGameById = async (req, res) => {
    const { id } = req.query;
    try {
        const rawgResponse = await axios.get(`https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`);
        if (rawgResponse.status === 200) {
            const game = rawgResponse.data;
            const gameData = {
                name: game.name,
                released: game.released,
                rating: game.rating,
                genres: game.genres.map(genre => genre.name),
                description: game.description,
                image: game.background_image,
                metacritic: game.metacritic,
                playtime: game.playtime,
                platforms: game.platforms.map(platform => platform.platform.name),
                website: game.website,
            };
            res.status(200).json({
                body: {
                    gameData
                }
            });
        } else {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao pesquisar jogo' });
    }
};



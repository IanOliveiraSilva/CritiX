
-- Criação da tabela 'users'
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela 'movies'
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  imdbID VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  year VARCHAR(255) NOT NULL,
  runtime VARCHAR(255) NOT NULL,
  released VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL,
  director VARCHAR(255) NOT NULL,
  writer VARCHAR(255) NOT NULL,
  actors VARCHAR(255) NOT NULL,
  plot TEXT NOT NULL,
  country VARCHAR(255) NOT NULL,
  awards VARCHAR(255) NOT NULL,
  poster VARCHAR(255) NOT NULL,
  imdbRating VARCHAR(255) NOT NULL,
  metascore VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mediaNotas DECIMAL(10,2) 	
);

-- Criação da tabela 'reviews'
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
  movieId INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  rating FLOAT NOT NULL,
  review TEXT NOT NULL,
  isPublic BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela 'Movie'

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    imdbid VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    runtime VARCHAR(255) NOT NULL,
    released VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    writer VARCHAR(255) NOT NULL,
    actors VARCHAR(255) NOT NULL,
    plot TEXT NOT NULL,
    country VARCHAR(255) NOT NULL,
    awards VARCHAR(255) NOT NULL,
    poster VARCHAR(255) NOT NULL,
    imdbrating VARCHAR(255) NOT NULL,
    metascore VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    medianotas NUMERIC(10,2)
);

-- Criação da tabela 'Lists'
CREATE TABLE IF NOT EXISTS lists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    movies INTEGER[],
    ispublic BOOLEAN NOT NULL,
    userid INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id)
);


-- Criação da tabela 'Movie_Lists'
CREATE TABLE IF NOT EXISTS movies_lists (
    listid INTEGER NOT NULL,
    movieid INTEGER NOT NULL,
    FOREIGN KEY (listid) REFERENCES lists(id),
    FOREIGN KEY (movieid) REFERENCES movies(id)
);

-- Criação da tabela 'Comments'
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    reviewid INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    comment TEXT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewid) REFERENCES reviews(id),
    FOREIGN KEY (userid) REFERENCES users(id)
);


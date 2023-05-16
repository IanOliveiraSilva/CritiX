SELECT * FROM movies;
SELECT * FROM reviews;
SELECT * FROM users;

DROP TABLE movies;
DROP TABLE reviews;
DROP TABLE users;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  runtime VARCHAR(20),
  released VARCHAR(50),
  genre VARCHAR(255),
  director VARCHAR(255),
  writer VARCHAR(255),
  actors VARCHAR(255),
  plot TEXT,
  country VARCHAR(255),
  awards TEXT,
  poster VARCHAR(255),
  imdbrating FLOAT,
  metascore INTEGER,
  imdbid VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  movieid INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  review TEXT,
  ispublic BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (userid) REFERENCES users (id),
  FOREIGN KEY (movieid) REFERENCES movies (id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

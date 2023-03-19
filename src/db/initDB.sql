CREATE TABLE IF NOT EXISTS genres (
  id serial PRIMARY KEY,
  title VARCHAR(255) not NULL
);


CREATE TABLE IF NOT EXISTS films (
  id serial PRIMARY KEY,
  title VARCHAR(255),
  year INTEGER
);

CREATE TABLE IF NOT EXISTS film_genres (
  genreId INTEGER,
  FOREIGN KEY (genreId) REFERENCES genres (id) on delete NO ACTION,
  filmId INTEGER,
  FOREIGN KEY (filmId) REFERENCES films (id) on delete NO ACTION
);
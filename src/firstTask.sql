CREATE TABLE IF NOT EXISTS persons (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
  id serial PRIMARY KEY,
  name VARCHAR(255) not NULL
);

CREATE TABLE IF NOT EXISTS countries (
  id serial PRIMARY KEY,
  name VARCHAR(255) not NULL
);

CREATE TABLE IF NOT EXISTS films (
  id serial PRIMARY KEY,
  title VARCHAR(255),
  descr TEXT,
  slogan VARCHAR(255),
  year INTEGER,
  budget INTEGER,
  marketing INTEGER,
  duration INTEGER,
  premier TIMESTAMP,
  countryId INTEGER,
  FOREIGN KEY (countryId) REFERENCES countries (id) on delete SET NULL, 
  directorId INTEGER,
  FOREIGN KEY (directorId) REFERENCES persons (id) on delete SET NULL, 
  screenwriterId INTEGER,
  FOREIGN KEY (screenwriterId) REFERENCES persons (id) on delete SET NULL, 
  cameramanId INTEGER,
  FOREIGN KEY (cameramanId) REFERENCES persons (id) on delete SET NULL, 
  artistId INTEGER,
  FOREIGN KEY (artistId) REFERENCES persons (id) on delete SET NULL, 
  composerId INTEGER,
  FOREIGN KEY (composerId) REFERENCES persons (id) on delete SET NULL, 
  editorId INTEGER,
  FOREIGN KEY (editorId) REFERENCES persons (id) on delete SET NULL
);

CREATE TABLE IF NOT EXISTS film_views (
  countryId INTEGER,
  FOREIGN KEY (countryId) REFERENCES countries (id) on delete NO ACTION,
  filmId INTEGER,
  FOREIGN KEY (filmId) REFERENCES films (id) on delete NO ACTION,
  count integer not NULL
);

CREATE TABLE IF NOT EXISTS film_genres (
  genreId INTEGER,
  FOREIGN KEY (genreId) REFERENCES genres (id) on delete NO ACTION,
  filmId INTEGER,
  FOREIGN KEY (filmId) REFERENCES films (id) on delete NO ACTION
);

CREATE TABLE IF NOT EXISTS film_actors (
  actorId INTEGER,
  FOREIGN KEY (actorId) REFERENCES persons (id) on delete NO ACTION,
  filmId INTEGER,
  FOREIGN KEY (filmId) REFERENCES films (id) on delete NO ACTION,
  role VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS film_dubles (
  actorId INTEGER,
  FOREIGN KEY (actorId) REFERENCES persons (id) on delete NO ACTION,
  filmId INTEGER,
  FOREIGN KEY (filmId) REFERENCES films (id) on delete NO ACTION,
  role VARCHAR(255)
);
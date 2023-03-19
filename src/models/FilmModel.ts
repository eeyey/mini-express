import db from '../db';

type Film = { id: number; title: string; year: number; genres: number[] };
type ErrorNotify = { message: string };

export default class FilmModel {
  static async getFilms(): Promise<Film[]> {
    const filmsGet = `
    SELECT films.id, films.title, films.year, string_agg(genres.id::varchar, ', ') AS genres
    FROM films 
    JOIN film_genres ON film_genres.filmId = films.id
    JOIN genres ON genres.id = film_genres.genreId
    GROUP BY films.id
    `;
    const rows = (await db.query(filmsGet)).rows;

    rows.forEach(
      (row) => (row.genres = row.genres.split(',').map((id) => +id)),
    );

    return rows as Film[];
  }

  static async getFilm(id: number): Promise<Film> {
    const filmGet = `
      SELECT films.id, films.title, films.year, string_agg(genres.id::varchar, ', ') AS genres
      FROM films 
      JOIN film_genres ON film_genres.filmId = films.id
      JOIN genres ON genres.id = film_genres.genreId
      where films.id = $1
      GROUP BY films.id
    `;
    const result = (await db.query(filmGet, [id])).rows[0];

    result.genres = result.genres.split(',').map((id) => +id);

    return result as Film;
  }

  static async updateFilm(id: number, data: Omit<Film, 'id'>): Promise<Film> {
    const updateFilm = `UPDATE films SET title = $1, year = $2 WHERE id = $3`;
    const deleteGenres = 'DELETE FROM film_genres WHERE filmId = $1';
    const insertReference =
      'INSERT INTO film_genres (genreId, filmId) VALUES ($1, $2)';

    if (!data.title || !data.year || !data.genres)
      throw new Error(
        'Не удалось обновить фильм. Обязательные поля: title, year, genres',
      );

    await db.query(updateFilm, [data.title, data.year, id]);
    await db.query(deleteGenres, [id]);

    for (const genreId of data.genres) {
      await db.query(insertReference, [genreId, id]);
    }

    return { id, ...data };
  }

  static async deleteFilm(id: number) {
    const deleteGenres = 'DELETE FROM film_genres WHERE filmId = $1';
    const deleteFilm = 'DELETE FROM films WHERE id = $1';

    await db.query(deleteGenres, [id]);
    await db.query(deleteFilm, [id]);

    return true;
  }

  static async createFilm(data: Omit<Film, 'id'>): Promise<Film> {
    const filmInsert =
      'INSERT INTO FILMS (title, year) values ($1, $2) RETURNING id';

    const insertReference =
      'INSERT INTO film_genres (genreId, filmId) VALUES ($1, $2)';

    if (!data.title || !data.year || !data.genres)
      throw new Error(
        'Не удалось добавить фильм. Обязательные поля: title, year, genres',
      );

    const result = await db.query(filmInsert, [data.title, data.year]);
    const filmId = result.rows[0].id;

    for (const genreId of data.genres) {
      await db.query(insertReference, [genreId, filmId]);
    }

    return { id: filmId, genres: data.genres, ...data };
  }
}

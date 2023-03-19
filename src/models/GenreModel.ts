import db from '../db';

type Genre = { id: number; title: string };

export default class GenreModel {
  static async getGenres(): Promise<Genre[]> {
    const genresGet = 'SELECT * from genres';

    return (await db.query(genresGet)).rows as Genre[];
  }

  static async getGenre(id: number): Promise<Genre> {
    const genreGet = 'SELECT * from genres WHERE id = $1';

    return (await db.query(genreGet, [id])).rows[0] as Genre;
  }

  static async updateGenre(
    id: number,
    data: Omit<Genre, 'id'>,
  ): Promise<Genre> {
    const updateGenre = `UPDATE genres SET title = $1 WHERE id = $2`;

    if (!data.title)
      throw new Error('Не удалось обновить фильм. Обязательные поля: title');

    await db.query(updateGenre, [data.title, id]);

    return { id, ...data };
  }

  static async deleteGenre(id: number) {
    const deleteReferences = 'DELETE FROM film_genres WHERE genreId = $1';
    const deleteGenre = 'DELETE FROM genres WHERE id = $1';

    await db.query(deleteReferences, [id]);
    await db.query(deleteGenre, [id]);

    return true;
  }

  static async createGenre(data: Omit<Genre, 'id'>): Promise<Genre> {
    const genreInsert = 'INSERT INTO genres (title) values ($1) RETURNING id';

    if (!data.title)
      throw new Error('Не удалось добавить жанр. Обязательные поля: title');

    const result = await db.query(genreInsert, [data.title]);
    const genreId = result.rows[0].id;

    return { id: genreId, ...data };
  }
}

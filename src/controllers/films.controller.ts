import FilmModel from '../models/FilmModel';
import { Request, Response } from '../types';

class FilmsController {
  static async getFilms(req: Request, res: Response) {
    try {
      const films = await FilmModel.getFilms();

      return res.status(200).json(films);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось получить фильмы' });
    }
  }

  static async getFilm(req: Request<{ id: string }>, res: Response) {
    try {
      const id = +req.params.id;

      if (!id)
        return res.status(404).json({
          message: 'Не удалось обновить фильм. Некорректный id',
        });

      const film = await FilmModel.getFilm(id);

      return res.status(200).json(film);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось получить фильм' });
    }
  }

  static async createFilm(
    req: Request<{}, { title: string; year: number; genres: number[] }>,
    res: Response,
  ) {
    try {
      const data = req.body;

      if (!data.title || !data.year || !data.genres)
        return res.status(404).json({
          message:
            'Не удалось создать фильм. Обязательные поля: title, year, genres',
        });

      const film = await FilmModel.createFilm(data);

      return res.status(200).json(film);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось обновить фильм' });
    }
  }

  static async deleteFilm(req: Request<{ id: string }>, res: Response) {
    try {
      const id = +req.params.id;

      console.log('delete', id);

      if (!id)
        return res.status(404).json({
          message: 'Не удалось обновить фильм. Некорректный id',
        });

      await FilmModel.deleteFilm(id);

      res.status(200).end();
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось обновить фильм' });
    }
  }

  static async updateFilm(
    req: Request<
      { id: string },
      { title: string; year: number; genres: number[] }
    >,
    res: Response,
  ) {
    try {
      const data = req.body;
      const id = +req.params.id;

      if (!id)
        return res.status(404).json({
          message: 'Не удалось обновить фильм. Некорректный id',
        });

      if (!data.title || !data.year || !data.genres)
        return res.status(404).json({
          message:
            'Не удалось обновить фильм. Обязательные поля: title, year, genres',
        });

      const film = await FilmModel.updateFilm(id, data);

      return res.status(200).json(film);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось обновить фильм' });
    }
  }
}

export default FilmsController;

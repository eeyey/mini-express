import GenreModel from '../models/GenreModel';
import { Request, Response } from '../types';

class GenresController {
  static async getGenres(req: Request, res: Response) {
    try {
      const genres = await GenreModel.getGenres();

      return res.status(200).json(genres);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось получить жанры' });
    }
  }

  static async getGenre(req: Request<{ id: string }>, res: Response) {
    try {
      const id = +req.params.id;

      if (!id)
        return res.status(404).json({
          message: 'Не удалось обновить жанр. Некорректный id',
        });

      const genre = await GenreModel.getGenre(id);

      return res.status(200).json(genre);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось получить жанр' });
    }
  }

  static async createGenre(req: Request<{}, { title: string }>, res: Response) {
    try {
      const data = req.body;

      if (!data.title)
        return res.status(404).json({
          message: 'Не удалось создать жанр. Обязательные поля: title',
        });

      const genre = await GenreModel.createGenre(data);

      return res.status(200).json(genre);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось обновить жанр' });
    }
  }

  static async deleteGenre(req: Request<{ id: string }>, res: Response) {
    try {
      const id = +req.params.id;

      if (!id)
        return res.status(404).json({
          message: 'Не удалось обновить жанр. Некорректный id',
        });

      await GenreModel.deleteGenre(id);

      res.status(200).end();
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось обновить жанр' });
    }
  }

  static async updateGenre(
    req: Request<{ id: string }, { title: string }>,
    res: Response,
  ) {
    try {
      const data = req.body;
      const id = +req.params.id;

      if (!id)
        return res.status(404).json({
          message: 'Не удалось обновить жанр. Некорректный id',
        });

      if (!data.title)
        return res.status(404).json({
          message: 'Не удалось обновить жанр. Обязательные поля: title',
        });

      const genre = await GenreModel.updateGenre(id, data);

      return res.status(200).json(genre);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Ошибка сервера. Не удалось обновить жанр' });
    }
  }
}

export default GenresController;

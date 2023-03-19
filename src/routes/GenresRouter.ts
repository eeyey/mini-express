import GenresController from '../controllers/genres.controller';
import Router from '../core/Router';

const genresRouter = new Router();

genresRouter.get('/genres', GenresController.getGenres);
genresRouter.post('/genres', GenresController.createGenre);

genresRouter.get('/genre/:id', GenresController.getGenre);
genresRouter.delete('/genre/:id', GenresController.deleteGenre);
genresRouter.put('/genre/:id', GenresController.updateGenre);

export default genresRouter;

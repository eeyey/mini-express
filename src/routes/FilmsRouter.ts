import FilmsController from '../controllers/films.controller';
import Router from '../core/Router';

const filmsRouter = new Router();

filmsRouter.get('/films', FilmsController.getFilms);
filmsRouter.post('/films', FilmsController.createFilm);

filmsRouter.get('/film/:id', FilmsController.getFilm);
filmsRouter.delete('/film/:id', FilmsController.deleteFilm);
filmsRouter.put('/film/:id', FilmsController.updateFilm);

export default filmsRouter;

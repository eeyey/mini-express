import Server from './core/Server';

import genresRouter from './routes/GenresRouter';
import filmsRouter from './routes/FilmsRouter';

const server = new Server();

server.addRouter(filmsRouter);
server.addRouter(genresRouter);

server.listen(8080, () => console.log('server is ran'));

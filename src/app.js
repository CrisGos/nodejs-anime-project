import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.handler.js';
import routerAnime from './routes/animes.js';
import routerStudio from './routes/studios.js';
import routerDirector from './routes/directors.js';
import routerCharacter from './routes/characters.js';


const app = express();
dotenv.config();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use('/animes', routerAnime);
app.use('/studios', routerStudio);
app.use('/directors', routerDirector);
app.use('/characters', routerCharacter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`El puerto esta siendo escuchado correctamente en http://localhost:${PORT}`);
})
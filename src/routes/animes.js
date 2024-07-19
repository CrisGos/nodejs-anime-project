import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath  } from "url";
import path from 'path';

const routerAnime = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)

const animesFilePath = path.join(_dirname, "../../data/animes.json");

const readAnimesFs = async () => {
    try{
        const animes = await fs.readFile(animesFilePath)
        return JSON.parse(animes);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeAnimesFs = async (animes) => {
    await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2));
};

const idGenerator = async () => {
    const animes = await readAnimesFs()
    if (animes.length == 0) return 1
    return (animes[(animes.length - 1)].id + 1);
}


routerAnime.post("/postAnimes", async (req, res) => {
    const animes = await readAnimesFs();
    const newAnime = {
        id: await idGenerator(),
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId,
    };

    animes.push(newAnime);
    await writeAnimesFs(animes);
    res.status(201).send(`Anime created successfully ${JSON.stringify(newAnime)}`);
});

routerAnime.get("/", async (req, res) => {
    const animes = await readAnimesFs()
    res.status(200).json(animes);
});

routerAnime.get("/:animeId", async (req, res) => {
    const animes = await readAnimesFs();
    const anime = animes.find(a => a.id === parseInt(req.params.animeId));
    if(!anime) return res.status(404).send("Anime not found");
    res.status(200).json(anime)
});

routerAnime.put("/:id", async (req, res) => {
    const animes = await readAnimesFs();
    const indexAnime = animes.findIndex(a => a.id === parseInt(req.params.id));
    if(indexAnime === -1) return res.status(404).send("Anime not found");
    const updateAnime = {
        ...animes[indexAnime],
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId,
    }

    animes[indexAnime] = updateAnime;
    await writeAnimesFs(animes);
    res.send(`Anime update successfully ${JSON.stringify(updateAnime)}`)
});

routerAnime.delete("/delete/:id", async (req, res) => {
    let animes = await readAnimesFs();
    const anime = animes.find(a => a.id === parseInt(req.params.id));
    if(!anime) return res.status(404).send("Anime not found");
    animes = animes.filter(a => a.id !== anime.id);

    await writeAnimesFs(animes);
    res.status(200).send('The anime has been deleted')

});

export default routerAnime;
export {Router, fs, fileURLToPath, path};
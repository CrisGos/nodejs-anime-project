import {Router, fs, fileURLToPath, path} from './animes.js';

const routerDirector = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)

const directorsFilePath = path.join(_dirname, "../../data/directors.json");

const readDirectorsFs = async () => {
    try{
        const directors = await fs.readFile(directorsFilePath)
        return JSON.parse(directors);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeDirectorsFs = async (directors) => {
    await fs.writeFile(directorsFilePath, JSON.stringify(directors, null, 2));
};

const idGenerator = async () => {
    const directors = await readDirectorsFs()
    if (directors.length == 0) return 1
    return (directors[(directors.length - 1)].id + 1);
}


routerDirector.post("/postDirectors", async (req, res) => {
    const directors = await readDirectorsFs();
    const newDirector = {
        id: await idGenerator(),
        name: req.body.name
    };

    directors.push(newDirector);
    await writeDirectorsFs(directors);
    res.status(201).send(`Director created successfully ${JSON.stringify(newDirector)}`);
});

routerDirector.get("/", async (req, res) => {
    const directors = await readDirectorsFs()
    res.status(200).json(directors);
});

routerDirector.get("/:directorId", async (req, res) => {
    const directors = await readDirectorsFs();
    const director = directors.find(a => a.id === parseInt(req.params.directorId));
    if(!director) return res.status(404).send("Director not found");
    res.status(200).json(director)
});

routerDirector.put("/:id", async (req, res) => {
    const directors = await readDirectorsFs();
    const indexDirector = directors.findIndex(a => a.id === parseInt(req.params.id));
    if(indexDirector === -1) return res.status(404).send("Director not found");
    const updateDirector = {
        ...directors[indexDirector],
        name: req.body.name
    }

    directors[indexDirector] = updateDirector;
    await writeDirectorsFs(directors);
    res.send(`Director update successfully ${JSON.stringify(updateDirector)}`)
});

routerDirector.delete("/delete/:id", async (req, res) => {
    let directors = await readDirectorsFs();
    const director = directors.find(a => a.id === parseInt(req.params.id));
    if(!director) return res.status(404).send("Director not found");
    directors = directors.filter(a => a.id !== director.id);

    await writeDirectorsFs(directors);
    res.status(200).send('The director has been deleted')

});

export default routerDirector;
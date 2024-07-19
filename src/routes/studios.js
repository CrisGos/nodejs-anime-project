import {Router, fs, fileURLToPath, path} from './animes.js';

const routerStudio = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)

const studiosFilePath = path.join(_dirname, "../../data/studios.json");

const readStudiosFs = async () => {
    try{
        const studios = await fs.readFile(studiosFilePath)
        return JSON.parse(studios);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeStudiosFs = async (studios) => {
    await fs.writeFile(studiosFilePath, JSON.stringify(studios, null, 2));
};

const idGenerator = async () => {
    const studios = await readStudiosFs()
    if (studios.length == 0) return 1
    return (studios[(studios.length - 1)].id + 1);
}


routerStudio.post("/postStudios", async (req, res) => {
    const studios = await readStudiosFs();
    const newStudio = {
        id: await idGenerator(),
        name: req.body.name
    };

    studios.push(newStudio);
    await writeStudiosFs(studios);
    res.status(201).send(`Studio created successfully ${JSON.stringify(newStudio)}`);
});

routerStudio.get("/", async (req, res) => {
    const studios = await readStudiosFs()
    res.status(200).json(studios);
});

routerStudio.get("/:studioId", async (req, res) => {
    const studios = await readStudiosFs();
    const studio = studios.find(a => a.id === parseInt(req.params.studioId));
    if(!studio) return res.status(404).send("Studio not found");
    res.status(200).json(studio)
});

routerStudio.put("/:id", async (req, res) => {
    const studios = await readStudiosFs();
    const indexStudio = studios.findIndex(a => a.id === parseInt(req.params.id));
    if(indexStudio === -1) return res.status(404).send("Studio not found");
    const updateStudio = {
        ...studios[indexStudio],
        name: req.body.name
    }

    studios[indexStudio] = updateStudio;
    await writeStudiosFs(studios);
    res.send(`Studio update successfully ${JSON.stringify(updateStudio)}`)
});

routerStudio.delete("/delete/:id", async (req, res) => {
    let studios = await readStudiosFs();
    const studio = studios.find(a => a.id === parseInt(req.params.id));
    if(!studio) return res.status(404).send("Studio not found");
    studios = studios.filter(a => a.id !== studio.id);

    await writeStudiosFs(studios);
    res.status(200).send('The studio has been deleted')

});

export default routerStudio;
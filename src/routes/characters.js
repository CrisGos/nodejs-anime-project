import {Router, fs, fileURLToPath, path} from './animes.js';

const routerCharacter = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)

const charactersFilePath = path.join(_dirname, "../../data/characters.json");

const readCharactersFs = async () => {
    try{
        const characters = await fs.readFile(charactersFilePath)
        return JSON.parse(characters);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeCharactersFs = async (characters) => {
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));
};

const idGenerator = async () => {
    const characters = await readCharactersFs()
    if (characters.length == 0) return 1
    return (characters[(characters.length - 1)].id + 1);
}


routerCharacter.post("/postCharacters", async (req, res) => {
    const characters = await readCharactersFs();
    const newCharacter = {
        id: await idGenerator(),
        name: req.body.name,
        animeId: req.body.animeId
    };

    characters.push(newCharacter);
    await writeCharactersFs(characters);
    res.status(201).send(`Character created successfully ${JSON.stringify(newCharacter)}`);
});

routerCharacter.get("/", async (req, res) => {
    const characters = await readCharactersFs()
    res.status(200).json(characters);
});

routerCharacter.get("/:characterId", async (req, res) => {
    const characters = await readCharactersFs();
    const character = characters.find(a => a.id === parseInt(req.params.characterId));
    if(!character) return res.status(404).send("Character not found");
    res.status(200).json(character)
});

routerCharacter.put("/:id", async (req, res) => {
    const characters = await readCharactersFs();
    const indexCharacter = characters.findIndex(a => a.id === parseInt(req.params.id));
    if(indexCharacter === -1) return res.status(404).send("Character not found");
    const updateCharacter = {
        ...characters[indexCharacter],
        name: req.body.name,
        animeId: req.body.animeId
    }

    characters[indexCharacter] = updateCharacter;
    await writeCharactersFs(characters);
    res.send(`Character update successfully ${JSON.stringify(updateCharacter)}`)
});

routerCharacter.delete("/delete/:id", async (req, res) => {
    let characters = await readCharactersFs();
    const character = characters.find(a => a.id === parseInt(req.params.id));
    if(!character) return res.status(404).send("Character not found");
    characters = characters.filter(a => a.id !== character.id);

    await writeCharactersFs(characters);
    res.status(200).send('The character has been deleted')

});

export default routerCharacter;
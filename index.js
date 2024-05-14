import express from 'express'
import Jimp from "jimp";
import { engine } from 'express-handlebars';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(express.static('public'))

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/process-image', async(req, res) => {
    const {imageUrl} = req.body;
    try{
        const image = await Jimp.read(imageUrl);
        const uniqueName = `${nanoid()}.jpg`;
        const processedImagePath = path.join(__dirname, 'public', uniqueName);
        await image
            .resize(350, Jimp.AUTO)
            .greyscale()
            .writeAsync(processedImagePath);
            res.send(`
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: black;">
                <img src="/${uniqueName}" alt="Imagen Procesada" style="max-width: 100%; max-height: 100%;"/>
            </div>
        `);
    }catch(error){
        res.status(500).send('Error al procesar la imagen. Por favor, asegúrate de que la URL de la imagen sea válida y vuelva a intentarlo.');

    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})

const express = require("express");
let ProductManager = require('./ProductManager'); // Importar la clase

const app = express();

//Se coloca a escuchar al servidor
const PUERTO = 8080;

let manager = new ProductManager();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Rutas

app.get("/", async (req, res) => {
    const ArrayProducts = await manager.getProducts();
    if (ArrayProducts.length) {
        res.send(ArrayProducts);
    } else {
        res.send("No hay productos");
    }
})

app.get("/Products", async (req, res) => {
    const limit = req.query.limit;
    const ArrayProducts = await manager.getProducts();
    if (ArrayProducts.length) {
        if (limit) {
            const ArrayLimited = ArrayProducts.slice(0, limit);
            res.send(ArrayLimited);
        } else {
            res.send(ArrayProducts);
        }
    } else {
        res.send("No hay productos");
    }
})

app.get("/Products/:ID", async (req, res) => {
    const ID = req.params.ID;
    const ArrayProducts = await manager.getProducts();
    const ProductFound = ArrayProducts.find(p => p.ID == ID);
    if (ProductFound) {
        res.send(ProductFound);
    } else {
        res.send("Producto no encontrado");
    }
})


app.listen(PUERTO, () => {
    console.log("Escuchando servidor en el puerto 8080");
})
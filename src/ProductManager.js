const { Console } = require("console");
const fs = require("fs").promises;


class Producto {
    constructor(title, description, price, thumbnail, code, stock, ID) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.ID = ID;
    }
}

 class ProductManager {
    constructor() {
        this.products = [];
        this.Path = "./ArchivoProductos.json";
    }

    async readProduct(direccion) {
        try {
            const contenido = await fs.readFile(direccion, "utf-8");
            const parsedData = JSON.parse(contenido);

            // Asegurarse de que parsedData sea un array
            this.products = Array.isArray(parsedData) ? parsedData : [parsedData];

            return this.products;
        } catch (error) {
            console.log("Error al leer los usuarios ", error);
            return this.products || [];
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {
            let ID;
            this.products = await this.readProduct(this.Path);

            if (!this.products.some(p => p.code === code)) {
                if (this.products.length !== 0) {
                    const identificadores = this.products.map(p => p.ID);
                    ID = Math.max(...identificadores) + 1;
                } else {
                    ID = 1;
                }

                const nuevoProducto = new Producto(title, description, price, thumbnail, code, stock, ID);
                this.products.push(nuevoProducto);
                await fs.writeFile(this.Path, JSON.stringify(this.products, null, 2));
                console.log("Producto añadido con éxito");
            } else {
                console.log("Código de producto ya existe");
            }
        } catch (error) {
            console.log("Problemas con el archivo:", error);
        }
    }

    getProducts = async () => {
        return await this.readProduct(this.Path);
    }

    getProductByID = async (aux) => {
        this.products = await this.readProduct(this.Path);
        const p = this.products.find(p => p.ID === aux)

        if (p) {
            console.log("Producto encontrado: ");
            return p;
        }
        else {
            console.log("Producto no existe");
        }
    }

    updateProduct = async (aux, campo, modificacion) => {
        try {
            this.products = await this.readProduct(this.Path);
            const producto = this.products.find(p => p.ID === aux);

            if (producto) {
                console.log("Producto encontrado, se verifica si se puede modificar: ");
                if (campo === "code") {
                    if (!this.products.find(p => p[campo] === modificacion)) {
                        producto[campo] = modificacion;
                        await fs.writeFile(this.Path, JSON.stringify(this.products, null, 2));
                        console.log("Producto actualizado: ");
                    } else {
                        console.log("Code ya existe y no se puede modificar campo en producto.")
                    }
                } else { //No es propiedad code
                    producto[campo] = modificacion;
                    await fs.writeFile(this.Path, JSON.stringify(this.products, null, 2));
                    console.log("Producto actualizado: ");
                }
            } else {
                console.log("Producto no existe");
            }
        } catch (error) {
            console.log("Error al actualizar el producto:", error);
        }
    }

        deleteProduct = async (aux) => {
            try {
                this.products = await this.readProduct(this.Path);
                const arrayFiltrado = this.products.filter(p => p.ID !== aux);

                if (arrayFiltrado.length < this.products.length) {
                    console.log("Producto encontrado, se procede a eliminarlo ");
                    await fs.writeFile(this.Path, JSON.stringify(arrayFiltrado, null, 2));
                    console.log("Producto eliminado con éxito");
                } else {
                    console.log("Producto no existe");
                }
            } catch (error) {
                console.log("Error al eliminar el producto:", error);
            }
        }
    }


//let manager = new ProductManager();

/*
(async () => {
    await manager.addProduct("title", "description", 10, "thumbnail", "code", 1);
    await manager.addProduct("title", "description", 10, "thumbnail", "code2", 1);

    console.log(await manager.getProducts());
    await manager.getProductByID(2);
    await manager.updateProduct(2, "title", "actualizacion de titulo");

    setTimeout(async () => {
        await manager.deleteProduct(2);
    }, 5000);
})();
*/


module.exports = ProductManager;
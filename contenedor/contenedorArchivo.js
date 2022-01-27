const fs = require('fs')

class ContenedorArchivo {

    constructor(nombre) {
        this.nombreArchivo = `./DB/${nombre}`
    }

    async guarda(listaProductos) {
        let string = JSON.stringify(listaProductos)
        await fs.promises.writeFile(this.nombreArchivo, string)
    }


    async save(objetoProducto) {
        let listaProductos = await this.getAll()
        let productosIds = listaProductos.map(item => item.id);
        // crea nuevo Id
        let newId = productosIds.length > 0 ? Math.max.apply(Math, productosIds) + 1 : 1;
        //objetoProducto.id = parseInt(newId);

        listaProductos.push(objetoProducto)
        console.log(listaProductos);

        try {
            await this.guarda(listaProductos)
            return objetoProducto;
        } catch (err) {
            return err
        }
    }

    async get(id) {
        const productos = await this.getAll()
        const encontrado = productos.find(prod => prod.id == id)
        return encontrado

    }

    async getAll() {
        try {
            const productos = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            return JSON.parse(productos)
        } catch (error) {
            console.log("err: ", error);
            return []
        }
    }

    async update(producto) {
        let listaProductos = await this.getAll()
        let productoAnterior = listaProductos.findIndex(prod => prod.id == producto.id) //busca producto existente

        //reemplaza el viejo por el nuevo
        listaProductos.splice(productoAnterior, 1, producto);
        try {
            await this.guarda(listaProductos)
            return producto
        } catch (err) {
            return err
        }


    }


    async deleteById(id) {
        let listaProductos = await this.getAll()

        let index = listaProductos.findIndex(producto => producto.id === id);
        if (index > -1) {
            listaProductos.splice(index, 1);
        }

        try {
            await this.guarda(listaProductos)
            return true
        } catch (err) {
            return err
        }
    }

    async deleteAll() {
        try {
            let listaProductos = []
            await this.guarda(listaProductos)
            return true
        } catch (err) {
            return err;
        }

    }
}

module.exports = ContenedorArchivo

//export default ContenedorArchivo
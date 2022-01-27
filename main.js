const express = require('express')
const normalizr = require('normalizr')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require('socket.io')
const ContenedorArchivo = require('./contenedor/contenedorArchivo')

const faker= require('faker')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

faker.locale = 'es_MX'
const listaProductos = []
let listaMensajes = [];
let lista = [];

const listaMensajesChat = new ContenedorArchivo('mensajes.json')
normaliza()

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', './public/views')
app.set('view engine', 'ejs');

app.get('/', (req, resp) =>{
    if(listaProductos.length <= 0){
        for (let index = 0; index < 5; index++) {
            listaProductos.push(creaProducto())
        }
    }
    
    resp.render('layouts/index', {
        productos: listaProductos
    })
    //resp.send(listaProductos)
    //resp.send('listaProductos')
})

function creaProducto(){
    return{
        timestamp: faker.datatype.datetime(),
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        codigo: faker.finance.currencyCode(),
        precio: faker.commerce.price(),
        stock: faker.datatype.number()+"",
        foto: faker.image.imageUrl(), 
        id: faker.datatype.number()
    }
}

//listen 
httpServer.listen(3000, function () {
    console.log('3000 es mi puerto');
})

async function normaliza(){
    lista = await listaMensajesChat.getAll()
    //listaMensajes.push(ultimoProducto);
    const listaNueva = {
        id: "mensajes",
        mensajes: lista
    }

    const authorMensajesSchema = new normalizr.schema.Entity('author')
    const textMensajesSchema = new normalizr.schema.Entity('text')

    const mensajesSchema = new normalizr.schema.Entity('mensajes', {
        id: 'post', mensajes: [{ author: authorMensajesSchema, text: textMensajesSchema }]
    })

    listaMensajes = normalizr.normalize(listaNueva, mensajesSchema)
}


io.on('connection', (socket) => {

    //console.log("socket");
    //emite mensajes
    socket.emit('mensaje', [], listaMensajes, lista)

    socket.on("new-mensaje", async data => {
        const ultimoProducto = await listaMensajesChat.save(data)
        await normaliza()
        

        //listaMensajes.push(data);
        //console.log("data mensaje: ", data);
        io.sockets.emit("mensaje", [data], listaMensajes, lista)
    })

})
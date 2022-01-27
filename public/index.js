//const { schema } = require("normalizr");

const socket = io();
let usuario = '';
let nombre = '';
let apellido = '';
let edad = '';
let alias = '';
let avatar = '';

/*const authorMensajesSchema = new schema.Entity('author')
const textMensajesSchema = new schema.Entity('text')

const mensajesSchema = new schema.Entity('mensajes', {
    id: 'post', mensajes: [{ author: authorMensajesSchema, text: textMensajesSchema }]
})*/

socket.on("mensaje", (dataMessajes, normalizado, normal) =>{
    total = Object.keys(normalizado).length;
    totalNormal = Object.keys(normal).length;
    console.log("normalizado: ", normalizado);
    console.log("normalizado lenght: ", total);
    console.log("normal: ", normal);
    console.log("normal lenght: ", totalNormal);
    let porcentaje = (total / totalNormal) * 100;
    console.log(`espacio optimizado: ${Math.round(porcentaje)}%`);
    


    dataMessajes.forEach(mensaje => {
        //console.log(mensaje.text);
        if(mensaje.author.id == usuario){
            var tr = `<div class="alert alert-success mt-3"><strong>${mensaje.author.id}</strong><small>[${mensaje.author.fecha}]</small><em>: ${mensaje.text}</em><img src="${mensaje.author.avatar}" width="50px" height="50px" class="rounded-circle"></div> `;
        }else{
            var tr = `<div class="alert alert-secondary mt-3"><strong>${mensaje.author.id}</strong><small>[${mensaje.author.fecha}]</small><em>: ${mensaje.text}</em><img src="${mensaje.author.avatar}" width="50px" height="50px" class="rounded-circle" ></div>`;
        }
        $("#listaMensajes").prepend(tr)
    });
})



//login para chat
$('#loginForm').submit(e => {
    e.preventDefault();

    usuario = $("#correo").val();
    nombre = $("#nombre").val();
    apellido = $("#apellido").val();
    edad = $("#edad").val();
    alias = $("#alias").val();
    avatar = $("#avatar").val();
    if (valEmail(usuario)) {
        $("#miAlert").hide();
        $("#btEntrar").hide();
        $("#mensajeForm").show();
        $("#correo").attr("readonly", true);
        $("#mensaje").focus();

    }else{
        alert("introduce un correo valido")
    }

    return false;
})

//envio de mensaje
$('#enviaMensaje').click(e => {
    e.preventDefault();

    const mensaje = $("#mensaje").val();
    let fecha = new Date().toLocaleString();
    if (mensaje != '') {
        const newMessaje = {
            author:{
                id: usuario,
                nombre: nombre,
                apellido: apellido,
                edad: edad,
                alias: alias,
                avatar: avatar,
                fecha
            },
            text: mensaje
        }
        socket.emit('new-mensaje', newMessaje);
        $("#mensaje").val('');
    }
    
    return false;
})


function permite(elEvento, permitidos) {

    var numeros = "0123456789";
    var caracteres = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚáéíóú´ñÑ!-#";
    var numeros_caracteres = numeros + caracteres;
    var teclas_especiales = [8, 37, 39, 46, 9];

    // 8 = BackSpace, 46 = Supr, 37 = flecha izquierda, 39 = flecha derecha, 9 = tabulador

    // Seleccionar los caracteres a partir del parametro de la funcion

    switch (permitidos) {

        case 'num':
            permitidos = numeros;
            break;
        case 'car':
            permitidos = caracteres;
            break;
        case 'num_car':
            permitidos = numeros_caracteres;
            break;
    }

    // Obtener la tecla pulsada
    var evento = elEvento || window.event;
    var codigoCaracter = evento.charCode || evento.keyCode;
    var caracter = String.fromCharCode(codigoCaracter);
    var tecla_especial = false;

    for (var i in teclas_especiales) {
        if (codigoCaracter == teclas_especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    return permitidos.indexOf(caracter) != -1 || tecla_especial;
}

function valEmail(valor) {

    re = /^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{2,3})$/;
    if (!re.exec(valor)) {
        //alert("El correo no es correcto");
        return false;
    } else {
        return true;
    }
}
function prueba() {
    let visibles = document.querySelectorAll('header div div button, header div div a:nth-of-type(3) button')
    console.log(visibles);
    let registrables = document.querySelectorAll('header div div a:nth-of-type(1) button, header div div a:nth-of-type(2) button')
    if (sessionStorage.getItem('token')) {
        visibles.forEach((e) => e.classList.remove('oculto'))
        registrables.forEach((e) => e.classList.add('oculto'))
        let cerrar = document.querySelector('header div div > button')
        console.log(cerrar);
        cerrar.addEventListener('click', function() {
            sessionStorage.removeItem('token')
            visibles.forEach((e) => e.classList.add('oculto'))
            registrables.forEach((e) => e.classList.remove('oculto'))
            modal('La sesión ha sido exitósamente cerrada', '../')
        })
        console.log(registrables);
        console.log('por aca');
    } else {
        visibles.forEach((e) => e.classList.add('oculto'))
        registrables.forEach((e) => e.classList.remove('oculto'))
    }
}

prueba()

let mensaje = document.getElementById('modal')
let botonModal = mensaje.querySelector('#modal button')
let tramite = document.getElementById('tramite')
botonModal.addEventListener('click', () => {
    mensaje.style.display = 'none'
})

window.onclick = function(event) {
    if (event.target == mensaje) {
        mensaje.style.display = "none";
        // tramite.style.display = 'none'
    }
}

let indiceImagen = 1;
const inmueble = JSON.parse(localStorage.getItem('inmueble'))

function pasar(numero) {
    mostrarImagenes(indiceImagen += numero)
}

function mostrarImagenes(numero) {
    let imagenes = document.querySelectorAll(".imagenes > div");
    if (numero > imagenes.length) {
        indiceImagen = 1
    }
    if (numero < 1) {
        indiceImagen = imagenes.length
    }
    for (let i = 0; i < imagenes.length; i++) {
        imagenes[i].style.display = "none";
    }
    imagenes[indiceImagen-1].style.display = "block";
} 

function darBotones() {
    let boton = document.querySelector('main button')
    if (!sessionStorage.getItem('token') || inmueble['estado'] == 3) {
        boton.classList.add('desaparecer')
        return
    }
    if (inmueble['estado'] == 1) {
        boton.innerText = '¡Visitar!'
        boton.addEventListener('click', async function() {
            try {
                const respuesta = await fetch('https://graco-api.onrender.com/visitar-propiedad', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem('token')
                    }, 
                    body: JSON.stringify({
                        'propiedad': inmueble['id']
                    })
                })
                const verdad = await respuesta.json()
                console.log(verdad);
                console.log(respuesta);
                // let nuevo = boton.cloneNode(true)
                boton.innerText = '¡Comprar!'
                // boton.parentNode.replaceChild(nuevo, boton)
                boton.addEventListener('click', async function() {
                    comprar()
                })
            } catch (error) {
                console.log(error);
            }
        })
    } else if (inmueble['estado'] == 2) {
        // let nuevo = boton.cloneNode(true)
        boton.innerText = '¡Comprar!'
        // boton.parentNode.replaceChild(nuevo, boton)
        boton.addEventListener('click', async function() {
            comprar()
        })
    }
    console.log(inmueble);
}

function comprar() {
    tramite.style.display = 'block'
    let forma = tramite.querySelector('form')
    let boton = forma.querySelector('form button')
    boton.addEventListener('submit', async function(event) {
        event.preventDefault()
        let data = new FormData(forma)
        let correo = data.get('correo')
        let telefono = data.get('telefono')
        let nombre = data.get('nombre')
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/tramitar-propiedad', {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem('token')
                }, 
                body: JSON.stringify({
                    "propiedad": inmueble['id'],
                    "correo": correo,
                    "nombre": nombre,
                    "telefono": telefono,
                    "transaccion": '1'
                })
            })
            const verdad = await respuesta.json()
            if (verdad['success']) {
                modal('¡Felicidades! Trámite pagado con éxito', '../')
            } else {
                modal('¡Oh no! No se pudo tramitar la compra D:')
            }
        } catch (error) {
            console.log(error);
            modal('¡Oh no! Un error grave ha sucedido')
        }
    })
}

function calcular(fecha) {
    const hoy = new Date();
    let tiempo = hoy - fecha
    tiempo = tiempo / 1000 / (365.25 * 24 * 60 * 60)
    años = Math.floor(tiempo)
    return años + ((años == 1) ? ' año' : ' años')
}

function inicial() {
    console.log(inmueble);
    let info = document.querySelectorAll('main section:last-of-type p')
    let imagenes = document.querySelector('main section:first-of-type div')
    console.log(info);
    console.log(imagenes);
    info[1].innerText = 'Precio: ' + inmueble['precio'] + ' $'
    info[2].innerText = 'Tamaño (metros cuadrados): ' + inmueble['metroscuadrados']
    info[3].innerText = 'Cantidad de habitaciones: ' + inmueble['habitaciones']
    info[4].innerText = 'Cantidad de baños: ' + inmueble['baños']
    info[5].innerText = 'Antigüedad: ' + calcular(new Date(inmueble['antiguedad']))
    let numero = 0
    for (const esta of inmueble['imagenes']) {
        numero++
        let divMayor = document.createElement('div')
        let divNumero = document.createElement('div')
        divNumero.innerText = numero + ' / ' + inmueble['imagenes'].length
        divMayor.appendChild(divNumero)
        let img = document.createElement('img')
        img.src = esta
        img.alt = 'Una imagen muy bonita'
        divMayor.appendChild(img)
        imagenes.appendChild(divMayor)
    }
    let a = document.createElement('a')
    a.addEventListener('click', function() {
        pasar(-1)
    })
    a.innerText = '<'
    imagenes.appendChild(a)
    a = document.createElement('a')
    a.addEventListener('click', function() {
        pasar(1)
    })
    a.innerText = '>'
    imagenes.appendChild(a)
    mostrarImagenes(indiceImagen);
    darBotones()
}

inicial()

function modal(texto, pasar = undefined) {
    let p = mensaje.querySelector('#modal p')
    console.log(texto);
    p.innerHTML = texto
    mensaje.style.display = 'block'
    if (pasar != undefined) {
        console.log('pasar');
        botonModal.addEventListener('click', () => {
            mensaje.style.display = 'none'
            location.href = pasar
            let nuevo = botonModal.cloneNode(true)
            botonModal.parentNode.replaceChild(nuevo, botonModal)
        })
    } else {
        console.log('no pasar');
        botonModal.addEventListener('click', () => {
            mensaje.style.display = 'none'
            let nuevo = botonModal.cloneNode(true)
            botonModal.parentNode.replaceChild(nuevo, botonModal)
        })
    }
}
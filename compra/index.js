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
    if (inmueble['estado'] != 2) {
        let boton = document.querySelector('main button')
        boton.innerText = '¡Visitar!'
        boton.addEventListener('click', async function() {
            try {
                const respuesta = fetch('https://graco-api.onrender.com/visitar-propiedad', {
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
                if (verdad['success']) {
                    modal(verdad['message'])
                    let nuevo = boton.cloneNode(true)
                    nuevo.innerText = '¡Comprar!'
                    boton.parentNode.replaceChild(nuevo, boton)
                    boton.addEventListener('click', async function() {
                        await comprar()
                    })
                } else {
                    modal('¡Oh no! Algo salió mal D:')
                }
            } catch (error) {
                
            }
        })
    }
    console.log(inmueble);
}

async function comprar() {
    let boton = document.querySelector('main button')
    
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
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
            modal('La sesión ha sido exitósamente cerrada')
        })
        console.log(registrables);
        console.log('por aca');
    } else {
        visibles.forEach((e) => e.classList.add('oculto'))
        registrables.forEach((e) => e.classList.remove('oculto'))
    }
}

let mensaje = document.getElementById('modal')
let boton = mensaje.querySelector('#modal button')
boton.addEventListener('click', () => {
    mensaje.style.display = 'none'
})

window.onclick = function(event) {
    if (event.target == mensaje) {
        mensaje.style.display = "none";
    }
}

prueba()

function texto(tipo) {
    switch (tipo) {
        case 1:
            return 'Apartamento'
        case 2: 
            return 'Casa'
        case 3: 
            return 'Inmueble común'
        default:
            return 'Inmueble mágico'
    }
}

function calcular(fecha) {
    const hoy = new Date();
    let tiempo = hoy - fecha
    tiempo = tiempo / 1000 / (365.25 * 24 * 60 * 60)
    años = Math.floor(tiempo)
    return años + ((años == 1) ? ' año' : ' años')
}

async function mostrar() {
    const respuesta = await fetch('https://graco-api.onrender.com/propiedad-principales', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const verdad = await respuesta.json()
    if (verdad['data']) {
        let lista = verdad['data']
        let inmuebles = document.querySelector('main section')
        let eleccion = 0
        inmuebles.innerHTML = ''
        for (const esta of lista) {
            let div = document.createElement('div')
            let img = document.createElement('img')
            if (eleccion == esta['imagenes'].length - 1) {
                eleccion = 0
            }
            img.src = esta['imagenes'][eleccion]
            img.alt = 'Inmueble bonito'
            eleccion++
            div.appendChild(img)
            let p = document.createElement('p')
            p.innerText = esta['precio'] + ' $'
            div.appendChild(p)
            p = document.createElement('p')
            p.innerText = calcular(new Date(esta['antiguedad']))
            div.appendChild(p)
            p = document.createElement('p')
            p.innerText = esta['tipo']
            div.appendChild(p)
            div.addEventListener('click', function() {
                localStorage.setItem('inmueble', JSON.stringify(esta))
                location.href = '/compra/'
            })
            inmuebles.appendChild(div)
        }
    }
}

mostrar()

function modal(texto, pasar = undefined) {
    let p = mensaje.querySelector('#modal p')
    console.log(texto);
    p.innerHTML = texto
    mensaje.style.display = 'block'
    let boton = mensaje.querySelector('#modal button')
    if (pasar != undefined) {
        console.log('pasar');
        boton.addEventListener('click', () => {
            mensaje.style.display = 'none'
            location.href = pasar
            let nuevo = boton.cloneNode(true)
            boton.parentNode.replaceChild(nuevo, boton)
        })
    } else {
        console.log('no pasar');
        boton.addEventListener('click', () => {
            mensaje.style.display = 'none'
            let nuevo = boton.cloneNode(true)
            boton.parentNode.replaceChild(nuevo, boton)
        })
    }
}
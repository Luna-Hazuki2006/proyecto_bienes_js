if (sessionStorage.getItem('token')) {
    let visibles = document.querySelectorAll('header div div button, header div div a:nth-of-type(3) button')
    console.log(visibles);
    let registrables = document.querySelectorAll('header div div a:nth-of-type(1) button, header div div a:nth-of-type(2) button')
    visibles.forEach((e) => e.classList.remove('oculto'))
    registrables.forEach((e) => e.classList.add('oculto'))
    console.log(registrables);
    console.log('por aca');
}
let lista = []

function escribir() {
    let todos = document.querySelectorAll('form input')
    let reset = document.querySelector('form button')
    todos.forEach((e) => {
        e.addEventListener('keydown', function() {
            let muchos = lista.filter((e) => e['habitaciones'] == todos[0] || 
                                            e['baños'] == todos[1] ||
                                            calcular(e['antiguedad']) == todos[2] || 
                                            e['metroscuadrados'] == todos[3])
            llenar(muchos)
        })
    })
    reset.addEventListener('click', function() {
        llenar(lista)
    })
}

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
    console.log(tiempo);
    return Math.floor(tiempo) + ' años'
}

async function mostrar() {
    const respuesta = await fetch('https://graco-api.onrender.com/propiedad', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const verdad = await respuesta.json()
    if (verdad['data']) {
        lista = verdad['data']
        llenar(lista)
    }
}

function llenar(todo) {
    let inmuebles = document.querySelector('main section')
    inmuebles.innerHTML = ''
        let eleccion = 0
        for (const esta of todo) {
            console.log(esta);
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
            p.innerText = texto(esta['tipo'])
            div.appendChild(p)
            div.addEventListener('click', function() {
                sessionStorage.setItem('inmueble', JSON.stringify(esta))
                location.href = '../compra/'
            })
            inmuebles.appendChild(div)
        }
}

mostrar()
escribir()
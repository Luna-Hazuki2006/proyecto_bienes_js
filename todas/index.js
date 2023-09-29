if (sessionStorage.getItem('token')) {
    let visibles = document.querySelectorAll('header div div button, header div div a:nth-of-type(3) button')
    console.log(visibles);
    let registrables = document.querySelectorAll('header div div a:nth-of-type(1) button, header div div a:nth-of-type(2) button')
    visibles.forEach((e) => e.classList.remove('oculto'))
    registrables.forEach((e) => e.classList.add('oculto'))
    console.log(registrables);
    console.log('por aca');
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
        let lista = verdad['data']
        let inmuebles = document.querySelector('main section')
        inmuebles.innerHTML = ''
        let eleccion = 0
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
            p.innerText = texto(esta['tipo'])
            div.appendChild(p)
            inmuebles.appendChild(div)
        }
    }
}

mostrar()
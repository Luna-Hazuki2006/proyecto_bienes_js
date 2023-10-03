if (localStorage.getItem('token')) {
    let visibles = document.querySelectorAll('header div div button, header div div a:nth-of-type(3) button')
    console.log(visibles);
    let registrables = document.querySelectorAll('header div div a:nth-of-type(1) button, header div div a:nth-of-type(2) button')
    visibles.forEach((e) => e.classList.remove('oculto'))
    registrables.forEach((e) => e.classList.add('oculto'))
    console.log(registrables);
    console.log('por aca');
}
let lista = []
console.log(document.getElementById('baños'));

function escribir() {
    let todos = document.querySelectorAll('form input')
    let reset = document.querySelector('form button')
    let propiedades_filtradas = {}
    todos.forEach((e) => {
        propiedades_filtradas[e.id] = []
    })
    console.log(Object.keys(propiedades_filtradas))
    todos.forEach((e) => {
        e.addEventListener('change', function() {
            if (e.value) {
                console.log(e.id);
                if (e.type == 'date') {
                    console.log(calcular(new Date(e.value)));
                    propiedades_filtradas[e.id] = lista.filter((inmueble) => calcular(new Date(inmueble[e.id])) == calcular(new Date(e.value)))
                } else {
                    propiedades_filtradas[e.id] = lista.filter((inmueble) => inmueble[e.id] == e.value)
                }
            } else {
                propiedades_filtradas[e.id] = []
            }
            let valores = []
            for (const este of Object.keys(propiedades_filtradas)) {
                if (propiedades_filtradas[este].length != 0) {
                    if (este == 'antiguedad') {
                        let valor = {
                            'nombre': este, 
                            'valor': calcular(new Date(propiedades_filtradas[este][0][este]))
                        } 
                        valores.push(valor)
                    } else {
                        let valor = {
                            'nombre': este, 
                            'valor': propiedades_filtradas[este][0][este]
                        }
                        valores.push(valor)
                    } 
                }
            } 
            let lista_filtrada = []
            console.log(valores);
            let verdad = true
            for (const este of valores) {
                if (verdad) {
                    verdad = false
                    if (este['nombre'] == 'antiguedad') {
                        console.log('si pasa');
                        lista_filtrada = lista.filter((inmueble) => calcular(new Date(inmueble[este['nombre']])) == este['valor'])
                    } else {
                        lista_filtrada = lista.filter((inmueble) => inmueble[este['nombre']] == este['valor'])
                    }
                } else {
                    if (este['nombre'] == 'antiguedad') {
                        console.log('también pasa');
                        lista_filtrada = lista_filtrada.filter((inmueble) => calcular(new Date(inmueble[este['nombre']])) == este['valor'])
                    } else {
                        lista_filtrada = lista_filtrada.filter((inmueble) => inmueble[este['nombre']] == este['valor'])
                    }
                }
            }
            console.log('filtrada');
            console.log(lista_filtrada);
            llenar(lista_filtrada)
            console.log(propiedades_filtradas);
            
        })
    })
    reset.addEventListener('click', function() {
        todos.forEach((e) => {
            propiedades_filtradas[e.id] = []
        })
        console.log(propiedades_filtradas);
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
    // console.log(tiempo);
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
            // console.log(esta);
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
                localStorage.setItem('inmueble', JSON.stringify(esta))
                location.href = '../compra/'
            })
            inmuebles.appendChild(div)
        }
}

mostrar()
escribir()
async function prueba() {
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
    await cargar()
}

let mensaje = document.getElementById('modal')
let boton = mensaje.querySelector('div div:last-of-type button')
boton.addEventListener('click', () => {
    mensaje.style.display = 'none'
})

window.onclick = function(event) {
    if (event.target == mensaje) {
        mensaje.style.display = "none";
    }
}

prueba()

function fecha(fecha) {
    let valor = new Date(fecha);
    let final = valor.getFullYear()
    let mes = ''
    if ((valor.getMonth() + 1) < 10) {
        mes = '-0' + (valor.getMonth() + 1)
    } else {
        mes = '-' + (valor.getMonth() + 1)
    }
    final += mes
    let dia = ''
    if (valor.getDate() < 10) {
        dia = '-0' + (valor.getDate())
    } else {
        dia = '-' + (valor.getDate())
    }
    final += dia
    return final
}

async function cargar() {
    let input = document.querySelectorAll('form input')
    try {
        const respuesta = await fetch('https://graco-api.onrender.com/perfil', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('token')
            }
        })
        const verdad = await respuesta.json()
        if (verdad['success']) {
            let data = verdad['data']
            input[0].value = data['dni']
            input[1].value = data['nombre']
            input[2].value = data['apellido']
            input[3].value = fecha(data['nacimiento'])
            input[4].value = data['direccion']
        } else {
            modal('¡Oh no! Un problema en la carga de datos', '../perfil/')
        }
    } catch (error) {
        console.log(error);
        modal('¡Oh no! Sucedió un error grave')
    }
    let forma = document.querySelector('form')
    forma.addEventListener('submit', async (event) => {
        event.preventDefault()
        let data = new FormData(forma)
        let cedula = data.get('cedula')
        let nombre = data.get('nombre')
        console.log(nombre);
        let apellido = data.get('apellido')
        let nacimiento = new Date(data.get('nacimiento'))
        let direccion = data.get('direccion')
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/perfil', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
                }, 
                body: JSON.stringify({
                    'nombre': nombre, 
                    'apellido': apellido, 
                    'dni': cedula, 
                    'nacimiento': nacimiento, 
                    'direccion': direccion
                })
            })
            const verdad = await respuesta.json()
            if (verdad['success']) {
                modal('¡Felicidades! Modificaste tu perfil exitosamente', '../perfil/')
            } else {
                modal('¡Oh no! Sucedió un problema al modificar el perfil')
            }
        } catch (error) {
            console.log(error);
            modal('¡Oh no! Sucedió un error grave')
        }
    })
}

function modal(texto, pasar = undefined) {
    let p = mensaje.querySelector('div div:first-of-type p')
    console.log(texto);
    p.innerHTML = texto
    mensaje.style.display = 'block'
    let boton = mensaje.querySelector('div div:last-of-type button')
    if (pasar != undefined) {
        console.log('pasar');
        boton.addEventListener('click', () => {
            mensaje.style.display = 'none'
            location.href = pasar
            let nuevo = mensaje.cloneNode(true)
            mensaje.parentNode.replaceChild(nuevo, mensaje)
        })
    } else {
        console.log('no pasar');
        boton.addEventListener('click', () => {
            mensaje.style.display = 'none'
            let nuevo = mensaje.cloneNode(true)
            mensaje.parentNode.replaceChild(nuevo, mensaje)
        })
    }
}
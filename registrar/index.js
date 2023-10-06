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
let boton = mensaje.querySelector('#modal button')
boton.addEventListener('click', () => {
    mensaje.style.display = 'none'
})

window.onclick = function(event) {
    if (event.target == mensaje) {
        mensaje.style.display = "none";
    }
}

function calcular(fecha) {
    const hoy = new Date();
    let tiempo = hoy - fecha
    tiempo = tiempo / 1000 / (365.25 * 24 * 60 * 60)
    años = Math.floor(tiempo)
    return años + ((años == 1) ? ' año' : ' años')
}

function cargar() {
    let form = document.querySelector('form')
    let boton = document.querySelector('form button')
    boton.classList.add('ingresar')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        console.log('Esta cargando');
        let data = new FormData(form)
        let cedula = data.get('cedula')
        let nombre = data.get('nombre')
        let apellido = data.get('apellido')
        let nacimiento = data.get('nacimiento')
        let direccion = data.get('direccion')
        let correo = data.get('correo')
        let clave = data.get('contraseña')
        let repetida = data.get('repetida')
        if (clave != repetida) {
            modal('¡Oh no! las contrasñas no son iguales\nTrata de no equivocarte :3')
            return
        }
        let edad = calcular(new Date(nacimiento)).split(' ')
        if (edad < 18) {
            modal('¡Oh no! ')
            return
        }
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/registrar', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    'nombre': nombre, 
                    'apellido': apellido, 
                    'mail': correo, 
                    'clave': clave, 
                    'dni': cedula, 
                    'nacimiento': nacimiento, 
                    'direccion': direccion
                })
            })
            const verdad = await respuesta.json()
            if (verdad['success']) {
                console.log(verdad);
                console.log('felicidades');
                modal('Felicidades, usuario registrado')
                location.href = '../iniciar/'   
            }
        } catch (error) {
            console.error(error)
            modal('Ha sucedido un error pero no preocupes, no es tu culpa :D')
        }
    })
}

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

cargar()
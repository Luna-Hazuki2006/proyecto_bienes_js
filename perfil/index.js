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
    console.log('esperando');
    await cargar()
    console.log('terminó');
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

async function cargar() {
    try {
        const respuesta = await fetch('https://graco-api.onrender.com/perfil', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': sessionStorage.getItem('token')
            }
        })
        const verdad = await respuesta.json()
        console.log(verdad);
        if (verdad['success']) {
            let data = verdad['data']
            let p = document.querySelectorAll('main p')
            p[0].innerHTML = 'Nombres: ' + data['nombre']
            p[1].innerHTML = 'Apellidos: ' + data['apellido']
            p[2].innerHTML = 'Correo: ' + data['mail']
            p[3].innerHTML = 'Nacimiento: ' + data['nacimiento']
            p[4].innerHTML = 'Cédula: ' + data['dni']
            p[5].innerHTML = 'Dirección: ' + data['direccion']
            console.log('los p');
            console.log(p);
        } else {
            console.log('¡Oh no! No pudiste iniciar sesión');
            modal('¡Oh no! parece que hubo un problema, trata de iniciar sesión de nuevo', '../iniciar/')
        }
    } catch (error) {
        console.error(error)
        modal('Ha sucedido un error pero no preocupes, no es tu culpa :D')
    }
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
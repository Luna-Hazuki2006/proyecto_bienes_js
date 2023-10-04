async function prueba() {
    let visibles = document.querySelectorAll('header div div button, header div div a:nth-of-type(3) button')
    console.log(visibles);
    let registrables = document.querySelectorAll('header div div a:nth-of-type(1) button, header div div a:nth-of-type(2) button')
    if (localStorage.getItem('token')) {
        visibles.forEach((e) => e.classList.remove('oculto'))
        registrables.forEach((e) => e.classList.add('oculto'))
        let cerrar = document.querySelector('header div div > button')
        console.log(cerrar);
        cerrar.addEventListener('click', function() {
            localStorage.removeItem('token')
            visibles.forEach((e) => e.classList.add('oculto'))
            registrables.forEach((e) => e.classList.remove('oculto'))
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
                'Authorization': localStorage.getItem('token')
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
            modal('Felicidades, inicio de sesión exitoso', '../todas/')
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
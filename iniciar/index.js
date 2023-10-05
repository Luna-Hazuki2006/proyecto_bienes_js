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

prueba()

let mensaje = document.getElementById('modal')
window.onclick = function(event) {
    if (event.target == mensaje) {
        mensaje.style.display = "none";
    }
}

function cargar() {
    let form = document.querySelector('form')
    console.log(form);
    let boton = document.querySelector('form button')
    boton.classList.add('ingresar')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let data = new FormData(form)
        let correo = data.get('correo')
        let clave = data.get('contraseña')
        console.log('pasa por aqui');
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/login', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    'email': correo, 
                    'password': clave
                })
            })
            const verdad = await respuesta.json()
            if (verdad['success']) {
                let jwt = verdad['data']['token']
                console.log(jwt);
                sessionStorage.setItem('token', jwt)
                let cerrar = document.querySelector('header div div button')
                let registrar = document.querySelectorAll('header div div a button')
                cerrar.classList.remove('ocultar')
                registrar.forEach((e) => e.classList.add('ocultar'))
                modal('Felicidades, inicio de sesión exitoso', '../todas/')
            } else {
                console.log('¡Oh no! No pudiste iniciar sesión');
                modal('¡Oh no! parece que hubo un problema para iniciar sesión')
            }
        } catch (error) {
            console.error(error)
            modal('Ha sucedido un error pero no preocupes, no es tu culpa :D')
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

cargar()
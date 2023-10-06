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
    cargar()
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

function cargar() {
    let forma = document.querySelector('form')
    forma.addEventListener('submit', async (event) => {
        event.preventDefault()
        let data = new FormData(forma)
        let antigua = data.get('antigua')
        let clave = data.get('contraseña')
        let repetida = data.get('repetida')
        try {
            const data_antigua = await fetch('https://graco-api.onrender.com/perfil', {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
                }
            })
            const data_real = await data_antigua.json()
            if (!data_real['success']) {
                modal('¡Oh no! Hubo un problema interno, pero no te preocupes\nProbablemente no sea tu culpa :D')
                return
            }
            if (data_real['data']['clave'] != antigua) {
                modal('¡Oh no! La contraseña antigua no es igual a la que usted ingresó\nTrate de no equivocarse :D')
                return
            }
            if (clave != repetida) {
                modal('¡Oh no! La contraseña repetida no es igual a la nueva contraseña\nTrate de no equivocarse :D')
                return
            }
            const respuesta = await fetch('https://graco-api.onrender.com/cambiarclave', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
                }, 
                body: JSON.stringify({
                    "claveAnterior": antigua,
                    "claveNueva": clave
                })
            })
            const verdad = await respuesta.json()
            if (verdad['success']) {
                modal('¡Felicidades! Modificaste tu contraseña exitosamente', '../perfil/')
            } else {
                modal('¡Oh no! Sucedió un error en la modificación de la contraseña')
            }
        } catch (error) {
            console.log(error);
            modal('¡Oh no! Sucedió un error grave')
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
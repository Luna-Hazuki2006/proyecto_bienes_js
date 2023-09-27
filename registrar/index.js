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
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/registrar', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    'nombre': nombre, 
                    'apellido': apellido, 
                    'email': correo, 
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

function modal(texto) {
    let p = mensaje.querySelector('div div:first-of-type p')
    console.log(texto);
    p.innerHTML = texto
    mensaje.style.display = 'block'
}

cargar()
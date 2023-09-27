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
        pokebola.classList.remove('invisible')
        let data = new FormData(form)
        let nombre = data.get('nombre')
        let apellido = data.get('apellido')
        let correo = data.get('correo')
        let clave = data.get('contraseña')
        try {
            const respuesta = await fetch('https://graco-api.onrender.com/registrar', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    'name': nombre, 
                    'lastname': apellido, 
                    'email': correo, 
                    'password': clave
                })
            })
            const verdad = await respuesta.json()
            if (verdad['success']) {
                pokebola.classList.add('invisible')
                console.log(verdad);
                console.log('felicidades');
                modal('Felicidades, usuario registrado')
                location.href = '../'   
            }
        } catch (error) {
            console.error(error)
            modal('Ha sucedido un error pero no preocupes, no es tu culpa :D')
            pokebola.classList.add('invisible')
        }
    })
}

function modal(texto) {
    let p = mensaje.querySelector('div div:first-of-type p')
    console.log(texto);
    p.innerHTML = texto
    mensaje.style.display = 'block'
}

async function prueba() {
    // Probablemente no vuelva a usar este código pero...
    // No lo quiero borrar :(
    console.log('inicio');
    fetch('https://graco-api.onrender.com/registrar', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify({ "email": "ggimenez", "password": "1" }) 
    }).then(r=> r.json()).then(r=> console.log(r))
    console.log('final');
}

cargar()
if (sessionStorage.getItem('token')) {
    let visibles = document.querySelectorAll('header div div button, header div div a:nth-of-type(3) button')
    console.log(visibles);
    let registrables = document.querySelectorAll('header div div a:nth-of-type(1) button, header div div a:nth-of-type(2) button')
    visibles.forEach((e) => e.classList.remove('oculto'))
    registrables.forEach((e) => e.classList.add('oculto'))
    console.log(registrables);
    console.log('por aca');
}

function calcular(fecha) {
    const hoy = new Date();
    let tiempo = hoy - fecha
    tiempo = tiempo / 1000 / (365.25 * 24 * 60 * 60)
    console.log(tiempo);
    return Math.floor(tiempo) + ' años'
}

let inmueble = JSON.parse(sessionStorage.getItem('inmueble'))
console.log(inmueble);
let info = document.querySelectorAll('main section:last-of-type p')
let imagenes = document.querySelector('main section:first-of-type div')
console.log(info);
console.log(imagenes);
info[1].innerText = 'Precio: ' + inmueble['precio'] + ' $'
info[2].innerText = 'Tamaño (metros cuadrados): ' + inmueble['metroscuadrados']
info[3].innerText = 'Cantidad de habitaciones: ' + inmueble['habitaciones']
info[4].innerText = 'Cantidad de baños: ' + inmueble['baños']
info[5].innerText = 'Antigüedad: ' + calcular(new Date(inmueble['antiguedad']))
for (const esta of inmueble['imagenes']) {
    let img = document.createElement('img')
    img.src = esta
    img.alt = 'Una imagen muy bonita'
    imagenes.appendChild(img)
}
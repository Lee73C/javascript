const isResumenCompraPage = window.location.href.includes("./pages/resumenCompra.html");
const isIndexPage = window.location.href.includes("/javascript/index.html");

let productos = [];

// Cargar los productos y recetas desde un archivo JSON
fetch('./javascript/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        if (window.location.pathname.includes('index.html')) {
            mostrarProductos();
        }
    })
    .catch(error => console.error('Error al cargar productos:', error));

document.addEventListener('DOMContentLoaded', () => {
    fetch('./javascript/recetas.json')
        .then(response => response.json())
        .then(data => {
            window.recetas = data;
        })
        .catch(error => console.error('Error al cargar las recetas:', error));
});

if (isIndexPage) {
// Función para mostrar los productos
function mostrarProductos() {
    const contenedorProductos = document.getElementById('productos');
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');

        divProducto.innerHTML = `<div class="${producto.nombre.toLowerCase()}">
      <img src="img/${producto.nombre.toLowerCase()}.png" alt="${producto.nombre}">
      <p class="nomProd">${producto.nombre}</p>
      <p>$${producto.precio.toLocaleString('es-ES')}</p>
      <button class="addCarrito" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
    </div>`;

        contenedorProductos.appendChild(divProducto);
    });
};

// Obtener carrito desde el almacenamiento local (localStorage) o crear uno nuevo si no existe
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar un producto al carrito
function agregarAlCarrito(producto, precio) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.producto === producto);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ producto, precio, cantidad: 1 });
    }

    // Guardar el carrito actualizado en localStorage como JSON
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la vista del carrito
    actualizarCarrito();
    abrirCarrito();
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const carritoLista = document.getElementById('carritoLista');
    const totalCarrito = document.getElementById('totalCarrito');
    const carritoAcciones = document.getElementById('carritoAcciones'); // Contenedor para los botones de acción

    carritoLista.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.producto} - $${item.precio.toLocaleString('es-ES')} x ${item.cantidad}
            <button class="menos" onclick="cambiarCantidad(${index}, -1)">-</button>
            <button class="mas" onclick="cambiarCantidad(${index}, 1)">+</button>
        `;
        carritoLista.appendChild(li);
        total += item.precio * item.cantidad;
    });

    totalCarrito.innerText = `Total: $${total.toLocaleString('es-ES')}`;

    // Agregar botones si no existen
    carritoAcciones.innerHTML = `
        <button onclick="vaciarCarrito()" class="vaciar">Vaciar Carrito</button>
        <button onclick="comprar()" class="comprar">Comprar</button>
    `;
}

// Función para cambiar la cantidad de un producto
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    // Si la cantidad del producto es 0 o menor, eliminarlo del carrito
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    // Guardar el carrito actualizado en localStorage como JSON
    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarCarrito();
}
function comprar() {
    if (carrito.length === 0) {
        const alertContainer = document.getElementById('carritoVacio') || crearContenedorAlerta();
        
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                El carrito está vacío. Agrega productos antes de continuar con la compra.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        return;
    }
    window.location.href = '/pages/resumenCompra.html';
}

function abrirCarrito() {
    const carritoElement = document.getElementById('carrito');
    carritoElement.style.right = '0';
}

function cerrarCarrito() {
    const carritoElement = document.getElementById('carrito');
    carritoElement.style.right = '-320px';
}
// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];

    // Eliminar el carrito del almacenamiento local
    localStorage.removeItem('carrito');

    actualizarCarrito();
    cerrarCarrito();
}

// Cargar el carrito al iniciar la página
actualizarCarrito();

function seleccionarOpcion() {
    const opcionSeleccionada = document.querySelector('input[name="fermentado"]:checked').value;
    mostrarIngredientes(opcionSeleccionada);
}

// Función para mostrar los ingredientes según la receta seleccionada
function mostrarIngredientes(tipo) {
    const receta = recetas[tipo.toLowerCase()];
    const resultadoDiv = document.getElementById('resultado');

    // Mostrar los ingredientes base de la receta seleccionada
    resultadoDiv.innerHTML = `<h4>Ingredientes base para ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:</h4><ul>`;
    receta.forEach(ingrediente => {
        resultadoDiv.innerHTML += `<li class="ingredientes">${ingrediente.nombre}: ${ingrediente.cantidad} ${ingrediente.unidad}</li>`;
    });
    resultadoDiv.innerHTML += '</ul>';

    // Crear entrada para la cantidad del ingrediente principal
    let cantidadInput = document.createElement('input');
    cantidadInput.className = `input`
    cantidadInput.type = 'number';
    cantidadInput.placeholder = `Cantidad de ${receta[0].nombre} (en ${receta[0].unidad})`;

    let calcularButton = document.createElement('button');
    calcularButton.className = `calcular`
    calcularButton.textContent = 'Calcular';
    calcularButton.onclick = () => calcularIngredientes(tipo, parseFloat(cantidadInput.value));

    // Agregar el input y el botón debajo de los ingredientes base
    resultadoDiv.appendChild(cantidadInput);
    resultadoDiv.appendChild(calcularButton);
}

// Función para calcular ingredientes basados en la cantidad del ingrediente principal
function calcularIngredientes(tipo, cantidadPrincipal) {
    const receta = recetas[tipo.toLowerCase()];
    const resultadoDiv = document.getElementById('resultado');

    // Calculamos el factor en relación al ingrediente principal
    const ingredienteBase = receta[0];
    const factor = cantidadPrincipal / ingredienteBase.cantidad;

    // Mostrar ingredientes calculados con las nuevas cantidades
    resultadoDiv.innerHTML += '<h4>Ingredientes ajustados:</h4><ul>';
    receta.forEach(ingrediente => {
        const cantidadCalculada = (ingrediente.cantidad * factor).toFixed(2);
        resultadoDiv.innerHTML += `<li class="ingredientes">${ingrediente.nombre}: ${parseFloat(cantidadCalculada)} ${ingrediente.unidad}</li>`;
    });
    resultadoDiv.innerHTML += '</ul>';
}
}
//JS para el resumenCompra.html:
if (isResumenCompraPage) {
document.addEventListener('DOMContentLoaded', () => {
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarrito = document.getElementById('totalCarrito');
    
    // Obtener el carrito de localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    // Mostrar los productos del carrito
    listaCarrito.innerHTML = ''; // Limpiar lista
    carrito.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `${item.producto} - $${item.precio.toLocaleString('es-ES')} x ${item.cantidad}`;
        listaCarrito.appendChild(li);
        total += item.precio * item.cantidad;
    });

    // Mostrar el total del carrito
    totalCarrito.innerText = `Total: $${total.toLocaleString('es-ES')}`;
});

document.addEventListener('DOMContentLoaded', function () {
    const validation = new JustValidate('#formCompra');

    validation
        .addField('#nombre', [
            {
                rule: 'required',
                errorMessage: 'El nombre es obligatorio',
            },
        ])
        .addField('#apellido', [
            {
                rule: 'required',
                errorMessage: 'El apellido es obligatorio',
            },
        ])
        .addField('#direccion', [
            {
                rule: 'required',
                errorMessage: 'La dirección es obligatoria',
            },
        ])
        .addField('#identificacion', [
            {
                rule: 'required',
                errorMessage: 'La identificación es obligatoria',
            },
            {
                rule: 'customRegexp',
                value: /^[0-9]{7,8}-[a-zA-Z0-9]$/,
                errorMessage: 'Debe tener el formato 12345678-1',
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: 'El email es obligatorio',
            },
            {
                rule: 'email',
                errorMessage: 'Por favor, ingresa un email válido',
            },
        ])
        .onSuccess((event) => {
            // Prevenir el envío por defecto
            event.preventDefault();

            // Obtener valores del formulario
            const formData = new FormData(event.target);
            const nombre = formData.get('nombre');

            // Mostrar mensaje de agradecimiento
            Swal.fire({
                icon: 'success',
                title: '¡Compra confirmada!',
                text: `Gracias ${nombre} por tu compra. Esperamos que disfrutes de nuestros productos.`,
                confirmButtonText: 'Aceptar',
            }).then(() => {
                localStorage.removeItem('carrito');
                event.target.reset();
                window.location.href = '/index.html';
            });
        });
});
};

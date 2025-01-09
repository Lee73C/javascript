let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funciones del carrito - estas deben estar fuera de cualquier condicional
function abrirCarrito() {
    const carritoElement = document.getElementById('carrito');
    carritoElement.style.right = '0';
}

function cerrarCarrito() {
    const carritoElement = document.getElementById('carrito');
    carritoElement.style.right = '-320px';
}

function mostrarProductos() {
    const contenedorProductos = document.getElementById('productos');
    if (!contenedorProductos) return; // Evitar errores si el elemento no existe
    
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');

        divProducto.innerHTML = `<div class="${producto.nombre.toLowerCase()}">
            <img src="./img/${producto.nombre.toLowerCase()}.png" alt="${producto.nombre}">
            <p class="nomProd">${producto.nombre}</p>
            <p>$${producto.precio.toLocaleString('es-ES')}</p>
            <button class="addCarrito" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
        </div>`;

        contenedorProductos.appendChild(divProducto);
    });
}

function agregarAlCarrito(producto, precio) {
    const productoExistente = carrito.find(item => item.producto === producto);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ producto, precio, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    abrirCarrito();
}

function actualizarCarrito() {
    const carritoLista = document.getElementById('carritoLista');
    const totalCarrito = document.getElementById('totalCarrito');
    const carritoAcciones = document.getElementById('carritoAcciones');
    
    if (!carritoLista || !totalCarrito || !carritoAcciones) return;

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
    carritoAcciones.innerHTML = `
        <button onclick="vaciarCarrito()" class="vaciar">Vaciar Carrito</button>
        <button onclick="comprar()" class="comprar">Comprar</button>
    `;
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarCarrito();
    cerrarCarrito();
}

function comprar() {
    if (carrito.length === 0) {
        const alertContainer = document.getElementById('carritoVacio');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    El carrito está vacío. Agrega productos antes de continuar con la compra.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }
        return;
    }
    window.location.href = './pages/resumenCompra.html';
}

// Cargar los productos
fetch('./javascript/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        mostrarProductos(); // Llamar a mostrarProductos después de cargar los datos
    })
    .catch(error => {
        console.error('Error al cargar productos:', error);
        console.log('URL actual:', window.location.href);
        console.log('Pathname:', window.location.pathname);
    });

// Cargar las recetas
fetch('./javascript/recetas.json')
    .then(response => response.json())
    .then(data => {
        window.recetas = data;
    })
    .catch(error => console.error('Error al cargar las recetas:', error));

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});

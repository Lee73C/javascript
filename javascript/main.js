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

function seleccionarOpcion() {
    const opcionSeleccionada = document.querySelector('input[name="fermentado"]:checked');
    if (!opcionSeleccionada) {
        alert('Por favor selecciona una opción');
        return;
    }
    mostrarIngredientes(opcionSeleccionada.value);
}

function mostrarIngredientes(tipo) {
    if (!window.recetas || !window.recetas[tipo.toLowerCase()]) {
        console.error('Recetas no encontradas');
        return;
    }

    const receta = window.recetas[tipo.toLowerCase()];
    const resultadoDiv = document.getElementById('resultado');

    if (!resultadoDiv) return;

    // Mostrar los ingredientes base de la receta seleccionada
    resultadoDiv.innerHTML = `
        <h4>Ingredientes base para ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:</h4>
        <ul>
            ${receta.map(ingrediente => 
                `<li class="ingredientes">${ingrediente.nombre}: ${ingrediente.cantidad} ${ingrediente.unidad}</li>`
            ).join('')}
        </ul>
    `;

    // Crear entrada para la cantidad del ingrediente principal
    let cantidadInput = document.createElement('input');
    cantidadInput.className = 'input';
    cantidadInput.type = 'number';
    cantidadInput.placeholder = `Cantidad de ${receta[0].nombre} (en ${receta[0].unidad})`;

    let calcularButton = document.createElement('button');
    calcularButton.className = 'calcular';
    calcularButton.textContent = 'Calcular';
    calcularButton.onclick = () => {
        const cantidad = parseFloat(cantidadInput.value);
        if (isNaN(cantidad) || cantidad <= 0) {
            alert('Por favor ingresa una cantidad válida');
            return;
        }
        calcularIngredientes(tipo, cantidad);
    };

    // Agregar el input y el botón debajo de los ingredientes base
    resultadoDiv.appendChild(cantidadInput);
    resultadoDiv.appendChild(calcularButton);
}

function calcularIngredientes(tipo, cantidadPrincipal) {
    if (!window.recetas || !window.recetas[tipo.toLowerCase()]) {
        console.error('Recetas no encontradas');
        return;
    }

    const receta = window.recetas[tipo.toLowerCase()];
    const resultadoDiv = document.getElementById('resultado');

    if (!resultadoDiv) return;

    // Calculamos el factor en relación al ingrediente principal
    const ingredienteBase = receta[0];
    const factor = cantidadPrincipal / ingredienteBase.cantidad;

    // Mostrar ingredientes calculados con las nuevas cantidades
    resultadoDiv.innerHTML += `
        <h4>Ingredientes ajustados:</h4>
        <ul>
            ${receta.map(ingrediente => {
                const cantidadCalculada = (ingrediente.cantidad * factor).toFixed(2);
                return `<li class="ingredientes">${ingrediente.nombre}: ${parseFloat(cantidadCalculada)} ${ingrediente.unidad}</li>`;
            }).join('')}
        </ul>
    `;
}

// Asegurarse de que las recetas se carguen correctamente
document.addEventListener('DOMContentLoaded', () => {
    if (!window.recetas) {
        fetch('./javascript/recetas.json')
            .then(response => response.json())
            .then(data => {
                window.recetas = data;
                console.log('Recetas cargadas:', data);
            })
            .catch(error => console.error('Error al cargar las recetas:', error));
    }
});

let productos = [];

// Cargar los productos y recetas desde un archivo JSON
fetch('javascript/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        console.log(productos);
        mostrarProductos();
    })
    .catch(error => console.error('Error al cargar productos:', error));

document.addEventListener('DOMContentLoaded', () => {
    fetch('javascript/recetas.json')
        .then(response => response.json())
        .then(data => {
            window.recetas = data;
        })
        .catch(error => console.error('Error al cargar las recetas:', error));
});


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

// Cerrar carrito con la "X"
document.querySelector('cerrarCarrito').addEventListener('click', cerrarCarrito);

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
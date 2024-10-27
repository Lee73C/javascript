alert("Bienvenidos a la calculadora de costo y cantidades para los fermentados");

const precios = {
    repollo: 1.59, // precio por gramo
    jengibre: 1.5,
    ajo: 67,
    aji: 10,
    zanahoria: 1.35,
    cebollin: 282,
    salsaPescado: 10.95,
    azucar: 1.29,
    lima: 3.78,
    aguaFilt: 0.08,
    aguaHirv: 0.1,
    te: 20.76,
    scoby: 16000,
    kombucha: 1.5,
    cerezas: 2,
    canela: 63.3,
    clavos: 58,
    anis: 37.8
};

let costoTotalAcumulado = 0;

// Función para calcular el total del carrito usando arrays
function calcularCostoCarrito(ingredientes) {
    let total = 0;
    ingredientes.forEach(item => {
        if (precios[item.nombre]) {
            total += precios[item.nombre] * item.cantidad;
        }
    });
    return total || 0;
}

// Función para generar el mensaje de ingredientes y cantidades
function generarMensajeIngredientes(nomUsuario, carrito) {
    let mensaje = `Entendido, ${nomUsuario}, entonces lo que necesitas es:\n`;
    carrito.forEach(item => {
        mensaje += `- ${item.nombre}: ${item.cantidad.toFixed(0)} ${item.unidad} \n`;
    });
    return mensaje;
}

const nomUsuario = prompt("Primero que todo danos tu nombre");
function calcReceta() {
    let selecUsuario = prompt("Buen día " + nomUsuario + `, dinos qué fermento te gustaría hacer:
        Kimchi
        Kombucha
        Cerezas en Vinagre`).toLowerCase().trim();

    const opcionesValidas = ["kimchi", "kombucha", "cerezas en vinagre"];

    while (!opcionesValidas.includes(selecUsuario)) {
        alert("Receta no válida, por favor elige una opción válida.");
        selecUsuario = prompt("No es una opción válida " + nomUsuario + ". Elige entre Kimchi, Kombucha o Cerezas en Vinagre").toLowerCase().trim();
    }

    let carrito = [];
    if (selecUsuario === "kimchi") {
        alert(`Los ingredientes para un jarro de 1,5 lts son:
            - 825 grs Repollo (Col)
            - 50 grs Jengibre
            - 6 Dientes de Ajo
            - 50 grs de Aji
            - 3 unidades de zanahorias
            - 4 cebollines (cebolletas)
            - 400 ml de Salsa de pescado
            - 65 grs de Azucar
            - 2 Limas
            - 200 ml de Agua`);
        const cantIngresada = parseFloat(prompt("Dime cuantos grs tienes col (o repollo)"));
        const repollo = cantIngresada / 825;

        carrito = [
            { nombre: "repollo", cantidad: cantIngresada, unidad: "grs" },
            { nombre: "jengibre", cantidad: repollo * 50, unidad: "grs" },
            { nombre: "ajo", cantidad: repollo * 6, unidad: "dientes" },
            { nombre: "aji", cantidad: repollo * 50, unidad: "grs" },
            { nombre: "zanahoria", cantidad: repollo * 3, unidad: "unidades" },
            { nombre: "cebollin", cantidad: repollo * 4, unidad: "unidades" },
            { nombre: "salsaPescado", cantidad: repollo * 400, unidad: "ml" },
            { nombre: "azucar", cantidad: repollo * 65, unidad: "grs" },
            { nombre: "lima", cantidad: repollo * 2, unidad: "unidades" },
            { nombre: "agua", cantidad: repollo * 200, unidad: "ml" }
        ];

    } else if (selecUsuario === "kombucha") {
        alert(`Los ingredientes para un jarro de 1 lts son:
            - 2 cucharadas colmadas de té
            - 200 grs azucar
            - 1000 ml agua hirviendo
            - 1000 ml agua filtrada
            - 1 Scoby
            - 250 ml Kombucha`);
        const cantIngresada = parseFloat(prompt("Dime cuantas cucharadas de Té tienes"));
        const te = cantIngresada / 2;

        carrito = [
            { nombre: "te", cantidad: cantIngresada, unidad: "cucharadas" },
            { nombre: "azucar", cantidad: te * 200, unidad: "grs" },
            { nombre: "aguaHirv", cantidad: te * 1000, unidad: "ml" },
            { nombre: "aguaFilt", cantidad: te * 1000, unidad: "ml" },
            { nombre: "scoby", cantidad: (cantIngresada * 1) / 2, unidad: "unidades" },
            { nombre: "kombucha", cantidad: te * 250, unidad: "ml" }
        ];

    } else if (selecUsuario === "cerezas en vinagre") {
        alert(`Los ingredientes para un jarro de 1 lts son:
            - 600 grs de Cerezas
            - 600 grs de Azucar
            - 1 rama de canela
            - 2 clavos de olor
            - 1 anis estrellado`);
        const cantIngresada = parseFloat(prompt("Dime cuantos grs de Cerezas tienes"));
        const cerezas = cantIngresada / 600;

        carrito = [
            { nombre: "cerezas", cantidad: cantIngresada, unidad: "grs" },
            { nombre: "azucar", cantidad: cerezas * 600, unidad: "grs" },
            { nombre: "canela", cantidad: cerezas * 1, unidad: "rama" },
            { nombre: "clavos", cantidad: cerezas * 2, unidad: "unidades" },
            { nombre: "anis", cantidad: cerezas * 1, unidad: "unidad" }
        ];
    }

    // Mostrar el mensaje con los ingredientes y cantidades justo después de definir el carrito
    const mensajeIngredientes = generarMensajeIngredientes(nomUsuario, carrito);
    alert(mensajeIngredientes);

    const costoTotal = calcularCostoCarrito(carrito);
    costoTotalAcumulado += costoTotal;

    alert(`El costo total estimado para tu receta ${nomUsuario} es de ${selecUsuario} es: $${costoTotal.toFixed(0)} \n El costo acumulado estimado para tu receta ${nomUsuario} es de: $${costoTotalAcumulado.toFixed(0)}`);
    console.log(`Costo total estimado para ${selecUsuario}: $${costoTotal.toFixed(0)}`);
    console.log(`Costo total acumulado hasta ahora: $${costoTotalAcumulado.toFixed(0)}`);
}

let repetir;
do {
    calcReceta();
    repetir = prompt("¿Quieres agregar otra receta a la calculadora? (sí/no)").toLowerCase().trim();
} while (repetir === "si" || repetir === "sí");

alert(`El costo total acumulado de todas tus recetas es: $${costoTotalAcumulado.toFixed(0)}`);
console.log(`Costo total acumulado de todas las recetas: $${costoTotalAcumulado.toFixed(0)}`);
alert("¡Gracias por usar la calculadora de recetas de fermentados! Puedes visitarnos en https://lee73c.github.io/proyecto-bbf/");

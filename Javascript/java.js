alert("Bienvenido! Esta es la calculadora para recetas de fermentados, te ayudaré a realizar la receta que quieras.");

function calcReceta (componente){
    const nomUsuario = prompt("Primero que todo danos tu nombre")
    let selecUsuario = prompt("Buen dia " + nomUsuario + ` dinos que fermento te gustaria hacer
        Kimchi
        Kombucha
        Cerezas en Vinagre`).toLowerCase();

        const opcionesValidas = ["kimchi", "kombucha", "cerezas en vinagre"];

        while (!opcionesValidas.includes(selecUsuario)) {
            alert("Receta no válida, por favor elige una opción válida.");
            selecUsuario = prompt("No es una opcion valida " + nomUsuario + " elije entre Kimchi, Kombucha o Cerezas en vinagre").toLowerCase();
        }

    if(selecUsuario === "kimchi"){
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
            - 200 ml de Agua
            
            Pero no te preocupes, te pediré cuanto tienes del ingrediente principal en este caso el Repollo`);
        const cantIngresada = parseFloat(prompt("Dime cuantos grs tienes col (o repollo)"));
        const repollo = cantIngresada / 825;
        const jengibre = repollo * 50;
        const ajo = repollo * 6;
        const aji = repollo * 50;
        const zanahoria = repollo * 3;
        const cebollin = repollo * 4;
        const salsaPescado = repollo * 400;
        const azucar = repollo * 65;
        const lima = repollo * 2;
        const agua = repollo * 200;
        alert("Entendido " + nomUsuario + " entonces lo que necesitas es esto: \n -Repollo: " + cantIngresada.toFixed(1) + " grs \n Jengibre: " + jengibre.toFixed(1) + " grs \n Ajo: " + ajo.toFixed(0) + " dientes \n Aji: " + aji.toFixed(1) + " grs. \n Zanahoria: " + zanahoria.toFixed(0) + " unidades \n Cebollin: " + cebollin.toFixed(0) + " unidades \n Salsa de pescado: " + salsaPescado.toFixed(0) + " ml \n Azucar: " + azucar.toFixed(1) + " grs \n Limas: " + lima.toFixed(0) + " unidades \n Agua: " + agua.toFixed(0) + " ml");
    } else if(selecUsuario === "kombucha"){
        alert(`Los ingredientes para un jarro de 1 lts son:
            - 2 cucharadas colmadas de té
            - 200 grs azucar
            - 1000 ml agua hirviendo
            - 1000 ml agua filtrada
            - 1 Scoby
            - 250 ml Kombucha
            
            Pero no te preocupes, te pediré cuanto tienes del ingrediente principal en este caso el té`);

        const cantIngresada = parseFloat(prompt("Dime cuantas cucharadas de Té tienes"));
        const te = cantIngresada / 2;
        const azucar = te * 200;
        const aguaHirv = te * 1000;
        const aguaFilt = te * 1000;
        const scoby = 1;
        const kombucha = te * 250;
        alert("Entendido " + nomUsuario + " entonces lo que necesitas es esto: \n -Té: " + cantIngresada + " cucharadas \n -Azucar " + azucar.toFixed(1) + " grs. \n -Agua hirviendo: " + aguaHirv.toFixed(0) + " ml \n -Agua filtrada: " + aguaFilt.toFixed(0) + " ml \n -Scoby: " + scoby.toFixed(0) + " unidades \n -Kombucha: " + kombucha.toFixed(0) + " ml");
    } else if(selecUsuario === "cerezas en vinagre"){
        alert(`Los ingredientes para un jarro de 1 lts son:
            - 600 grs de Cerezas
            - 600 grs de Azucar
            - 1 rama de canela
            - 2 clavos de olor
            - 1 anis estrellado
            
            Pero no te preocupes, te pediré cuanto tienes del ingrediente principal en este caso las cerezas`);

        const cantIngresada = parseFloat(prompt("Dime cuantos grs de Cerezas tienes"));
        const cerezas = cantIngresada / 600;
        const azucar = cerezas * 600;
        const canela = cerezas * 1;
        const clavos = cerezas * 2;
        const anis = cerezas * 1;

        alert("Entendido " + nomUsuario + " entonces lo que necesitas es esto: \n -Cerezas: " + cantIngresada.toFixed(0) + " grs \n -Azucar " + azucar.toFixed(1) + " grs. \n -Canela: " + canela.toFixed(0) + " rama \n -Clavos de olor: " + clavos.toFixed(0) + " unidades \n -Anis estrellado: " + anis.toFixed(0) + " unidades");
    }
}

function preguntarRepetir() {
    let repetir;
    do {
        repetir = prompt("¿Quieres volver a usar la calculadora? (sí/no)").toLowerCase().trim();
    } while (repetir !== "si" && repetir !== "sí");

    return repetir;
}

// Ciclo principal para ejecutar la calculadora
function preguntarRepetir() {
    let repetir;
    do {
        repetir = prompt("¿Quieres volver a usar la calculadora? (sí/no)").toLowerCase().trim();
    } while (repetir !== "si" && repetir !== "sí" && repetir !== "no");

    return repetir;
}

// Variable para almacenar la respuesta del usuario y ejecutar el ciclo
let repetir;
do {
    calcReceta();
    repetir = preguntarRepetir();
} while (repetir === "si" || repetir === "sí");

alert("¡Gracias por usar la calculadora de recetas de fermentados! puedes visitarnos en https://lee73c.github.io/proyecto-bbf/");


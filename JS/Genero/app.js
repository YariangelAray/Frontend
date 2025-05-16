//importaciones
import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { get, post } from "../api.js";
import crearTabla from "../crearTabla.js";

// variables
const formulario = document.querySelector('form');
const nombre = document.querySelector('[name="nombre"]');

//funciones

// Función para crear la tabla
const crearTablaGeneros = (generos) => {
  const encabezados = ["ID", "Nombre"];

  const generosDatos = [];

  generos.forEach((genero) => {

    const celdas = [genero.id, genero.nombre];

    generosDatos.push({celdas, redireccion: `../../Genero/generoGestion.html?id=${genero.id}`})
  });

  crearTabla("Generos", encabezados, generosDatos);
}

//eventos

nombre.addEventListener('keydown', validarTexto);
nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Validamos los campos del formulario
  if (!validarCampos(event)) return;

  // Hacemos la petición POST al servidor enviando los datos del formulario
  const respuesta = await post("generos", datos);
  
  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {
    alert(`Error al crear el género: \n❌ ${(await respuesta.json()).error}`);
    return;
  }  
  
  alert("Formulario enviado.");
  event.target.reset();
  location.reload();
});


addEventListener('DOMContentLoaded', async () => {
  // Obtenemos la lista de géneros haciendo una petición GET al servidor
  const generos = await get('generos');

  if (generos.length == 0) return;
  
  crearTablaGeneros(generos);
  
});
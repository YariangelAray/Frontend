//importaciones
import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { get, post } from "../api.js";
import crearTabla from "../crearTabla.js";

// variables
const formulario = document.querySelector('form');
const nombre = document.querySelector('[name="nombre"]');

//funciones

// Función para crear la tabla
const crearTablaLenguajes = (lenguajes) => {
  const encabezados = ["ID", "Nombre"];

  const lenguajesDatos = [];

  lenguajes.forEach((lenguaje) => {

    const celdas = [lenguaje.id, lenguaje.nombre];

    lenguajesDatos.push({celdas, redireccion: `../../Lenguaje/lenguajeGestion.html?id=${lenguaje.id}`})
  });

  crearTabla("Lenguajes", encabezados, lenguajesDatos);
}

//eventos

nombre.addEventListener('keydown', validarTexto);
nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Validamos los campos del formulario
  if (!validarCampos(event)) return;

  // Hacemos la petición POST al servidor enviando los datos del formulario
  const respuesta = await post("lenguajes", datos);
  
  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {
    alert(`Error al crear el lenguaje: \n❌ ${(await respuesta.json()).message}`);
    return;
  }  
  
  alert("Formulario enviado.");
  event.target.reset();
  location.reload();
});


addEventListener('DOMContentLoaded', async () => {
  // Obtenemos la lista de lenguajes haciendo una petición GET al servidor
  const lenguajes = await get('lenguajes');

  if (lenguajes.data.length == 0) return;
  
  crearTablaLenguajes(lenguajes.data);
});
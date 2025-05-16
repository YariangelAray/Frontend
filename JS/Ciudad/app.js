//importaciones
import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { get, post } from "../api.js";
import crearTabla from "../crearTabla.js";

// variables
const formulario = document.querySelector('form');
const nombre = document.querySelector('[name="nombre"]');

//funciones

// Función para crear la tabla
const crearTablaCiudades = (ciudades) => {
  const encabezados = ["ID", "Nombre"];

  const ciudadesDatos = [];

  ciudades.forEach((ciudad) => {

    const celdas = [ciudad.id, ciudad.nombre];

    ciudadesDatos.push({celdas, redireccion: `../../Ciudad/ciudadGestion.html?id=${ciudad.id}`})
  });

  crearTabla("Ciudades", encabezados, ciudadesDatos);
}

//eventos

nombre.addEventListener('keydown', validarTexto);
nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Validamos los campos del formulario
  if (!validarCampos(event)) return;

  // Hacemos la petición POST al servidor enviando los datos del formulario
  const respuesta = await post("ciudades", datos);
  
  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {
    alert(`Error al crear la ciudad: \n❌ ${(await respuesta.json()).error}`);
    return;
  }  
  
  alert("Formulario enviado.");
  event.target.reset();
  location.reload();
});


addEventListener('DOMContentLoaded', async () => {
  // Obtenemos la lista de ciudades haciendo una petición GET al servidor
  const ciudades = await get('ciudades');

  if (ciudades.length == 0) return;
  
  crearTablaCiudades(ciudades);
});
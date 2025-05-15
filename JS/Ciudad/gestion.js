import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { get, put, del } from "../api.js";

// Obtenemos el id de la ciudad desde la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// Obtenemos los datos de la ciudad haciendo una petición GET al servidor
const ciudad = await get(`ciudades/${id}`);

const tituloPagina = document.querySelector('title');
const titulo = document.querySelector('h1');
const nombre = document.querySelector('[name="nombre"]');

const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');

// función para asignar valores a los campos del formulario
const asignarValores = () => {
  tituloPagina.textContent = ciudad.nombre;

  nombre.value = ciudad.nombre;  
  titulo.textContent = ciudad.nombre;
}

asignarValores();

nombre.addEventListener('keydown', validarTexto);
nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (nombre.value === ciudad.nombre) {
    alert("No se han realizado cambios.");
    return;
  }
  
  // Validamos los campos del formulario
  if (!validarCampos(event)) return;  
  
  // Hacemos la petición PUT al servidor enviando los nuevos datos del formulario
  const respuesta = await put(`ciudades/${id}`, datos);

  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {        
    alert(`Error al actualizar la ciudad: \n❌ ${(await respuesta.json()).error}`);
    return;
  }
  alert("Ciudad actualizada.");
  location.reload();
});

// Le agregamos un evento al botón de eliminar para que al hacer click se elimine la ciudad
btnEliminar.addEventListener('click', async () => {
  // Mostramos un mensaje de confirmación antes de eliminar la ciudad
  const confirmacion = confirm("¿Está seguro de que desea eliminar esta ciudad?");

  if (!confirmacion) return;

  // Hacemos la petición DELETE al servidor para eliminar la ciudad
  const respuesta = await del(`ciudades/${id}`);    

  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {            
    alert(`Error al eliminar la ciudad: \n❌ ${(await respuesta.json()).error}`);            
    return;
  }
  alert("Ciudad eliminada.");
  // Redirigimos al usuario a la página de ciudades porque ya no existe la ciudad actual
  window.location.href = "../../Ciudad/ciudad.html";
});
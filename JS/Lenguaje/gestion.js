import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { get, put, del } from "../api.js";

// Obtenemos el id del lenguaje desde la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// Obtenemos los datos del lenguaje haciendo una petición GET al servidor
const lenguaje = (await get(`lenguajes/${id}`)).data;

const tituloPagina = document.querySelector('title');
const titulo = document.querySelector('h1');
const nombre = document.querySelector('[name="nombre"]');

const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');

// función para asignar valores a los campos del formulario
const asignarValores = () => {
  tituloPagina.textContent = lenguaje.nombre;

  nombre.value = lenguaje.nombre;  
  titulo.textContent = lenguaje.nombre;
}

asignarValores();

nombre.addEventListener('keydown', validarTexto);
nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (nombre.value === lenguaje.nombre) {
    alert("No se han realizado cambios.");
    return;
  }
  
  // Validamos los campos del formulario
  if (!validarCampos(event)) return;  
  
  // Hacemos la petición PUT al servidor enviando los nuevos datos del formulario
  const respuesta = await put(`lenguajes/${id}`, datos);

  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {        
    alert(`Error al actualizar el lenguaje: \n❌ ${(await respuesta.json()).message}`);
    return;
  }
  alert("Lenguaje actualizado.");
  location.reload();
});

// Le agregamos un evento al botón de eliminar para que al hacer click se elimine el lenguaje
btnEliminar.addEventListener('click', async () => {
  // Mostramos un mensaje de confirmación antes de eliminar el lenguaje
  const confirmacion = confirm("¿Está seguro de que desea eliminar este lenguaje?");

  if (!confirmacion) return;

  // Hacemos la petición DELETE al servidor para eliminar el lenguaje
  const respuesta = await del(`lenguajes/${id}`);    

  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {            
    alert(`Error al eliminar el lenguaje: \n❌ ${(await respuesta.json()).message}`);            
    return;
  }
  alert("Lenguaje eliminado.");
  // Redirigimos al usuario a la página de lenguajes porque ya no existe el lenguaje actual
  window.location.href = "../../Lenguaje/lenguaje.html";
});
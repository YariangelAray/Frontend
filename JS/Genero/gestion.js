import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { get, put, del } from "../api.js";

// Obtenemos el id del género desde la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// Obtenemos los datos del género haciendo una petición GET al servidor
const genero = (await get(`generos/${id}`)).data;

const tituloPagina = document.querySelector('title');
const titulo = document.querySelector('h1');
const nombre = document.querySelector('[name="nombre"]');

const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');

// función para asignar valores a los campos del formulario
const asignarValores = () => {
  tituloPagina.textContent = genero.nombre;

  nombre.value = genero.nombre;  
  titulo.textContent = genero.nombre;
}

asignarValores();

nombre.addEventListener('keydown', validarTexto);
nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (nombre.value === genero.nombre) {
    alert("No se han realizado cambios.");
    return;
  }
  
  // Validamos los campos del formulario
  if (!validarCampos(event)) return;  
  
  // Hacemos la petición PUT al servidor enviando los nuevos datos del formulario
  const respuesta = await put(`generos/${id}`, datos);

  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {        
    alert(`Error al actualizar el género: \n❌ ${(await respuesta.json()).message}`);
    return;
  }
  alert("Género actualizado.");
  location.reload();
});

// Le agregamos un evento al botón de eliminar para que al hacer click se elimine el género
btnEliminar.addEventListener('click', async () => {
  // Mostramos un mensaje de confirmación antes de eliminar el género
  const confirmacion = confirm("¿Está seguro de que desea eliminar este genero?");

  if (!confirmacion) return;

  // Hacemos la petición DELETE al servidor para eliminar el género
  const respuesta = await del(`generos/${id}`);    

  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {            
    alert(`Error al eliminar el género: \n❌ ${(await respuesta.json()).message}`);            
    return;
  }
  alert("Género eliminado.");
  // Redirigimos al usuario a la página de géneros porque ya no existe el género actual
  window.location.href = "../../Genero/genero.html";
});
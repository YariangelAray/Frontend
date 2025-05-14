import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { obtenerDatos, actualizar, eliminar } from "../Helpers/realizarPeticion.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const ciudad = await obtenerDatos(`ciudades/${id}`);

const tituloPagina = document.querySelector('title');
const titulo = document.querySelector('h1');
const nombre = document.querySelector('[name="nombre"]');

const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');


const asignarValores = async () => {
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

  if (!validarCampos(event)) return;
  console.log(datos);
  

  const respuesta = await actualizar(`ciudades/${id}`, datos);
  if (!respuesta.ok) {        
    alert(`Error al actualizar la ciudad: \n❌ ${(await respuesta.json()).error}`);
    return;
  }
  alert("Ciudad actualizada.");
  location.reload();
});

btnEliminar.addEventListener('click', async (event) => {
  const confirmacion = confirm("¿Está seguro de que desea eliminar esta ciudad?");
  
  if (!confirmacion) return;
  
  const respuesta = await eliminar(`ciudades/${id}`);    
  if (!respuesta.ok) {            
    alert(`Error al eliminar la ciudad: \n❌ ${(await respuesta.json()).error}`);            
    return;
  }
  alert("Ciudad eliminada.");
  window.location.href = "ciudad.html";
  
});
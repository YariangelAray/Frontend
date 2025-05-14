import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { obtenerDatos, actualizar, eliminar } from "../Helpers/realizarPeticion.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const genero = await obtenerDatos(`generos/${id}`);

const tituloPagina = document.querySelector('title');
const titulo = document.querySelector('h1');
const nombre = document.querySelector('[name="nombre"]');

const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');


const asignarValores = async () => {
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

    if (!validarCampos(event)) return;
    
    const respuesta = await actualizar(`generos/${id}`, datos);
    if (!respuesta.ok) {        
        alert(`Error al actualizar el género: \n❌ ${(await respuesta.json()).error}`);
        return;
    }

    alert("Género actualizado.");    
    location.reload();
    
});

btnEliminar.addEventListener('click', async (event) => {
    const confirmacion = confirm("¿Está seguro de que desea eliminar este género?");
    
    if (!confirmacion) return;
    const respuesta = await eliminar(`generos/${id}`);
    
    if (!respuesta.ok) {      
        alert(`Error al eliminar el género: \n❌ ${(await respuesta.json()).error}`);            
        return
    }
    alert("Género eliminado.");
    window.location.href = "genero.html";
});
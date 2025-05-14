import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { obtenerDatos, actualizar, eliminar } from "../Helpers/realizarPeticion.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const lenguaje = await obtenerDatos(`lenguajes/${id}`);

const tituloPagina = document.querySelector('title');
const nombre = document.querySelector('[name="nombre"]');
const titulo = document.querySelector('h1');

const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');


const asignarValores = async () => {
    tituloPagina.textContent = lenguaje.nombre;

    nombre.value = lenguaje.nombre;
    nombre.textContent = lenguaje.nombre;
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

    if (validarCampos(event)) {
        const respuesta = await actualizar(`lenguajes/${id}`, datos);
        if (!respuesta.ok) {        
            alert(`Error al actualizar el lenguaje: \n❌ ${(await respuesta.json()).error}`);
            return;
        }

        alert("Lenguaje actualizado.");    
        location.reload();
    }
});

btnEliminar.addEventListener('click', async (event) => {
    const confirmacion = confirm("¿Está seguro de que desea eliminar este lenguaje?");
    
    if (confirmacion) {
        const respuesta = await eliminar(`lenguajes/${id}`);
    
        if (!respuesta.ok) {      
            alert(`Error al eliminar el lenguaje: \n❌ ${(await respuesta.json()).error}`);            
            return
        }
        alert("Lenguaje eliminado.");
        window.location.href = "lenguaje.html";
    }
});
//importaciones
import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";

// variables
const formulario = document.querySelector('form');

const nombre = document.querySelector('[name="nombre"]');

//funciones

//eventos

nombre.addEventListener('keydown', validarTexto);

nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', (event) => {
  event.preventDefault();
  
  if (validarCampos(event)) {

    console.log("Datos guardados:", datos);

    alert("Formulario enviado.");
    event.target.reset();
  }
});
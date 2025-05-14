//importaciones
import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { obtenerDatos, crear } from "../Helpers/realizarPeticion.js";

// variables
const formulario = document.querySelector('form');

const nombre = document.querySelector('[name="nombre"]');

//funciones

const crearTabla = () => {
  const main = document.querySelector('main');

  const tabla = document.createElement('table');
  tabla.classList.add('tabla'); // clase BEM principal

  const tablaHeader = document.createElement('thead');
  tablaHeader.classList.add('tabla__encabezado');
  tabla.append(tablaHeader);

  const tablaFila = document.createElement('tr');
  tablaFila.classList.add('tabla__fila');
  tablaHeader.append(tablaFila);

  const encabezados = [
    "ID", "Nombre"
  ];

  encabezados.forEach((texto) => {
    const th = document.createElement('th');
    th.classList.add('tabla__celda', 'tabla__celda--encabezado');
    th.textContent = texto;
    tablaFila.append(th);
  });

  const segundaSeccion = document.createElement('section');
  const div = document.createElement('div');
  div.classList.add('container');

  const titulo = document.createElement('h2');
  titulo.textContent = "Lista de lenguajes";
  titulo.classList.add('center');

  segundaSeccion.append(div);
  div.append(titulo, tabla);
  
  main.append(segundaSeccion);
}

//eventos

nombre.addEventListener('keydown', validarTexto);

nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async(event) => {
  event.preventDefault();
  
  if (!validarCampos(event)) return;

  console.log("Datos guardados:", datos);

  alert("Formulario enviado.");
  event.target.reset();

  const respuesta = await crear("lenguajes", datos);

  if (!respuesta.ok) {
    alert(`Error al crear el lenguaje: \n❌ ${(await respuesta.json()).error}`);
    return;
  }
  location.reload();
  
});

addEventListener('DOMContentLoaded', async () => {
  const lenguajes = await obtenerDatos('lenguajes');

  if (lenguajes.length > 0) {
    crearTabla();

    const tabla = document.querySelector('.tabla');
    const tablaBody = document.createElement('tbody');
    tablaBody.classList.add('tabla__cuerpo');
    tabla.append(tablaBody);

    lenguajes.forEach((lenguaje) => {
      const fila = document.createElement('tr');
      fila.classList.add('tabla__fila');
      tablaBody.append(fila);

      const celdas = [lenguaje.id, lenguaje.nombre];

      celdas.forEach((texto) => {
        const celda = document.createElement('td');
        celda.classList.add('tabla__celda');
        celda.textContent = texto;
        fila.append(celda);
      });

      fila.addEventListener('click', () => {
        window.location.href = `lenguajeGestion.html?id=${lenguaje.id}`;
      });
    });
  }
});
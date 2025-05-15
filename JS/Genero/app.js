//importaciones
import { validarCampo, validarCampos, validarTexto, datos } from "../validaciones.js";
import { get, post } from "../api.js";

// variables
const formulario = document.querySelector('form');
const nombre = document.querySelector('[name="nombre"]');

//funciones

// Función para crear la tabla
const crearTabla = () => {
  const main = document.querySelector('main');

  const tabla = document.createElement('table');
  tabla.classList.add('tabla'); 

  const tablaHeader = document.createElement('thead');
  tablaHeader.classList.add('tabla__encabezado');
  tabla.append(tablaHeader);

  const tablaFila = document.createElement('tr');
  tablaFila.classList.add('tabla__fila');
  tablaHeader.append(tablaFila);

  const encabezados = ["ID", "Nombre"];

  encabezados.forEach((texto) => {
    const th = document.createElement('th');
    th.classList.add('tabla__celda', 'tabla__celda--encabezado');
    th.textContent = texto;
    tablaFila.append(th);
  });

  const segundaSeccion = document.createElement('section');
  segundaSeccion.classList.add('section');

  const titulo = document.createElement('h2');
  titulo.textContent = "Lista de géneros";
  titulo.classList.add('center', 'subtitle');

  segundaSeccion.append(titulo, tabla);
  
  main.append(segundaSeccion);
}

//eventos

nombre.addEventListener('keydown', validarTexto);
nombre.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Validamos los campos del formulario
  if (!validarCampos(event)) return;

  // Hacemos la petición POST al servidor enviando los datos del formulario
  const respuesta = await post("generos", datos);
  
  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {
    alert(`Error al crear el género: \n❌ ${(await respuesta.json()).error}`);
    return;
  }  
  
  alert("Formulario enviado.");
  event.target.reset();
  location.reload();
});


addEventListener('DOMContentLoaded', async () => {
  // Obtenemos la lista de géneros haciendo una petición GET al servidor
  const generos = await get('generos');

  if (generos.length == 0) return;
  
  crearTabla();

  const tabla = document.querySelector('.tabla');
  const tablaBody = document.createElement('tbody');
  tablaBody.classList.add('tabla__cuerpo');
  tabla.append(tablaBody);

  // Recorremos la lista de generos y creamos una fila por cada género
  generos.forEach((genero) => {
    const fila = document.createElement('tr');
    fila.classList.add('tabla__fila');
    tablaBody.append(fila);

    const celdas = [genero.id, genero.nombre];

    celdas.forEach((texto) => {
      const celda = document.createElement('td');
      celda.classList.add('tabla__celda');
      celda.textContent = texto;
      fila.append(celda);
    });

    // Agregamos un evento al hacer click en la fila para redirigir a la página de gestión de género
    fila.addEventListener('click', () => {
      window.location.href = `../../Genero/generoGestion.html?id=${genero.id}`;
    });
  });
  
});
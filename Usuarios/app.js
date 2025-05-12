//importaciones
import { validarCampo, validarCampos, validarNumero, validarTexto, validarCheckeo, datos } from "../validaciones.js";
import obtenerDatos from "../Helpers/realizarPeticion.js";

// variables
const formulario = document.querySelector('form');
const boton = document.querySelector('#btn_validar');

const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const telefono = document.querySelector('[name="telefono"]');
const ciudad = document.querySelector('[name="ciudad"]');
const documento = document.querySelector('[name="documento"]');
const usuario = document.querySelector('[name="usuario"]');
const contrasena = document.querySelector('[name="contrasena"]');

const generos = document.querySelectorAll('[name="genero"]')
const lenguajes = document.querySelectorAll('[name="lenguajes[]"]')

const checkBox = document.querySelector('[name="politica"]');

//funciones

const habilitarBoton = () => {  
  if (!checkBox.checked) boton.setAttribute('disabled', '');
  
  else if (boton.disabled) boton.removeAttribute('disabled');
}

const cargarGeneros = async () => {
  const generos = await obtenerDatos('generos');
  console.log(generos);
  
  const contenedor = document.querySelector('.form__generos');

  generos.forEach((genero) => {
    const label = document.createElement('label');
    label.textContent = genero.nombre;  
    label.setAttribute('for', 'gen__' + genero.id);
    label.setAttribute('class', 'genero');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'genero');
    input.setAttribute('value', genero.id);
    input.setAttribute('id', 'gen__' + genero.id);
    input.setAttribute('required', '');
    
    label.insertAdjacentElement('afterbegin', input);
    contenedor.append(label);
  });
}
cargarGeneros();

const cargarCiudades = async () =>{
  const ciudades = await obtenerDatos('ciudades');
  console.log(ciudades);
  
  const contenedor = document.querySelector('.form__control select');

  ciudades.forEach((ciudad) => {
    const option = document.createElement('option');
    option.textContent = ciudad.nombre;
    option.setAttribute('value', ciudad.id);
    contenedor.append(option);
  });  
}
cargarCiudades();

const cargarLenguajes = async () => {
  const lenguajes = await obtenerDatos('lenguajes');
  console.log(lenguajes);
  
  const contenedor = document.querySelector('.form__lenguajes');

  lenguajes.forEach((lenguaje) => {
    const label = document.createElement('label');
    label.textContent = lenguaje.nombre;  
    label.setAttribute('for', 'leng__' + lenguaje.id);
    label.setAttribute('class', 'lenguaje');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'lenguajes[]');
    input.setAttribute('id', 'leng__' + lenguaje.id);
    input.setAttribute('value', lenguaje.id);
    input.setAttribute('required', '');
    
    label.insertAdjacentElement('afterbegin', input);
    contenedor.append(label);
  });
}
cargarLenguajes();

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
    "ID", "Nombre Completo", "Teléfono", "Ciudad",
    "Género", "N° Documento", "Lenguajes", "Usuario"
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
  titulo.textContent = "Lista de usuarios";
  titulo.classList.add('center');

  segundaSeccion.append(div);
  div.append(titulo, tabla);
  
  main.append(segundaSeccion);
}

//eventos

addEventListener('DOMContentLoaded', habilitarBoton);
checkBox.addEventListener('change', habilitarBoton);

nombre.addEventListener('keydown', validarTexto);
apellido.addEventListener('keydown', validarTexto);
telefono.addEventListener('keydown', validarNumero);
documento.addEventListener('keydown', validarNumero);

nombre.addEventListener('blur', validarCampo);
apellido.addEventListener('blur', validarCampo);
telefono.addEventListener('blur', validarCampo);
ciudad.addEventListener('blur', validarCampo);
documento.addEventListener('blur', validarCampo);
usuario.addEventListener('blur', validarCampo);
contrasena.addEventListener('blur', validarCampo);

[...generos].forEach((campo) => {
  campo.addEventListener('change', validarCheckeo);
});

[...lenguajes].forEach((campo) => {
  campo.addEventListener('change', validarCheckeo);
});


formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  if (validarCampos(event)) {

    console.log("Datos guardados:", datos);

    alert("Formulario enviado.");
    event.target.reset();

    boton.setAttribute('disabled', '');
  }
});

addEventListener('DOMContentLoaded', async () => {
  const usuarios = await obtenerDatos('usuarios');

  if (usuarios.length > 0) {
    crearTabla();

    const tabla = document.querySelector('.tabla');
    const tablaBody = document.createElement('tbody');
    tablaBody.classList.add('tabla__cuerpo');
    tabla.append(tablaBody);

    usuarios.forEach((usuario) => {
      const fila = document.createElement('tr');
      fila.classList.add('tabla__fila');
      tablaBody.append(fila);

      const celdas = [usuario.id, `${usuario.nombre} ${usuario.apellido}`,
      usuario.telefono, usuario.ciudad, usuario.genero, usuario.no_documento, '', usuario.usuario];

      celdas.forEach((texto) => {
        const celda = document.createElement('td');
        celda.classList.add('tabla__celda');
        celda.textContent = texto;
        fila.append(celda);
      });
    });
  }
});
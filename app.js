//importaciones
import { validarCampo, validarCampos, validarNumero, validarTexto, validarCheckeo, datos } from "./JS/validaciones.js";
import { get, post } from "./JS/api.js";
import crearTabla from "./JS/crearTabla.js";

// variables
const formulario = document.querySelector('form');
const boton = document.querySelector('#btn_validar');

// Obtenemos los elementos del formulario
const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const telefono = document.querySelector('[name="telefono"]');
const documento = document.querySelector('[name="documento"]');
const usuario = document.querySelector('[name="usuario"]');
const contrasena = document.querySelector('[name="contrasena"]');
const ciudad = document.querySelector('[name="ciudad_id"]');

const checkBox = document.querySelector('[name="politica"]');

//funciones

// Función para habilitar el botón de enviar formulario
const habilitarBoton = () => {  
  if (!checkBox.checked) boton.setAttribute('disabled', '');
  else if (boton.disabled) boton.removeAttribute('disabled');
}

// Función para cargar los géneros al formulario
// Se obtiene la lista de géneros desde el servidor y se crean los elementos del formulario
const cargarGeneros = async () => {
  const generos = await get('generos');  
  
  const contenedor = document.querySelector('.form__generos');

  generos.data.forEach((genero) => {
    const label = document.createElement('label');
    label.textContent = genero.nombre;  
    label.setAttribute('for', 'gen__' + genero.id);
    label.setAttribute('class', 'genero');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'genero_id');
    input.setAttribute('value', genero.id);
    input.setAttribute('id', 'gen__' + genero.id);
    input.setAttribute('required', '');
    input.setAttribute('class', 'input-radio');
    
    label.insertAdjacentElement('afterbegin', input);
    contenedor.append(label);

    // Le agregamos el evento de validación al radio
    input.addEventListener('change', validarCheckeo);
  });

}

// Función para cargar las ciudades al formulario
// Se obtiene la lista de ciudades desde el servidor y se crean los elementos del formulario
const cargarCiudades = async () =>{
  const ciudades = await get('ciudades');

  const contenedor = document.querySelector('.form__control select');

  ciudades.data.forEach((ciudad) => {
    const option = document.createElement('option');
    option.textContent = ciudad.nombre;
    option.setAttribute('value', ciudad.id);
    contenedor.append(option);
  });  
}

// Función para cargar los lenguajes al formulario
// Se obtiene la lista de lenguajes desde el servidor y se crean los elementos del formulario
const cargarLenguajes = async () => {
  const lenguajes = await get('lenguajes');  
  
  const contenedor = document.querySelector('.form__lenguajes');

  lenguajes.data.forEach((lenguaje) => {
    const label = document.createElement('label');
    label.textContent = lenguaje.nombre;  
    label.setAttribute('for', 'leng__' + lenguaje.id);
    label.setAttribute('class', 'lenguaje');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'lenguajes');
    input.setAttribute('id', 'leng__' + lenguaje.id);
    input.setAttribute('value', lenguaje.id);
    input.setAttribute('required', '');
    input.setAttribute('class', 'input-checkbox');
    
    label.insertAdjacentElement('afterbegin', input);

    // Le agregamos el evento de validación al checkbox
    input.addEventListener('change', validarCheckeo);

    contenedor.append(label);
  });
}

// Función para crear la tabla de usuarios
const crearTablaUsuarios = async (usuarios) => {
  const encabezados = [
    "ID", "Nombre Completo", "Teléfono", "Ciudad",
    "Género", "N° Documento", "Usuario", "Lenguajes"
  ];
  
  const usuariosDatos = [];

  for (const usuario of usuarios) {
    const lenguajes = usuario.lenguaje ? usuario.lenguajes : [];
    const genero = (await get("generos/" + usuario.genero_id)).data;
    const ciudad = (await get("ciudades/" + usuario.ciudad_id)).data;      

    const celdas = [usuario.id, `${usuario.nombre} ${usuario.apellido}`,
      usuario.telefono, ciudad.nombre, genero.nombre, usuario.documento, usuario.usuario, lenguajes.join(", ")];
      
    usuariosDatos.push({ celdas, redireccion: `Usuario/usuarioGestion.html?id=${usuario.id}`});
  }
  crearTabla("Usuarios", encabezados, usuariosDatos);
}

//eventos

// Se agrega el evento de habilitar el botón de enviar formulario al checkbox
addEventListener('DOMContentLoaded', habilitarBoton);
checkBox.addEventListener('change', habilitarBoton);

// Se agregan los eventos de validación a los campos del formulario para que se validen al escribir
nombre.addEventListener('keydown', validarTexto);
apellido.addEventListener('keydown', validarTexto);
telefono.addEventListener('keydown', validarNumero);
documento.addEventListener('keydown', validarNumero);

// Se agregan los eventos de validación a los campos del formulario para que se validen al perder el foco
nombre.addEventListener('blur', validarCampo);
apellido.addEventListener('blur', validarCampo);
telefono.addEventListener('blur', validarCampo);
ciudad.addEventListener('blur', validarCampo);
documento.addEventListener('blur', validarCampo);
usuario.addEventListener('blur', validarCampo);
contrasena.addEventListener('blur', validarCampo);

// Se agrega el evento de validación al botón de enviar formulario
formulario.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Validamos los campos del formulario
  if (!validarCampos(event)) return;
  
  // Realizamos una petición POST al servidor para crear el usuario
  const datosCambiados = { ...datos };
  delete datosCambiados.lenguajes;

  const respuesta = await post("usuarios", datosCambiados);
  console.log(datos);
  
  // Si la respuesta no es ok, mostramos un mensaje de error
  if (!respuesta.ok) {    
    
    alert(`Error al crear el usuario \n❌ ${(await respuesta.json()).message}`);
    return;
  }    
  
  // Guardamos el objeto del usuario creado en una variable
  const usuarioCreado = (await respuesta.json()).usuarioCreado;
  
  // Recorremos los lenguajes seleccionados y creamos una relación entre el usuario y los lenguajes
  datos.lenguajes.forEach(async(lenguaje) =>{      
    // Realizamos una petición POST al servidor para crear la relación entre el usuario y los lenguajes
    await post("lenguajes_usuarios", { id_usuario: usuarioCreado.id, lenguaje_id: lenguaje });
  });

  alert("Formulario enviado.");
  event.target.reset();

  boton.setAttribute('disabled', '');
  location.reload(); // Recargamos la página para mostrar el nuevo usuario en la tabla
});

addEventListener('DOMContentLoaded', async () => {

  // Ejecutamos las funciones para cargar los géneros, ciudades y lenguajes al formulario al cargar la página
  await cargarCiudades();
  await cargarGeneros();
  await cargarLenguajes();

  // Obtenemos la lista de usuarios desde el servidor para mostrarla en la tabla
  const usuarios = await get('usuarios');

  if (usuarios.data.length === 0) return;

  crearTablaUsuarios(usuarios.data);
});
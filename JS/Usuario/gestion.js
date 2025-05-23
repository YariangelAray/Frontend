//importaciones
import {valiarCampos20, validarCampo, validarCampos, validarNumero, validarTexto, validarCheckeo, datos } from "../validaciones.js";
import { get, post, put, del } from "../api.js";

// variables
const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');

// Obtenemos el id del usuario desde la URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Obtenemos los datos del usuario desde el servidor realizando una petición GET
const usuarioObtenido = (await get(`usuarios/${id}`)).data;

const tituloPagina = document.querySelector('title');
const titulo = document.querySelector('h1');

const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const telefono = document.querySelector('[name="telefono"]');
const documento = document.querySelector('[name="documento"]');
const usuario = document.querySelector('[name="usuario"]');
const contrasena = document.querySelector('[name="contrasena"]');
const ciudadSelect = document.querySelector('[name="ciudad_id"]');

//funciones

const cargarGeneros = async () => {
  const generos = await get('generos');

  //Validamos que haya géneros registrados
  if (!generos.data || generos.data.length === 0) return;

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
    input.setAttribute('class','input-radio');
    
    label.insertAdjacentElement('afterbegin', input);
    contenedor.append(label);

    // Validamos si el género del usuario coincide con el género del formulario y lo seleccionamos
    
    if (usuarioObtenido.genero_id == input.value) input.checked = true;

    input.addEventListener('change', validarCheckeo);
  });

}

const cargarCiudades = async () =>{
  const ciudades = await get('ciudades');

  //Validamos que haya ciudades registrados
  if (!ciudades.data || ciudades.data.length === 0) return;
  
  const contenedor = document.querySelector('.form__control select');

  ciudades.data.forEach((ciudad) => {
    const option = document.createElement('option');
    option.textContent = ciudad.nombre;
    option.setAttribute('value', ciudad.id);
    contenedor.append(option);
    
    // Validamos si la ciudad del usuario coincide con la ciudad del formulario y la seleccionamos
    if (usuarioObtenido.ciudad_id == option.value) ciudadSelect.value = option.value;

  });  
}

const cargarLenguajes = async () => {
  const lenguajes = await get('lenguajes');

  //Validamos que haya lenguajes registrados
  if (!lenguajes.data || lenguajes.data.length === 0) return;
  
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
    input.setAttribute('class', 'input-checkbox')
    
    label.insertAdjacentElement('afterbegin', input);

    input.addEventListener('change', validarCheckeo);

    // Validamos si el lenguaje que fue agregado al formulario está en la lista de lenguajes del usuario y lo seleccionamos
    if (usuarioObtenido.lenguajes.includes(parseInt(input.value))) input.checked = true;

    contenedor.append(label);
  });
}

// Función para asignar los valores del usuario al formulario
const asignarValores = async () => {
  tituloPagina.textContent = usuarioObtenido.nombre + " " + usuarioObtenido.apellido;
  titulo.textContent = usuarioObtenido.nombre + " " + usuarioObtenido.apellido;

  nombre.value = usuarioObtenido.nombre;
  apellido.value = usuarioObtenido.apellido;
  telefono.value = usuarioObtenido.telefono;
  documento.value = usuarioObtenido.documento;  
  usuario.value = usuarioObtenido.usuario;
  contrasena.value = usuarioObtenido.contrasena;
}


// Esta función recibe la respuesta del servidor con errores y los muestra de forma clara
function manejarErroresDeServidor(mensaje) {
  // Verificamos si hay un arreglo de errores
  if (Array.isArray(mensaje.errors) && mensaje.errors.length > 0) {
    // Recorremos cada error y extraemos el mensaje correspondiente
    const errores = mensaje.errors.map(error => {
      return `❌ ${error.message}`;
    });

    // Mostramos todos los errores en un solo alert
    alert(`Errores al actualizar el usuario:\n${errores.join('\n')}`);

  } else alert(`❌ Error al actualizar el usuario: ${mensaje.message || "Error desconocido."}`);

  // Mostramos la respuesta completa en la consola
  console.warn("Respuesta del servidor con error:", mensaje);
}



// Ejecutamos las funciones para cargar los datos al formulario
await cargarCiudades();
await cargarGeneros();
await cargarLenguajes();
asignarValores();

//evento

nombre.addEventListener('keydown', validarTexto);
apellido.addEventListener('keydown', validarTexto);
telefono.addEventListener('keydown', validarNumero);
documento.addEventListener('keydown', validarNumero);
usuario.addEventListener('keydown', valiarCampos20);
contrasena.addEventListener('keydown', valiarCampos20);



nombre.addEventListener('blur', validarCampo);
apellido.addEventListener('blur', validarCampo);
telefono.addEventListener('blur', validarCampo);
ciudadSelect.addEventListener('blur', validarCampo);
documento.addEventListener('blur', validarCampo);
usuario.addEventListener('blur', validarCampo);
contrasena.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {

  event.preventDefault();

  // Validamos que todos los campos actualizados esten completos
  if (!validarCampos(event)) return;


  // Copiamos los datos del formulario, excluyendo los lenguajes (que se manejan aparte)
  const datosCambiados = { ...datos };
  delete datosCambiados.lenguajes;
    
  try {
    // Hacemos la petición PUT al servidor para actualizar el usuario
    const respuesta = await put(`usuarios/${id}`, datosCambiados);
    
    // Convertimos la respuesta a formato JSON
    const resultado = await respuesta.json();
  
    // Si la respuesta NO fue exitosa (por ejemplo, error 400 o 500), mostramos los errores
    if (!respuesta.ok) {
      manejarErroresDeServidor(resultado); // Usamos una función externa para mostrar bien los errores
      return; // Detenemos el flujo si hay errores
    }
  
    // Eliminamos los lenguajes del usuario para volver a crear la relación entre el usuario y los lenguajes
    await del(`lenguajes_usuarios/usuario/${id}`);
  
    // Recorremos los lenguajes seleccionados y creamos una relación entre el usuario y los lenguajes
    for (const lenguaje of datos.lenguajes) {
      await post("lenguajes_usuarios", {usuario_id: id, lenguaje_id: parseInt(lenguaje)});
    }  
    
    alert("Usuario actualizado.");
  
    location.reload(); // Recargamos la página para mostrar los nuevos datos del usuario en el formulario
  } catch (error) {
    // Capturamos errores inesperados como problemas de conexión o errores en el código
    alert(`❌ Error inesperado: ${error.message}`);
    console.error("Error interno:", error);
  }
});

// Le agregamos el evento de eliminar al botón de eliminar
btnEliminar.addEventListener('click', async () => {
  // Hacemos una consulta de confirmación antes de eliminar el usuario
  if (!confirm("¿Está seguro de que desea eliminar este usuario?")) return;

  // Primero eliminamos la relación entre el usuario y los lenguajes
  await del(`lenguajes_usuarios/usuario/${id}`);

  // Luego eliminamos el usuario
  // Hacemos la petición DELETE al servidor para eliminar el usuario
  const respuesta = await del(`usuarios/${id}`);
  // Si la respuesta no es correcta, mostramos un mensaje de error
  if (!respuesta.ok) {
    alert("❌ Error al eliminar usuario." );
    return;
  }
  alert("Usuario eliminado.");
  window.location.href = "../../index.html"; // Redirigimos al usuario a la página de inicio ya que el usuario fue eliminado
});
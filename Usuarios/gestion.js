//importaciones
import { validarCampo, validarCampos, validarNumero, validarTexto, validarCheckeo, datos } from "../validaciones.js";
import { obtenerDatos, crear, actualizar, eliminar } from "../Helpers/realizarPeticion.js";

// variables
const formulario = document.querySelector('form');
const btnEliminar = document.querySelector('#btn_eliminar');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const usuarioObtenido = await obtenerDatos(`usuarios/${id}`);

const tituloPagina = document.querySelector('title');
const titulo = document.querySelector('h1');

const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const telefono = document.querySelector('[name="telefono"]');
const documento = document.querySelector('[name="documento"]');
const usuario = document.querySelector('[name="usuario"]');
const contrasena = document.querySelector('[name="contrasena"]');
const ciudadSelect = document.querySelector('[name="id_ciudad"]');

//funciones

const cargarGeneros = async () => {
  const generos = await obtenerDatos('generos');
  
  const contenedor = document.querySelector('.form__generos');

  generos.forEach((genero) => {
    const label = document.createElement('label');
    label.textContent = genero.nombre;  
    label.setAttribute('for', 'gen__' + genero.id);
    label.setAttribute('class', 'genero');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'id_genero');
    input.setAttribute('value', genero.id);
    input.setAttribute('id', 'gen__' + genero.id);
    input.setAttribute('required', '');
    
    label.insertAdjacentElement('afterbegin', input);
    contenedor.append(label);

    if (usuarioObtenido.genero === label.textContent) input.checked = true;

    input.addEventListener('change', validarCheckeo);
  });

}

const cargarCiudades = async () =>{
  const ciudades = await obtenerDatos('ciudades');
  
  const contenedor = document.querySelector('.form__control select');

  ciudades.forEach((ciudad) => {
    const option = document.createElement('option');
    option.textContent = ciudad.nombre;
    option.setAttribute('value', ciudad.id);
    contenedor.append(option);

    if (usuarioObtenido.ciudad == option.textContent) ciudadSelect.value = option.value;

  });  
}

const cargarLenguajes = async () => {
  const lenguajes = await obtenerDatos('lenguajes');
  
  const contenedor = document.querySelector('.form__lenguajes');

  lenguajes.forEach((lenguaje) => {
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
    
    label.insertAdjacentElement('afterbegin', input);

    input.addEventListener('change', validarCheckeo);

    if (usuarioObtenido.lenguajes.includes(label.textContent)) input.checked = true;

    contenedor.append(label);
  });
}

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

await cargarCiudades();
await cargarGeneros();
await cargarLenguajes();
asignarValores();

//evento

nombre.addEventListener('keydown', validarTexto);
apellido.addEventListener('keydown', validarTexto);
telefono.addEventListener('keydown', validarNumero);
documento.addEventListener('keydown', validarNumero);

nombre.addEventListener('blur', validarCampo);
apellido.addEventListener('blur', validarCampo);
telefono.addEventListener('blur', validarCampo);
ciudadSelect.addEventListener('blur', validarCampo);
documento.addEventListener('blur', validarCampo);
usuario.addEventListener('blur', validarCampo);
contrasena.addEventListener('blur', validarCampo);

formulario.addEventListener('submit', async (event) => {

  event.preventDefault();

  if (!validarCampos(event)) return;
    
  const respuesta = await actualizar(`usuarios/${id}`, datos);
  console.log(await respuesta.json());
  
  if (!respuesta.ok) {
    alert(`Error al actualizar el usuario: \n❌ ${(await respuesta.json()).error}`);
    return;
  }

  await eliminar(`lenguajes_usuarios/usuario/${id}`);


  for (const id_lenguaje of datos.lenguajes) {
    await crear("lenguajes_usuarios", {id_usuario: id, id_lenguaje: id_lenguaje});
  }  
  
  alert("Usuario actualizado.");

  location.reload();
});

btnEliminar.addEventListener('click', async () => {
  if (!confirm("¿Está seguro de que desea eliminar este usuario?")) return;

  await eliminar(`lenguajes_usuarios/usuario/${id}`);

  const respuesta = await eliminar(`usuarios/${id}`);
  if (!respuesta.ok) {
    alert("❌ Error al eliminar usuario." );
    return;
  }
  alert("Usuario eliminado.");
  window.location.href = "index.html";
});
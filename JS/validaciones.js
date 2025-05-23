// Validación para los campos que tengan 20 caracteres
export const valiarCampos20 = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  const teclasEspeciales = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"]; // Teclas especiales que se permiten

  if ( event.target.value.length > 20 && !teclasEspeciales.includes(key)) { // Validamos si el campo supera los 20 caracteres

    event.preventDefault(); // Evitamos la acción de la tecla
  }
}

// Validación para los campos de texto
export const validarTexto = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[\D]*$/i;  // Expresión regular para letras y caracteres especiales
  const teclasEspeciales = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"]; // Teclas especiales que se permiten

  if ((!regex.test(key) || event.target.value.length > 30) && !teclasEspeciales.includes(key)) { // Validamos si la tecla no es una letra o si el campo supera los 30 caracteres

    event.preventDefault(); // Evitamos la acción de la tecla
  }
}

// Validación para los campos de número
export const validarNumero = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[\d]*$/; // Expresión regular para números
  const teclasEspeciales = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"]; // Teclas especiales que se permiten

  // Validamos si la tecla no es un número o si el campo supera los 15 caracteres o si es una tecla especial
  if ((!regex.test(key) || event.target.value.length >= 10) && !teclasEspeciales.includes(key)) {
    event.preventDefault(); // Evitamos la acción de la tecla
  }
}

// --------------------------------------------------------

// Validación para los campos de texto y las listas desplegables
// Retorna true o false dependiendo de si el campo es válido o no
export const validarCampo = (event) => {
  let campo = event.target; // Obtenemos el campo que disparó el evento

  if ((campo.tagName == 'INPUT' && campo.value.trim() == "") || // Validamos si el campo es un input y está vacío
      (campo.tagName == 'SELECT' && campo.selectedIndex == 0))  // Validamos si el campo es un select y no se ha seleccionado una opción
  {
    agregarError(campo); // Agregamos el error 
    return false;
  }
  
  if(campo.className.includes('borde-rojo')) // Si el campo tiene la clase de error, la quitamos para que no se dupliquen los errores
    quitarError(campo); // Quitamos el error
    
  return true;
}

// --------------------------------------------------------
// Funciones para agregar y quitar errores

// Agrega un borde rojo y un mensaje de advertencia al campo
const agregarError = (campo, mensaje = "El campo es obligatorio.") => {

  campo.classList.add('borde-rojo');
  // Si el campo ya tiene un mensaje de advertencia, lo eliminamos para evitar duplicados
  if (campo.nextElementSibling) campo.nextElementSibling.remove();
  
  let texto = document.createElement('span');
  texto.textContent = mensaje;
  texto.classList.add('texto-advertencia');
  campo.insertAdjacentElement('afterend', texto); 
}

// Quita el borde rojo y el mensaje de advertencia del campo
const quitarError = (campo) => {
  campo.classList.remove('borde-rojo')
  campo.nextElementSibling.remove();
}

// --------------------------------------------------------
// Validación para los checkboxes y los radios

export const validarCheckeo = (event) => {
  const contenedor = event.target.parentElement.parentElement; // Obtenemos el contenedor de todos los checkboxs
  
  // Validamos si el checkbox es desmarcado y si el contenedor tiene la clase de error
  // Si el checkbox es desmarcado y el contenedor no tiene la clase de error, la agregamos
  if (event.target.type == 'checkbox' && !event.target.checked) agregarError(contenedor);
  // Si el checkbox es marcado y el contenedor tiene la clase de error, la quitamos
  else if (contenedor.className.includes('borde-rojo')) quitarError(contenedor);
}

// --------------------------------------------------------

// Validación para los radios button, la función recibe un array de radios button y valida si alguno de ellos está chequeado
const validarRadiosButton = (radiosButton) => {
  
  // Obtenemos el contenedor de los radios button
  // y buscamos el radio button que está chequeado
  const contenedor = document.querySelector('.form__generos');
  const radioCheckeado = [...radiosButton].find((radio) => radio.checked); 

  // Si no hay radio button chequeado, agregamos el error
  if (!radioCheckeado) agregarError(contenedor);
  else if (contenedor.className.includes('borde-rojo')) quitarError(contenedor); // Si el contenedor tiene la clase de error, la quitamos
  
  return radioCheckeado; // Retornamos el radio button chequeado
}

// Validación para los checkboxs, la función recibe un array de checkboxs y el número mínimo de checkboxs que deben estar chequeados
const validarCheckboxs = (checkBoxs, minLenguajes) => {  
  // Obtenemos el contenedor de los checkboxs y filtramos por los checkboxs que están chequeados
  const contenedor = document.querySelector('.form__lenguajes');
  const checkBoxsList = [...checkBoxs].filter((checkbox) => checkbox.checked);
  
  // Si no hay checkboxs chequeados, agregamos el error
  if (checkBoxsList.length < minLenguajes) {
    agregarError(contenedor, `El número de lenguajes mínimo es ${minLenguajes}.`);    
  }
  else if (contenedor.className.includes('borde-rojo')) quitarError(contenedor);
  
  return checkBoxsList; // Retornamos los checkboxs chequeados
}

// --------------------------------------------------------
// Función para validar todos los campos del formulario

export const datos = {}; // Objeto para almacenar los datos del formulario
export const validarCampos = (event) => {
  let valido = true; // Variable para validar si el formulario es válido
  let regexContra = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/; // Expresión regular para validar la contraseña

  // Obtenemos todos los campos del formulario que tienen el atributo required y son de tipo input o select
  const campos = [...event.target].filter((elemento) => elemento.hasAttribute('required') && (elemento.tagName == 'INPUT' || elemento.tagName == 'SELECT'));  

  // Recorremos los campos y validamos cada uno de ellos
  campos.forEach((campo) => {

    if (!validarCampo({ target: campo })) valido = false;    
    
    datos[campo.getAttribute('name')] = campo.value;
  });

  // Validacion para los radios button y los checkboxs

  // Obtenemos los radios button
  const radiosButton = [...campos].filter((campo) => campo.type === 'radio');
  // Validamos si hay algún radio button en el formulario
  if (radiosButton.length > 0) {
    // Validamos si hay algún radio button chequeado
    const radioCheckeado = validarRadiosButton(radiosButton);
    if (!radioCheckeado) valido = false; // Si no hay radio button chequeado, el formulario no es válido
    // Si hay radio button chequeado, lo agregamos al objeto de datos
    else datos[radioCheckeado.name] = radioCheckeado.value;    
  }

  // Obtenemos el contenedor de los checkboxs
  const contenedorLenguajes = document.querySelector('.form__lenguajes');
  // Validamos que el contenedor de los checkboxs exista
  if (contenedorLenguajes) {
    // Obtenemos el número mínimo de checkboxs que deben estar chequeados
    const minLenguajes = contenedorLenguajes.dataset.lenguajes;
    
    // Obtenemos los checkboxs
    const checkBoxs = [...campos].filter((campo) => campo.type === 'checkbox');
    // Validamos si hay checkboxs checkeados en el formulario
    const checkBoxsList = validarCheckboxs(checkBoxs, minLenguajes);
    
    // Si no hay checkboxs chequeados o el número de checkboxs chequeados es menor al mínimo, el formulario no es válido
    if (checkBoxsList.length < minLenguajes) valido = false;
    else datos[checkBoxs[0].name] = checkBoxsList.map((check) => check.value); // Agregamos los checkboxs chequeados al objeto de datos
  }

  // Validación para la contraseña
  // Obtenemos el campo de la contraseña
  const contrasena = campos.find((campo) => campo.name == 'contrasena');
  
  // Validamos si la contraseña es válida
  if (contrasena && contrasena.value.trim() != "" && !regexContra.test(contrasena.value)) {
    agregarError(contrasena, "La contraseña debe contener al menos 8 caracteres, una mayúscula, un número y un caracter especial."); // Agregamos el error    
    valido = false; // Si la contraseña es inválida, el formulario no es válido
  }

  return valido; // Retornamos si el formulario es válido o no
}


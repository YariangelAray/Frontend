export const validarTexto = (event) => {
  const key = event.key;
  const regex = /^[\D]*$/i;  
  if (!regex.test(key) || event.target.value.length > 40) {
    event.preventDefault();
  }
}

export const validarNumero = (event) => {
  const key = event.key;
  const regex = /^[\d]*$/;
  const teclasEspeciales = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"];

  if (!regex.test(key) && !teclasEspeciales.includes(key) || event.target.value.length > 15) {
    event.preventDefault();
  }
}

export const validarCampo = (event) => {
  let campo = event.target;
  if ((campo.tagName == 'INPUT' && campo.value.trim() == "") || (campo.tagName == 'SELECT' && campo.selectedIndex == 0)) {
    agregarError(campo);
  }
  else if(campo.className.includes('borde-rojo')) {
    quitarError(campo)
  }
}

const agregarError = (campo) => {
  campo.classList.add('borde-rojo');
  if (campo.nextElementSibling) campo.nextElementSibling.remove();
  
  let texto = document.createElement('span');
  texto.textContent = `El campo es obligatorio.`;
  texto.classList.add('texto-advertencia');
  campo.insertAdjacentElement('afterend', texto); 
}

const quitarError = (campo) => {
  campo.classList.remove('borde-rojo')
  campo.nextElementSibling.remove();
}


export const validarCheckeo = (event) => {
  const contenedor = event.target.parentElement.parentElement;

  if (event.target.type == 'checkbox' && !event.target.checked) agregarError(contenedor);
  else if (contenedor.className.includes('borde-rojo')) quitarError(contenedor);
}

const validarRadiosButton = (radiosButton) => {
  
  const radioCheckeado = [...radiosButton].find((radio) => radio.checked);
  const contenedor = document.querySelector('.form__generos');
  
  if (!radioCheckeado) agregarError(contenedor);
  else if (contenedor.className.includes('borde-rojo')) quitarError(contenedor);
  
  return radioCheckeado;
}

const validarCheckboxs = (checkBoxs, minHabilidades) => {  
  const checkBoxsList = [...checkBoxs].filter((checkbox) => checkbox.checked);
  const contenedor = document.querySelector('.form__habilidades');
  
  if (checkBoxsList.length < minHabilidades) {
    agregarError(contenedor);
    contenedor.nextElementSibling.textContent = `El número de habilidades mínimo es ${minHabilidades}.`;
  }
  else if (contenedor.className.includes('borde-rojo')) quitarError(contenedor);
  
  return checkBoxsList;
}

export const datos = {};
export const validarCampos = (event) => {
  let valido = true;
  let regexContra = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

  const campos = [...event.target].filter((elemento) => elemento.hasAttribute('required') && elemento.tagName == 'INPUT' || elemento.tagName == 'SELECT');  

  campos.forEach((campo) => {

    if ((campo.tagName == "INPUT" && campo.value.trim() == "") ||
        (campo.tagName == "SELECT" && campo.selectedIndex == 0))
    {
      agregarError(campo);
      valido = false;
    }
    else if (campo.className.includes('borde-rojo')) quitarError(campo);

    datos[campo.getAttribute('name')] = campo.value;
  });

  const radiosButton = [...campos].filter((campo) => campo.type === 'radio');
  if (!radiosButton) {
    const radioCheckeado = validarRadiosButton(radiosButton);
  
    if (!radioCheckeado) valido = false;
    else datos.genero = radioCheckeado.value;    
  }

  const contenedorHabilidades = document.querySelector('.form__habilidades');
  if (contenedorHabilidades) {
    const minHabilidades = contenedorHabilidades.dataset.habilidades;
  
    const checkBoxs = [...campos].filter((campo) => campo.type === 'checkbox');
    const checkBoxsList = validarCheckboxs(checkBoxs, minHabilidades);
  
    if (checkBoxsList.length < minHabilidades) valido = false;
    else datos[checkBoxs[0].name] = checkBoxsList.map((check) => check.value);    
  }

  const contrasena = campos.find((campo) => campo.name == 'contrasena');
  
  if (contrasena && contrasena.value.trim() != "" && !regexContra.test(contrasena.value)) {
    alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial");
    valido = false;
  }

  return valido;
}


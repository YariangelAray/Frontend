export const crearTabla = (tituloTexto, encabezados, datos) => {
  const main = document.querySelector('main');

  // Creamos la sección a la que se agregará la tabla
  const segundaSeccion = document.createElement('section');
  segundaSeccion.classList.add('section');

  // Creamos el titulo
  const titulo = document.createElement('h2');
  titulo.textContent = "Lista de " + tituloTexto;
  titulo.classList.add('center', 'subtitle');

  // Creamos la tabla
  const tabla = document.createElement('table');
  tabla.classList.add('tabla');

  // Creamos el encabezado de la tabla
  const tablaHeader = document.createElement('thead');
  tablaHeader.classList.add('tabla__encabezado');
  tabla.append(tablaHeader);

  // Creamos la fila del encabezado de la tabla
  const tablaFila = document.createElement('tr');
  tablaFila.classList.add('tabla__fila');
  tablaHeader.append(tablaFila);

  // Recorremos los encabezados recibidos y creamos los titulos de las columnas
  encabezados.forEach((texto) => {
    const th = document.createElement('th');
    th.classList.add('tabla__celda', 'tabla__celda--encabezado');
    th.textContent = texto;
    tablaFila.append(th);
  });

  // Creamos el cuerpo de la tabla   
  const tablaBody = document.createElement('tbody');
  tablaBody.classList.add('tabla__cuerpo');
  tabla.append(tablaBody);

  // Recorremos la lista de los datos y creamos una fila por cada dato
  datos.forEach((dato) => {
    const fila = document.createElement('tr');
    fila.classList.add('tabla__fila');
    tablaBody.append(fila);

    // Recorremos las celdas y las agregamos a la fila
    dato.celdas.forEach((texto) => {
      const celda = document.createElement('td');
      celda.classList.add('tabla__celda');
      celda.textContent = texto;
      fila.append(celda);
    });

    // Agregamos un evento de clic a la fila para redirigir el registro a la página de gestión
    fila.addEventListener('click', () => {
      window.location.href = dato.redireccion;
    });
  });

  segundaSeccion.append(titulo, tabla);
  main.append(segundaSeccion);
}

export default crearTabla;
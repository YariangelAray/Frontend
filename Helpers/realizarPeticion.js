export const obtenerDatos = async (endpoint)=> {
    const data = await fetch('http://localhost:3000/' + endpoint);
    return await data.json();
}

export default obtenerDatos;
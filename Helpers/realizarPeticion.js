export const obtenerDatos = async (endpoint)=> {
    const data = await fetch('http://localhost:3000/' + endpoint);
    return await data.json();
}


export const crear = async (endpoint, objeto) => {
    return await fetch('http://localhost:3000/' + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objeto)
    });
}

export const actualizar = async (endpoint, objeto) => {
    
    return await fetch('http://localhost:3000/' + endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objeto)
    });
}

export const eliminar = async (endpoint) => {
    return await fetch('http://localhost:3000/' + endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
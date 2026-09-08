import http from './http'
export async function registrar({ nombre, email, password }) {
  const { data } = await http.post('/auth/register', {
    nombre,
    email,
    password,
  })

  return data
}

export async function iniciarSesion({ email, password }) {
  const { data } = await http.post('/auth/login', {
    email,
    password,
  })

  return data
}


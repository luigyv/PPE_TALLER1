<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = ref({
  nombre: '',
  email: '',
  password: ''
})
const error = ref('')
const exito = ref(false)
const cargando = ref(false)

async function enviar() {
  error.value = ''

  const errorPassword = validarPassword(form.value.password)

  if (errorPassword) {
    error.value = errorPassword
    return
  }

  cargando.value = true

  try {
    await auth.register(form.value)

    exito.value = true

    setTimeout(() => {
      router.push({ name: 'login' })
    }, 1200)
  } catch (e) {
    error.value = 'No se pudo crear la cuenta. Prueba con otro correo.'
  } finally {
    cargando.value = false
  }
}

function validarPassword(password) {
  if (password.length < 8) {
    return 'La contraseña debe tener mínimo 8 caracteres.'
  }

  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe contener al menos un dígito.'
  }

  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe contener al menos una minúscula.'
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'La contraseña debe contener al menos un carácter especial.'
  }

  return ''
}

</script>

<template>
  <section class="form-page">
    <h2>Crear cuenta</h2>
    <form class="form" @submit.prevent="enviar">
      <p v-if="error" class="field-error">{{ error }}</p>
      <p v-if="exito" class="field-success">Cuenta creada. Redirigiendo al login...</p>

    <div class="field">
      <label for="nombre">Nombre</label>
      <input
        id="nombre"
        v-model="form.nombre"
        type="text"
        required
        autocomplete="name"
      />
    </div>

    <div class="field">
      <label for="email">Correo</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        autocomplete="username"
      />
    </div>

    <div class="field">
      <label for="password">Contraseña</label>

      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        autocomplete="new-password"
      />

        <ul class="password-help">
        <li>Mínimo 8 caracteres</li>
        <li>Al menos un dígito</li>
        <li>Al menos una minúscula</li>
        <li>Al menos un carácter especial</li>
      </ul>
    </div>

      <button type="submit" class="btn btn-primary" :disabled="cargando">
        {{ cargando ? 'Creando...' : 'Crear cuenta' }}
      </button>
    </form>

    <p class="switch">
      ¿Ya tienes cuenta?
      <RouterLink :to="{ name: 'login' }">Inicia sesión</RouterLink>
    </p>
  </section>
</template>

<style scoped>
.form-page {
  max-width: 380px;
  margin: 0 auto;
}

.form-page h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form button {
  width: 100%;
}

.field-success {
  color: var(--success);
  font-size: 0.85rem;
}

.switch {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.88rem;
  margin-top: 1.2rem;
}
</style>

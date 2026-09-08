<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerJuego, crearJuego, editarJuego } from '../services/juegosService'

const props = defineProps({
  id: { type: [String, Number], default: null },
})

const router = useRouter()
const esEdicion = computed(() => props.id != null)

const form = ref({ nombre: '', imagen: '', categoria: '' })
const errores = ref({})
const cargando = ref(false)
const guardando = ref(false)
const errorGeneral = ref('')

const categorias = ['Acción', 'Aventura', 'Estrategia', 'Deportes', 'Plataformas', 'Simulación', 'Fiesta']

onMounted(async () => {
  if (!esEdicion.value) return
  cargando.value = true
  try {
    const juego = await obtenerJuego(props.id)
    form.value = { nombre: juego.nombre, imagen: juego.imagen, categoria: juego.categoria }
  } catch (e) {
    errorGeneral.value = 'No se encontró el juego solicitado.'
  } finally {
    cargando.value = false
  }
})

function validar() {
  errores.value = {}
  if (!form.value.nombre.trim()) errores.value.nombre = 'El nombre es obligatorio.'
  if (!form.value.imagen.trim()) errores.value.imagen = 'La URL de la imagen es obligatoria.'
  if (!form.value.categoria.trim()) errores.value.categoria = 'Elige una categoría.'
  return Object.keys(errores.value).length === 0
}

async function guardar() {
  if (!validar()) return
  guardando.value = true
  errorGeneral.value = ''
  try {
    if (esEdicion.value) {
      await editarJuego(props.id, form.value)
    } else {
      await crearJuego(form.value)
    }
    router.push({ name: 'juegos-lista' })
  } catch (e) {
    errorGeneral.value = 'No se pudo guardar el juego. Intenta de nuevo.'
  } finally {
    guardando.value = false
  }
}

  function seleccionarImagen(event) {
    const archivo = event.target.files?.[0]

    if (!archivo) {
      return
    }

    if (!archivo.type.startsWith('image/')) {
      errores.value.imagen = 'Selecciona un archivo de imagen válido.'
      return
    }

    if (archivo.size > 1000 * 1024 * 1024) {
      errores.value.imagen = 'La imagen no puede superar los 7 MB.'
      return
    }

    errores.value.imagen = ''

    const reader = new FileReader()

    reader.onload = () => {
      form.value.imagen = reader.result
    }

    reader.readAsDataURL(archivo)
  }

</script>

<template>
  <section class="form-page">
    <h2>{{ esEdicion ? 'Editar juego' : 'Nuevo juego' }}</h2>

    <p v-if="cargando" class="state">Cargando...</p>

    <form v-else class="form" @submit.prevent="guardar">
      <p v-if="errorGeneral" class="field-error">{{ errorGeneral }}</p>

      <div class="field">
        <label for="nombre">Nombre</label>
        <input id="nombre" v-model="form.nombre" type="text" placeholder="Ej. Hollow Knight" />
        <span v-if="errores.nombre" class="field-error">{{ errores.nombre }}</span>
      </div>

     <div class="field">
  <label>Imagen del juego</label>

      <div class="image-upload">
        <input
          id="imagen"
          class="image-upload__input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          @change="seleccionarImagen"
        />

        <label for="imagen" class="image-upload__area">
          <template v-if="!form.imagen">
            <span class="image-upload__icon">📷</span>
            <span class="image-upload__title">Elegir una imagen</span>
            <span class="image-upload__description">
              PNG, JPG o WEBP · Máximo 2 MB
            </span>
          </template>

          <template v-else>
            <div class="image-upload__preview">
              <img :src="form.imagen" alt="Vista previa del juego" />
            </div>

            <span class="image-upload__change">
              Cambiar imagen
            </span>
          </template>
        </label>
      </div>

      <span v-if="errores.imagen" class="field-error">
        {{ errores.imagen }}
      </span>
    </div>

    

      <div class="field">
        <label for="categoria">Categoría</label>
        <select id="categoria" v-model="form.categoria">
          <option value="" disabled>Selecciona una categoría</option>
          <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
        </select>
        <span v-if="errores.categoria" class="field-error">{{ errores.categoria }}</span>
      </div>

      <div class="form__actions">
        <button type="button" class="btn btn-ghost" @click="router.back()">Cancelar</button>
        <button type="submit" class="btn btn-primary" :disabled="guardando">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.form-page {
  max-width: 460px;
}

.form-page h2 {
  margin-bottom: 1.5rem;
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.state {
  color: var(--text-muted);
}
</style>

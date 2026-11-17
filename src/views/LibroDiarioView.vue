<template>
  <div class="container py-4">
    <!-- Encabezado de la Vista -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark mb-1">
          <i class="bi bi-journal-text text-primary me-2"></i>Libro Diario
        </h2>
        <p class="text-muted mb-0">Registro cronológico de transacciones comerciales con opción de modificación y eliminación.</p>
      </div>
      <button class="btn btn-primary" @click="abrirModalNuevo">
        <i class="bi bi-plus-circle me-1"></i> Nuevo Asiento
      </button>
    </div>

    <!-- Tabla de Asientos Registrados -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th style="width: 15%;">Fecha</th>
                <th style="width: 40%;">Glosa / Descripción</th>
                <th style="width: 25%;">Cuenta</th>
                <th class="text-end" style="width: 10%;">Debe (Bs.)</th>
                <th class="text-end" style="width: 10%;">Haber (Bs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="asientos.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                  No hay asientos contables registrados aún. Haz clic en "Nuevo Asiento" para comenzar.
                </td>
              </tr>
              <template v-for="(asiento, index) in asientos" :key="index">
                <!-- Fila de Cabecera del Asiento con Botones de Acción -->
                <tr class="table-light border-top">
                  <td colspan="2" class="fw-bold text-secondary">
                    <span class="badge bg-secondary me-2">Asiento #{{ index + 1 }}</span> {{ asiento.fecha }}
                  </td>
                  <td class="text-muted small fst-italic">
                    <strong>Glosa:</strong> {{ asiento.glosa }}
                  </td>
                  <td colspan="2" class="text-end">
                    <button class="btn btn-outline-primary btn-sm me-2" @click="editarAsiento(index)" title="Modificar asiento">
                      <i class="bi bi-pencil-square"></i> Modificar
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="eliminarAsiento(index)" title="Eliminar asiento">
                      <i class="bi bi-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
                <!-- Filas de Detalle (Cuentas) -->
                <tr v-for="(linea, lIndex) in asiento.lineas" :key="lIndex">
                  <td></td>
                  <td></td>
                  <td :class="{'ps-4': linea.tipo === 'haber'}">
                    <span class="badge me-1" :class="linea.tipo === 'debe' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'">
                      {{ linea.tipo.toUpperCase() }}
                    </span>
                    <span class="font-monospace">{{ linea.cuenta }}</span>
                  </td>
                  <td class="text-end font-monospace">
                    {{ linea.tipo === 'debe' ? Number(linea.monto).toFixed(2) : '-' }}
                  </td>
                  <td class="text-end font-monospace">
                    {{ linea.tipo === 'haber' ? Number(linea.monto).toFixed(2) : '-' }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para Registrar o Modificar Asiento -->
    <div class="modal fade" id="modalAsiento" tabindex="-1" aria-hidden="true" ref="modalElement">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">
              <i class="bi me-2" :class="editandoIndex !== null ? 'bi-pencil-square' : 'bi-journal-plus'"></i>
              {{ editandoIndex !== null ? 'Modificar Asiento Contable' : 'Registrar Asiento Contable' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarAsiento">
              <div class="row mb-3">
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Fecha</label>
                  <input type="date" class="form-control" v-model="formulario.fecha" required />
                </div>
                <div class="col-md-8">
                  <label class="form-label fw-semibold">Glosa / Concepto de la Operación</label>
                  <input type="text" class="form-control" v-model="formulario.glosa" placeholder="Ej: Registro por venta de mercadería según factura" required />
                </div>
              </div>

              <hr class="my-3">

              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Detalle de Cuentas (Partida Doble)</h6>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="agregarLinea">
                  <i class="bi bi-plus me-1"></i> Añadir Cuenta
                </button>
              </div>

              <!-- Lista de Líneas del Asiento con Selector de Plan de Cuentas -->
              <div v-for="(linea, index) in formulario.lineas" :key="index" class="row g-2 align-items-center mb-2">
                <div class="col-md-5">
                  <select class="form-select form-select-sm font-monospace" v-model="linea.cuenta" required>
                    <option value="" disabled>Seleccione una cuenta...</option>
                    <option v-for="c in cuentasDisponibles" :key="c.codigo" :value="`${c.codigo} - ${c.nombre}`">
                      {{ c.codigo }} - {{ c.nombre }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <select class="form-select form-select-sm fw-semibold" v-model="linea.tipo">
                    <option value="debe">DEBE</option>
                    <option value="haber">HABER</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <input type="number" step="0.01" min="0" class="form-control form-control-sm font-monospace" v-model.number="linea.monto" placeholder="0.00 Bs." required />
                </div>
                <div class="col-md-1 text-center">
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="removerLinea(index)" :disabled="formulario.lineas.length <= 2" title="Eliminar línea">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Alerta de Validación de Partida Doble -->
              <div class="alert mt-3 p-3 text-center" :class="partidaDobleValida ? 'alert-success' : 'alert-danger'">
                <div class="d-flex justify-content-around fw-bold">
                  <span>Total Debe: Bs. {{ totalDebe.toFixed(2) }}</span>
                  <span>Total Haber: Bs. {{ totalHaber.toFixed(2) }}</span>
                </div>
                <div class="small mt-1" v-if="!partidaDobleValida">
                  <i class="bi bi-exclamation-triangle-fill me-1"></i> Los totales del Debe y del Haber deben ser estrictamente iguales para guardar el asiento.
                </div>
                <div class="small mt-1 text-success fw-semibold" v-else>
                  <i class="bi bi-check-circle-fill me-1"></i> Partida doble equilibrada correctamente.
                </div>
              </div>

              <div class="modal-footer px-0 pb-0 pt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnCerrarModal">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="!partidaDobleValida">
                  {{ editandoIndex !== null ? 'Actualizar Asiento' : 'Guardar Asiento en Diario' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const asientos = ref([])
const cuentasDisponibles = ref([])
const editandoIndex = ref(null)
let modalInstance = null

const modalElement = ref(null)

const formulario = ref({
  fecha: new Date().toISOString().split('T')[0],
  glosa: '',
  lineas: [
    { cuenta: '', tipo: 'debe', monto: 0 },
    { cuenta: '', tipo: 'haber', monto: 0 }
  ]
})

const abrirModalNuevo = () => {
  editandoIndex.value = null
  formulario.value = {
    fecha: new Date().toISOString().split('T')[0],
    glosa: '',
    lineas: [
      { cuenta: '', tipo: 'debe', monto: 0 },
      { cuenta: '', tipo: 'haber', monto: 0 }
    ]
  }
  if (modalInstance) modalInstance.show()
}

const editarAsiento = (index) => {
  editandoIndex.value = index
  // Clonar el asiento seleccionado para evitar referencias directas antes de guardar
  formulario.value = JSON.parse(JSON.stringify(asientos.value[index]))
  if (modalInstance) modalInstance.show()
}

const eliminarAsiento = (index) => {
  if (confirm(`¿Estás seguro de eliminar el Asiento #${index + 1}?`)) {
    asientos.value.splice(index, 1)
    localStorage.setItem('contaweb_diario', JSON.stringify(asientos.value))
  }
}

const agregarLinea = () => {
  formulario.value.lineas.push({ cuenta: '', tipo: 'debe', monto: 0 })
}

const removerLinea = (index) => {
  if (formulario.value.lineas.length > 2) {
    formulario.value.lineas.splice(index, 1)
  }
}

const totalDebe = computed(() => {
  return formulario.value.lineas
    .filter(l => l.tipo === 'debe')
    .reduce((acc, l) => acc + (Number(l.monto) || 0), 0)
})

const totalHaber = computed(() => {
  return formulario.value.lineas
    .filter(l => l.tipo === 'haber')
    .reduce((acc, l) => acc + (Number(l.monto) || 0), 0)
})

const partidaDobleValida = computed(() => {
  if (totalDebe.value === 0 && totalHaber.value === 0) return false
  return Math.abs(totalDebe.value - totalHaber.value) < 0.01
})

const guardarAsiento = () => {
  if (!partidaDobleValida.value) return

  if (editandoIndex.value !== null) {
    // Actualizar asiento existente
    asientos.value[editandoIndex.value] = JSON.parse(JSON.stringify(formulario.value))
  } else {
    // Crear nuevo asiento
    asientos.value.push(JSON.parse(JSON.stringify(formulario.value)))
  }

  // Persistir en localStorage
  localStorage.setItem('contaweb_diario', JSON.stringify(asientos.value))

  // Cerrar modal de Bootstrap
  if (modalInstance) modalInstance.hide()
}

onMounted(() => {
  // Inicializar instancia del Modal de Bootstrap
  if (modalElement.value) {
    modalInstance = new Modal(modalElement.value)
  }

  // Cargar asientos guardados
  const guardados = localStorage.getItem('contaweb_diario')
  if (guardados) {
    asientos.value = JSON.parse(guardados)
  }

  // Cargar el Plan de Cuentas desde localStorage
  const cuentasGuardadas = localStorage.getItem('contaweb_plancuentas')
  if (cuentasGuardadas) {
    cuentasDisponibles.value = JSON.parse(cuentasGuardadas)
  } else {
    cuentasDisponibles.value = [
      { codigo: '1.1.1.01', nombre: 'Caja Moneda Nacional' },
      { codigo: '1.1.1.02', nombre: 'Bancos Moneda Nacional' },
      { codigo: '1.1.3.01', nombre: 'Inventario de Mercaderías' },
      { codigo: '2.1.1', nombre: 'Cuentas por Pagar' },
      { codigo: '3.1.1', nombre: 'Capital Social' },
      { codigo: '4.1.1', nombre: 'Ventas' },
      { codigo: '5.1.1', nombre: 'Costo de Ventas' }
    ]
  }
})
</script>

<style scoped>
.table th {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
<template>
  <div class="container py-4">
    <!-- Encabezado de la Vista -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark mb-1">
          <i class="bi bi-list-nested text-primary me-2"></i>Plan de Cuentas Comercial
        </h2>
        <p class="text-muted mb-0">Catálogo estructurado de cuentas contables para el registro de operaciones comerciales.</p>
      </div>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCuenta">
        <i class="bi bi-plus-circle me-1"></i> Nueva Cuenta
      </button>
    </div>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
              <input 
                type="text" 
                class="form-control" 
                v-model="busqueda" 
                placeholder="Buscar por código o nombre de cuenta..." 
              />
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filtroTipo">
              <option value="">Todos los Grupos</option>
              <option value="1">1. ACTIVO</option>
              <option value="2">2. PASIVO</option>
              <option value="3">3. PATRIMONIO</option>
              <option value="4">4. INGRESOS</option>
              <option value="5">5. GASTOS / EGRESOS</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla del Plan de Cuentas -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th style="width: 20%;">Código</th>
                <th style="width: 50%;">Nombre de la Cuenta</th>
                <th style="width: 20%;">Grupo</th>
                <th class="text-center" style="width: 10%;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cuentasFiltradas.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">
                  <i class="bi bi-search fs-2 d-block mb-2"></i>
                  No se encontraron cuentas contables que coincidan con la búsqueda.
                </td>
              </tr>
              <tr v-for="cuenta in cuentasFiltradas" :key="cuenta.codigo">
                <td class="font-monospace fw-bold text-primary">{{ cuenta.codigo }}</td>
                <td :class="{'fw-bold': cuenta.codigo.length <= 3, 'ps-4': cuenta.codigo.length > 3}">
                  {{ cuenta.nombre }}
                </td>
                <td>
                  <span class="badge" :class="obtenerBadgeGrupo(cuenta.codigo)">
                    {{ obtenerNombreGrupo(cuenta.codigo) }}
                  </span>
                </td>
                <td class="text-center">
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="eliminarCuenta(cuenta.codigo)" 
                    title="Eliminar cuenta"
                    :disabled="cuenta.sistema">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para Añadir Cuenta -->
    <div class="modal fade" id="modalCuenta" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">
              <i class="bi bi-journal-plus me-2"></i>Agregar Nueva Cuenta Contable
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarCuenta">
              <div class="mb-3">
                <label class="form-label fw-semibold">Código de Cuenta</label>
                <input 
                  type="text" 
                  class="form-control font-monospace" 
                  v-model="nuevaCuenta.codigo" 
                  placeholder="Ej: 1.1.03 o 1.1.1.03" 
                  required 
                />
                <div class="form-text">Usa la estructura jerárquica con puntos (ej. Grupo.Rubro.Cuenta).</div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Nombre de la Cuenta</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="nuevaCuenta.nombre" 
                  placeholder="Ej: Inventario de Mercaderías" 
                  required 
                />
              </div>

              <div class="modal-footer px-0 pb-0 pt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnCerrarModalCuenta">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar Cuenta</button>
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

// Plan de cuentas inicial estándar comercial (Bolivia)
const cuentasBase = [
  { codigo: '1', nombre: 'ACTIVO', sistema: true },
  { codigo: '1.1', nombre: 'ACTIVO CORRIENTE', sistema: true },
  { codigo: '1.1.1', nombre: 'Disponible', sistema: true },
  { codigo: '1.1.1.01', nombre: 'Caja Moneda Nacional', sistema: false },
  { codigo: '1.1.1.02', nombre: 'Bancos Moneda Nacional', sistema: false },
  { codigo: '1.1.2', nombre: 'Exigible', sistema: true },
  { codigo: '1.1.2.01', nombre: 'Cuentas por Cobrar', sistema: false },
  { codigo: '1.1.3', nombre: 'Realizable', sistema: true },
  { codigo: '1.1.3.01', nombre: 'Inventario de Mercaderías', sistema: false },
  { codigo: '1.2', nombre: 'ACTIVO NO CORRIENTE', sistema: true },
  { codigo: '1.2.1', nombre: 'Activos Fijos', sistema: true },
  { codigo: '1.2.1.01', nombre: 'Muebles y Enseres', sistema: false },
  { codigo: '1.2.1.02', nombre: 'Equipos de Computación', sistema: false },
  { codigo: '1.2.1.03', nombre: 'Vehículos', sistema: false },
  { codigo: '1.2.1.04', nombre: 'Depreciación Acumulada Activos Fijos', sistema: false },

  { codigo: '2', nombre: 'PASIVO', sistema: true },
  { codigo: '2.1', nombre: 'PASIVO CORRIENTE', sistema: true },
  { codigo: '2.1.1', nombre: 'Cuentas por Pagar', sistema: false },
  { codigo: '2.1.2', nombre: 'Impuestos por Pagar', sistema: false },
  { codigo: '2.1.3', nombre: 'Sueldos y Salarios por Pagar', sistema: false },

  { codigo: '3', nombre: 'PATRIMONIO', sistema: true },
  { codigo: '3.1', nombre: 'CAPITAL', sistema: true },
  { codigo: '3.1.1', nombre: 'Capital Social', sistema: false },
  { codigo: '3.2', nombre: 'RESERVAS Y RESULTADOS', sistema: true },
  { codigo: '3.2.1', nombre: 'Resultados Acumulados', sistema: false },

  { codigo: '4', nombre: 'INGRESOS', sistema: true },
  { codigo: '4.1', nombre: 'INGRESOS OPERATIVOS', sistema: true },
  { codigo: '4.1.1', nombre: 'Ventas', sistema: false },
  { codigo: '4.1.2', nombre: 'Recargos Percibidos', sistema: false },

  { codigo: '5', nombre: 'GASTOS / EGRESOS', sistema: true },
  { codigo: '5.1', nombre: 'GASTOS OPERATIVOS', sistema: true },
  { codigo: '5.1.1', nombre: 'Costo de Ventas', sistema: false },
  { codigo: '5.1.2', nombre: 'Sueldos y Salarios', sistema: false },
  { codigo: '5.1.3', nombre: 'Alquileres Pagados', sistema: false },
  { codigo: '5.1.4', nombre: 'Depreciación Activos Fijos', sistema: false }
]

const cuentas = ref([])
const busqueda = ref('')
const filtroTipo = ref('')

const nuevaCuenta = ref({
  codigo: '',
  nombre: '',
  sistema: false
})

const obtenerNombreGrupo = (codigo) => {
  const inicial = codigo.charAt(0)
  switch (inicial) {
    case '1': return 'ACTIVO'
    case '2': return 'PASIVO'
    case '3': return 'PATRIMONIO'
    case '4': return 'INGRESO'
    case '5': return 'GASTO'
    default: return 'OTRO'
  }
}

const obtenerBadgeGrupo = (codigo) => {
  const inicial = codigo.charAt(0)
  switch (inicial) {
    case '1': return 'bg-success-subtle text-success border border-success-subtle'
    case '2': return 'bg-warning-subtle text-warning border border-warning-subtle'
    case '3': return 'bg-info-subtle text-info border border-info-subtle'
    case '4': return 'bg-primary-subtle text-primary border border-primary-subtle'
    case '5': return 'bg-danger-subtle text-danger border border-danger-subtle'
    default: return 'bg-secondary-subtle text-secondary'
  }
}

const cuentasFiltradas = computed(() => {
  return cuentas.value.filter(c => {
    const coincideTexto = c.codigo.toLowerCase().includes(busqueda.value.toLowerCase()) || 
                          c.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideFiltro = filtroTipo.value === '' || c.codigo.startsWith(filtroTipo.value)
    return coincideTexto && coincideFiltro
  })
})

const guardarCuenta = () => {
  if (!nuevaCuenta.value.codigo || !nuevaCuenta.value.nombre) return

  // Verificar si ya existe el código
  const existe = cuentas.value.some(c => c.codigo === nuevaCuenta.value.codigo)
  if (existe) {
    alert('El código de cuenta ya existe. Por favor ingrese uno diferente.')
    return
  }

  cuentas.value.push({ ...nuevaCuenta.value })
  
  // Ordenar cuentas por código
  cuentas.value.sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }))

  // Persistir en localStorage
  localStorage.setItem('contaweb_plancuentas', JSON.stringify(cuentas.value))

  // Limpiar formulario y cerrar modal
  nuevaCuenta.value.codigo = ''
  nuevaCuenta.value.nombre = ''
  
  const btnCerrar = document.getElementById('btnCerrarModalCuenta')
  if (btnCerrar) btnCerrar.click()
}

const eliminarCuenta = (codigo) => {
  if (confirm(`¿Estás seguro de eliminar la cuenta con código ${codigo}?`)) {
    cuentas.value = cuentas.value.filter(c => c.codigo !== codigo)
    localStorage.setItem('contaweb_plancuentas', JSON.stringify(cuentas.value))
  }
}

onMounted(() => {
  const guardadas = localStorage.getItem('contaweb_plancuentas')
  if (guardadas) {
    cuentas.value = JSON.parse(guardadas)
  } else {
    cuentas.value = cuentasBase
    localStorage.setItem('contaweb_plancuentas', JSON.stringify(cuentasBase))
  }
})
</script>

<style scoped>
.table th {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
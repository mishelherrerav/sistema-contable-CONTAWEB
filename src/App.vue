<template>
  <div id="app" class="min-vh-100 d-flex flex-column bg-light">
    <!-- Barra de Navegación Principal -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid px-4">
        <router-link to="/" class="navbar-brand fw-bold d-flex align-items-center">
          <i class="bi bi-calculator-fill text-info me-2 fs-4"></i>
          <span>CONTAWEB</span>
          <span class="badge bg-secondary ms-2 fs-6 fw-normal">Sistema Contable</span>
        </router-link>

        <button 
          class="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li class="nav-item">
              <router-link to="/" class="nav-link px-3" active-class="active fw-semibold text-info">
                <i class="bi bi-house-door me-1"></i> Inicio
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/ventas" class="nav-link px-3" active-class="active fw-semibold text-info">
                <i class="bi bi-cart-check me-1"></i> Ventas (Cajero)
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/compras" class="nav-link px-3" active-class="active fw-semibold text-info">
                <i class="bi bi-bag-plus me-1"></i> Compras
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/libro-diario" class="nav-link px-3" active-class="active fw-semibold text-info">
                <i class="bi bi-journal-text me-1"></i> Libro Diario
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/libro-mayor" class="nav-link px-3" active-class="active fw-semibold text-info">
                <i class="bi bi-book me-1"></i> Libro Mayor
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/hoja-trabajo" class="nav-link px-3" active-class="active fw-semibold text-info">
                <i class="bi bi-file-earmark-spreadsheet me-1"></i> Hoja de Trabajo
              </router-link>
            </li>
            <li class="nav-item ms-lg-2">
              <router-link to="/estudiante" class="btn btn-outline-info btn-sm px-3 text-white border-info">
                <i class="bi bi-mortarboard me-1"></i> Módulo Estudiante
              </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/plan-cuentas" class="nav-link px-3" active-class="active fw-semibold text-info">
                  <i class="bi bi-list-nested me-1"></i> Plan de Cuentas
                </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido Dinámico de las Vistas -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Pie de Página Institucional -->
    <footer class="bg-dark text-white-50 text-center py-3 mt-auto border-top border-secondary">
      <div class="container small">
        <span>CONTAWEB &copy; 2026 — Sistema Contable Comercial y Académico | Desarrollado con Vue 3 & Bootstrap 5</span>
      </div>
    </footer>
  </div>
   
</template>

<script setup>
// Configuración principal del layout raíz
</script>

<style>
/* Estilos globales limpios para mantener la concentración */
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f8f9fa;
}

.navbar .nav-link {
  transition: color 0.2s ease-in-out;
}

.navbar .nav-link:hover {
  color: #0dcaf0 !important;
}
</style>

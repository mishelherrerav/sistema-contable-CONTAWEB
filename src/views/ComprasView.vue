<template>
  <div class="container py-4">
    <!-- Encabezado de la Vista -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-dark mb-1">
          <i class="bi bi-bag-plus text-primary me-2"></i>Módulo de Compras
        </h2>
        <p class="text-muted mb-0">Registro de adquisiciones de mercadería y control de facturas de proveedores.</p>
      </div>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCompra">
        <i class="bi bi-plus-circle me-1"></i> Nueva Compra
      </button>
    </div>

    <!-- Contenido Principal -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body text-center py-5 text-muted">
        <i class="bi bi-inbox fs-2 d-block mb-2"></i>
        No hay registros de compras todavía. Haz clic en "Nueva Compra" para registrar la primera adquisición.
      </div>
    </div>
  </div>
</template>

<script setup>
// Lógica del módulo de compras
</script>
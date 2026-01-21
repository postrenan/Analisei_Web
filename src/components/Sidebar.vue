<script setup>
import { useMainStore } from '@/stores/mainStore'
import { ref } from 'vue'

const props = defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
})
const store = useMainStore()
const newKeyword = ref('')
const emit = defineEmits(['navigate'])

function addKw() {
  if (newKeyword.value.trim()) {
      store.addKeyword(newKeyword.value.trim())
      newKeyword.value = ''
  }
}

function removeKw(kw) {
    store.removeKeyword(kw)
}
</script>

<template>
  <div class="sidebar d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary h-100 overflow-y-auto">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
      <span class="fs-4 fw-bold">Analisei</span>
    </a>
    <hr>
    
    <!-- Navigation -->
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <a href="#" class="nav-link active" @click.prevent="$emit('navigate', 'analysis')" :data-bs-dismiss="mobile ? 'offcanvas' : null">
          <i class="bi bi-file-earmark-text"></i> Análise
        </a>
      </li>
      <li>
        <a href="#" class="nav-link link-body-emphasis" @click.prevent="$emit('navigate', 'history')" :data-bs-dismiss="mobile ? 'offcanvas' : null">
          <i class="bi bi-clock-history"></i> Histórico
        </a>
      </li>
       <li>
        <a href="#" class="nav-link link-body-emphasis" @click.prevent="$emit('navigate', 'debug')" :data-bs-dismiss="mobile ? 'offcanvas' : null">
          <i class="bi bi-bug"></i> Debug
        </a>
      </li>
    </ul>

    <hr>

    <!-- Settings -->
    <div class="mb-3">
        <label class="form-label fw-bold">Tema</label>
        <select class="form-select form-select-sm" v-model="store.theme">
            <option value="system">Sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label fw-bold">Modo de Busca</label>
        <select class="form-select form-select-sm" v-model="store.searchMode">
            <option>Qualquer (Padrão)</option>
            <option>MAIÚSCULAS</option>
            <option>minúsculas</option>
            <option>Primeira Maiúscula</option>
        </select>
    </div>

    <!-- Keywords -->
    <div class="mb-3">
        <label class="form-label fw-bold">Palavras-chave</label>
        <div class="input-group input-group-sm mb-2">
            <input type="text" class="form-control" placeholder="Nova palavra..." v-model="newKeyword" @keyup.enter="addKw">
            <button class="btn btn-primary" type="button" @click="addKw">+</button>
        </div>
        
        <div class="keywords-list border rounded p-2 bg-body" style="max-height: 200px; overflow-y: auto;">
            <div v-if="store.keywords.length === 0" class="text-muted small">Nenhuma palavra.</div>
            <div v-for="kw in store.keywords" :key="kw" class="d-flex justify-content-between align-items-center mb-1">
                <span class="small">{{ kw }}</span>
                <button class="btn btn-sm btn-outline-danger py-0 px-1" @click="removeKw(kw)">×</button>
            </div>
        </div>
    </div>
    
  </div>
</template>

<style scoped>
/* Basic active state for pills if managed manually, but we can just use bootstrap classes dynamically in parent or here */
.nav-link.active {
    background-color: #0d6efd;
    color: white !important;
}
.nav-link:not(.active) {
    color: var(--bs-body-color);
}
.keywords-list {
    background-color: var(--bs-body-bg) !important; 
}
</style>

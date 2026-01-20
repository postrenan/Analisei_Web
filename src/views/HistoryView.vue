<script setup>
import { useMainStore } from '@/stores/mainStore'

const store = useMainStore()
</script>

<template>
  <div class="container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Histórico de Processamento</h3>
        <button class="btn btn-danger btn-sm" @click="store.clearHistory" v-if="store.history.length > 0">
            Limpar Histórico
        </button>
    </div>

    <div v-if="store.history.length === 0" class="text-muted">
        Nenhum histórico encontrado.
    </div>

    <div v-else class="list-group">
        <div v-for="(item, index) in store.history" :key="index" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ item.file }}</h5>
                <small>{{ item.timestamp }}</small>
            </div>
            
            <p v-if="item.error" class="mb-1 text-danger">Erro: {{ item.error }}</p>
            <p v-else-if="item.warning" class="mb-1 text-warning">⚠ {{ item.warning }}</p>
            <p v-else class="mb-1 text-success">
                Encontrado ({{ item.match_count }}): {{ item.found_keywords ? item.found_keywords.join(', ') : 'N/A' }}
            </p>
        </div>
    </div>
  </div>
</template>

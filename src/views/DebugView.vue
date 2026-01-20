<script setup>
import { onMounted, ref } from 'vue';

const logs = ref([])

onMounted(() => {
    logs.value.push(`[${new Date().toLocaleTimeString()}] Sistema iniciado.`)
    logs.value.push(`[${new Date().toLocaleTimeString()}] Aguardando arquivos.`)
})

defineExpose({
    log: (msg) => logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
})
</script>

<template>
  <div class="container-fluid p-4">
      <h3>Logs do Sistema</h3>
      <div class="bg-dark text-light p-3 rounded font-monospace" style="height: 400px; overflow-y: auto;">
          <div v-for="(log, i) in logs" :key="i">{{ log }}</div>
      </div>
  </div>
</template>

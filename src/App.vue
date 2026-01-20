<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import AnalysisView from '@/views/AnalysisView.vue'
import HistoryView from '@/views/HistoryView.vue'
import DebugView from '@/views/DebugView.vue'
import { useMainStore } from '@/stores/mainStore'

const store = useMainStore()
const currentView = ref('analysis')

// Dynamic view component
const activeComponent = computed(() => {
    switch(currentView.value) {
        case 'analysis': return AnalysisView
        case 'history': return HistoryView
        case 'debug': return DebugView
        default: return AnalysisView
    }
})

function navigate(view) {
    currentView.value = view
}
</script>

<template>
  <div class="d-flex h-100" :data-bs-theme="store.theme">
      <Sidebar @navigate="navigate" />
      <main class="flex-grow-1 bg-body-tertiary" style="height: 100vh; overflow: hidden;">
          <component :is="activeComponent" />
      </main>
  </div>
</template>

<style>
#app {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>

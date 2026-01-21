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
  <div class="d-flex flex-column h-100" :data-bs-theme="store.theme">
      
      <!-- Mobile Navbar -->
      <nav class="navbar bg-body-tertiary border-bottom d-lg-none flex-shrink-0">
          <div class="container-fluid">
              <button class="btn btn-outline-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-controls="mobileSidebar">
                  <i class="bi bi-list fs-5"></i>
              </button>
              <span class="navbar-brand mb-0 h1 ms-2">Analisei</span>
          </div>
      </nav>

      <!-- Main Layout -->
      <div class="d-flex flex-grow-1 overflow-hidden">
          
          <!-- Desktop Sidebar -->
          <div class="d-none d-lg-block border-end" style="width: 280px;">
               <Sidebar @navigate="navigate" />
          </div>

          <!-- Mobile Sidebar (Offcanvas) -->
          <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel" :data-bs-theme="store.theme">
              <div class="offcanvas-header">
                  <h5 class="offcanvas-title" id="mobileSidebarLabel">Menu</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div class="offcanvas-body p-0">
                   <Sidebar @navigate="navigate" :mobile="true" />
              </div>
          </div>

          <!-- Main Content -->
          <main class="flex-grow-1 bg-body-tertiary position-relative h-100 overflow-hidden">
              <component :is="activeComponent" />
          </main>
      </div>
  </div>
</template>

<style>
#app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>

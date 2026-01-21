<script setup>
import { ref } from 'vue'
import { useMainStore } from '@/stores/mainStore'
import { FileProcessor } from '@/services/FileProcessor'

const store = useMainStore()
const fileInput = ref(null)
const selectedFiles = ref([])
const processing = ref(false)
const results = ref([])
const statusMessage = ref("Nenhum arquivo selecionado.")

function triggerSelect() {
    fileInput.value.click()
}

function handleFileChange(event) {
    const files = event.target.files
    if (files.length > 0) {
        selectedFiles.value = Array.from(files)
        statusMessage.value = `${files.length} arquivo(s) selecionado(s).`
        results.value = [] // Clear previous results
    }
}

async function processFiles() {
    if (selectedFiles.value.length === 0) return

    processing.value = true
    statusMessage.value = "Analisando arquivos..."
    results.value = []

    try {
        // Use raw objects from Pinia proxy if needed, but normally fine
        const keywords = [...store.keywords]
        const mode = store.searchMode

        const res = await FileProcessor.processFiles(selectedFiles.value, keywords, mode)
        results.value = res
        statusMessage.value = "Análise completa."
        
        // Save to history
        res.forEach(r => {
            store.addToHistory({
                timestamp: r.timestamp || new Date().toLocaleString(),
                file: r.file,
                match_count: r.match_count,
                error: r.error,
                warning: r.warning,
                found_keywords: r.matches ? [...new Set(r.matches.map(m => m.keyword))] : []
            })
        })

    } catch (e) {
        console.error(e)
        statusMessage.value = "Erro fatal na análise."
    } finally {
        processing.value = false
    }
}
</script>

<template>
  <div class="container-fluid p-4 h-100 d-flex flex-column">
      <!-- Controls -->
      <div class="card p-3 mb-3 shadow-sm">
          <div class="row align-items-center g-3">
              <div class="col-12 col-md-auto">
                  <input type="file" multiple ref="fileInput" @change="handleFileChange" class="d-none" accept=".pdf,.docx,.txt">
                  <button class="btn btn-outline-primary w-100 w-md-auto" @click="triggerSelect">Files 📂</button>
              </div>
              <div class="col-12 col-md-auto">
                    <button class="btn btn-success w-100 w-md-auto" @click="processFiles" :disabled="processing || selectedFiles.length === 0">
                        {{ processing ? 'Processando...' : 'PROCESSAR ARQUIVOS' }}
                    </button>
              </div>
               <div class="col-12 col-md-auto">
                    <span class="text-muted d-block text-center text-md-start">{{ statusMessage }}</span>
              </div>
          </div>
      </div>

      <!-- Results -->
      <div class="flex-grow-1 overflow-auto">
           <div v-if="results.length > 0" class="accordion" id="resultsAccordion">
                <div v-for="(res, i) in results" :key="i" class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse'+i" aria-expanded="true">
                             <span class="fw-bold me-2">{{ res.file }}</span>
                             <span v-if="res.error" class="badge bg-danger">Erro</span>
                             <span v-else-if="res.warning" class="badge bg-warning text-dark">Alerta</span>
                             <span v-else class="badge bg-success">{{ res.match_count }} Ocorrências</span>
                        </button>
                    </h2>
                    <div :id="'collapse'+i" class="accordion-collapse collapse show" data-bs-parent="#resultsAccordion">
                        <div class="accordion-body">
                             <div v-if="res.error" class="text-danger">{{ res.error }}</div>
                             <div v-else-if="res.warning" class="text-warning">{{ res.warning }}</div>
                             <div v-else-if="res.matches.length === 0" class="text-muted">Nenhuma palavra-chave encontrada.</div>
                             <ul v-else class="list-group list-group-flush">
                                 <li v-for="(m, idx) in res.matches" :key="idx" class="list-group-item">
                                     <strong>'{{ m.keyword }}'</strong> (Pg {{ m.page }}, Ln {{ m.line }})
                                     <br>
                                     <small class="text-muted">...{{ m.context.substring(0, 100) }}...</small>
                                 </li>
                             </ul>
                        </div>
                    </div>
                </div>
           </div>
           
           <div v-else-if="!processing && selectedFiles.length > 0 && results.length === 0" class="text-center text-muted mt-5">
               Clique em processar para iniciar.
           </div>
           <div v-else class="text-center text-muted mt-5">
               Selecione arquivos para começar.
           </div>
      </div>
  </div>
</template>

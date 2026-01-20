import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useMainStore = defineStore('main', () => {
    // State
    const keywords = ref(JSON.parse(localStorage.getItem('analisei_keywords')) || ["contrato", "assinatura", "válido"])
    const history = ref(JSON.parse(localStorage.getItem('analisei_history')) || [])
    const theme = ref(localStorage.getItem('analisei_theme') || 'system')
    const searchMode = ref(localStorage.getItem('analisei_searchMode') || 'Qualquer (Padrão)')

    // Actions
    function addKeyword(kw) {
        if (kw && !keywords.value.includes(kw)) {
            keywords.value.push(kw)
        }
    }

    function removeKeyword(kw) {
        keywords.value = keywords.value.filter(k => k !== kw)
    }

    function addToHistory(item) {
        history.value.unshift(item)
        if (history.value.length > 50) history.value.pop() // Limit to 50
    }

    function clearHistory() {
        history.value = []
    }

    // Persistence
    watch(keywords, (n) => localStorage.setItem('analisei_keywords', JSON.stringify(n)), { deep: true })
    watch(history, (n) => localStorage.setItem('analisei_history', JSON.stringify(n)), { deep: true })
    watch(theme, (n) => localStorage.setItem('analisei_theme', n))
    watch(searchMode, (n) => localStorage.setItem('analisei_searchMode', n))

    return { keywords, history, theme, searchMode, addKeyword, removeKeyword, addToHistory, clearHistory }
})

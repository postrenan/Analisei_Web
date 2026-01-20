import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

import pdfWorker from 'pdfjs-dist/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export class FileProcessor {
    constructor() { }

    static async processFiles(files, keywords, searchMode) {
        const results = []
        // Process in parallel
        const promises = Array.from(files).map(file => this.analyzeFile(file, keywords, searchMode))
        const res = await Promise.all(promises)
        return res
    }

    static async analyzeFile(file, keywords, searchMode) {
        try {
            let textLines = []
            
            if (file.type === "application/pdf") {
                textLines = await this.extractPdf(file)
            } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                textLines = await this.extractDocx(file)
            } else if (file.type === "text/plain") {
                textLines = await this.extractTxt(file)
            } else {
                return { file: file.name, matches: [], error: "Formato não suportado." }
            }

            if (!textLines || textLines.length === 0) {
                 return { file: file.name, matches: [], warning: "Arquivo vazio ou não legível." }
            }

            const matches = this.searchKeywords(textLines, keywords, searchMode)
            return {
                 file: file.name, 
                 matches: matches, 
                 error: null,
                 match_count: matches.length,
                 timestamp: new Date().toLocaleString()
            }

        } catch (e) {
            console.error(e)
            return { file: file.name, matches: [], error: e.message }
        }
    }

    static async extractPdf(file) {
        const arrayBuffer = await file.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const doc = await loadingTask.promise
        let lines = []

        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i)
            const content = await page.getTextContent()
            const pageLines = content.items.map(item => item.str).join('\n').split('\n')
            
            pageLines.forEach((line, idx) => {
                if (line.trim()) {
                    lines.push({ page: i, line: idx + 1, content: line.trim() })
                }
            })
        }
        return lines
    }

    static async extractDocx(file) {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        const text = result.value
        const rawLines = text.split('\n')
        return rawLines.map((line, idx) => ({ page: 1, line: idx + 1, content: line.trim() })).filter(l => l.content)
    }

    static async extractTxt(file) {
        const text = await file.text()
        const rawLines = text.split('\n')
        return rawLines.map((line, idx) => ({ page: 1, line: idx + 1, content: line.trim() })).filter(l => l.content)
    }

    static searchKeywords(lines, keywords, mode) {
        const matches = []
        for (const { page, line, content } of lines) {
            for (const kw of keywords) {
                let found = false
                if (mode === 'Qualquer (Padrão)' || mode === 'ANY') { // Default ANY
                    if (content.toLowerCase().includes(kw.toLowerCase())) found = true
                } else if (mode === 'MAIÚSCULAS' || mode === 'UPPER') {
                    if (content.includes(kw.toUpperCase())) found = true
                } else if (mode === 'minúsculas' || mode === 'LOWER') {
                    if (content.includes(kw.toLowerCase())) found = true
                } else if (mode === 'Primeira Maiúscula' || mode === 'TITLE') {
                    // Title case in JS is a bit manual
                    const titleKw = kw.charAt(0).toUpperCase() + kw.slice(1).toLowerCase()
                    if (content.includes(titleKw)) found = true
                }

                if (found) {
                    matches.push({
                        keyword: kw,
                        page,
                        line,
                        context: content
                    })
                }
            }
        }
        return matches
    }
}

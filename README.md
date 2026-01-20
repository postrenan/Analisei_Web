# Analisei Web - Documentação de Segurança e Arquitetura

Este documento fornece uma visão geral técnica do sistema **Analisei Web**, com foco em aspectos de segurança, privacidade de dados e conformidade para avaliação por equipes de Cybersecurity.

## 1. Visão Geral do Sistema

O **Analisei Web** é uma aplicação **Client-Side (Single Page Application)** desenvolvida para auxiliar na análise rápida de contratos e documentos textuais. O sistema permite a importação de arquivos (PDF, DOCX, TXT), extração de texto e busca automatizada por palavras-chave definidas pelo usuário.

**Tecnologias Core:**

- **Frontend Framework:** Vue.js 3 + Vite
- **Gerenciamento de Estado:** Pinia
- **Processamento de Arquivos:** processamento local via browser (JavaScript)

## 2. Arquitetura de Segurança

A arquitetura foi projetada seguindo o princípio **"Local-First"**, minimizando a superfície de ataque e garantindo que dados sensíveis não trafeguem pela rede.

### 2.1. Processamento de Dados (Data Flow)

- **Execução Local:** Todo o processamento de arquivos ocorre exclusivamente na memória do navegador do cliente (Client-Side).
- **Sem Backend de Aplicação:** Não existe servidor de API proprietário para processamento de arquivos. O servidor web serve apenas os arquivos estáticos (HTML/CSS/JS).
- **Zero Upload:** Os arquivos analisados **NUNCA** são enviados para nuvem ou servidores externos. A leitura é feita via File API do navegador diretamente para `ArrayBuffer` na memória RAM.

### 2.2. Persistência de Dados

O sistema utiliza o **LocalStorage** do navegador para persistir configurações e histórico de análise, visando usabilidade entre sessões.

- **Dados Armazenados:**
  - `analisei_keywords`: Lista de palavras-chave customizadas pelo usuário.
  - `analisei_history`: Histórico simplificado das análises (apenas metadados: nome do arquivo, contagem de matches, timestamp). O conteúdo do arquivo **NÃO** é salvo.
  - `analisei_theme` & `analisei_searchMode`: Preferências de interface.
- **Ciclo de Vida:** Os dados permanecem residentes apenas no dispositivo do usuário e podem ser removidos limpando o cache/dados do site no navegador.

## 3. Análise de Riscos e Mitigações

| Vetor de Risco                         | Avaliação   | Mitigação Implementada                                                                                                                                                                                                                       |
| :------------------------------------- | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vazamento de Documentos**            | Risco Baixo | Implementação estritamente offline-capable para análise. Nenhuma requisição de rede (XHR/Fetch) envia dados do arquivo.                                                                                                                      |
| **Execução de Código Malicioso (XSS)** | Risco Médio | O sistema extrai apenas **texto puro** dos arquivos (PDF/DOCX). Scripts embutidos em arquivos não são executados, pois a renderização visual do documento original não é feita, apenas a extração de strings (via `pdfjs-dist` e `mammoth`). |
| **Dependências Vulneráveis**           | Risco Baixo | Uso de bibliotecas padrão de mercado (`pdfjs-dist`, `mammoth`). Recomendado auditoria periódica via `npm audit` no pipeline de CI/CD.                                                                                                        |

## 4. Dependências Críticas

As seguintes bibliotecas são utilizadas para o parsing de arquivos. Elas operam em ambiente sandbox do JavaScript:

- **`pdfjs-dist` (Mozilla):** Utilizada para parsing de PDFs. O Worker do PDF.js é configurado localmente.
- **`mammoth`:** Utilizada para conversão de `.docx` para texto raw.

## 5. Instruções para Auditoria

Para validar a postura de segurança da aplicação:

1.  **Instalação**: Clonar o repositório e rodar `npm install`.
2.  **Verificação de Rede**: Abrir o DevTools (F12) -> Network. Processar um arquivo sensível. Verificar que **nenhuma requisição** é disparada contendo o payload do arquivo.
3.  **Verificação de Armazenamento**: Abrir DevTools -> Application -> Local Storage. Confirmar que apenas metadados e configurações são salvos.

## 6. Conclusão para Uso Interno

O sistema é considerado **SEGURO** para uso interno com documentos confidenciais, desde que o endpoint de hospedagem dos arquivos estáticos seja confiável. Como o processamento é isolado no cliente, o risco de interceptação ou armazenamento indevido por terceiros (via aplicação) é inexistente por design.

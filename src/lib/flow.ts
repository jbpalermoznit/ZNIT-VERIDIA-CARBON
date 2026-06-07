/** Rotas da análise. O fluxo de input é uma conversa única (chat). */

export function analysisPath(id: string): string {
  return `/analise/${id}`;
}

export function resultPath(id: string): string {
  return `/analise/${id}/resultado`;
}

export function documentsPath(id: string): string {
  return `/analise/${id}/documentos`;
}

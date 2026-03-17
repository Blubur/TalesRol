export const POSTS_PER_PAGE = 20

/**
 * Calcula el rango de filas para Supabase .range(from, to) — ambos extremos inclusivos.
 */
export function getRange(page: number) {
  const from = (page - 1) * POSTS_PER_PAGE
  const to   = from + POSTS_PER_PAGE - 1
  return { from, to }
}

/**
 * Número total de páginas.
 */
export function getTotalPages(totalPosts: number) {
  return Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))
}

/**
 * Dado un post_number, devuelve en qué página cae.
 * Usado para redirigir desde notificaciones al post correcto.
 */
export function getPageForPostNumber(postNumber: number) {
  return Math.ceil(postNumber / POSTS_PER_PAGE)
}

/**
 * Parsea y valida el query param ?page=N.
 */
export function parsePage(raw: string | string[] | undefined): number {
  const n = parseInt(Array.isArray(raw) ? raw[0] : (raw ?? '1'), 10)
  return isNaN(n) || n < 1 ? 1 : n
}
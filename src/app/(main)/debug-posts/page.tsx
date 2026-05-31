import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function DebugPage() {
  const supabase = getServiceClient()

  // 1. ¿Cuántos posts hay en total?
  const { count: totalCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  // 2. ¿Posts sin filtros?
  const { data: rawPosts, error: rawError } = await supabase
    .from('posts')
    .select('id, post_number, created_at, topic_id, author_id, deleted_at, blocked_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // 3. ¿Posts con joins?
  const { data: joinedPosts, error: joinError } = await supabase
    .from('posts')
    .select(`
      id,
      post_number,
      created_at,
      topic_id,
      profiles ( username, role ),
      topics ( title, rooms ( slug, title ) )
    `)
    .is('deleted_at', null)
    .is('blocked_at', null)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
      <h1>Debug Posts</h1>

      <h2>1. Total de posts en la tabla</h2>
      <pre>{JSON.stringify({ totalCount }, null, 2)}</pre>

      <h2>2. Posts sin filtros (raw)</h2>
      <pre style={{ color: rawError ? 'red' : 'inherit' }}>
        {JSON.stringify({ error: rawError, data: rawPosts }, null, 2)}
      </pre>

      <h2>3. Posts con joins + filtros is(deleted_at, null)</h2>
      <pre style={{ color: joinError ? 'red' : 'inherit' }}>
        {JSON.stringify({ error: joinError, data: joinedPosts }, null, 2)}
      </pre>
    </div>
  )
}
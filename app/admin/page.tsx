'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Notice = { id: number; date: string; title: string; content: string | null; image: string | null }

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [notices, setNotices] = useState<Notice[]>([])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setIsAdmin(false); setLoading(false); return }
    const { data } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle()
    setIsAdmin(!!data)
    if (!data) { await supabase.auth.signOut(); setMsg('This account is not an admin.') }
    setLoading(false)
  }

  async function loadNotices() {
    const { data } = await supabase.from('notices').select('*').order('date', { ascending: false })
    setNotices((data as Notice[]) ?? [])
  }

  useEffect(() => { checkAdmin() }, [])
  useEffect(() => { setDate(new Date().toISOString().slice(0, 10)) }, [])
  useEffect(() => { if (isAdmin) loadNotices() }, [isAdmin])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMsg(error.message); return }
    await checkAdmin()
  }

  async function logout() {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }

  async function addNotice(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    let imageUrl: string | null = null

    if (file) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const { error: upErr } = await supabase.storage.from('notice-images').upload(path, file)
      if (upErr) { setMsg('Upload failed: ' + upErr.message); return }
      imageUrl = supabase.storage.from('notice-images').getPublicUrl(path).data.publicUrl
    }

    const { error } = await supabase.from('notices').insert({ title, content, date, image: imageUrl })
    if (error) { setMsg('Save failed: ' + error.message); return }

    setTitle(''); setContent(''); setFile(null)
    setMsg('Notice added.')
    loadNotices()
  }

  async function deleteNotice(id: number) {
    if (!confirm('Delete this notice?')) return
    const { error } = await supabase.from('notices').delete().eq('id', id)
    if (error) { setMsg(error.message); return }
    loadNotices()
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>

  if (!isAdmin) {
    return (
      <main style={{ maxWidth: 360, margin: '0 auto', padding: 24 }}>
        <h1>Admin login</h1>
        <form onSubmit={login} style={{ display: 'grid', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Log in</button>
        </form>
        {msg && <p>{msg}</p>}
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Manage notices</h1>
        <button onClick={logout}>Log out</button>
      </div>

      <form onSubmit={addNotice} style={{ display: 'grid', gap: 12, margin: '24px 0' }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <textarea placeholder="Content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="submit">Add notice</button>
      </form>
      {msg && <p>{msg}</p>}

      <h2>Existing notices</h2>
      {notices.map((n) => (
        <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ddd' }}>
          <span>{n.date}: {n.title}</span>
          <button onClick={() => deleteNotice(n.id)}>Delete</button>
        </div>
      ))}
    </main>
  )
}
'use client'

import React, { useEffect, useState } from 'react'
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Notice = {
  id: number
  date: string
  title: string
  content: string | null
  image: string | null
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Login form state
  const [username, setUsername] = useState('kishan')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberUsername, setRememberUsername] = useState(true)
  const [msg, setMsg] = useState('')

  // Notice management states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [notices, setNotices] = useState<Notice[]>([])

  async function checkAdmin() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      setIsAdmin(!!data)
      if (!data) {
        await supabase.auth.signOut()
        setMsg('This account is not authorized as an administrator.')
      }
    } catch (err: unknown) {
      console.error('Error checking admin status:', err)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  async function loadNotices() {
    const { data } = await supabase
      .from('notices')
      .select('*')
      .order('date', { ascending: false })
    setNotices((data as Notice[]) ?? [])
  }

  useEffect(() => {
    checkAdmin()
    // Load remembered username if supported & saved
    const savedUsername = localStorage.getItem('remembered_admin_username')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10))
  }, [])

  useEffect(() => {
    if (isAdmin) {
      loadNotices()
    }
  }, [isAdmin])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setSubmitting(true)

    if (rememberUsername) {
      localStorage.setItem('remembered_admin_username', username)
    } else {
      localStorage.removeItem('remembered_admin_username')
    }

    const trimmedInput = username.trim()
    const emailToUse = trimmedInput.includes('@') ? trimmedInput : trimmedInput

    // First attempt
    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    })

    if (error) {
      // If user typed plain username, try with default email suffix fallback
      if (!trimmedInput.includes('@')) {
        const fallback = await supabase.auth.signInWithPassword({
          email: `${trimmedInput}@gmail.com`,
          password,
        })
        if (!fallback.error) {
          await checkAdmin()
          setSubmitting(false)
          return
        }
      }
      setMsg(error.message)
      setSubmitting(false)
      return
    }

    await checkAdmin()
    setSubmitting(false)
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
      if (upErr) {
        setMsg('Upload failed: ' + upErr.message)
        return
      }
      imageUrl = supabase.storage.from('notice-images').getPublicUrl(path).data.publicUrl
    }

    const { error } = await supabase.from('notices').insert({ title, content, date, image: imageUrl })
    if (error) {
      setMsg('Save failed: ' + error.message)
      return
    }

    setTitle('')
    setContent('')
    setFile(null)
    setMsg('Notice added successfully.')
    loadNotices()
  }

  async function deleteNotice(id: number) {
    if (!confirm('Delete this notice?')) return
    const { error } = await supabase.from('notices').delete().eq('id', id)
    if (error) {
      setMsg(error.message)
      return
    }
    loadNotices()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F3F5F9]">
        <div className="flex items-center gap-3 rounded-[16px] bg-white px-6 py-4 shadow-sm border border-[#E2E8F0]">
          <Loader2 className="h-5 w-5 animate-spin text-[#111827]" />
          <span className="text-sm font-semibold text-[#111827]">Verifying session...</span>
        </div>
      </div>
    )
  }

  // Modern Enterprise Admin Login Interface
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F3F5F9] p-4 sm:p-6 lg:p-8 font-sans antialiased text-[#111827]">
        <div className="w-full max-w-[480px] rounded-[26px] bg-[#FFFFFF] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.03)] border border-[#E2E8F0] transition-all">
          
          {/* Header Section */}
          <div>
            <h1 className="text-[30px] sm:text-[32px] font-bold tracking-tight text-[#111827] leading-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-[#64748B]">
              Sign in to access your administration dashboard.
            </p>
          </div>

          {/* Administrator Role Indicator */}
          {/* <div className="mt-7 flex h-12 items-center justify-between rounded-[14px] bg-[#111827] px-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#94A3B8]" strokeWidth={2} />
              <span className="text-sm font-semibold text-white tracking-wide">
                Administrator
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wider text-slate-200">
              SECURE ACCESS
            </span>
          </div> */}

          {/* Form */}
          <form onSubmit={login} className="mt-7 space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full h-[52px] rounded-[14px] border border-[#DCE2EA] bg-[#FFFFFF] px-4 text-sm font-medium text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#647FEA] focus:outline-none focus:ring-4 focus:ring-[#647FEA]/15"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#111827] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-[52px] rounded-[14px] border border-[#DCE2EA] bg-[#FFFFFF] px-4 pr-12 text-sm font-medium text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#647FEA] focus:outline-none focus:ring-4 focus:ring-[#647FEA]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#64748B] hover:text-[#111827] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#647FEA]/30"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Username */}
            <div className="pt-0.5">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberUsername}
                  onChange={(e) => setRememberUsername(e.target.checked)}
                  className="h-4 w-4 rounded-[4px] border-[#DCE2EA] text-[#111827] accent-[#111827] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm font-medium text-[#64748B] hover:text-[#111827] transition-colors">
                  Remember username
                </span>
              </label>
            </div>

            {/* Error Message */}
            {msg && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-sm font-medium text-[#B91C1C] transition-all"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#B91C1C]" strokeWidth={2} />
                <div className="leading-snug">{msg}</div>
              </div>
            )}

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[52px] rounded-[14px] bg-[#111827] px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#273449] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#111827] cursor-pointer flex items-center justify-center gap-2.5 shadow-sm focus:outline-none focus:ring-4 focus:ring-[#111827]/15"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Dashboard view for logged-in admin
  return (
    <main className="min-h-screen w-full bg-[#F3F5F9] p-4 sm:p-8 font-sans antialiased text-[#111827]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[22px] bg-white p-6 shadow-sm border border-[#E2E8F0]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Admin Portal
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Manage Notices
            </h1>
          </div>
          <button
            onClick={logout}
            className="self-start sm:self-auto rounded-[12px] bg-[#F1F5F9] px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>

        {/* Status message */}
        {msg && (
          <div className="mt-4 rounded-[14px] border border-sky-200 bg-sky-50 p-4 text-xs font-semibold text-sky-800">
            {msg}
          </div>
        )}

        {/* Add Notice Form */}
        <div className="mt-6 rounded-[22px] bg-white p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
          <h2 className="text-lg font-bold text-[#111827] mb-4">Add New Notice</h2>
          <form onSubmit={addNotice} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Title</label>
                <input
                  placeholder="Notice title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full h-11 rounded-[12px] border border-[#DCE2EA] px-4 text-sm font-medium text-[#111827] placeholder:text-[#94A3B8] focus:border-[#647FEA] focus:outline-none focus:ring-4 focus:ring-[#647FEA]/15"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full h-11 rounded-[12px] border border-[#DCE2EA] px-4 text-sm font-medium text-[#111827] focus:border-[#647FEA] focus:outline-none focus:ring-4 focus:ring-[#647FEA]/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">Content</label>
              <textarea
                placeholder="Notice description & details..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-[12px] border border-[#DCE2EA] p-3 text-sm font-medium text-[#111827] placeholder:text-[#94A3B8] focus:border-[#647FEA] focus:outline-none focus:ring-4 focus:ring-[#647FEA]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">Attachment / Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-[#64748B] file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#F1F5F9] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#334155] hover:file:bg-[#E2E8F0] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="rounded-[12px] bg-[#111827] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#273449] transition-colors cursor-pointer"
            >
              Add notice
            </button>
          </form>
        </div>

        {/* Existing Notices List */}
        <div className="mt-6 rounded-[22px] bg-white p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
          <h2 className="text-lg font-bold text-[#111827] mb-4">Existing Notices ({notices.length})</h2>
          {notices.length === 0 ? (
            <p className="text-sm text-[#94A3B8] py-4">No notices published yet.</p>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {notices.map((n) => (
                <div key={n.id} className="flex items-center justify-between py-3.5 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{n.title}</p>
                    <p className="text-xs text-[#64748B]">{n.date}</p>
                  </div>
                  <button
                    onClick={() => deleteNotice(n.id)}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
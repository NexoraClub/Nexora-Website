'use client'

import React, { useEffect, useState } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Pin,
  Paperclip,
  Loader2,
  X,
  Upload,
  Calendar,
} from 'lucide-react'

interface NoticeItem {
  id: string
  title: string
  summary?: string | null
  content?: string | null
  category: string
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT'
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  date: string
  expiryDate?: string | null
  isPinned: boolean
  authorName?: string | null
  authorRole?: string | null
  attachmentUrl?: string | null
  attachmentName?: string | null
  attachmentType?: string | null
}

interface NoticesViewProps {
  initialOpenModal?: boolean
}

export default function NoticesView({ initialOpenModal = false }: NoticesViewProps) {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(initialOpenModal)
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingAttachment, setUploadingAttachment] = useState(false)
  const [msg, setMsg] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    priority: 'NORMAL' as 'NORMAL' | 'IMPORTANT' | 'URGENT',
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    summary: '',
    content: '',
    date: new Date().toISOString().slice(0, 10),
    expiryDate: '',
    isPinned: false,
    authorName: 'Nexora Executive Board',
    authorRole: 'ISE Department',
    attachmentUrl: '',
    attachmentName: '',
  })

  async function loadNotices() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (categoryFilter) params.set('category', categoryFilter)
      if (priorityFilter) params.set('priority', priorityFilter)

      const res = await fetch(`/api/admin/notices?${params.toString()}`)
      const data = await res.json()
      if (res.ok && data.notices) {
        setNotices(data.notices)
      }
    } catch (err) {
      console.error('Failed to load notices:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotices()
  }, [categoryFilter, priorityFilter])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    loadNotices()
  }

  function openCreateModal() {
    setEditingNotice(null)
    setFormData({
      title: '',
      category: 'General',
      priority: 'NORMAL',
      status: 'PUBLISHED',
      summary: '',
      content: '',
      date: new Date().toISOString().slice(0, 10),
      expiryDate: '',
      isPinned: false,
      authorName: 'Nexora Executive Board',
      authorRole: 'ISE Department',
      attachmentUrl: '',
      attachmentName: '',
    })
    setMsg('')
    setIsModalOpen(true)
  }

  function openEditModal(notice: NoticeItem) {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      category: notice.category,
      priority: notice.priority,
      status: notice.status,
      summary: notice.summary || '',
      content: notice.content || '',
      date: notice.date ? notice.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
      expiryDate: notice.expiryDate ? notice.expiryDate.slice(0, 10) : '',
      isPinned: notice.isPinned,
      authorName: notice.authorName || 'Nexora Executive Board',
      authorRole: notice.authorRole || 'ISE Department',
      attachmentUrl: notice.attachmentUrl || '',
      attachmentName: notice.attachmentName || '',
    })
    setMsg('')
    setIsModalOpen(true)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingAttachment(true)
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('bucket', 'notice-images')

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          attachmentUrl: data.url,
          attachmentName: file.name,
        }))
      } else {
        alert(data.error || 'Upload failed.')
      }
    } catch {
      alert('Upload failed due to network error.')
    } finally {
      setUploadingAttachment(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMsg('')

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        summary: formData.summary,
        content: formData.content,
        date: formData.date,
        expiryDate: formData.expiryDate || null,
        isPinned: formData.isPinned,
        authorName: formData.authorName,
        authorRole: formData.authorRole,
        attachmentUrl: formData.attachmentUrl || null,
        attachmentName: formData.attachmentName || null,
      }

      let res
      if (editingNotice) {
        res = await fetch('/api/admin/notices', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingNotice.id, ...payload }),
        })
      } else {
        res = await fetch('/api/admin/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const resData = await res.json()
      if (!res.ok) {
        setMsg(resData.error || 'Failed to save notice.')
        return
      }

      setIsModalOpen(false)
      loadNotices()
    } catch (err: unknown) {
      console.error('Save notice failed:', err)
      setMsg('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete notice "${title}"?`)) return

    try {
      const res = await fetch(`/api/admin/notices?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadNotices()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete notice.')
      }
    } catch {
      alert('Network error while deleting notice.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search notices by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-4 text-xs font-medium text-[#111827] placeholder-[#94A3B8] focus:border-[#647FEA] focus:bg-white focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#475569] focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Urgent">Urgent</option>
            <option value="Events">Events</option>
            <option value="Projects">Projects</option>
            <option value="General">General</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#475569] focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="NORMAL">Normal</option>
            <option value="IMPORTANT">Important</option>
            <option value="URGENT">Urgent</option>
          </select>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-xl bg-[#111827] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#273449] transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>Post Notice</span>
          </button>
        </div>
      </div>

      {/* Notices Table */}
      <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#64748B]" />
          </div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-[#111827]">No notices found</p>
            <p className="text-xs text-[#64748B] mt-1">
              Publish your first notice or adjust search filters.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#111827] px-3.5 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Post Notice</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase text-[#64748B]">
                <tr>
                  <th className="px-5 py-3.5">Title & Summary</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {notices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#111827]">
                      <div className="max-w-md">
                        <div className="flex items-center gap-1.5">
                          {notice.isPinned && (
                            <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          <p className="truncate text-[13px]">{notice.title}</p>
                        </div>
                        {notice.summary && (
                          <p className="text-[11px] text-[#64748B] font-normal line-clamp-1 mt-0.5">
                            {notice.summary}
                          </p>
                        )}
                        {notice.attachmentUrl && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 mt-1">
                            <Paperclip className="h-3 w-3" />
                            <span>Attachment attached</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {notice.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          notice.priority === 'URGENT'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : notice.priority === 'IMPORTANT'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {notice.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3 text-[#94A3B8]" />
                        <span>{notice.date ? notice.date.slice(0, 10) : 'Today'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          notice.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : notice.status === 'DRAFT'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(notice)}
                          title="Edit notice"
                          className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#111827] transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id, notice.title)}
                          title="Delete notice"
                          className="rounded-lg p-1.5 text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#111827]">
                {editingNotice ? 'Edit Notice' : 'Post New Notice'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {msg && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Notice Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Internal Hackathon 2026: Team Registration Deadline"
                    className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Events">Events</option>
                    <option value="Projects">Projects</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent (Hero banner)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Summary / Excerpt
                  </label>
                  <input
                    type="text"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief 1-2 sentence preview..."
                    className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Detailed Content / Body
                  </label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Full notice message with guidelines and instructions..."
                    className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Notice Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Attachment (PDF, Document, Rulebook)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.attachmentUrl}
                      onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                      placeholder="File URL or upload below..."
                      className="w-full rounded-xl border border-[#DCE2EA] px-3.5 py-2 text-xs text-[#111827] focus:border-[#647FEA] focus:outline-none"
                    />
                    <label className="cursor-pointer shrink-0 rounded-xl border border-[#DCE2EA] bg-[#F8FAFC] p-2 hover:bg-[#F1F5F9]">
                      <Upload className="h-4 w-4 text-[#64748B]" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploadingAttachment}
                      />
                    </label>
                  </div>
                  {uploadingAttachment && (
                    <p className="text-[10px] text-indigo-600 mt-1">Uploading document...</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="h-4 w-4 rounded border-[#DCE2EA] text-[#111827] focus:ring-0"
                  />
                  <label htmlFor="isPinned" className="text-xs font-semibold text-[#111827]">
                    Pin this notice to top
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-xl bg-[#111827] px-4 py-2 text-xs font-semibold text-white hover:bg-[#273449] disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingNotice ? 'Save Changes' : 'Post Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

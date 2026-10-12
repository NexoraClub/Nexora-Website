import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'

async function NoticeList() {
  const notices = await prisma.notice.findMany({ orderBy: { date: 'desc' } })

  if (notices.length === 0) return <p>No notices yet.</p>

  return (
    <>
      {notices.map((n) => (
        <article
          key={n.id.toString()}
          style={{ margin: '24px 0', borderBottom: '1px solid #ddd', paddingBottom: 16 }}
        >
          <small>{n.date.toLocaleDateString()}</small>
          <h2>{n.title}</h2>
          {n.image && <img src={n.image} alt={n.title} style={{ maxWidth: '100%' }} />}
          <p>{n.content}</p>
        </article>
      ))}
    </>
  )
}

export default function NoticesPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>Notices</h1>
      <Suspense fallback={<p>Loading notices...</p>}>
        <NoticeList />
      </Suspense>
    </main>
  )
}
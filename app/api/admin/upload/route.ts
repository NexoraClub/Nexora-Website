import { NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'notice-images'

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    // Sanitize filename and create unique path
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${Date.now()}-${sanitizedName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      })

    if (error) {
      console.warn(`Upload to ${bucket} failed:`, error.message)
      // If bucket doesn't exist, try notice-images as fallback
      if (bucket !== 'notice-images') {
        const fallback = await supabase.storage
          .from('notice-images')
          .upload(fileName, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          })
        if (!fallback.error) {
          const { data: publicData } = supabase.storage
            .from('notice-images')
            .getPublicUrl(fileName)
          return NextResponse.json({
            success: true,
            url: publicData.publicUrl,
            fileName,
          })
        }
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      fileName,
    })
  } catch (err: unknown) {
    console.error('File upload error:', err)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}

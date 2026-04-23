import { NextRequest } from 'next/server'
import { transcribeAudio, generateClinicalNote } from '../../actions/transcribeAudio'

export async function POST(req: Request) {
  const formData = await req.formData()

  const transcriptionRes = await transcribeAudio(formData)
  const status = transcriptionRes.status
  const json = await transcriptionRes.json().catch(() => ({}))

  if (!transcriptionRes.ok) {
    return new Response(JSON.stringify(json), { status })
  }

  const transcript = json.text ?? ''
  const note = await generateClinicalNote(transcript)

  return new Response(JSON.stringify({ text: transcript, note }), { status: 200 })
}

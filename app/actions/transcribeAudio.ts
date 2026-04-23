const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY in environment')
}

export async function transcribeAudio(formData: FormData) {
  const file = formData.get('file') as File | null
  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 })
  }

  // Convert uploaded File/Blob to a Node Buffer so the SDK can detect format
  try {
    const arrayBuffer = await (file as unknown as Blob).arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const fd = new FormData()
    // Append as Blob with filename so OpenAI can parse multipart correctly
    fd.append('file', new Blob([buffer]), 'audio.webm')
    fd.append('model', 'whisper-1')
    fd.append('prompt', 'This is a dental clinical note. Terms include: distal-occlusal, caries, gingivitis, tooth numbers 1-32.')

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: fd,
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('OpenAI transcription error', errText)
      return new Response(JSON.stringify({ error: errText }), { status: res.status })
    }

    const data = await res.json()
    const text = data.text ?? ''
    console.log('Transcription:', text)
    return new Response(JSON.stringify({ text }), { status: 200 })
  } catch (err: any) {
    console.error('OpenAI transcription error', err)
    return new Response(JSON.stringify({ error: err.message ?? String(err) }), { status: 500 })
  }
}

export const runtime = 'nodejs'

export async function generateClinicalNote(transcript: string): Promise<string> {
  if (!transcript) return ''

  const systemPrompt = `You are a professional dental scribe. Given a raw transcription of a clinical encounter, produce a condensed, professional SOAP note suitable for entry into a dental practice management system. STRICTLY follow the Dental SOAP format with these sections in order:\n\nSubjective:\nObjective:\nAssessment:\nPlan:\n\nUse the Universal Tooth Numbering system (1-32) when referencing teeth. Keep language concise, clinical, and professional; prefer short bullet points or brief sentences. Do not include extraneous commentary, sources, or apologies. Output only the SOAP note text.`

  const body = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Raw transcription:\n\n${transcript}` },
    ],
    temperature: 0.2,
    max_tokens: 800,
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('OpenAI chat error', errText)
      throw new Error(errText)
    }

    const data = await res.json()
    const note = data.choices?.[0]?.message?.content ?? ''
    return String(note).trim()
  } catch (err: any) {
    console.error('generateClinicalNote error', err)
    return ''
  }
}

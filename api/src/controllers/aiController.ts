import { GoogleGenAI } from '@google/genai'

const DEFAULT_MODEL = 'gemini-2.0-flash'

/**
 * Generate a short project summary from structured context (project details, issues, status updates).
 * Uses Gemini SDK. Requires GEMINI_API_KEY (or GOOGLE_API_KEY) in env.
 */
export async function generateProjectSummaryFromContext(
  context: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? ''
  if (!apiKey.trim()) {
    throw new Error(
      'GEMINI_API_KEY (or GOOGLE_API_KEY) is required for AI summary'
    )
  }

  const ai = new GoogleGenAI({ apiKey })
  const prompt = buildSummaryPrompt(context)
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
    contents: prompt,
  })

  const text = response.text
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Gemini returned an empty summary')
  }
  return text.trim()
}

function buildSummaryPrompt(context: string): string {
  return `You are summarizing a project for a team workspace. Given the following project details, issues, and status updates, produce a concise summary (2–4 short paragraphs). Focus on: current status, key issues, recent progress, and any risks or blockers. Write in clear, neutral prose. Do not use bullet points unless necessary.

Context:
${context}

Summary:`
}

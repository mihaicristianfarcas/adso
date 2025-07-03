import { GoogleGenAI } from '@google/genai'

const assistant = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// export async function generateResponse(prompt: string) {
//   try {
//     const response = await assistant.models.generateContent({
//       model: 'gemini-2.5-flash-preview-05-20',
//       contents: prompt
//     })
//     return response.text || ''
//   } catch (error) {
//     console.error('Error getting explanation:', error)
//     return 'Unable to generate explanation at this time.'
//   }
// }

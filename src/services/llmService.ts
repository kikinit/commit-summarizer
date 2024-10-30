import axios from 'axios'
import { config } from '../config/config.js'

export async function summarizeCommits(commits: string[]): Promise<string> {
  const prompt = `Summarize the following commits: ${commits.join(' | ')}`
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    },
    {
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data.choices[0].text.trim()
}

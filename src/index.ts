import { fetchLocalCommits, fetchRemoteCommits } from './service/gitService.js'
import { summarizeCommits } from './service/llmService.js'

export async function fetchCommits(branch: string, start?: string, end?: string, isRemote?: boolean) {
  try {
    const commits = isRemote
      ? await fetchRemoteCommits(branch)
      : await fetchLocalCommits(branch, start, end)
    
    console.log('Commits fetched:', commits)

    const summary = await summarizeCommits(commits)
    console.log('Commit Summary:', summary)
  } catch (error) {
    console.error('Error fetching or summarizing commits:', error)
  }
}

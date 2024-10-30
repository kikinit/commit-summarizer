import { fetchLocalCommits, fetchRemoteCommits } from './service/gitService.js'

export async function fetchCommits(
  branch: string,
  startCommit?: string,
  endCommit?: string,
  isRemoteFallback: boolean = true
): Promise<void> {
  try {
    const start = startCommit ?? 'first_commit_hash'
    const end = endCommit ?? 'last_commit_hash'
    let commits = await fetchLocalCommits(branch, start, end)
        
    // If no commits are found locally and remote fallback is enabled, fetch remotely
    if (!commits.length && isRemoteFallback) {
      console.log('No local commits found. Fetching from remote...')
      commits = await fetchRemoteCommits(branch)
    }

    console.log('Commits fetched:', commits)
  } catch (error) {
    console.error('Error fetching commits:', error)
  }
}

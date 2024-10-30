import { fetchLocalCommits, fetchRemoteCommits } from './service/gitService.js'

export async function fetchCommits(
  branch: string,
  startCommit?: string,
  endCommit?: string,
  isRemote: boolean = false
): Promise<void> {
  try {
    const commits = isRemote
      ? await fetchRemoteCommits(branch)
      : await fetchLocalCommits(branch, startCommit, endCommit)

    console.log('Commits fetched:', commits)
  } catch (error) {
    console.error('Error fetching commits:', error)
  }
}

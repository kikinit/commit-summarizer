import axios from 'axios'
import { config } from '../config/config.js'
import { GitHubCommit } from '../types/GitHubCommit.js'

/**
 * Fetches commits from the remote GitHub repository for the specified branch and optional commit range.
 * @param branch - The branch to fetch commits from.
 * @param startCommit - Optional start commit hash.
 * @param endCommit - Optional end commit hash.
 * @returns An array of commit objects from the remote repository.
 */
export async function fetchRemoteCommits(
  branch: string,
  startCommit?: string,
  endCommit?: string
): Promise<GitHubCommit[]> {
  try {
    let url = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/commits?sha=${branch}`

    // Fetch commits from the remote repository
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${config.githubToken}` },
    })

    let commits = response.data as GitHubCommit[]

    // Filter commits based on start and end hash if provided
    if (startCommit || endCommit) {
      const startIndex = commits.findIndex(commit => commit.sha === startCommit) || 0
      const endIndex = commits.findIndex(commit => commit.sha === endCommit) + 1 || commits.length
      commits = commits.slice(startIndex, endIndex)
    }

    return commits
  } catch (error) {
    console.error('Error fetching commits from the remote repository:', error)
    throw error
  }
}

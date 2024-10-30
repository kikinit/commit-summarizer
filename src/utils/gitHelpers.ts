import { execSync } from 'child_process'
import axios from 'axios'
import { config } from '../config/config.js'
import { GitHubCommit } from 'types/GitHubCommit.js'

/**
 * Retrieves the current branch name.
 */
export function getCurrentBranch(): string {
  return executeGitCommand('git rev-parse --abbrev-ref HEAD')
}

/**
 * Gets the first and last commit hashes for the current branch from GitHub.
 * @param branch - The branch to retrieve commit bounds for.
 */
export async function getBranchBoundCommits(branch: string): Promise<{ firstCommit: string, lastCommit: string }> {
  const url = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/commits?sha=${branch}`
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${config.githubToken}` },
  })

  const commits = response.data as GitHubCommit[]
  const firstCommit = commits[commits.length - 1].sha
  const lastCommit = commits[0].sha

  return { firstCommit, lastCommit }
}

/**
 * Executes a Git command and returns the output as a string.
 * @param command - The Git command to execute.
 */
function executeGitCommand(command: string): string {
  try {
    return execSync(command).toString().trim()
  } catch (error) {
    console.error('Failed to execute Git command:', (error as Error).message)
    throw new Error('Git command execution failed')
  }
}

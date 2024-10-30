import { execSync } from 'child_process'

/**
 * Executes a Git command and returns the output as a string.
 * @param command - The Git command to execute.
 */
export function executeGitCommand(command: string): string {
  try {
    return execSync(command).toString().trim()
  } catch (error) {
    console.error('Failed to execute Git command:', (error as Error).message)
    throw new Error('Git command execution failed')
  }
}

/**
 * Retrieves the current branch name.
 */
export function getCurrentBranch(): string {
  return executeGitCommand('git rev-parse --abbrev-ref HEAD')
}

/**
 * Gets the first and last commit hashes for a given branch.
 * @param branch - The branch to retrieve commit bounds for.
 * @returns An object with firstCommit and lastCommit hashes.
 */
export function getBranchBoundCommits(branch: string) {
  try {
    console.log(`Getting first and last commits for branch: ${branch}`)
    const firstCommit = execSync(`git rev-list --max-parents=0 ${branch}`)
      .toString()
      .trim()
    const lastCommit = execSync(`git rev-parse ${branch}`).toString().trim()
    console.log(`First commit: ${firstCommit}, Last commit: ${lastCommit}`)
    return { firstCommit, lastCommit }
  } catch (error) {
    console.error('Error retrieving branch bound commits:', error)
    throw error
  }
}

/**
 * Retrieves GitHub repository information (owner and repo) from Git origin URL.
 */
export function getRepoInfo() {
  const originUrl = executeGitCommand('git config --get remote.origin.url')
  const match = originUrl.match(/github\.com[:\/](.+)\/(.+)\.git/)
  if (match) {
    return { owner: match[1], repo: match[2] }
  }
  throw new Error('Could not determine GitHub repository information')
}

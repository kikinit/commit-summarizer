import { execSync } from 'child_process'

export function getCurrentBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch {
    throw new Error('Failed to get the current branch.')
  }
}
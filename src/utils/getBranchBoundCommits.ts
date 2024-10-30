import { execSync } from 'child_process'

export function getBranchBoundCommits(branch: string) {
  const firstCommit = execSync(`git rev-list --max-parents=0 ${branch}`).toString().trim()
  const lastCommit = execSync(`git rev-parse ${branch}`).toString().trim()
  return { firstCommit, lastCommit }
}

import { execSync } from 'child_process'

export function getRepoInfo() {
  const originUrl = execSync('git config --get remote.origin.url').toString().trim()
  const match = originUrl.match(/github\.com[:\/](.+)\/(.+)\.git/)
  if (match) {
    return { owner: match[1], repo: match[2] }
  }
  throw new Error('Could not determine GitHub repository information')
}

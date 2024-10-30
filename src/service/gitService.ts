import axios from 'axios'
import { getRepoInfo } from '../utils/getRepoInfo.js'
import { GitHubCommit } from '../types'
import { config } from '../config/config.js'
import { execSync } from 'child_process'

export async function fetchLocalCommits(
  branch: string,
  startCommit?: string,
  endCommit?: string
) {
  // Build command based on provided commit range
  const logCommand = startCommit && endCommit
    ? `git log ${startCommit}..${endCommit} --pretty=format:"%H %s" --reverse`
    : `git log ${branch} --pretty=format:"%H %s" --reverse`

  const result = execSync(logCommand).toString().trim()

  return result
    ? result.split('\n').map((line) => {
        const [hash, ...message] = line.split(' ')
        return { hash, message: message.join(' ') }
      })
    : []
}

export async function fetchRemoteCommits(
  branch: string,
  owner: string = config.githubOwner ?? '',
  repo: string = config.githubRepo ?? ''
): Promise<{ hash: string; message: string }[]> {
  if (!owner || !repo) {
    throw new Error(
      'Owner and repo must be defined in the configuration or passed explicitly.'
    )
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${config.githubToken}` },
  })

  return response.data.map((commit: GitHubCommit) => ({
    hash: commit.sha,
    message: commit.commit.message,
  }))
}

export async function fetchCommits(
  branch: string,
  startCommit: string,
  endCommit: string,
  forceRemote: boolean = false
) {
  if (!forceRemote) {
    try {
      const localCommits = await fetchLocalCommits(branch, startCommit, endCommit)
      if (localCommits.length) return localCommits
    } catch (error) {
      console.warn('Local fetch failed; attempting remote fetch...', error)
    }
  }

  const { owner, repo } = getRepoInfo()
  return fetchRemoteCommits(branch, owner, repo)
}

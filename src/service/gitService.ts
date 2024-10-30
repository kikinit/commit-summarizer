import axios from 'axios'
import { getRepoInfo } from '../utils/getRepoInfo.js'
import { GitHubCommit } from '../types'
import { config } from '../config/config.js'
import { execSync } from 'child_process'

export async function fetchLocalCommits(
  branch: string,
  startCommit: string,
  endCommit: string
) {
  const logCommand = `git log ${startCommit}..${endCommit} --pretty=format:"%H %s" --reverse`
  const result = execSync(logCommand).toString().trim()

  return result
    ? result.split('\n').map((line: string) => {
        const [hash, ...messageParts] = line.split(' ')
        const message = messageParts.join(' ')
        return { hash, message }
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
  startCommit?: string,
  endCommit?: string
) {
  try {
    const localCommits = await fetchLocalCommits(
      branch,
      startCommit ?? 'first_commit_hash',
      endCommit ?? 'last_commit_hash'
    )
    if (localCommits.length) return localCommits
  } catch (error) {
    console.warn('Local fetch failed; attempting remote fetch...', error)
  }

  const { owner, repo } = getRepoInfo()
  return fetchRemoteCommits(branch, owner, repo)
}

import { execSync } from 'child_process'
import axios from 'axios'
import { GitHubCommit } from '../types'
import { config } from '../config/config.js'

export async function fetchLocalCommits(
  branch: string,
  start?: string,
  end?: string
): Promise<string[]> {
  const range = start && end ? `${start}..${end}` : branch
  const command = `git log ${range} --pretty=format:"%s"`
  const output = execSync(command).toString()
  return output.split('\n')
}

export async function fetchRemoteCommits(branch: string): Promise<string[]> {
  const url = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/commits?sha=${branch}`
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
    },
  })

  return response.data.map((commit: GitHubCommit) => commit.commit.message)
}

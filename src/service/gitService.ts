import { execSync } from 'child_process'
import axios from 'axios'
import { GitHubCommit } from '../types'

export async function fetchLocalCommits(branch: string, start?: string, end?: string): Promise<string[]> {
  const range = start && end ? `${start}..${end}` : branch
  const command = `git log ${range} --pretty=format:"%s"`
  const output = execSync(command).toString()
  return output.split('\n')
}

export async function fetchRemoteCommits(branch: string): Promise<string[]> {
  const url = `https://api.github.com/repos/<owner>/<repo>/commits?sha=${branch}`
  const response = await axios.get<GitHubCommit[]>(url, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
  })

  return response.data.map((commit) => commit.commit.message)
}

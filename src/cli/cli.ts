import inquirer from 'inquirer'
import { fetchRemoteCommits } from '../services/gitService.js'
import { getCurrentBranch, getBranchBoundCommits } from '../utils/gitHelpers.js'

/**
 * Prompts user for commit range customization within the current branch.
 */
async function promptUserForCommits() {
  const branch = getCurrentBranch()
  console.log(`Current branch detected: ${branch}`)

  const { firstCommit, lastCommit } = await getBranchBoundCommits(branch)

  const { startCommit, endCommit } = await inquirer.prompt([
    {
      type: 'input',
      name: 'startCommit',
      message: `Enter starting commit hash (default: first commit on ${branch})`,
      default: firstCommit,
    },
    {
      type: 'input',
      name: 'endCommit',
      message: `Enter ending commit hash (default: last commit on ${branch})`,
      default: lastCommit,
    },
  ])

  const commits = await fetchRemoteCommits(branch, startCommit, endCommit)
  console.log(`Fetched ${commits.length} commits:`)
  commits.forEach(commit => {
    console.log(`${commit.sha}: ${commit.commit.message}`)
  })
}

promptUserForCommits()

import inquirer from 'inquirer'
import { fetchCommits } from '../service/gitService.js'
import { getBranchBoundCommits } from '../utils/getBranchBoundCommits.js'

async function run() {
  const branch = process.argv.includes('--branch') ? process.argv[process.argv.indexOf('--branch') + 1] : 'main'
  const { startCommit, endCommit } = await getCommitRange(branch)

  console.log(`Fetching commits from ${branch} branch...`)
  const commits = await fetchCommits(branch, startCommit, endCommit)
  console.log(`Fetched ${commits.length} commits`)
  console.log(commits)
}

async function getCommitRange(branch: string) {
  const { firstCommit, lastCommit } = await getBranchBoundCommits(branch)
  const responses = await inquirer.prompt([
    {
      type: 'input',
      name: 'startCommit',
      message: `Enter starting commit hash (default: first commit on ${branch})`,
      default: firstCommit
    },
    {
      type: 'input',
      name: 'endCommit',
      message: `Enter ending commit hash (default: last commit on ${branch})`,
      default: lastCommit
    }
  ])
  return {
    startCommit: responses.startCommit || firstCommit,
    endCommit: responses.endCommit || lastCommit
  }
}

run()

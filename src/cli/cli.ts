import { getCurrentBranch } from '../utils/getCurrentBranch.js'

import inquirer from 'inquirer'
import { fetchCommits } from '../service/gitService.js'

async function run() {
  const { branch } = await inquirer.prompt({
    type: 'input',
    name: 'branch',
    message: 'Enter the branch name:',
    default: getCurrentBranch(),
  })

  const { startCommit } = await inquirer.prompt({
    type: 'input',
    name: 'startCommit',
    message:
      'Enter the starting commit hash (leave blank for first commit in branch):',
  })

  const { endCommit } = await inquirer.prompt({
    type: 'input',
    name: 'endCommit',
    message:
      'Enter the ending commit hash (leave blank for latest commit in branch):',
  })

  const { forceRemote } = await inquirer.prompt({
    type: 'confirm',
    name: 'forceRemote',
    message:
      'Would you like to fetch directly from the remote (skip local fetch)?',
    default: false,
  })

  try {
    const commits = await fetchCommits(
      branch,
      startCommit || '',
      endCommit || '',
      forceRemote
    )
    console.log('Commits fetched:', commits)
  } catch (error) {
    console.error('Error fetching commits:', error)
  }
}

run()

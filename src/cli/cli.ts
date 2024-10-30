import { Command } from 'commander'
import inquirer from 'inquirer'
import { fetchCommits } from '../index.js'

const program = new Command()

program
  .option('-b, --branch <branch>', 'Specify the branch to summarize', 'main')
  .option('-r, --remote', 'Fetch commits from remote repository')
  .parse(process.argv)

const options = program.opts()

async function getCommitHashes() {
  const responses = await inquirer.prompt([
    {
      type: 'input',
      name: 'startCommit',
      message: 'Enter the starting commit hash:',
      validate: (input) => input ? true : 'Start commit hash is required',
    },
    {
      type: 'input',
      name: 'endCommit',
      message: 'Enter the ending commit hash:',
      validate: (input) => input ? true : 'End commit hash is required',
    },
  ])
  return responses
}

(async () => {
  const { startCommit, endCommit } = await getCommitHashes()
  await fetchCommits(options.branch, startCommit, endCommit, options.remote)
})()

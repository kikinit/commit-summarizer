import { fetchRemoteCommits } from './services/gitService.js'
import { getCurrentBranch, getBranchBoundCommits } from './utils/gitHelpers.js'

/**
 * Main function to fetch and display commits from the current branch.
 */
async function run() {
  try {
    const branch = getCurrentBranch()
    console.log(`Fetching commits from the current branch: ${branch}`)

    // Adjusted property names to match getBranchBoundCommits function's return type
    const { firstCommit, lastCommit } = await getBranchBoundCommits(branch)
    const commits = await fetchRemoteCommits(branch, firstCommit, lastCommit)

    console.log(`Fetched ${commits.length} commits:`)
    commits.forEach(commit => {
      console.log(`${commit.sha}: ${commit.commit.message}`)
    })
  } catch (error) {
    console.error('Error fetching commits:', error)
  }
}

run()

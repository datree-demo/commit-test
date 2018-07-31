const { GitProcess, GitError, IGitResult } = require('dugite')

const pathToRepository = '.'

async function main() {
  const result = await GitProcess.exec(['diff'], pathToRepository)
  if (result.exitCode === 0) {
    const output = result.stdout
    console.log(output.split('\n'))
    // do some things with the output
  } else {
    const error = result.stderr
    // error handling
  }
}

main()
  .then(console.log)
  .catch(console.log)

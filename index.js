const util = require('util')
const git = require('nodegit')

function parseCodeComponent(line) {
  const match = /(?:(?:\\['"`][\s\S])*?(['"`](?=[\s\S]*?require\s*\(['"`][^`"']+?[`'"]\)))(?:\\\1|[\s\S])*?\1|\s*(?:(?:var|const|let)?\s*([_.\w/$]+?)\s*=\s*)?require\s*\(([`'"])((?:@([^/]+?)\/([^/]*?)|[-.@\w/$]+?))\3(?:, ([`'"])([^\7]+?)\7)?\);?)/g.exec(
    line
  )
  if (!match) return
  return match[4]
}
async function main() {
  const projectRepository = await git.Repository.open('.')
  const walker = projectRepository.createRevWalk()
  const headCommit = await projectRepository.getHeadCommit()
  walker.sorting(git.Revwalk.SORT.TOPOLOGICAL)
  walker.push(headCommit.sha())
  const commits = await walker.getCommitsUntil(async () => {})
  const changes = {}
  for (const commit of commits) {
    const sha = commit.sha()
    changes[sha] = {}
    console.log(sha)
    const diffs = await commit.getDiff()
    for (const diff of diffs) {
      const patches = await diff.patches()
      for (const patch of patches) {
        const newFilePath = patch.newFile().path()
        changes[sha][newFilePath] = {
          added: new Set(),
          removed: new Set(),
          unknown: new Set()
        }
        const hunks = await patch.hunks()
        for (const hunk of hunks) {
          const lines = await hunk.lines()
          for (const line of lines) {
            const codeComponent = parseCodeComponent(line.content().trim())
            if (codeComponent) {
            }
            if (line.origin() === 43) {
              changes[sha][newFilePath]['added'].add(codeComponent)
            } else if (line.origin() === 45) {
              changes[sha][newFilePath]['removed'].add(codeComponent)
            } else {
              changes[sha][newFilePath]['unknown'].add(codeComponent)
            }
          }
        }
      }
    }
  }
  console.log(util.inspect(changes, false, null))
}

main()
  .then(console.log)
  .catch(console.log)

// adding just for testing - can remove if in master
// another temp line

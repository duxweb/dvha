import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import fs from 'fs-extra'
import { createProject, getAvailableUIs } from '../bin/index.js'

const args = process.argv.slice(2).filter(arg => arg !== '--')
const templates = args.length > 0 ? args : ['pro']
const available = new Set(getAvailableUIs().map(item => item.value))
const tempDirs = []

function run(command, commandArgs, cwd) {
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0) {
    throw new Error(`${command} ${commandArgs.join(' ')} failed with code ${result.status}`)
  }
}

async function main() {
  for (const template of templates) {
    if (!available.has(template)) {
      throw new Error(`Unknown template: ${template}`)
    }

    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), `dvha-${template}-`))
    tempDirs.push(tempRoot)
    const projectDir = path.join(tempRoot, `${template}-app`)

    console.log(`\n[smoke] create ${template}`)
    await createProject(projectDir, {
      template,
      silent: true,
    })

    console.log(`[smoke] install ${template}`)
    run('pnpm', ['install'], projectDir)

    console.log(`[smoke] build ${template}`)
    run('pnpm', ['build'], projectDir)
  }
}

try {
  await main()
}
finally {
  await Promise.all(tempDirs.map(dir => fs.remove(dir)))
}

import assert from 'node:assert/strict'
import os from 'node:os'
import path from 'node:path'
import { after, test } from 'node:test'
import fs from 'fs-extra'
import { createProject, getAvailableUIs } from '../bin/index.js'

const tempDirs = []

after(async () => {
  await Promise.all(tempDirs.map(dir => fs.remove(dir)))
})

async function createTempProject(template) {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'dvha-template-'))
  tempDirs.push(tempRoot)

  const projectDir = path.join(tempRoot, `${template}-app`)
  await createProject(projectDir, {
    template,
    silent: true,
  })

  return projectDir
}

test('available UI templates include base, elementui, naiveui and pro', () => {
  const uiNames = getAvailableUIs().map(item => item.value).sort()

  assert.deepEqual(uiNames, ['base', 'elementui', 'naiveui', 'pro'])
})

test('pro template keeps router versions aligned with published packages', async () => {
  const projectDir = await createTempProject('pro')
  const pkg = await fs.readJson(path.join(projectDir, 'package.json'))
  const mainTs = await fs.readFile(path.join(projectDir, 'main.ts'), 'utf8')

  assert.equal(pkg.dependencies.vue, '^3.5.31')
  assert.equal(pkg.dependencies['vue-router'], '^5.0.4')
  assert.equal(pkg.dependencies['naive-ui'], '^2.44.1')
  assert.ok(await fs.pathExists(path.join(projectDir, 'main.ts')))
  assert.equal(await fs.pathExists(path.join(projectDir, 'uno.config.ts')), false)
  assert.match(mainTs, /const app = createApp\(DuxApp\)/)
  assert.match(mainTs, /app\.use\(createDux\(config\)\)/)
  assert.match(mainTs, /app\.use\(NaiveUI\)/)
  assert.match(mainTs, /app\.use\(createDuxPro\(\)\)/)
  assert.match(mainTs, /'@duxweb\/dvha-pro': DuxPro/)
})

test('naiveui template injects plugin registration before createDux', async () => {
  const projectDir = await createTempProject('naiveui')
  const mainTs = await fs.readFile(path.join(projectDir, 'main.ts'), 'utf8')

  const importIndex = mainTs.indexOf(`import naive from 'naive-ui'`)
  const useIndex = mainTs.indexOf('app.use(naive)')
  const duxIndex = mainTs.indexOf('app.use(createDux(config))')

  assert.notEqual(importIndex, -1)
  assert.notEqual(useIndex, -1)
  assert.notEqual(duxIndex, -1)
  assert.ok(useIndex < duxIndex)
})

import { spawn } from 'node:child_process'
import process from 'node:process'
import { getPackages } from '@manypkg/get-packages'

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code)
      }
      else {
        reject(new Error(`命令失败，退出码: ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

function runCommandSilent(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      }
      else {
        reject(new Error(`命令失败，退出码: ${code}\n${stderr}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

// 获取changeset状态
async function getChangesetStatus() {
  try {
    const output = await runCommandSilent('npx', ['changeset', 'status', '--output=json'])
    return JSON.parse(output)
  }
  catch {
    console.warn('⚠️  无法获取changeset状态，将构建所有包')
    return null
  }
}

// 获取包构建脚本映射
function getBuildScriptMapping() {
  return {
    '@duxweb/dvha-core': 'core:build',
    '@duxweb/dvha-naiveui': 'naiveui:build',
    '@duxweb/dvha-elementui': 'elementui:build',
    '@duxweb/dvha-pro': 'pro:build',
  }
}

// 使用第三方库分析包依赖并构建
async function buildChangedPackages() {
  console.log('📊 分析changeset状态...')
  const changesetStatus = await getChangesetStatus()

  if (!changesetStatus || !changesetStatus.releases) {
    // 构建所有包
    console.log('🔨 构建所有包...')
    const buildScripts = Object.values(getBuildScriptMapping())
    for (const script of buildScripts) {
      await runCommand('pnpm', ['run', script])
    }
    return
  }

  const changedPackages = changesetStatus.releases
    .filter(release => release.type !== 'none')
    .map(release => release.name)

  if (changedPackages.length === 0) {
    console.log('ℹ️  没有待发布的包')
    return
  }

  console.log(`📦 待发布的包: ${changedPackages.join(', ')}`)

  // 获取所有包信息
  const { packages } = await getPackages(process.cwd())
  const buildScriptMapping = getBuildScriptMapping()

  // 构建依赖图
  const packageMap = new Map()
  packages.forEach((pkg) => {
    packageMap.set(pkg.packageJson.name, pkg)
  })

  // 获取需要构建的包（包括依赖）
  const toBuild = new Set()

  function addPackageAndDeps(pkgName) {
    if (toBuild.has(pkgName) || !packageMap.has(pkgName))
      return

    toBuild.add(pkgName)
    const pkg = packageMap.get(pkgName)

    // 添加workspace依赖
    const deps = {
      ...pkg.packageJson.dependencies,
      ...pkg.packageJson.peerDependencies,
    }

    for (const [depName, depVersion] of Object.entries(deps || {})) {
      if (depVersion?.startsWith('workspace:') && packageMap.has(depName)) {
        addPackageAndDeps(depName)
      }
    }
  }

  // 添加所有待发布的包及其依赖
  changedPackages.forEach(addPackageAndDeps)

  // 按依赖顺序排序（简单的拓扑排序）
  const sorted = []
  const visited = new Set()

  function visit(pkgName) {
    if (visited.has(pkgName) || !toBuild.has(pkgName))
      return
    visited.add(pkgName)

    const pkg = packageMap.get(pkgName)
    const deps = {
      ...pkg.packageJson.dependencies,
      ...pkg.packageJson.peerDependencies,
    }

    // 先访问依赖
    for (const [depName, depVersion] of Object.entries(deps || {})) {
      if (depVersion?.startsWith('workspace:') && toBuild.has(depName)) {
        visit(depName)
      }
    }

    sorted.push(pkgName)
  }

  Array.from(toBuild).forEach(visit)

  console.log(`🔨 需要构建的包: ${sorted.join(', ')}`)

  // 构建包
  for (const pkgName of sorted) {
    const buildScript = buildScriptMapping[pkgName]
    if (buildScript) {
      console.log(`构建 ${pkgName}...`)
      await runCommand('pnpm', ['run', buildScript])
    }
  }
}

async function publish() {
  let needRestore = false

  try {
    console.log('🚀 开始发布...')

    // 检查依赖版本一致性
    console.log('🔍 检查依赖版本一致性...')
    try {
      await runCommand('npx', ['manypkg', 'check'])
    }
    catch {
      console.log('🔧 发现版本不一致，自动修复...')
      await runCommand('npx', ['manypkg', 'fix'])
    }

    // 智能构建
    await buildChangedPackages()

    // 修复 workspace 依赖
    console.log('📝 修复依赖...')
    await runCommand('node', ['scripts/package.js'])
    needRestore = true

    // 执行 changeset publish
    console.log('📦 发布到 npm...')
    await runCommand('changeset', ['publish'])

    console.log('✅ 发布成功！')
  }
  catch (error) {
    console.error('❌ 发布失败:', error.message)
    process.exitCode = 1
  }
  finally {
    // 恢复 workspace 依赖
    if (needRestore) {
      try {
        console.log('🔄 恢复依赖...')
        await runCommand('node', ['scripts/package.js', 'restore'])
        console.log('✅ 完成')
      }
      catch (restoreError) {
        console.error('❌ 恢复失败:', restoreError.message)
        process.exitCode = 1
      }
    }
  }
}

publish()

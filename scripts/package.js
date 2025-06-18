import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取所有包的目录
const packagesDir = path.join(__dirname, '../packages')
const packages = fs.readdirSync(packagesDir).filter(dir =>
  fs.statSync(path.join(packagesDir, dir)).isDirectory(),
)

// 检查命令行参数
const action = process.argv[2] // 'fix' 或 'restore'

if (action === 'restore') {
  for (const pkg of packages) {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json')
    const backupPath = path.join(packagesDir, pkg, 'package.json.backup')

    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, packageJsonPath)
      fs.unlinkSync(backupPath)
    }
  }
  process.exit(0)
}

// 默认为 fix 操作
for (const pkg of packages) {
  const packageJsonPath = path.join(packagesDir, pkg, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    continue
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  let modified = false

  // 备份原文件
  const backupPath = path.join(packagesDir, pkg, 'package.json.backup')
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(packageJsonPath, backupPath)
  }

  // 修复 dependencies
  if (packageJson.dependencies) {
    for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
      if (depVersion.startsWith('workspace:')) {
        // 获取依赖包的实际版本
        const depPackageJsonPath = path.join(packagesDir, depName.replace('@duxweb/dvha-', ''), 'package.json')

        if (fs.existsSync(depPackageJsonPath)) {
          const depPackageJson = JSON.parse(fs.readFileSync(depPackageJsonPath, 'utf8'))
          packageJson.dependencies[depName] = `^${depPackageJson.version}`
          modified = true
        }
      }
    }
  }

  // 修复 peerDependencies
  if (packageJson.peerDependencies) {
    for (const [depName, depVersion] of Object.entries(packageJson.peerDependencies)) {
      if (depVersion.startsWith('workspace:')) {
        const depPackageJsonPath = path.join(packagesDir, depName.replace('@duxweb/dvha-', ''), 'package.json')

        if (fs.existsSync(depPackageJsonPath)) {
          const depPackageJson = JSON.parse(fs.readFileSync(depPackageJsonPath, 'utf8'))
          packageJson.peerDependencies[depName] = `^${depPackageJson.version}`
          modified = true
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
  }
}

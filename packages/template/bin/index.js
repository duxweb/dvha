#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { confirm, input, select } from '@inquirer/prompts'
import { Command } from 'commander'
import fs from 'fs-extra'
import { bold, cyan, green, red, yellow } from 'kolorist'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 获取版本号
function getVersion() {
  const packagePath = path.resolve(__dirname, '..', 'package.json')
  if (fs.existsSync(packagePath)) {
    const pkg = fs.readJsonSync(packagePath)
    return pkg.version
  }
  return '1.0.0'
}

async function createProject(projectName) {
  console.log()
  console.log(bold(cyan('欢迎使用 DVHA 项目创建工具！ / Welcome to DVHA Project Creator!')))
  console.log()

  let targetDir = projectName

  if (!targetDir) {
    targetDir = await input({
      message: '请输入项目名称 / Enter project name:',
      default: 'my-dvha-app',
    })
  }

  if (!targetDir) {
    console.log(red('✖ 项目名称不能为空 / Project name cannot be empty'))
    process.exit(1)
  }

  const root = path.resolve(targetDir)

  if (fs.existsSync(root)) {
    const overwrite = await confirm({
      message: `目录 ${targetDir} 已存在，是否覆盖？ / Directory ${targetDir} already exists, overwrite?`,
      default: false,
    })

    if (!overwrite) {
      console.log(yellow('✖ 操作已取消 / Operation cancelled'))
      process.exit(1)
    }

    fs.emptyDirSync(root)
  }

  // 读取可用的UI配置
  const uiConfigsDir = path.resolve(__dirname, '..', 'template', 'ui-configs')
  const availableUIs = fs.readdirSync(uiConfigsDir)
    .filter(dir => fs.statSync(path.join(uiConfigsDir, dir)).isDirectory())
    .map((dir) => {
      const configPath = path.join(uiConfigsDir, `${dir}.json`)
      if (fs.existsSync(configPath)) {
        const config = fs.readJsonSync(configPath)
        return {
          name: config.name,
          display: config.display,
          description: config.description,
          value: config.name,
        }
      }
      return null
    })
    .filter(Boolean)

  const template = await select({
    message: '请选择一个模板 / Please select a template:',
    choices: availableUIs.map(ui => ({
      name: `${ui.display} - ${ui.description}`,
      value: ui.value,
      description: ui.description,
    })),
  })

  if (!template) {
    console.log(red('✖ 请选择一个模板 / Please select a template'))
    process.exit(1)
  }

  console.log(yellow(`\n正在创建项目 / Creating project: ${targetDir}...`))

  // 基础模板目录
  const baseTemplateDir = path.resolve(__dirname, '..', 'template', 'base')
  const uiConfigPath = path.resolve(__dirname, '..', 'template', 'ui-configs', `${template}.json`)
  const uiPagesDir = path.resolve(__dirname, '..', 'template', 'ui-configs', template, 'pages')

  if (!fs.existsSync(baseTemplateDir)) {
    console.log(red(`✖ 基础模板不存在 / Base template does not exist`))
    process.exit(1)
  }

  if (!fs.existsSync(uiConfigPath)) {
    console.log(red(`✖ UI配置 ${template} 不存在 / UI config ${template} does not exist`))
    process.exit(1)
  }

  // 读取UI配置
  const uiConfig = fs.readJsonSync(uiConfigPath)

  // 创建目录
  fs.ensureDirSync(root)

  // 1. 复制基础模板文件
  fs.copySync(baseTemplateDir, root, {
    filter: (src) => {
      const relativePath = path.relative(baseTemplateDir, src)
      const fileName = path.basename(src)

      // 过滤掉不需要的目录和文件
      const shouldExclude
        = relativePath.includes('node_modules')
          || relativePath.includes('.git')
          || relativePath.includes('dist')
          || relativePath.includes('.vite')
          || fileName === '.DS_Store'
          || fileName.endsWith('.log')
          || fileName === 'bun.lockb'
          || fileName === 'package-lock.json'
          || fileName === 'yarn.lock'

      return !shouldExclude
    },
  })

  // 2. 复制UI特定的pages文件
  if (fs.existsSync(uiPagesDir)) {
    const targetPagesDir = path.join(root, 'pages')
    fs.emptyDirSync(targetPagesDir)
    fs.copySync(uiPagesDir, targetPagesDir)
  }

  // 2.5. 检查并复制UI特定的配置文件（如果存在）
  const uiConfigDir = path.resolve(__dirname, '..', 'template', 'ui-configs', template)

  // 复制 main.ts
  const uiMainTsPath = path.join(uiConfigDir, 'main.ts')
  if (fs.existsSync(uiMainTsPath)) {
    const targetMainTsPath = path.join(root, 'main.ts')
    fs.copySync(uiMainTsPath, targetMainTsPath)
  }

  // 复制 vite.config.ts
  const uiViteConfigPath = path.join(uiConfigDir, 'vite.config.ts')
  if (fs.existsSync(uiViteConfigPath)) {
    const targetViteConfigPath = path.join(root, 'vite.config.ts')
    fs.copySync(uiViteConfigPath, targetViteConfigPath)
  }

  // 对于 pro 模板，删除 uno.config.ts（因为不需要 UnoCSS）
  if (template === 'pro') {
    const targetUnoConfigPath = path.join(root, 'uno.config.ts')
    if (fs.existsSync(targetUnoConfigPath)) {
      fs.removeSync(targetUnoConfigPath)
    }
  }

  // 3. 更新package.json
  const pkgPath = path.join(root, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath)

    // 更新项目名称
    pkg.name = path.basename(root)

    // 更新依赖
    pkg.dependencies = {
      ...pkg.dependencies,
      ...uiConfig.dependencies,
    }

    if (uiConfig.devDependencies && Object.keys(uiConfig.devDependencies).length > 0) {
      pkg.devDependencies = {
        ...pkg.devDependencies,
        ...uiConfig.devDependencies,
      }
    }

    // 移除排除的依赖
    if (uiConfig.excludeDependencies && Array.isArray(uiConfig.excludeDependencies)) {
      uiConfig.excludeDependencies.forEach((dep) => {
        if (pkg.dependencies && pkg.dependencies[dep]) {
          delete pkg.dependencies[dep]
        }
        if (pkg.devDependencies && pkg.devDependencies[dep]) {
          delete pkg.devDependencies[dep]
        }
      })
    }

    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 })
  }

  // 4. 更新main.ts（仅当UI配置没有自定义main.ts时）
  const mainTsPath = path.join(root, 'main.ts')

  // 如果UI配置有自定义main.ts，跳过修改；否则修改基础main.ts
  if (!fs.existsSync(uiMainTsPath) && fs.existsSync(mainTsPath)) {
    let mainTsContent = fs.readFileSync(mainTsPath, 'utf-8')

    // 在导入语句后添加UI库的导入
    const importStatements = uiConfig.imports || []
    const appUseStatements = uiConfig.appUse || []

    // 找到现有导入的位置
    const appImportIndex = mainTsContent.indexOf('import App from \'./App.vue\'')
    if (appImportIndex !== -1) {
      const insertPosition = mainTsContent.indexOf('\n', appImportIndex) + 1
      const additionalImports = importStatements.join('\n') + (importStatements.length > 0 ? '\n' : '')
      mainTsContent = mainTsContent.slice(0, insertPosition) + additionalImports + mainTsContent.slice(insertPosition)
    }

    // 在app.use(createDux(config))之前添加UI库的使用
    if (appUseStatements.length > 0) {
      const appUseIndex = mainTsContent.indexOf('app.use(createDux(config))')
      if (appUseIndex !== -1) {
        const additionalUse = `${appUseStatements.join('\n')}\n`
        mainTsContent = mainTsContent.slice(0, appUseIndex) + additionalUse + mainTsContent.slice(appUseIndex)
      }
    }

    fs.writeFileSync(mainTsPath, mainTsContent)
  }

  console.log(green('\n✓ 项目创建成功！ / Project created successfully!'))
  console.log()
  console.log(bold('下一步 / Next steps:'))
  console.log(cyan(`  cd ${targetDir}`))
  console.log(cyan('  bun install'))
  console.log(cyan('  bun run dev'))
  console.log()
  console.log(bold('或者使用 npm / Or use npm:'))
  console.log(cyan(`  cd ${targetDir}`))
  console.log(cyan('  npm install'))
  console.log(cyan('  npm run dev'))
  console.log()
  console.log(green('🎉 开始你的 Dux Vue 之旅吧！ / Start your Dux Vue journey!'))
}

// 主程序
const program = new Command()

program
  .name('duxweb-dvha')
  .description('DVHA 项目创建工具 / DVHA Project Creator')
  .version(getVersion())

program
  .command('init')
  .description('创建新项目 / Create a new project')
  .argument('[project-name]', '项目名称 / Project name')
  .alias('create')
  .action(async (projectName) => {
    try {
      await createProject(projectName)
    }
    catch (error) {
      if (error.name === 'ExitPromptError') {
        console.log(yellow('\n👋 操作已取消 / Operation cancelled'))
        process.exit(0)
      }
      console.error(red('创建项目时出错 / Error creating project:'), error)
      process.exit(1)
    }
  })

// 添加默认行为 - 当没有命令时显示友好提示
program
  .action(() => {
    console.log()
    console.log(bold(cyan('👋 欢迎使用 DVHA 项目创建工具！ / Welcome to DVHA Project Creator!')))
    console.log()
    console.log('使用以下命令开始创建项目 / Use the following command to start creating a project:')
    console.log()
    console.log(green('  duxweb-dvha init [project-name]'))
    console.log()
    console.log('更多信息请使用 / For more information, use:', cyan('duxweb-dvha --help'))
    console.log()
  })

program.parse()

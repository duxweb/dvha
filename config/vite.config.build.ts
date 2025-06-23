import type { UserConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

interface SharedConfigOptions {
  /** 包的根目录路径 */
  packageDir: string
  /** 入口文件路径，相对于包根目录 */
  entry?: string
  /** CSS 入口文件路径，相对于包根目录 */
  cssEntry?: string
  /** 额外的外部依赖 */
  additionalExternal?: string[]
  /** 额外的 vite 插件 */
  additionalPlugins?: any[]
}

/**
 * 创建共享的 vite 配置
 */
export function createSharedViteConfig(options: SharedConfigOptions): UserConfig {
  const {
    packageDir,
    entry = 'src/index.ts',
    additionalExternal = [],
    additionalPlugins = [],
  } = options

  const pkgPath = path.resolve(packageDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...additionalExternal,
  ]

  const isExternal = (id: string) => {
    if (id.startsWith('.') || id.startsWith('/') || id.includes('\\')) {
      return false
    }

    if (external.some(ext => id === ext || id.startsWith(`${ext}/`))) {
      return true
    }

    return true
  }

  const entryPath = path.resolve(packageDir, entry)

  return {
    plugins: [
      vue(),
      vueJsx(),
      ...additionalPlugins,
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      lib: {
        entry: entryPath,
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: isExternal,
        output: [
          {
            format: 'es',
            dir: 'dist/esm',
            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: 'src',
            exports: 'named',
          },
          {
            format: 'cjs',
            dir: 'dist/cjs',
            entryFileNames: '[name].cjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
            exports: 'named',
          },
        ],
      },
    },
  }
}

/**
 * 为包创建 vite 配置的便捷函数
 * @param packageDir 包的目录路径，通常传入 __dirname
 */
export function definePackageConfig(packageDir: string, options: Omit<SharedConfigOptions, 'packageDir'> = {}) {
  return defineConfig(createSharedViteConfig({
    packageDir,
    ...options,
  }))
}

import type { Options, Resource } from 'vue3-sfc-loader'
import * as vueQuery from '@tanstack/vue-query'
import * as vueUse from '@vueuse/core'
import axios from 'axios'
import crypto from 'crypto-js'
import dayjs from 'dayjs'
import * as _ from 'lodash-es'
import * as marked from 'marked'
import * as math from 'mathjs'
import mime from 'mime'
import mitt from 'mitt'
import * as pinia from 'pinia'
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'
import * as vueRouter from 'vue-router'
import { useManage } from '../../../hooks'
import * as index from '../../../index'

const styleCache = new Map<string, boolean>()

function hashString(str: string): string {
  return crypto.MD5(str).toString().substring(0, 10)
}

export function sfcLoader(path: string) {
  const client = index.useClient()
  const { mutate: handleError } = index.useError()
  const { mergeLocale } = index.useI18n()

  const { config } = useManage()

  const options: Options = {
    moduleCache: {
      'vue': Vue,
      '@duxweb/dvha-core': index,
      '@vueuse/core': vueUse,
      '@tanstack/vue-query': vueQuery,
      'axios': axios,
      'crypto-js': crypto,
      'mime': mime,
      'math': math,
      'mitt': mitt,
      'lodash-es': _,
      'pinia': pinia,
      'dayjs': dayjs,
      'vue-router': vueRouter,
      'marked': marked,
      ...config?.remote?.packages,

      'static!': function (content: string, _path: string, type: string) {
        const name = mime.getType(type)
        if (name?.startsWith('image')) {
          return `data:${name};charset=utf-8;base64,${btoa(content)}`
        }
        if (type === '.json') {
          return JSON.parse(content)
        }
        throw new Error(`${type} unable to parse`)
      },
    },
    async handleModule(type: string, getContentData: () => any) {
      if (type === '.vue') {
        return undefined
      }
      if (type === '.json') {
        const contentData = await getContentData()

        const { render: JsonRender } = index.useJsonSchema({
          data: contentData?.nodes || {},
          context: contentData?.data || {},
        })

        return () => <JsonRender />
      }
      if (type === '.mjs') {
        return undefined
      }
      return getContentData()
    },
    customBlockHandler(block) {
      if (block.type === 'i18n') {
        const messages = JSON.parse(block.content)
        for (const locale in messages) {
          mergeLocale(locale, messages[locale])
        }
      }
    },
    getFile: async (url) => {
      url = removeSuffix(url, '.vue')
      url = removeSuffix(url, '.json')

      const res = await client.request({
        path: typeof config?.remote?.apiRoutePath === 'function' ? config?.remote?.apiRoutePath(url) : config?.remote?.apiRoutePath || `static`,
        payload: {
          path: url,
        },
        method: config?.remote?.apiMethod || 'POST',
      }).then((res) => {
        return res?.data
      }).catch((err) => {
        handleError(err)
      })

      if (!res) {
        return
      }

      let fileType = res?.type || '.vue'

      if (res?.type?.endsWith('js') || res?.type?.endsWith('ts') || res?.type?.endsWith('jsx') || res?.type?.endsWith('tsx')) {
        fileType = '.mjs'
      }

      return {
        content: res?.content,
        type: fileType,
      }
    },
    getResource({ refPath, relPath }, options: Options): Resource {
      const { moduleCache, pathResolve, getFile } = options

      const [resourceRelPath, ...loaders] = relPath.match(/([^!]+!)|[^!]+$/g).reverse()

      const processContentThroughLoaders = (content, path, type, options) => {
        return loaders.reduce((content, loader) => {
          return moduleCache[loader](content, path, type, options)
        }, content)
      }

      const path = pathResolve({ refPath, relPath: resourceRelPath }, options)
      const id = loaders.join('') + path

      const isPackage = (p: string) => {
        if (p.startsWith('@'))
          return true
        return !p.includes('/') && !p.startsWith('.')
      }

      return {
        id,
        path,
        async getContent() {
          if (isPackage(path)) {
            throw new Error(`Package ${path} not imported`)
          }

          const file = await getFile(path)

          const { content, type } = file || {}

          return {
            getContentData: async (_asBinary: boolean) => processContentThroughLoaders(content, path, type, options),
            type,
          }
        },
      }
    },
    addStyle(textContent) {
      const hash = hashString(textContent)

      if (styleCache.has(hash)) {
        return
      }

      styleCache.set(hash, true)

      const style = document.createElement('style')
      style.textContent = textContent
      style.setAttribute('data-hash', hash)

      document.head.appendChild(style)
    },
  }

  return () => loadModule(`${path}`, { ...options })
}

function removeSuffix(url: string, suffix: string) {
  const regex = new RegExp(`${suffix}$`)
  return url.replace(regex, '')
}

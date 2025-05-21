import type { IConfig } from '../types'
import { inject } from 'vue'

/**
 * Config
 * get global config
 * @returns Config
 */
export function useConfig(): IConfig {
  const config = inject<IConfig>('dux.config')
  if (!config) {
    throw new Error('config is not defined')
  }
  return config
}

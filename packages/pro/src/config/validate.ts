import { localize } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'
import zh from '@vee-validate/i18n/dist/locale/zh_CN.json'
import { configure } from 'vee-validate'

export function initVeeValidate() {
  configure({
    generateMessage: localize({
      'en-US': en,
      'zh-CN': zh,
    }),
  })
}

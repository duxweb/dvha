import type { FormInst } from 'naive-ui'
import { DuxLogo, useI18n, useLogin, useManage, useTheme } from '@duxweb/dvha-core'
import clsx from 'clsx'
import { NButton, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { defineComponent, reactive, ref } from 'vue'
import { DuxDrawApps } from '../components'

export const DuxLoginPage = defineComponent({
  name: 'DuxLoginPage',
  setup(_props, { slots }) {
    const themeStore = useTheme()
    const manage = useManage()
    const { t } = useI18n()

    const formRef = ref<FormInst | null>()
    const message = useMessage()

    const form = reactive({
      username: '',
      password: '',
    })

    const { mutate, isLoading } = useLogin({
      onSuccess: () => {
        message.success(t('pages.login.success') as string)
      },
      onError: (error) => {
        message.error(error?.message || t('pages.login.error') as string)
      },
    })

    const submit = () => {
      mutate(form)
    }

    return () => (
      <div
        un-cloak
        class={clsx([
          'h-screen w-screen flex items-start justify-center text-secondary md:items-center',
          themeStore.isDark.value ? 'app-login-dark-bg' : 'app-login-bg',
        ])}
      >
        <div class="relative md:m-4 max-w-180 w-full h-full md:h-auto grid-cols-1 md:grid-cols-2 gap-12 overflow-hidden md:rounded-lg p-8 md:shadow bg-default dark:bg-muted grid">
          <div
            class="flex justify-center tex absolute h-30 w-30 rotate-45 cursor-pointer items-end p-3 text-white bg-primary -right-15 -top-15 hover:bg-primary-hover"
            onClick={() => themeStore.toggle()}
          >
            {themeStore.mode.value === 'auto' && <div class="i-tabler:brightness-half h-5 w-5" />}
            {themeStore.mode.value === 'light' && <div class="h-5 w-5 i-tabler:sun" />}
            {themeStore.mode.value === 'dark' && <div class="h-5 w-5 i-tabler:moon" />}
          </div>
          <div class="justify-center hidden md:flex flex-row items-center">
            {manage.config.theme?.banner ? <img class="w-full h-auto" src={manage.config.theme?.banner} /> : <div class="w-full h-auto"><DuxDrawApps /></div>}
          </div>
          <div class="flex flex-col">
            <div class="flex flex-col items-center justify-center mt-4">
              <div>
                {manage.config.theme?.logo ? <img class="w-auto h-16" src={manage.config.theme?.logo} /> : <div class="h-10"><DuxLogo /></div>}
              </div>
              <div class="mt-4 text-lg text-muted">
                {manage.config.title || 'Dux Admin Manage'}
              </div>
            </div>
            <div class="my-6">
              <NForm ref={formRef} model={form} class="flex flex-col gap-4">
                <NFormItem showLabel={false} path="username" showFeedback={false}>
                  <NInput value={form.username} onUpdateValue={v => form.username = v} type="text" placeholder={t('pages.login.placeholder.username')} size="large">
                    {{
                      default: () => <div class="text-lg i-tabler:user" />,
                    }}
                  </NInput>
                </NFormItem>
                <NFormItem showLabel={false} path="password" showFeedback={false}>
                  <NInput value={form.password} onUpdateValue={v => form.password = v} type="password" showPasswordOn="mousedown" placeholder={t('pages.login.placeholder.password')} size="large" inputProps={{ autocomplete: 'new-password' }}>
                    {{
                      default: () => <div class="text-lg i-tabler:lock" />,
                    }}
                  </NInput>
                </NFormItem>

                {slots.default?.(form)}

                <div class="mb-2 mt-4">
                  <NButton type="primary" size="large" block loading={isLoading.value} onClick={submit}>
                    {t('pages.login.buttons.login')}
                  </NButton>
                </div>
              </NForm>
            </div>
            <div class="text-center text-sm text-gray-5">
              {manage.config?.copyright || 'All rights reserved © duxweb 2024'}
            </div>
          </div>
        </div>
      </div>
    )
  },
})

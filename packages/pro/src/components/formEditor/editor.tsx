import type { PageEditorComponent, PageEditorGroup, UseEditorResult } from '../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { NButton } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { useModal } from '../../hooks'
import { DuxDesignEditor } from '../designEditor'
import { DuxFormLayout } from '../form/formLayout'
import { DuxFormEditorSettingPage } from './base'
import {
  duxFormEditorAIEditor,
  duxFormEditorCascader,
  duxFormEditorCascaderAsync,
  duxFormEditorCheckbox,
  duxFormEditorColor,
  duxFormEditorDate,
  duxFormEditorDynamicInput,
  duxFormEditorDynamicTags,
  duxFormEditorFileUpload,
  duxFormEditorImageUpload,
  duxFormEditorInput,
  duxFormEditorInputNumber,
  duxFormEditorMentionAsync,
  duxFormEditorRadio,
  duxFormEditorRegion,
  duxFormEditorSelect,
  duxFormEditorSelectAsync,
  duxFormEditorSider,
  duxFormEditorSwitch,
  duxFormEditorTime,
  duxFormEditorTransferAsync,
  duxFormEditorTreeSelect,
  duxFormEditorTreeSelectAsync,
} from './components'

export const DuxFormEditor = defineComponent({
  name: 'DuxFormEditor',
  props: {
    onSave: Function,
  },
  extends: DuxDesignEditor,
  setup(props) {
    const { t } = useI18n()
    const modal = useModal()
    const groups = computed<PageEditorGroup[]>(() => {
      return [
        {
          name: 'form',
          label: t('components.formEditor.groups.form'),
          icon: 'i-tabler:forms',
        },
        {
          name: 'select',
          label: t('components.formEditor.groups.select'),
          icon: 'i-tabler:select',
        },
        {
          name: 'async',
          label: t('components.formEditor.groups.async'),
          icon: 'i-tabler:loader',
        },
      ] as PageEditorGroup[]
    })

    const components = computed<PageEditorComponent[]>(() => {
      const list = [
        duxFormEditorInput(t),
        duxFormEditorInputNumber(t),
        duxFormEditorAIEditor(t),
        duxFormEditorSider(t),
        duxFormEditorDate(t),
        duxFormEditorTime(t),
        duxFormEditorColor(t),
        duxFormEditorCheckbox(t),
        duxFormEditorRadio(t),
        duxFormEditorSwitch(t),
        duxFormEditorDynamicInput(t),
        duxFormEditorDynamicTags(t),
        duxFormEditorImageUpload(t),
        duxFormEditorFileUpload(t),
        duxFormEditorSelect(t),
        duxFormEditorCascader(t),
        duxFormEditorTreeSelect(t),
        duxFormEditorRegion(t),
        duxFormEditorSelectAsync(t),
        duxFormEditorCascaderAsync(t),
        duxFormEditorTreeSelectAsync(t),
        duxFormEditorTransferAsync(t),
        duxFormEditorMentionAsync(t),
      ]

      const descriptions: Record<string, string | undefined> = {
        'dux-input': t('components.formEditor.toolbarDescriptions.input'),
        'dux-input-number': t('components.formEditor.toolbarDescriptions.inputNumber'),
        'dux-editor': t('components.formEditor.toolbarDescriptions.aiEditor'),
        'sider': t('components.formEditor.toolbarDescriptions.slider'),
        'dux-date': t('components.formEditor.toolbarDescriptions.date'),
        'dux-time': t('components.formEditor.toolbarDescriptions.time'),
        'dux-color': t('components.formEditor.toolbarDescriptions.color'),
        'dux-checkbox': t('components.formEditor.toolbarDescriptions.checkbox'),
        'dux-radio': t('components.formEditor.toolbarDescriptions.radio'),
        'dux-switch': t('components.formEditor.toolbarDescriptions.switch'),
        'dux-dynamic-input': t('components.formEditor.toolbarDescriptions.dynamicInput'),
        'dynamic-tags': t('components.formEditor.toolbarDescriptions.dynamicTags'),
        'dux-image-upload': t('components.formEditor.toolbarDescriptions.imageUpload'),
        'dux-file-upload': t('components.formEditor.toolbarDescriptions.fileUpload'),
        'dux-select': t('components.formEditor.toolbarDescriptions.select'),
        'dux-cascader': t('components.formEditor.toolbarDescriptions.cascader'),
        'tree-select': t('components.formEditor.toolbarDescriptions.treeSelect'),
        'region': t('components.formEditor.toolbarDescriptions.region'),
        'select-async': t('components.formEditor.toolbarDescriptions.selectAsync'),
        'dux-cascader-async': t('components.formEditor.toolbarDescriptions.cascaderAsync'),
        'tree-select-async': t('components.formEditor.toolbarDescriptions.treeSelectAsync'),
        'transfer-async': t('components.formEditor.toolbarDescriptions.transferAsync'),
        'mention-async': t('components.formEditor.toolbarDescriptions.mentionAsync'),
      }

      return list.map(item => ({
        ...item,
        description: item.description || descriptions[item.name] || '',
      }))
    })

    return () => (
      <DuxDesignEditor
        {...props}
        groups={groups.value}
        components={components.value}
        settingPage={{
          component: params => <DuxFormEditorSettingPage {...params} />,
          default: {
            labelPlacement: 'left',
          },
        }}
        previewWrapper={(preview, editor) => {
          const config = computed(() => {
            return editor?.value?.value?.config
          })
          return <DuxFormLayout labelPlacement={config.value?.labelPlacement || 'left'} class="h-full">{preview}</DuxFormLayout>
        }}
        actionRender={(edit?: UseEditorResult) => {
          return (
            <div class="flex flex-col gap-2">
              <NButton
                type="primary"
                secondary
                block
                onClick={() => {
                  modal.show({
                    title: t('components.formEditor.main.actions.jsonOutput'),
                    component: () => import('./json'),
                    componentProps: {
                      value: edit?.value?.value.data || [],
                    },
                  })
                }}
              >
                {t('components.formEditor.main.actions.jsonOutput')}
              </NButton>
              <NButton
                type="info"
                secondary
                block
                onClick={() => {
                  modal.show({
                    title: t('common.preview'),
                    component: () => import('./preview'),
                    componentProps: {
                      data: edit?.value?.value.data || [],
                      config: edit?.value?.value.config || {},
                    },
                  })
                }}
              >
                {t('common.preview')}
              </NButton>
              <NButton
                type="primary"
                block
                onClick={() => {
                  props.onSave?.(edit?.value?.value || {})
                }}
              >
                {t('components.formEditor.main.actions.save')}
              </NButton>
            </div>
          )
        }}

      />
    )
  },
})

import type { PropType, VNode } from 'vue'
import type { PageEditorComponent, PageEditorGroup, PageEditorSettingPage, UseEditorResult, UseEditorValue } from './editor/hook'
import { useI18n } from '@duxweb/dvha-core'

import clsx from 'clsx'
import { cloneDeep } from 'lodash-es'
import { NScrollbar } from 'naive-ui'
import ShortUniqueId from 'short-unique-id'
import { defineComponent, provide, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { DuxCard } from '../card'
import { duxFormEditorGrid } from './components/grid'
import { useEditor } from './editor/hook'
import { DuxWidgetEditorPreview } from './editor/preview'
import { WidgetEditorSetting } from './editor/setting'

export const DuxDesignEditor = defineComponent({
  name: 'DuxDesignEditor',
  props: {
    data: Object as PropType<UseEditorValue | undefined>,
    onUpdateData: Function as PropType<(data: UseEditorValue) => void>,
    groups: Array as PropType<PageEditorGroup[]>,
    components: Array as PropType<PageEditorComponent[]>,
    settingPage: Object as PropType<PageEditorSettingPage>,
    actionRender: Function as PropType<(editor?: UseEditorResult) => VNode>,
    previewWrapper: Function as PropType<(preview: VNode, editor?: UseEditorResult) => VNode>,
  },
  setup(props) {
    const { t } = useI18n()

    const editor = useEditor({ settingPage: props.settingPage })
    provide('editor.use', editor)

    // 注册分组与组件
    watch([() => props.components, () => props.groups], () => {
      editor.clearGroup()
      editor.clearComponent()

      // 注册默认分组
      editor.addGroup({
        name: 'layout',
        label: t('components.designEditor.layout') || 'Layout',
        icon: 'i-tabler:layout',
      })

      props.groups?.forEach((group) => {
        editor.addGroup(group)
      })

      editor.addComponent(duxFormEditorGrid(t))

      props.components?.forEach((component) => {
        editor.addComponent(component)
      })
    }, { immediate: true, deep: true })

    // 选中分组
    const groupSelect = ref<string>()

    // 复制组件
    const { randomUUID } = new ShortUniqueId({ length: 10 })
    const compDragClone = (element) => {
      return {
        key: randomUUID(),
        name: element.name,
        options: cloneDeep(element.settingDefault),
      } as any
    }

    watch(() => props.data, (v) => {
      const defaultConfig = props.settingPage?.default || {}
      editor.value.value = {
        config: { ...defaultConfig, ...cloneDeep(v?.config || {}) },
        data: cloneDeep(v?.data || []),
      }
    }, { deep: true, immediate: true })

    watch(() => editor.value.value, (newValue) => {
      if (newValue !== props.data) {
        props.onUpdateData?.(newValue)
      }
    }, { deep: true })

    return () => (
      <DuxCard class="h-full" shadow>
        <div class="h-full flex flex-row  text-default">
          <div class="flex-none flex flex-col gap-2  border-r border-default bg-default p-2">
            <MainMenuItem
              title={t('components.designEditor.all') || 'All'}
              icon="i-tabler:hexagons"
              active={!groupSelect.value}
              onClick={() => {
                groupSelect.value = undefined
              }}
            />
            {editor.group.value?.map((item, key) => (
              <MainMenuItem
                key={key}
                active={groupSelect.value === item.name}
                title={item.label}
                icon={item.icon}
                onClick={() => {
                  groupSelect.value = item.name
                }}
              />
            ))}
          </div>
          <div class="flex-none text-xs w-180px bg-default" id="comp-list">
            <NScrollbar>
              <div class="flex flex-col gap-4 p-2">
                {editor.tree.value?.filter((group) => {
                  if (groupSelect.value) {
                    return group.name === groupSelect.value
                  }
                  return true
                }).map(group => (
                  <div key={group.name} class="flex flex-col gap-2">
                    <div class="bg-muted border border-muted rounded p-2 flex justify-center">
                      {group.label}
                    </div>
                    <VueDraggable
                      modelValue={group.children || []}
                      animation={150}
                      group={
                        {
                          name: 'widget',
                          pull: 'clone',
                          put: false,
                        }
                      }
                      sort={false}
                      clone={compDragClone}
                      class="grid grid-cols-2 items-start gap-2 "
                    >
                      {group.children?.map(item => (
                        <div key={item.name} class="border border-muted rounded-sm p-2 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted  edit-drag">
                          <div class={clsx([
                            'size-6',
                            item.icon,
                          ])}
                          >
                          </div>
                          <div class="truncate whitespace-nowrap px-2 overflow-hidden">{item.label}</div>
                        </div>
                      ))}
                    </VueDraggable>
                  </div>
                ))}
              </div>
            </NScrollbar>
          </div>
          <div
            class="flex-1 shadow-sm flex flex-col items-center p-6 overflow-auto"
            style="background: linear-gradient(45deg, rgba(0,0,0, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0, 0.1) 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;"
          >

            <div
              class="max-w-2xl w-full flex-1 bg-default shadow p-2"
              onClick={() => {
                editor.selected.value = undefined
              }}
            >
              {props.previewWrapper
                ? props.previewWrapper(<DuxWidgetEditorPreview modelValue={editor.value.value?.data} onUpdate={v => editor.value.value.data = v} />, editor)
                : <DuxWidgetEditorPreview modelValue={editor.value.value?.data} onUpdate={v => editor.value.value.data = v} />}
            </div>
          </div>
          <WidgetEditorSetting actionRender={props.actionRender} />
        </div>
      </DuxCard>
    )
  },
})

interface MainMenuItemProps {
  title: string
  icon: string
  onClick?: () => void
  active?: boolean
}

function MainMenuItem({ title, icon, active, onClick }: MainMenuItemProps) {
  return (
    <div
      class={clsx([
        'flex flex-col items-center px-3 py-2 hover:bg-primary/10 cursor-pointer rounded-sm',
        active ? 'bg-primary/10 text-primary' : '',
      ])}
      onClick={onClick}
    >
      <div class={clsx([
        'size-4',
        icon,
      ])}
      >
      </div>
      <div class="truncate whitespace-nowrap text-default text-sm">{title}</div>
    </div>
  )
}

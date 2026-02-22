import type { PropType, VNode } from 'vue'
import type { PageEditorComponent, PageEditorGroup, PageEditorSettingPage, UseEditorResult, UseEditorValue } from './editor/hook'
import { useI18n } from '@duxweb/dvha-core'

import clsx from 'clsx'
import { cloneDeep } from 'lodash-es'
import { NScrollbar } from 'naive-ui'
import ShortUniqueId from 'short-unique-id'
import { defineComponent, provide, watch } from 'vue'
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

    watch(editor.value, (v) => {
      props.onUpdateData?.(v)
    }, { deep: true })

    const iconColorList = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ]

    return () => (
      <DuxCard class="h-full" shadow>
        <div class="h-full w-full relative text-default bg-muted rounded-md">
          <div class="absolute top-4 left-4 bottom-4 z-10">
            <div class="h-full w-220px bg-default shadow rounded">
              <div class="h-full flex flex-col">
                <NScrollbar class="flex-1 min-h-0">
                  <div class="p-4 space-y-4" id="comp-list">
                    {editor.tree.value
                      ?.filter(group => group.children && group.children.length > 0)
                      .map((group, groupIndex) => (
                        <div key={group.name} class="space-y-2">
                          <div class="flex items-center gap-2 text-sm px-1">
                            <div class={clsx(['size-4', group.icon])} />
                            <span class="truncate">{group.label}</span>
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
                            class="space-y-2"
                          >
                            {group.children?.map((item, itemIndex) => {
                              const colorIndex = (groupIndex * 20 + itemIndex) % iconColorList.length
                              const iconBg = iconColorList[colorIndex]
                              return (
                                <div
                                  key={item.name}
                                  class="rounded-lg px-3 py-2 cursor-move transition-all bg-default dark:bg-muted hover:bg-elevated edit-drag flex items-center gap-3"
                                >
                                  <div class={clsx(['size-8 rounded-lg flex items-center justify-center flex-shrink-0', iconBg])}>
                                    <div class={clsx(['size-4 text-white', item.icon])} />
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <div class="text-sm font-medium truncate">
                                      {item.label}
                                    </div>
                                    {item.description && (
                                      <div class="text-xs truncate opacity-80">
                                        {item.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </VueDraggable>
                        </div>
                      ))}
                    {editor.tree.value?.filter(group => group.children && group.children.length > 0).length === 0 && (
                      <div class="text-xs text-muted text-center py-4">
                        {t('components.designEditor.empty') || 'No components'}
                      </div>
                    )}
                  </div>
                </NScrollbar>
              </div>
            </div>
          </div>

          <div
            class="absolute inset-0 shadow-sm flex flex-col items-center p-6 overflow-auto"
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

          <div class="absolute top-4 right-4 bottom-4 z-10">
            <div class="h-full w-300px bg-default shadow rounded">
              <WidgetEditorSetting actionRender={props.actionRender} />
            </div>
          </div>
        </div>
      </DuxCard>
    )
  },
})

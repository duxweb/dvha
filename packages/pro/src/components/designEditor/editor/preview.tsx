import type { PropType } from 'vue'
import type { PageEditorData, UseEditorResult } from './hook'
import clsx from 'clsx'
import { defineComponent, inject } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

export const DuxWidgetEditorPreview = defineComponent({
  name: 'DuxWidgetEditorPreview',
  props: {
    class: String,
    select: String,
    modelValue: Array as PropType<PageEditorData[]>,
    onUpdate: Function,
    onSelect: Function,
  },
  setup(props) {
    const editor = inject<UseEditorResult>('editor.use')

    return () => (
      <>
        <VueDraggable
          modelValue={props.modelValue || []}
          animation={150}
          group="widget"
          handle=".editor-handle"
          class={props.class
            || clsx([
              'h-full flex flex-col gap-2',
              (!props.modelValue || props.modelValue?.length === 0) ? 'p-2' : '',
            ])}
          {...{
            'onUpdate:modelValue': (v) => {
              props.onUpdate?.(v)
            },
          }}
        >
          {props.modelValue?.map((item, index) => {
            const componentData = editor?.components?.value?.find(component => component.name === item.name)

            const componentProps: Record<string, any> = {
              options: item.options,
            }
            if (componentData?.nested) {
              componentProps.children = item.children || []
              componentProps.onChildren = (v) => {
                item.children = v
              }
            }

            return (
              <div
                class={clsx([
                  'border p-2 rounded-sm relative w-full',
                  editor?.selected.value === item.key ? 'bg-primary/10 border-primary border-solid' : 'border-accented border-dashed',
                ])}
                key={item.key}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!editor?.selected) {
                    return
                  }
                  editor.selected.value = item.key
                }}
              >
                <div>
                  {componentData?.component(componentProps)}
                </div>
                {editor?.selected.value === item.key && (
                  <>
                    <div class="absolute right-0 bottom-0  bg-primary flex px-1 rounded-tl z-1">
                      <div
                        class="p-1 text-inverted cursor-pointer  hover:text-inverted/80"
                        onClick={() => {
                          editor.copyData(item.key, index)
                        }}
                      >
                        <div class="i-tabler:copy"></div>
                      </div>
                      <div class="p-1 text-inverted  cursor-pointer hover:text-inverted/80">
                        <div
                          class="i-tabler:trash-x"
                          onClick={() => {
                            editor?.deleteData(item.key, index)
                          }}
                        >
                        </div>
                      </div>

                    </div>
                    <div class="absolute left-0 top-0  bg-primary p-1 text-inverted rounded-br z-1 editor-handle">
                      <div class="i-tabler:arrows-move "></div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </VueDraggable>
      </>
    )
  },
})

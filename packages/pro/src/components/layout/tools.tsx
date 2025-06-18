import type { DropdownOption } from 'naive-ui'
import type { PropType } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { NButton, NDropdown } from 'naive-ui'
import { computed, defineComponent, Transition } from 'vue'

export interface DuxToolOptionItem {
  label?: string
  icon?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  type?: 'default' | 'error' | 'success' | 'warning'
}

export const DuxTableTools = defineComponent({
  name: 'DuxTableTools',
  props: {
    number: {
      type: Number,
    },
    options: {
      type: Array as PropType<DuxToolOptionItem[]>,
    },
    group: {
      type: Array as PropType<DuxToolOptionItem[][]>,
    },
    dropdown: {
      type: Array as PropType<DropdownOption[]>,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const group = computed(() => {
      if (props.group) {
        return props.group
      }
      return [props.options]
    })

    const hasSelectedItems = computed(() => {
      return props.number && props.number > 0
    })

    return () => (
      <div class="absolute  bottom-0 left-0 right-0 pointer-events-none">
        <Transition
          name="slide-up"
          appear={true}
          enterActiveClass="transition-all duration-200 ease-out"
          enterFromClass="transform translate-y-full opacity-0"
          enterToClass="transform translate-y-0 opacity-100"
          leaveActiveClass="transition-all duration-200 ease-in"
          leaveFromClass="transform translate-y-0 opacity-100"
          leaveToClass="transform translate-y-full opacity-0"
        >
          {hasSelectedItems.value
            ? (
                <div class="flex h-12 px-1 justify-between lg:justify-center gap-2 pointer-events-auto backdrop-blur">
                  {group.value?.map((options, index) => (
                    <div class="h-10 mt-1 bg-gray-800 rounded px-4 py-1 shadow-lg flex items-center gap-4">

                      {index === group.value.length - 1 && (
                        <>
                          <span class="text-gray-300">
                            {t('components.list.selectedItems', { num: props.number || 0 })}
                          </span>
                          <div class="w-px h-4 bg-gray-600"></div>
                        </>
                      )}

                      {options?.map(item => (
                        <NButton text onClick={item.onClick} class="text-gray-300" loading={item.loading} disabled={item.disabled} type={item.type}>
                          {{
                            default: () => item.label,
                            icon: () => <div class={item.icon} />,
                          }}
                        </NButton>
                      ))}

                      {index === group.value.length - 1 && props.dropdown && props.dropdown.length > 0 && (
                        <NDropdown
                          options={props.dropdown}
                        >
                          <NButton text class="text-gray-300">
                            {{
                              icon: () => <div class="i-tabler:dots-vertical size-4" />,
                            }}
                          </NButton>
                        </NDropdown>
                      )}
                    </div>
                  ))}
                </div>
              )
            : null}
        </Transition>
      </div>
    )
  },
})

import type { UseMenuProps } from '@duxweb/dvha-core'
import type { MenuOption } from 'naive-ui'
import { arrayToTree, useMenu } from '@duxweb/dvha-core'
import { computed, h } from 'vue'
import { RouterLink } from 'vue-router'

export function useNaiveMenu(props?: UseMenuProps) {
  const menu = useMenu(props)

  const options = computed((): MenuOption[] => {
    const data = menu.getMenu(true).map((item) => {
      return {
        ...item,
        key: item.name,
        icon: item?.icon
          ? () => {
              return h('div', {
                class: `${item.icon} size-4`,
              })
            }
          : undefined,
        labelName: item.label,
        label: () => {
          return item.path
            ? h(
                RouterLink,
                {
                  to: {
                    path: item.path,
                  },
                },
                { default: () => item.label },
              )
            : item.label
        },
      }
    })

    return arrayToTree(data, {
      idKey: 'key',
      parentKey: 'parent',
      childrenKey: 'children',
      sortKey: 'sort',
    }, undefined)
  })

  return {
    options,
    ...menu,
  }
}

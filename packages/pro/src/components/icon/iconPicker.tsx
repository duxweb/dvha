import type { PropType } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { icons } from '@iconify-json/tabler/icons.json'

import { useOffsetPagination } from '@vueuse/core'
import { NInput, NPagination } from 'naive-ui'
import { defineComponent, onMounted, ref, watch } from 'vue'

const DuxIconPicker = defineComponent({
  name: 'DuxIconPicker',
  props: {
    onConfirm: Function as PropType<(icon: string) => void>,
    onClose: Function as PropType<() => void>,
  },
  setup(props) {
    const allData = Object.keys(icons)
    const iconData = ref(allData)
    const keyword = ref('')
    const data = ref<string[]>([])
    const total = ref(allData.length)

    function fetchData({ currentPage, currentPageSize }: { currentPage: number, currentPageSize: number }) {
      data.value = iconData.value.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
    }

    const {
      currentPage,
      currentPageSize,
      pageCount,
    } = useOffsetPagination({
      total: () => total.value,
      page: 1,
      pageSize: 42,
      onPageChange: fetchData,
      onPageSizeChange: fetchData,
      onPageCountChange: fetchData,
    })

    onMounted(() => {
      fetchData({
        currentPage: currentPage.value,
        currentPageSize: 42,
      })
    })

    watch(keyword, () => {
      iconData.value = Object.keys(icons).filter(item => item.includes(keyword.value))
      total.value = iconData.value.length
      currentPage.value = 1
      fetchData({ currentPage: currentPage.value, currentPageSize: currentPageSize.value })
    }, { immediate: true })

    const { t } = useI18n()

    return () => (
      <div class="p-4 flex flex-col gap-4">
        <NInput placeholder={t('common.keyword')} v-model:value={keyword.value} clearable />
        <div class="grid grid-cols-6">
          {data.value?.map((item, index) => (
            <div
              key={index}
              class="flex justify-center items-center"
              onClick={() => {
                props.onConfirm?.(`i-tabler:${item}`)
              }}
            >
              <div class="py-2 px-3 hover:bg-primary/10 border border-transparent hover:border-primary-hover rounded cursor-pointer transition-all">
                <div class={`i-tabler:${item} size-6`}></div>
              </div>
            </div>
          ))}
        </div>
        <div class="flex justify-center">
          <NPagination page={currentPage.value} pageSize={currentPageSize.value} pageCount={pageCount.value} onUpdatePage={v => currentPage.value = v} />
        </div>
      </div>
    )
  },
})

export default DuxIconPicker

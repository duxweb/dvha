import { useTabStore } from "@dux-vue/core"
import { computed} from "vue"
import { useRouter } from "vue-router"
import type { TabProps } from 'naive-ui'


export const useNaiveTab = () => {
  const tab = useTabStore()
	const router = useRouter()

	const props = computed(() => {
		return {
			value: tab.current,
			onClose: (value) => {
				tab.delTab(value, (item) => {
					router.push(item.path || '')
				})
			},
			onUpdateValue: (value) => {
				tab.changeTab(value, (item) => {
					router.push(item.path || '')
				})
			},
		} as TabProps
	})

	return {
			...tab,
			props,
	}
}

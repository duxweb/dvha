import { defineComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIsLogin, useManage } from '../../hooks'

export const DuxAppAuth = defineComponent({
  name: 'DuxAppAuth',
  props: {
    path: {
      type: String,
      default: '/login',
    },
  },
  setup(props, { slots }) {
    const isLogin = useIsLogin()
    const route = useRoute()
    const router = useRouter()
    const { getRoutePath } = useManage(route.meta.manageName as string)

    onBeforeMount(() => {
      if (!isLogin) {
        router.replace(getRoutePath(props.path))
      }
    })

    return () => (
      <>
        {slots.default?.()}
      </>
    )
  },
})

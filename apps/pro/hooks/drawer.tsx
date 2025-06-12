import type { AsyncComponentLoader } from 'vue'
import { useOverlayInject } from '@overlastic/vue'
import { DuxDrawer } from '../components'

export interface UseDrawerResult {
  show: (props: UseDrawerProps) => Promise<any>
}

export interface UseDrawerProps {
  title?: string
  width?: number | string
  component: AsyncComponentLoader<any>
  componentProps?: Record<string, any>
}

export function useDrawer(): UseDrawerResult {
  const create = useOverlayInject(DuxDrawer)

  const show = (props: UseDrawerProps) => {
    return create(props)
  }

  return {
    show,
  }
}

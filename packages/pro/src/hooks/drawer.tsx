import type { AsyncComponentLoader, Component } from 'vue'
import { useOverlayInject } from '@overlastic/vue'
import { DuxDrawer } from '../components'

export interface UseDrawerResult {
  show: (props: UseDrawerProps) => Promise<any>
}

export interface UseDrawerProps {
  title?: string
  width?: number | string
  maxWidth?: number
  component: AsyncComponentLoader<any> | Component
  componentProps?: Record<string, any>
  placement?: 'top' | 'right' | 'bottom' | 'left'
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

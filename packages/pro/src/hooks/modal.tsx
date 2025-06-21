import type { ModalProps } from 'naive-ui'
import type { AsyncComponentLoader, Component } from 'vue'
import { useOverlayInject } from '@overlastic/vue'
import { DuxModal } from '../components'

export interface UseModalResult {
  show: (props: UseModalProps) => Promise<any>
}

export interface UseModalProps {
  title?: string
  width?: number | string
  component: AsyncComponentLoader<any> | Component
  componentProps?: Record<string, any>
  draggable?: boolean
  modalProps?: ModalProps
}

export function useModal(): UseModalResult {
  const create = useOverlayInject(DuxModal)

  const show = (props: UseModalProps) => {
    return create(props)
  }

  return {
    show,
  }
}

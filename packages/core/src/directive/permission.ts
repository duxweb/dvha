import type { Directive, DirectiveBinding } from 'vue'
import { useCan } from '../hooks'

export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding): void {
    const { value } = binding
    if (!value) {
      return
    }
    const can = useCan()
    if (!can(value)) {
      el.parentElement?.removeChild(el)
    }
  },
}

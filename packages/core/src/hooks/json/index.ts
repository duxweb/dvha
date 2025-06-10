import type { IJsonAdaptor } from './types'
import { vForAdaptor } from './vFor'
import { vIfAdaptor } from './vIf'
import { vModelAdaptor } from './vModel'
import { vOnAdaptor } from './vOn'
import { vShowAdaptor } from './vShow'
import { vTextAdaptor } from './vText'

export const defaultAdaptors: IJsonAdaptor[] = [
  vIfAdaptor,
  vShowAdaptor,
  vForAdaptor,
  vModelAdaptor,
  vOnAdaptor,
  vTextAdaptor,
].sort((a, b) => b.priority - a.priority)

export * from './types'
export {
  vForAdaptor,
  vIfAdaptor,
  vModelAdaptor,
  vOnAdaptor,
  vShowAdaptor,
  vTextAdaptor,
}

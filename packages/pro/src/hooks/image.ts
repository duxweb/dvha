import { NImage, NImageGroup } from 'naive-ui'
import { h, render } from 'vue'

export function useImagePreview() {
  let existDiv = document.querySelector('#preview-image')
  if (!existDiv) {
    const div = document.createElement('div')
    div.id = 'preview-image'
    div.style.display = 'none'
    document.body.appendChild(div)
    existDiv = div
  }

  const show = (list: string[], previewIndex?: number) => {
    if (!list.length) {
      return
    }
    const e = new MouseEvent('click', { bubbles: true, cancelable: true })
    const imgList = list.map((src) => {
      return h(NImage, { width: 100, src })
    })
    if (imgList.length > 1) {
      render(h(NImageGroup, {}, {
        default: () => imgList,
      }), existDiv)
    }
    else {
      render(imgList[0], existDiv)
    }
    existDiv?.querySelectorAll('.n-image img')[previewIndex || 0]?.dispatchEvent(e)
  }

  return {
    show,
  }
}

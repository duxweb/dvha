import type { IUseImportProps } from './import'
import { useFileDialog } from '@vueuse/core'
import { csv2json } from 'json-2-csv'
import { computed } from 'vue'
import { useImport } from './import'

export interface IUseImportCsvProps extends IUseImportProps {
  // 输入文件编码。默认 auto：自动探测并转为 UTF-8
  encoding?: 'auto' | string
  csvOptions?: {
    delimiter?: string
    wrap?: string
    eol?: string
    excelBOM?: boolean
    headerFields?: string[]
    keys?: string[]
    trimHeaderFields?: boolean
    trimFieldValues?: boolean
  }
}

export function useImportCsv(props: IUseImportCsvProps) {
  const importProps = computed(() => {
    const { csvOptions, ...rest } = props
    return rest
  })

  const csvOptions = computed(() => {
    const options = props.csvOptions || {}
    return {
      delimiter: {
        field: options.delimiter || ',',
        wrap: options.wrap || '"',
        eol: options.eol || '\n',
      },
      excelBOM: options.excelBOM || false,
      headerFields: options.headerFields,
      keys: options.keys,
      trimHeaderFields: options.trimHeaderFields || false,
      trimFieldValues: options.trimFieldValues || false,
    }
  })

  const res = useImport({
    ...importProps.value,
  })

  // 尝试根据 BOM 与启发式自动识别编码，统一按 UTF-8 字符串给解析器
  const decodeToUtf8 = async (file: File): Promise<string> => {
    const buf = await file.arrayBuffer()

    const bytes = new Uint8Array(buf)
    // BOM 检测
    const hasUtf8BOM = bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF
    const hasUtf16LEBOM = bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE
    const hasUtf16BEBOM = bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF

    const preferEncoding = props.encoding || 'auto'

    const tryDecode = (enc: string, data?: Uint8Array) => {
      try {
        const decoder = new TextDecoder(enc as any, { fatal: false })
        return decoder.decode(data || bytes)
      }
      catch {
        return ''
      }
    }

    const score = (s: string) => {
      if (!s) return { rep: Number.MAX_SAFE_INTEGER, ctrl: Number.MAX_SAFE_INTEGER }
      let rep = 0
      let ctrl = 0
      for (let i = 0; i < s.length; i++) {
        const ch = s.charCodeAt(i)
        if (ch === 0xFFFD) rep++ // 替换字符
        // 统计不可见控制符（允许常见换行/回车/制表）
        if (ch < 32 && ch !== 9 && ch !== 10 && ch !== 13) ctrl++
      }
      return { rep, ctrl }
    }

    const stripBOM = (s: string) => s.replace(/^\ufeff/, '')

    // 1) 有 BOM 时按 BOM 解码
    if (hasUtf8BOM) {
      return stripBOM(tryDecode('utf-8'))
    }
    if (hasUtf16LEBOM) {
      return stripBOM(tryDecode('utf-16le'))
    }
    if (hasUtf16BEBOM) {
      return stripBOM(tryDecode('utf-16be'))
    }

    // 2) 用户指定编码且非 auto
    if (preferEncoding !== 'auto') {
      return stripBOM(tryDecode(preferEncoding))
    }

    // 3) 无 BOM，自动尝试。
    const candidates = ['utf-8', 'gb18030', 'gbk']
    const results = candidates.map((enc) => {
      const text = tryDecode(enc)
      const sc = score(text)
      return { enc, text, sc }
    })
    // 选择替换字符更少、控制字符更少的结果
    results.sort((a, b) => (a.sc.rep - b.sc.rep) || (a.sc.ctrl - b.sc.ctrl))
    return stripBOM(results[0].text)
  }

  // 读取文件
  const readFile = async (file: File) => {
    try {
      const text = await decodeToUtf8(file)
      const jsonData = await csv2json(text, csvOptions.value)

      if (jsonData && jsonData.length > 0) {
        // 调用导入触发器
        await res.trigger(jsonData)
      }
      else {
        props.onError?.({
          message: 'CSV 文件为空或格式不正确',
          status: 400,
        })
      }
    }
    catch (error) {
      props.onError?.({
        message: `CSV 解析错误: ${error}`,
        status: 500,
      })
    }
  }

  const { open: openFileDialog, reset, onChange } = useFileDialog({
    accept: '.csv',
    multiple: false,
  })

  onChange((selectedFiles) => {
    if (selectedFiles && selectedFiles.length > 0) {
      readFile(selectedFiles[0])
    }
  })

  const open = () => {
    reset()
    openFileDialog()
  }

  return {
    ...res,
    open,
    readFile,
  }
}

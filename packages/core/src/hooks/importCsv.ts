import type { IUseImportProps } from './import'
import { useFileDialog } from '@vueuse/core'
import { csv2json } from 'json-2-csv'
import { computed } from 'vue'
import { useImport } from './import'

export interface IUseImportCsvProps extends IUseImportProps {
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

  // 读取文件
  const readFile = async (file: File) => {
    try {
      const text = await file.text()

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

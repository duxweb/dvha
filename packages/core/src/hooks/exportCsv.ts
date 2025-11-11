import type { IUseExportProps } from './export'
import { json2csv } from 'json-2-csv'
import { computed } from 'vue'
import { useExport } from './export'

export interface IUseExportCsvProps extends IUseExportProps {
  filename?: string
  headers?: string[] | boolean
  csvOptions?: {
    delimiter?: string
    quote?: string | boolean
    escape?: string
    eol?: string
    writeBOM?: boolean
  }
}

export function useExportCsv(props: IUseExportCsvProps) {
  const exportProps = computed(() => {
    const { filename, headers, csvOptions, ...rest } = props
    return rest
  })

  const csvOptions = computed(() => {
    const options = props.csvOptions || {}
    const wrapChar = options.quote
    return {
      prependHeader: props.headers !== false,
      keys: Array.isArray(props.headers) ? props.headers : undefined,
      delimiter: {
        field: options.delimiter || ',',
        wrap: typeof wrapChar === 'string' ? wrapChar : '"',
        eol: options.eol || '\n',
      },
      // 默认为 Excel 加上 UTF-8 BOM，避免中文在 Excel 中出现乱码
      excelBOM: options.writeBOM !== false,
    }
  })

  const res = useExport({
    ...exportProps.value,
    onSuccess: async (res) => {
      if (!res?.data || !res?.data?.length) {
        props.onError?.({
          message: 'No data to export',
          status: 400,
        })
        return
      }

      try {
        const csvString = await json2csv(res.data, csvOptions.value)

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = props.filename || 'export.csv'
        link.style.display = 'none'

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        props.onSuccess?.(res)
      }
      catch (error) {
        props.onError?.({
          message: `CSV Export Error: ${error}`,
          status: 500,
        })
      }
    },
  })

  return res
}

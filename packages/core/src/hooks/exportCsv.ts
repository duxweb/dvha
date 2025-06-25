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
      excelBOM: options.writeBOM || false,
    }
  })

  const res = useExport({
    ...exportProps.value,
    onSuccess: async (data) => {
      if (!data?.pages) {
        props.onError?.({
          message: 'No data to export',
          status: 400,
        })
        return
      }

      // 合并所有页面的数据
      const allData = data.pages.flatMap(page => Array.isArray(page?.data) ? page.data : [])

      if (!allData || !allData?.length) {
        props.onError?.({
          message: 'No data to export',
          status: 400,
        })
        return
      }

      try {
        const csvString = await json2csv(allData, csvOptions.value)

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

        props.onSuccess?.(data)
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

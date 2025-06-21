import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { DuxCard } from '../card'
import { DuxChart } from '../chart'
import { DuxStatsNumber } from './number'

export interface StatsCardItem {
  label: string
  value: number | string
  color?: string
}

export interface StatsChartItem {
  title: string
  value: number | string
  subtitle?: string
  change?: number
  changeType?: 'up' | 'down'
  labels?: string[]
  data: number[]
  color?: string
}

export const DuxStatsRealTime = defineComponent({
  name: 'DuxStatsRealTime',
  props: {
    title: {
      type: String,
      default: '实时数据',
    },
    subtitle: {
      type: String,
      default: '',
    },
    cards: {
      type: Array as PropType<StatsCardItem[]>,
      default: () => [],
    },
    charts: {
      type: Array as PropType<StatsChartItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const computedCharts = computed(() => {
      if (props.charts.length === 1) {
        return props.charts.map(chart => ({
          ...chart,
          class: 'col-span-2',
        }))
      }
      return props.charts.map(chart => ({
        ...chart,
        class: 'col-span-1',
      }))
    })

    const formatValue = (value: number | string) => {
      if (typeof value === 'number') {
        return value.toLocaleString()
      }
      return value
    }

    return () => (
      <DuxCard title="实时数据">
        {{
          headerExtra: () => (
            <div class="text-sm text-muted">
              {props.subtitle}
            </div>
          ),
          default: () => (
            <>
              {/* Stats Cards */}
              {props.cards.length > 0 && (
                <div class={[
                  'grid grid-cols-2 bg-muted lg:overflow-hidden lg:h-26',
                  `lg:grid-cols-[repeat(auto-fit,minmax(100px,1fr))]`,
                ]}
                >
                  {props.cards.map((card, index) => (
                    <div
                      key={index}
                      class="text-center flex flex-col gap-1 py-6"
                    >
                      <div
                        class={[
                          'text-2xl font-bold',
                        ]}
                      >
                        {formatValue(card.value)}
                      </div>
                      <div class="text-sm text-muted">
                        {card.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {props.charts.length > 0 && (
                <div class={[
                  'grid grid-cols-1',
                  `lg:grid-cols-[repeat(auto-fit,minmax(100px,1fr))]`,
                ]}
                >
                  {computedCharts.value.map((chart, index) => (
                    <div
                      key={index}
                      class={[
                        'p-4 pb-0 flex gap-4',
                      ]}
                    >
                      <DuxStatsNumber
                        title={chart.title}
                        subtitle={chart.subtitle}
                        value={chart.value || 0}
                        change={chart.change}
                        changeType={chart.changeType}
                      />

                      <div class="flex-1 min-w-0">
                        <DuxChart
                          type="line"
                          height="100px"
                          min={true}
                          option={{
                            showXAxisLabel: true,
                            labels: chart.labels,
                            data: [
                              {
                                name: chart.title,
                                data: chart.data,
                              },
                            ],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ),
        }}

      </DuxCard>
    )
  },
})

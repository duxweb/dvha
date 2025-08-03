import { useCustomMutation, useI18n, useList, useManage } from '@duxweb/dvha-core'
import { NBadge, NButton, NPopover, NSpin, NTooltip } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DuxBlockEmpty, DuxCard } from '../../components'

export default defineComponent({
  name: 'DuxMenuNotice',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t } = useI18n()

    const { config, getRoutePath } = useManage()
    const router = useRouter()

    const { data, isLoading, refetch } = useList({
      path: config.notice?.path || 'notice',
      pagination: { page: 1, pageSize: 10 },
    })

    const { mutate: markRead } = useCustomMutation({
      path: `${config.notice?.path || 'notice'}`,
      method: 'POST',
      onSuccess: () => {
        refetch()
      },
    })

    const noticeList = computed(() => data.value?.data || [])
    const hasUnread = computed(() =>
      noticeList.value.some((item: any) => !item[config.notice?.readField || 'read']),
    )

    const show = ref(false)

    const handleNotice = (notice: any) => {
      markRead({
        payload: {
          type: 'read',
          id: notice.id,
        },
      })
      show.value = false
    }

    const handleNoticeAll = () => {
      markRead({
        payload: {
          type: 'all_read',
        },
      })
      show.value = false
    }

    return () => (
      <NPopover
        trigger="click"
        arrowClass="ml-2.5"
        placement="bottom-start"
        style="padding: 0"
        width={300}
        show={show.value}
        onClickoutside={() => show.value = false}
      >
        {{
          trigger: () => (
            <NTooltip trigger="hover" placement="right">
              {{
                default: () => t('components.menu.notice', 'Notice'),
                trigger: () => (
                  <NButton onClick={() => show.value = true} quaternary>
                    {{
                      icon: () => (
                        <NBadge dot={hasUnread.value} offset={[-8, 8]}>
                          <div class="transition-all text-muted p-2 hover:text-white">
                            <div class="i-tabler:bell size-5" />
                          </div>
                        </NBadge>
                      ),
                    }}
                  </NButton>
                ),
              }}
            </NTooltip>

          ),
          default: () => (
            <DuxCard headerBordered headerClass="text-sm" headerSize="small" contentSize="none" title={t('components.menu.notice', 'Notice')}>
              {{
                default: () => {
                  return (
                    <>
                      <NSpin show={isLoading.value}>
                        {noticeList.value.length > 0
                          ? (
                              <div class="p-2">
                                {noticeList.value?.map((item: any, index: number) => {
                                  const url = item[config.notice?.urlField || 'url']
                                  const readField = config.notice?.readField || 'read'
                                  const descField = config.notice?.descField || 'desc'
                                  const titleRead = config.notice?.titleField || 'title'
                                  return (
                                    <div
                                      class="hover:bg-elevated rounded cursor-pointer p-2 flex gap-2 items-center"
                                      onClick={() => {
                                        const url = item[config.notice?.urlField || 'url']
                                        if (url?.startsWith('http')) {
                                          window.open(url, '_blank')
                                        }
                                        else {
                                          router.push(getRoutePath(config.notice?.path || 'notice'))
                                        }
                                        item[readField] = true
                                        handleNotice(item)
                                      }}
                                    >
                                      <div
                                        key={index}
                                        class="flex-1 min-w-0 flex flex-col"
                                      >
                                        <div class="flex items-center gap-2">
                                          {!item[readField] ? <div class="w-2 h-2 bg-error rounded-full" /> : <div class="w-2 h-2 bg-elevated rounded-full" />}
                                          <div class="flex-1 min-w-0 text-sm font-medium truncate">
                                            {item[titleRead]}
                                          </div>
                                        </div>
                                        <div class="pl-4 text-xs text-muted line-clamp-2">
                                          {item[descField]}
                                        </div>
                                      </div>
                                      {url?.startsWith('http') && (
                                        <div>
                                          <div class="i-tabler:external-link size-5 text-muted"></div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          : (
                              <div class="p-4">
                                <DuxBlockEmpty text={t('components.menu.noNotice', 'No notices')} simple />
                              </div>
                            )}
                      </NSpin>
                      <div class="border-t border-muted p-2">
                        <div
                          class="text-center text-sm text-primary hover:text-primary-hover cursor-pointer py-1"
                          onClick={() => {
                            router.push(getRoutePath(config.notice?.path || 'notice'))
                            show.value = false
                          }}
                        >
                          {t('components.menu.viewAllNotices', 'View all notices')}
                        </div>
                      </div>
                    </>
                  )
                },
                headerExtra: () => (
                  <NButton
                    size="tiny"
                    quaternary
                    disabled={!hasUnread.value}
                    onClick={handleNoticeAll}
                  >
                    {t('components.menu.markAllRead', 'Mark all read')}
                  </NButton>
                ),

              }}
            </DuxCard>
          ),
        }}
      </NPopover>
    )
  },
})

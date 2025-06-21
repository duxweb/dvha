<script setup lang="ts">
import { DuxDashboardQuick, DuxMedia, DuxWidgetConnect } from '@duxweb/dvha-pro'
import { NCalendar, NCard } from 'naive-ui'

const taskData = [
  {
    title: '完成年度财务报告的编制',
    section: '财务部主管',
    nickname: '张华',
    status: 1,
    date: '09-01',
  },
  {
    title: '更新公司内部网络安全协议',
    section: 'IT部门经理',
    nickname: '李明',
    status: 2,
    date: '09-02',
  },
  {
    title: '策划并执行下季度市场推广活动',
    section: '市场部负责人',
    nickname: '王丽',
    status: 3,
    date: '09-03',
  },
  {
    title: '设计新的员工培训课程',
    section: '人力资源部主管',
    nickname: '赵强',
    status: 1,
    date: '09-04',
  },
  {
    title: '组织公司年度健康检查',
    section: '行政部经理',
    nickname: '刘洋',
    status: 2,
    date: '09-05',
  },
  {
    title: '开发新的客户关系管理系统',
    section: '研发部负责人',
    nickname: '陈晨',
    status: 3,
    date: '09-06',
  },
  {
    title: '撰写并提交新产品的市场调研报告',
    section: '市场调研部主管',
    nickname: '孙悦',
    status: 1,
    date: '09-07',
  },
  {
    title: '准备并提交下个月的预算报告',
    section: '财务部副经理',
    nickname: '周杰',
    status: 2,
    date: '09-08',
  },
  {
    title: '更新公司网站内容和用户界面',
    section: '网络运营部经理',
    nickname: '吴浩',
    status: 3,
    date: '09-09',
  },
  {
    title: '组织公司年度员工满意度调查',
    section: '人力资源部副经理',
    nickname: '郑洁',
    status: 1,
    date: '09-10',
  },
  {
    title: '实施新的员工激励计划',
    section: '人力资源部主管',
    nickname: '赵强',
    status: 1,
    date: '09-11',
  },
]
</script>

<template>
  <dux-page :card="false">
    <div class="flex gap-2 flex-col lg:flex-row">
      <div class="flex-1 flex flex-col gap-2 lg:w-1">
        <dux-dashboard-hello-big
          title="HELLO，张三" :data="[
            {
              label: '已处理',
              icon: 'i-tabler:cube',
              value: 0,
            },
            {
              label: '处理中',
              icon: 'i-tabler:cube',
              value: 0,
            },
            {
              label: '未处理',
              icon: 'i-tabler:cube',
              value: 0,
            },
          ]"
        />

        <div class="bg-primary rounded-sm text-white px-10 py-6 relative overflow-hidden flex justify-between">
          <div>
            <div class="text-xl">
              Dux Vue Admin
            </div>
            <div class="text-sm opacity-60">
              基于 Vue3 和 Naive UI 的异步渲染中后台前端框架
            </div>
          </div>

          <div class="flex items-center text-lg italic">
            简单、高效、易用
          </div>

          <div class="absolute top-7 -right-20 rounded-full size-40 bg-white/8" />
          <div class="absolute top-0 -right-20 rounded-full size-50 bg-white/8" />
          <div class="absolute -top-7 -right-18 rounded-full size-60 bg-white/8" />
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <div>
            <NCard
              class="shadow-sm"
              :bordered="false"
              title="今日任务"
              content-class="!p-0"

              :segmented="{
                content: true,
              }"
              size="small"
            >
              <template #header-extra>
                <n-tabs pane-class="!p-0" type="segment" size="small" animated class="!w-50">
                  <n-tab-pane name="1" tab="待处理" />
                  <n-tab-pane name="2" tab="已处理" />
                  <n-tab-pane name="3" tab="未处理" />
                </n-tabs>
              </template>
              <n-scrollbar>
                <div class="flex flex-col gap-4 p-4">
                  <DuxMedia v-for="(item, key) in taskData" :key="key">
                    {{ item.title }}
                    <template #image>
                      <n-avatar round class="!bg-primary">
                        {{ item.nickname.charAt(0) }}
                      </n-avatar>
                    </template>
                    <template #desc>
                      <div>{{ item.section }} <span class="text-primary">{{ item.nickname }}</span></div>
                    </template>
                    <template #extend>
                      <div class="flex items-center justify-center h-10 w-16 rounded" :class="[item.status === 1 ? 'text-info bg-info/10' : '', item.status === 2 ? 'text-warning bg-warning/10' : '', item.status === 3 ? 'text-success bg-success/10' : '']">
                        {{ item.status === 1 ? '未处理' : item.status === 2 ? '处理中' : '已处理' }}
                      </div>
                      <div class="text-warning bg-warning/10 flex flex-col gap-0 items-center justify-center h-10 w-16 rounded">
                        {{ item.date }}
                      </div>
                    </template>
                  </DuxMedia>
                </div>
              </n-scrollbar>
            </NCard>
          </div>

          <div class="flex flex-col gap-4">
            <NCard
              class="shadow-sm"
              :bordered="false"
              size="small" title="常用功能" :segmented="{
                content: true,
              }"
            >
              <DuxDashboardQuick
                :col="4"
                :data="[
                  {
                    title: '我的任务',
                    icon: 'i-tabler:checklist',
                  },
                  {
                    title: '部门任务',
                    icon: 'i-tabler:building-skyscraper',
                  },
                  {
                    title: '项目管理',
                    icon: 'i-tabler:presentation',
                  },
                  {
                    title: '团队成员',
                    icon: 'i-tabler:users-group',
                  },
                  {
                    title: '合同管理',
                    icon: 'i-tabler:contract',
                  },
                  {
                    title: '审批待办',
                    icon: 'i-tabler:rubber-stamp',
                  },
                  {
                    title: '考勤管理',
                    icon: 'i-tabler:clock-pin',
                  },
                  {
                    title: '绩效管理',
                    icon: 'i-tabler:activity',
                  },
                ]"
              />
            </NCard>
            <NCard
              class="shadow-sm"
              :bordered="false"
              size="small" title="计划日历" :segmented="{
                content: true,
              }"
            >
              <div>
                <NCalendar
                  class="!h-92"
                />
              </div>
            </NCard>
          </div>
        </div>
      </div>
      <div class="flex-none flex flex-col gap-2 lg:w-86">
        <DuxCarousel
          :height="200" :data="[
            {
              src: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
            },
            {
              src: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
            },
            {
              src: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
            },
            {
              src: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
            },
          ]"
        />
        <NCard

          class="shadow-sm"
          :bordered="false"
          title="系统公告" size="small" :segmented="{
            content: true,
          }"
        >
          <template #header-extra>
            <n-button size="small" text>
              更多
            </n-button>
          </template>
          <div class="flex flex-col gap-2">
            <DuxMedia @click="() => {}">
              <template #prefix>
                <n-tag type="success" size="small">
                  系统
                </n-tag>
              </template>
              优化功能与安全升级
            </DuxMedia>
            <DuxMedia @click="() => {}">
              <template #prefix>
                <n-tag type="info" size="small">
                  部门
                </n-tag>
              </template>
              2024年第二季度工作总结会议通知
            </DuxMedia>
            <DuxMedia @click="() => {}">
              <template #prefix>
                <n-tag type="success" size="small">
                  系统
                </n-tag>
              </template>
              本周五晚进行服务器升级
            </DuxMedia>
            <DuxMedia @click="() => {}">
              <template #prefix>
                <n-tag type="info" size="small">
                  部门
                </n-tag>
              </template>
              新员工入职培训计划安排
            </DuxMedia>
            <DuxMedia @click="() => {}">
              <template #prefix>
                <n-tag type="success" size="small">
                  系统
                </n-tag>
              </template>
              网络安全意识月活动启动
            </DuxMedia>
            <DuxMedia @click="() => {}">
              <template #prefix>
                <n-tag type="info" size="small">
                  部门
                </n-tag>
              </template>
              年度绩效评估流程及时间表
            </DuxMedia>
          </div>
        </NCard>

        <DuxWidgetConnect title="平台定制需求" desc="助力企业提升管理效率">
          <n-button type="primary" size="small">
            联系我们
          </n-button>
        </DuxWidgetConnect>
      </div>
    </div>
  </dux-page>
</template>

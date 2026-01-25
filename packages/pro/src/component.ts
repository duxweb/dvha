import type { App } from 'vue'

import { DuxApp } from './app'
// 导入components中的所有Dux组件
import {
  DuxAiEditor,
  DuxBlockEmpty,
  DuxCard,
  DuxCardPage,
  DuxCarousel,
  DuxChart,
  DuxCodeEditor,
  DuxCollapsePanel,
  DuxDashboardHello,
  DuxDashboardHelloBig,
  DuxDashboardQuick,
  DuxDrawApps,
  DuxDrawAuth,
  DuxDrawEmpty,
  DuxDrawEmptyForm,
  DuxDrawerPage,
  DuxDrawError,
  DuxDynamicData,
  DuxDynamicSelect,
  DuxFileUpload,
  DuxFormItem,
  DuxFormLayout,
  DuxIconPicker,
  DuxImageCrop,
  DuxImageCropModal,
  DuxImageUpload,
  DuxLevel,
  DuxListLayout,
  DuxListPage,
  DuxMedia,
  DuxMapCoord,
  DuxModal,
  DuxModalForm,
  DuxModalPage,
  DuxModalTab,
  DuxPageForm,
  DuxPanelAlert,
  DuxPanelCard,
  DuxSchemaTreeEditor,
  DuxSelectCard,
  DuxSettingForm,
  DuxStatsNumber,
  DuxStatsRealTime,
  DuxStatsStore,
  DuxStatsStoreItem,
  DuxTableFilter,
  DuxTableLayout,
  DuxTablePage,
  DuxTableTools,
  DuxTreeFilter,
  DuxWidgetConnect,
} from './components'
// 导入pages中的所有Dux组件
import {
  DuxAuthLayout,
  DuxLoginPage,
  DuxMenuCmd,
  DuxMenuMain,
  DuxMobileMenu,
  DuxPage,
  DuxPage403,
  DuxPage404,
  DuxPage500,
  DuxPageEmpty,
  DuxPageStatus,
} from './pages'
import { DuxLayout } from './pages/layout'

export default {
  install(app: App) {
    // 注册components中的所有组件
    app.component('DuxAiEditor', DuxAiEditor)
    app.component('DuxCard', DuxCard)
    app.component('DuxDrawerPage', DuxDrawerPage)
    app.component('DuxDrawApps', DuxDrawApps)
    app.component('DuxDrawAuth', DuxDrawAuth)
    app.component('DuxDrawEmpty', DuxDrawEmpty)
    app.component('DuxDrawEmptyForm', DuxDrawEmptyForm)
    app.component('DuxDrawError', DuxDrawError)
    app.component('DuxDynamicData', DuxDynamicData)
    app.component('DuxDynamicSelect', DuxDynamicSelect)
    app.component('DuxFormItem', DuxFormItem)
    app.component('DuxFormLayout', DuxFormLayout)
    app.component('DuxModalForm', DuxModalForm)
    app.component('DuxPageForm', DuxPageForm)
    app.component('DuxSettingForm', DuxSettingForm)
    app.component('DuxListLayout', DuxListLayout)
    app.component('DuxTableFilter', DuxTableFilter)
    app.component('DuxTableLayout', DuxTableLayout)
    app.component('DuxTableTools', DuxTableTools)
    app.component('DuxCardPage', DuxCardPage)
    app.component('DuxListPage', DuxListPage)
    app.component('DuxMedia', DuxMedia)
    app.component('DuxMapCoord', DuxMapCoord)
    app.component('DuxModal', DuxModal)
    app.component('DuxPanelAlert', DuxPanelAlert)
    app.component('DuxPanelCard', DuxPanelCard)
    app.component('DuxBlockEmpty', DuxBlockEmpty)
    app.component('DuxTablePage', DuxTablePage)
    app.component('DuxLevel', DuxLevel)
    app.component('DuxImageCrop', DuxImageCrop)
    app.component('DuxImageCropModal', DuxImageCropModal)
    app.component('DuxModalPage', DuxModalPage)
    app.component('DuxModalTab', DuxModalTab)
    app.component('DuxFileUpload', DuxFileUpload)
    app.component('DuxImageUpload', DuxImageUpload)
    app.component('DuxTreeFilter', DuxTreeFilter)
    app.component('DuxSchemaTreeEditor', DuxSchemaTreeEditor)
    app.component('DuxIconPicker', DuxIconPicker)
    app.component('DuxCollapsePanel', DuxCollapsePanel)
    app.component('DuxCodeEditor', DuxCodeEditor)

    app.component('DuxDashboardHello', DuxDashboardHello)
    app.component('DuxDashboardHelloBig', DuxDashboardHelloBig)
    app.component('DuxDashboardQuick', DuxDashboardQuick)
    app.component('DuxCarousel', DuxCarousel)
    app.component('DuxWidgetConnect', DuxWidgetConnect)

    app.component('DuxChart', DuxChart)
    app.component('DuxSelectCard', DuxSelectCard)
    app.component('DuxStatsStore', DuxStatsStore)
    app.component('DuxStatsStoreItem', DuxStatsStoreItem)
    app.component('DuxStatsRealTime', DuxStatsRealTime)
    app.component('DuxStatsNumber', DuxStatsNumber)

    // 注册pages中的所有组件
    app.component('DuxAuthLayout', DuxAuthLayout)
    app.component('DuxLayout', DuxLayout)
    app.component('DuxPage403', DuxPage403)
    app.component('DuxPage404', DuxPage404)
    app.component('DuxPage500', DuxPage500)
    app.component('DuxPageEmpty', DuxPageEmpty)
    app.component('DuxPageStatus', DuxPageStatus)
    app.component('DuxLoginPage', DuxLoginPage)
    app.component('DuxPage', DuxPage)
    app.component('DuxMenuMain', DuxMenuMain)
    app.component('DuxMobileMenu', DuxMobileMenu)
    app.component('DuxMenuCmd', DuxMenuCmd)

    app.component('DuxApp', DuxApp)
  },
}

import { defineComponent } from 'vue'

export const DuxLoading = defineComponent({
  name: 'DuxLoading',
  setup() {
    return () => (
      <div class="app-loading">
        <div class="app-box-loading" />
      </div>
    )
  },
})

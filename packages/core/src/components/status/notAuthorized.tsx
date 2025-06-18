import { defineComponent } from 'vue'

export const DuxNotAuthorized = defineComponent({
  name: 'DuxNotAuthorized',
  setup() {
    return () => (
      <div>
        <h1>403</h1>
        <p>You are not authorized to access this page</p>
      </div>
    )
  },
})

export default {
  components: {
    dropdown: primevue.dropdown
  },
  setup(props, { emit }) {
    
  },
  template: `
  <dropdown 
    append-to="self" 
    placeholder="請選擇" 
    filter 
    show-clear
    ></dropdown>
  `,
}

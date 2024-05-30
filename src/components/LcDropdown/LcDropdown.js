const {
  ref,
  onMounted,
  onBeforeUnmount
} = Vue
export default {
  components: {
    dropdown: primevue.dropdown
  },
  props:{
    queryUrl: String
  },
  setup(props) {
    const dataSource = ref([])
    onMounted(()=>{
      console.log(props.queryUrl)
      if(props.queryUrl){
        // get data from ajax
        const source = []
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            source.push({Text: `選項 ${i}`, Value: i})
          }
          dataSource.value = source
        }, 1000);
      }
    })
    // onBeforeUnmount(()=>{
    //   console.log('onBeforeUnmount')
    // })
      return {
        queryUrl: props.queryUrl,
        dataSource
      }
  },
  template: `
  <dropdown
    append-to="self" 
    placeholder="請選擇" 
    :options= dataSource
    option-label="Text"
    option-value="Value"
    filter
    show-clear
    >
    </dropdown>
  `,
}

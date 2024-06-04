const {
  ref,
  onMounted,
  toRef,
  onBeforeUnmount,
  watch
} = Vue
export default {
  components: {
    dropdown: primevue.dropdown
  },
  props:{
    queryUrl: String,
    initQuery: { type: Boolean, default: () => true },
    cascadeFrom: Number
  },
  setup(props) {
    const loading = ref(true)
    const dataSource = ref([])
    const queryUrl = ref(null)
    onMounted(()=>{
      loading.value = false
      if(props.queryUrl){
        queryUrl.value = props.queryUrl
      }
      if(props.initQuery)
        GetDataFromUrl()
    })

    const GetDataFromUrl = ()=>{
      console.log('GetDataFromUrl', queryUrl.value)
      if(!queryUrl){
        return
      }
      // get data from ajax
      loading.value = true
      const source = []
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          source.push({Text: `選項 ${i}`, Value: i})
        }
        dataSource.value = source
        loading.value = false
      }, 1000);
    }
    const query = ()=>{
      GetDataFromUrl()
    }
    const clear = ()=>{
      dataSource.value = []
    }
    const setQueryUrl = (url)=>{
      console.log('setQueryUrl', url, queryUrl)
      queryUrl.value = url
    }
      return {
        queryUrl,
        dataSource,

        setQueryUrl,
        query,
        clear,
        loading
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
    :loading="loading"
    emptyMessage="無資料"
    >
    </dropdown>
  `,
}

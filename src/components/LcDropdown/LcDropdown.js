const {
  ref,
  onMounted,
  onUpdated,
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
    onMounted(()=>{
      loading.value = false
      if(props.initQuery)
        GetDataFromUrl()
    })

    watch(() => props.cascadeFrom, (newValue) => {
      console.log('watch:', newValue);  // 每當 myProp 發生變化時執行
      if(!newValue){
        clear()
        return
      }

      GetDataFromUrl()
      if(dataSource.value.length !== 0)
        return
  
      if(props.cascadeFrom){
        GetDataFromUrl()
      }
    });
    
    const GetDataFromUrl = ()=>{
      if(!props.queryUrl){
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
    const query = (param)=>{
      if(!param)
        return
      GetDataFromUrl()
    }
    const clear = ()=>{
      dataSource.value = []
    }
      return {
        queryUrl: props.queryUrl,
        dataSource,

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

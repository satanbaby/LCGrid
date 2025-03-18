import './styles.scss';
import {LcGridVue, LcColumn} from './components/LcGridVue/LcGridVue.js';
import LcModal from './components/LcModal/LcModal.js';
import LcDatepicker from './components/LcDatepicker/LcDatepicker.js';

const {
  createApp,
  ref,
  onMounted,
  watch
} = Vue;

const app = createApp({
  components: {
    LcGridVue,
    LcColumn,
    LcModal,
    LcDatepicker
  },
  setup() {
    const list = ref({});
    const grid = ref(null);
    const modalData  = ref({})
    const modalRef = ref(null)
    const searchData = ref(null)
    onMounted(() => {
      const _dataSource = grid.value.dataSource;
      list.value = _dataSource;
      // console.log('searchData',  grid.value.searchData)
      searchData.value = grid.value.searchData
    });
    const onChange = (isInit, model, childDropdown)=>{
      if(!isInit)
        model.selectedCity4 = null
      
      const newValue = model.selectedCity3
      if(!newValue){
        childDropdown.clear()
        return
      }

      childDropdown.setQueryUrl('api url ' + newValue)
      childDropdown.query()
    }

    const deleteItems = () => {
      const selectedItem = grid.value.getSelected()
        .map((_) => _.ReceNo)
      console.log(selectedItem)
      const messageReceNos = selectedItem.join('、');
      alert('刪除文號:' + messageReceNos);
    }

    const exportList = () =>{
      alert('匯出');
    }
    const changeUser = () =>{
      alert('異動承辦人');
    }
    const openModal = (doc)=>{
      modalData.value = {...doc}
      modalRef.value.show()
    }

    const rowClick = ({data})=>{
      alert('click row: ' + data.CaseNo)
    }

    const onModalHidden = ()=>{
      console.log('onModalHidden')
      modalData.value = {}
    }
    const dynamicColumn = ref(['ReceNo', 'CaseNo', 'Editable'])
    return {
      deleteItems,
      exportList,
      changeUser,
      openModal,
      onModalHidden,
      onChange,
      
      modalRef,
      modalData,
      grid,
      dynamicColumn,

      rowClick,
    };
  },
});
app.mount('#app')

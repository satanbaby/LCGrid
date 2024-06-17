import './styles.scss';
import LcGrid from './components/LcGrid/LcGrid.js';
import LcColumn from './components/LcGrid/LcColumn2.js';
import LcModal from './components/LcModal/LcModal.js';
import LcDropdown from './components/LcDropdown/LcDropdown.js';
import LabCategory from './components/LabCategory.js';

const {
  createApp,
  ref,
  onMounted,
  watch
} = Vue;

const app = createApp({
  components: {
    LcGrid,
    LcModal,
    LcDropdown,
    LcColumn,
    LabCategory
  },
  setup() {
    const list = ref({});
    const grid = ref(null);
    const modalData  = ref({})
    const modalRef = ref(null)
    const dropdown2 = ref(null)
    const searchData = ref(null)
    onMounted(() => {
      const _dataSource = grid.value.dataSource;
      list.value = _dataSource;
      // console.log('searchData',  grid.value.searchData)
      searchData.value = grid.value.searchData
      // console.log(searchData.value)
      onChange(true, searchData.value, dropdown2.value)
      searchData.value.labType = ['Mike']
      searchData.value.KeyWord = "12323"
      console.log(searchData.value)
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
      dropdown2
    };
  },
});
app.use(primevue.config.default)
app.component('calendar', primevue.calendar);
app.component('checkbox', primevue.checkbox);
app.component('radioButton', primevue.radiobutton);
app.mount('#app')

import './styles.scss';
import {LcGridVue, LcColumn} from './components/LcGridVue/LcGridVue.js';
import LcModal from './components/LcModal/LcModal.js';
import LcDatepicker from './components/LcDatepicker/LcDatepicker.js';
import FakeBackend from './FakeBackend/FakeBackend.js';

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
    const grid = ref(null);
    const modalData  = ref({})
    const modalRef = ref(null)
    const modalMode = ref('create')

    const modalTitle = Vue.computed(() => {
      switch(modalMode.value){
        case 'create': return '新增';
        case 'edit': return '編輯';
        case 'view': return '檢視';
        default: return '';
      }
    })

    const deleteItems = () => {
      const selectedItem = grid.value.getSelected().map(_ => _.ReceNo)
      if(selectedItem.length===0){
        alert('請選取欲刪除資料')
        return
      }
      if(confirm(`確認刪除${selectedItem.length}筆資料?`)){
        FakeBackend.Delete(selectedItem)
        grid.value.query()
      }
    }

    const exportList = () =>{
      alert('匯出');
    }
    const changeUser = () =>{
      alert('異動承辦人');
    }
    const openModal = (doc={}, mode='create')=>{
      modalMode.value = mode
      modalData.value = structuredClone(doc || {})
      modalRef.value.show(modalData.value)
    }

    const finalDateColor = (date)=>{
      const d = dayjs(date).startOf('day')
      const today = dayjs().startOf('day')
      if(d.isBefore(today)) return 'red'
      if(d.isSame(today)) return 'green'
      if(d.diff(today, 'day') <= 10) return 'blue'
      return 'black'
    }

    const save = ()=>{
      if(modalMode.value==='create'){
        const item = {
          SN: FakeBackend.GetNextSN(),
          ReceNo: modalData.value.ReceNo,
          CaseNo: modalData.value.CaseNo || '',
          ComeDate: new Date(),
          ReceDate: new Date(),
          FinalDate: new Date(),
          User: modalData.value.User || ''
        }
        FakeBackend.Create(item)
      }else if(modalMode.value==='edit'){
        FakeBackend.Update(modalData.value.SN, modalData.value)
      }
      modalRef.value.hide()
      grid.value.query()
    }

    const onModalHidden = ()=>{
      modalData.value = {}
      modalMode.value = 'create'
    }

    return {
      deleteItems,
      exportList,
      changeUser,
      openModal,
      save,
      onModalHidden,

      modalTitle,
      modalMode,

      modalRef,
      modalData,
      grid,
      finalDateColor,
    };
  },
});
app.mount('#app')

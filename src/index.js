import './styles.scss';
import LcGrid from './components/LcGrid/LcGrid.js';
import LcModal from './components/LcModal/LcModal.js';

const {
  createApp,
  ref,
  onMounted,
  watch
} = Vue;

const app = createApp({
  components: {
    LcGrid,
    LcModal
  },
  setup() {
    const list = ref({});
    const grid = ref(null);
    const modalData  = ref({})
    const modalRef = ref(null)
    onMounted(() => {
      const _dataSource = grid.value.dataSource;
      list.value = _dataSource;
    });

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
    return {
      deleteItems,
      exportList,
      changeUser,
      openModal,
      onModalHidden,
      
      modalRef,
      modalData,
      grid,

      rowClick
    };
  },
});
app.use(primevue.config.default)
app.component('calendar', primevue.calendar);
app.component('dropdown', primevue.dropdown);
app.component('checkbox', primevue.checkbox);
app.component('radioButton', primevue.radiobutton);
app.mount('#app')

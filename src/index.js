import './styles.scss';
import LcGrid from './LcGrid.js';

const {
  createApp,
  ref,
  onMounted,
  watch
} = Vue;
const app = createApp({
  components: {
    LcGrid,
  },
  setup() {
    const list = ref({});
    const child = ref(null);
    onMounted(() => {
      const _dataSource = child.value.dataSource;
      list.value = _dataSource;
    });

    function deleteItems() {
      const selectedItem = child.value.getSelected()
        .map((_) => _.ReceNo)
      console.log(selectedItem)
      const messageReceNos = selectedItem.join('、');
      alert('刪除文號:' + messageReceNos);
    }

    function exportList() {
      alert('匯出');
    }
    function changeUser() {
      alert('異動承辦人');
    }
    function extendDoc(doc){
      console.log(doc.CaseNo)
      alert('展辦:' + doc.CaseNo)
    }

    const rowClick = ({data})=>{
      alert('click row: ' + data.CaseNo)
    }
    return {
      list,
      deleteItems,
      exportList,
      changeUser,
      extendDoc,
      
      child,

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

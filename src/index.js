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
    const grid = ref(null);
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
    const extendDoc = (doc)=>{
      console.log(doc.CaseNo)
      alert('展辦:' + doc.CaseNo)
    }

    const rowClick = ({data})=>{
      alert('click row: ' + data.CaseNo)
    }

    return {
      deleteItems,
      exportList,
      changeUser,
      extendDoc,
      
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

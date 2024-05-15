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
      console.log(list.value.rows.push({}))
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
    }

    const initChosen = (e, item)=>{
      console.log('init')
      const chosen = $(e.el).chosen()
      console.log(chosen)
      chosen.val(item.Select)
      chosen.trigger("chosen:updated")
      chosen.change((chosenevent, a)=>{
          item.Select = a.selected
        })
    }
    const updateChosen = (e, item)=>{
      console.log($(e.el).data('chosen'))
      //const chosen=$(e.el).chosen()
      chosen.val(item.Select)
      chosen.trigger("chosen:updated")
      console.log(chosen)
      chosen.change((chosenevent, a)=>{
        item.Select = a.selected
      })
      // console.log()
    }
    return {
      initChosen,
      updateChosen,
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

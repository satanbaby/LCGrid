import './styles.scss';
import LCGrid from './LCGrid.js';
import LCColumn from './LCColumn.js';
// import fakeData from './fakeApiData.js';

import {
  createApp,
  ref,
  onMounted,
  watch
} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
createApp({
  components: {
    LCGrid,
    LCColumn,
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
    return {
      list,
      deleteItems,
      exportList,
      changeUser,

      child,
    };
  },
}).mount('#app');

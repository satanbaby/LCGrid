import { ref, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
export default {
  props: {
    column: [String, Object],
    searchData: Object
  },
  setup(props) {
    const columnName = ref('')
    const sortName = ref('')
    console.log(props)
    const sortType = ref('')
    

    if (typeof props.column === 'string') {
      columnName.value = props.column
    } else if (typeof props.column === 'object') {
      columnName.value = props.column.columnName
      sortName.value = props.column.sortName
      sortType.value = props.column.sortType ?? ''
    }
    const actionStyle = {
      ASC: 'fa-caret-up',
      DESC: 'fa-caret-down',
      '': 'fa-caret-left',
    }
    const getActionStyle = ()=>{
      return 'fa-caret-left'
    }

    return {
      columnName,
      sortName,
      sortType,
      getActionStyle,
    }
  },
  template: `
  <div class="cell">
    {{columnName}}
    <i class="sortIcon px-1 fa fa-caret-left"
      v-if="sortName"
    ></i>
  </div>
  `,
};

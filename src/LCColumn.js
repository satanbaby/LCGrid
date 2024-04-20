import { ref, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
export default {
  props: {
    column: [String, Object],
    searchData: Object
  },
  setup(props) {
    const columnName = ref('')
    const sortName = ref('')
    const sortType = ref('')
    const search = ref(props.searchData)
    
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
    const getActionStyle = computed(()=>{
      if(sortName.value !== search.value.sortField)
        return "fa-caret-left"
      
      if(search.value.sortAction === 'ASC')
        return 'fa-caret-up'

      if(search.value.sortAction === 'DESC')
        return 'fa-caret-down'
    })

    return {
      columnName,
      sortName,
      sortType,
      getActionStyle,
      search,
    }
  },
  template: `
  <div class="cell">
    {{columnName}}
    <i class="sortIcon px-1 fa" :class=getActionStyle
      v-if="sortName"
    ></i>
  </div>
  `,
};

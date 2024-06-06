const { ref, computed, toRef } = Vue;
export default {
  props: {
    header: [String],
    sort: [String],
    /** 外部傳入的欄位設定 */
    column: [String, {columnName: String, sortName: String}],
    /** 外部搜尋條件 */
    searchData: {
      pageSize: Number,
      sortField: String,
      sortAction: String,
      nowPage: Number,
    }
  },
  setup(props) {
    const columnName = ref('')
    const sortName = ref('')
    const sortType = ref('')
    const search = toRef(props, 'searchData')
    const sort = toRef(props, 'sort')
    
    if (typeof props.column === 'string') {
      columnName.value = props.column
    } else if (typeof props.column === 'object') {
      columnName.value = props.column.columnName
      sortName.value = props.column.sortName
      sortType.value = props.column.sortType ?? ''
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

      header: props.header,
      sort
    }
  },
  template: `
  <div class="cell user-select-none">
    {{header}}
    {{sort}}
    <slot></slot>
  </div>
  `,
};

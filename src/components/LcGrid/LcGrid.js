import { watch } from 'vue';
import fakeData from './fakeApiData.js';
import LcColumn from './LcColumn.js';
const {
  ref,
  computed,
  onMounted,
  toRefs,
  watchEffect
} = Vue

const DEFAULT_SEARCH_MODEL = {
  pageSize: 10,
  sortField: 'ID',
  sortAction: 'ASC',
  nowPage: 1,
};

export default {
  props: {
    /** 查詢網址 */
    queryUrl: String,
    /** 表頭欄 */
    cols: Array,
    /** 預設查詢條件 */
    defaultSearchModel: {
        type: Object,
        default: () => ({})
    },
    /** 儲存查詢條件用GUID */
    guid: String,
    /** 是否在載入時執行查詢 */
    initQuery: { type: Boolean, default: () => true },
    /** 是否記錄查詢條件 */
    rememberQuery: { type: Boolean, default: () => true },
    /** 開啟checkbox */
    selectable: Boolean,
    /** 是否開啟跨頁選取 */
    crossPageSelect: Boolean,
    /** 跨頁選取Key */
    selectKey: String,
  },
  emits:[
    'row-click',
  ],
  components: {
    LcColumn,
  },
  setup(props, {emit, slots}) {
    const {defaultSearchModel, rememberQuery, guid, queryUrl, cols, 
      selectable, crossPageSelect, selectKey} = toRefs(props)
    
    const searchData = ref({ ...DEFAULT_SEARCH_MODEL, ...defaultSearchModel.value });
    const dataSource = ref({rows: [], total: 0});
    const selectedItems = ref(new Map())

    const nextPage = () => {
      if (searchData.value.nowPage >= getTotalPage()) return;
      searchData.value.nowPage++;
      query();
    };

    const previousPage = () => {
      if (searchData.value.nowPage <= 1) return;
      searchData.value.nowPage--;
      query();
    };

    const jumpToPage = () => {
      query();
    };

    const changePageSize = () => {
      searchData.value.nowPage = 1;
      query();
    };
    const query = (fromDom = false) => {
      
      if (fromDom) {
        searchData.value.nowPage = 1;
      }

      if (rememberQuery) {
        setSessionStorage(searchData.value);
      }

      // AJAX call to replace fakeData
      dataSource.value = fakeData.paginateData(searchData.value);
      dataSource.value.rows.forEach(item=>{
        if(selectedItems.value.has(item[selectKey.value]))
          item.selected = true
      })
    };

    const queryAll = () => {
      searchData.value = { ...DEFAULT_SEARCH_MODEL, ...defaultSearchModel.value };
      query();
    };

    const getTotalPage = () => {
      return Math.ceil(dataSource.value.total / searchData.value.pageSize);
    };

    const totalPage = computed(getTotalPage);

    const getSelected = () => {
      return dataSource.value.rows.filter(_ => _.selected);
    };

    const changeSort = (clickCol) => {
      const sortName = clickCol.sortName;
      if (!sortName) return;

      const { sortField, sortAction } = searchData.value;
      const nextAction = sortField === sortName && sortAction === 'ASC' ? 'DESC' : 'ASC';

      searchData.value.sortAction = nextAction;
      searchData.value.sortField = sortName;

      query();
    };

    const setSessionStorage = () => {
      sessionStorage[guid.value] = JSON.stringify(searchData.value);
    };

    const getSessionStorage = () => {
      const storedObj = sessionStorage[guid.value];
      return JSON.parse(storedObj ?? null);
    };

    const columns = ref([])
    onMounted(() => {
      watchEffect(() => {
        columns.value = slots.rows({})
        .filter((child) => child.type.name === "lcColumn2")
        .map(_=> _.props)
        .map(_=> { return {columnName: _.title, sortName: _.sort}})
      });
    
      if (props.rememberQuery) {
        const previousSearchModel = getSessionStorage();
        if (previousSearchModel) {
          searchData.value = previousSearchModel;
        }
      }
      query();
    });

    const onRowClick = (item, event)=>{
      if(event.target.classList.contains('cell'))
        emit('row-click', { data: item });
    }


    const isSelectedAll = computed({
        get() {
            return dataSource.value.rows.every(item => item.selected);
        },
        set(value) {
          dataSource.value.rows.forEach(item => {
            item.selected = value
            toggleSelect(item, value)
          });
        }
    });

    // crossPageSelect, key
    const toggleSelect = (item, select) => {
      // 沒開啟就不要記儲存紀錄
      if(!crossPageSelect.value)
        return
      if(!selectKey.value)
        throw new Error(`The 'crossPageSelect' prop requires 'selectKey' to be set. Ensure 'selectKey' has a valid value.`)

      const id = item[selectKey.value]
      const hasData = selectedItems.value.has(id);
      
      if(select){
        if(!hasData){
          //如果找不到就新增
          selectedItems.value.set(id, item)
        }
      }else{
        //如果找得到就移除
        if(hasData){
          selectedItems.value.delete(id)
        }
      }
    }

    return {
      columns,
      dataSource,
      queryUrl,
      searchData,
      cols,
      selectable,
      isSelectedAll,
      selectedItems,

      nextPage,
      previousPage,
      jumpToPage,
      changePageSize,
      changeSort,
      toggleSelect,

      query,
      queryAll,
      getSelected,
      totalPage,

      onRowClick
    };
  },
  template: `
<div>
  <form class="p-3 bg-white custom-shadow">
    <slot name="search" :searchModel="searchData"></slot>
    <hr class="mt-0" />
    <div class="text-end">
      <button type="button" class="btn btn-color01 px-4 btn-sm" @click="query(true)">
        <i class="fas fa-search me-2"></i>查詢
      </button>
      <button type="button" class="btn btn-secondary btn-sm" @click="queryAll">
        <i class="fas fa-list-alt me-2"></i>列出全部
      </button>
    </div>
  </form>
  <div class="list-area p-3 mt-3 bg-white custom-shadow">
    <div class="row mb-2">
      <slot name="toolbar" :selectedItems></slot>
    </div>
    <div class="table m-0">
      <div class="row list-header bg-gray-light text-nowrap">
        <div class="cell" data-title="選取" 
          v-if="selectable">
          <div class="d-inline">
            <input class="form-check-input" type="checkbox"
              v-model="isSelectedAll"
              >
          </div>
        </div>
        <lc-column 
          v-for="item in columns"
          :column=item
          :key=item.columnName
          :searchData=searchData
          @click="changeSort(item)"
          >
        </lc-column>
      </div>
      <template v-if="dataSource.total">
        <div class="row list-body" 
          v-for="item in dataSource.rows" 
          @click="onRowClick(item, $event)"
        >
          <div class="cell" data-title="選取" v-if="selectable">
            <div class="d-inline">
              <input class="form-check-input" 
                type="checkbox" 
                v-model="item.selected"
                @click="toggleSelect(item, $event.target.checked)">
            </div>
          </div>
          <slot name="rows" :item></slot>
        </div>
      </template>
    </div>
    <div class="text-center text-dark" v-if="!dataSource.total">
      查無資料！
    </div>
  </div>
  <div class="list-pagination mt-3">
    <div>
      每頁
      <select class="form-select form-select-sm" v-model.number="searchData.pageSize" @change="changePageSize">
        <option>10</option>
        <option>30</option>
        <option>50</option>
      </select>
      筆，第 <span>{{searchData.nowPage}}/{{totalPage}}</span> 頁，共 <span>{{dataSource.total}}</span> 筆，
      <a href="javascript:void(0)" class="link-color" @click="previousPage">上一頁</a>｜跳至第
      <select class="form-select form-select-sm" v-model="searchData.nowPage" @change="jumpToPage">
        <option v-for="item in totalPage" :value="item">{{item}}</option>
      </select>
      頁｜<a href="javascript:void(0)" class="link-color" @click="nextPage">下一頁</a>
    </div>
  </div>
</div>
  `,
};

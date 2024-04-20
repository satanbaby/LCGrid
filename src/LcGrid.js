import fakeData from './fakeApiData.js';
import LcColumn from './LcColumn.js'
import {
  ref,
  computed,
  onMounted
} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
/**
 * todo:
 * 儲存搜尋紀錄再session storage
 */
export default {
  props: {
    /** API網址 */
    queryUrl: String,
    /** 欄位資訊 */
    cols: Array,
    /** 預設 searchModel */
    defaultSearchModel: {
      type: Object,
      default: () => { return {} }
    },
    /** 儲存當前資料 */
    guid: String,
    initQuery: { type: Boolean, default: () => true },
    rememberQuery: { type: Boolean, default: () => true }
  },
  components: {
    LcColumn,
  },
  setup(props) {
    const resetData = {
      ...{
        pageSize: 10,
        sortField: 'ID',
        sortAction: 'ASC',
        nowPage: 1,
      },
      ...props.defaultSearchModel
    }
    let searchData = ref({ ...resetData });
    let dataSource = ref({rows: [], total: 0});
    let cols = ref(props.cols)

    function nextPage() {
      if (searchData.value.nowPage >= getTotalPate()) return;
      searchData.value.nowPage++;
      query();
    }
    function previousPage() {
      if (searchData.value.nowPage <= 1) return;
      searchData.value.nowPage--;
      query();
    }
    function jumpToPage() {
      query();
    }
    function changePageSize() {
      searchData.value.nowPage = 1;
      query();
    }

    function query(fromDom = false) {
      if (fromDom) {
        searchData.value.nowPage = 1
      }

      if (props.rememberQuery) {
        setSessionStorage(searchData.value)
      }

      // 取代為AJAX
      dataSource.value = { ...fakeData.paginateData(searchData.value) };
    }
    function queryAll() {
      searchData.value = { ...resetData };
      query();
    }
    const getTotalPate = () => {
      return Math.ceil(dataSource.value.total / searchData.value.pageSize);
    };
    const totalPage = computed(getTotalPate);
    function getSelected() {
      return dataSource.value.rows.filter((_) => _.selected);
    }

    const changeSort = (clickCol) => {
      const sortName = clickCol.sortName
      if (!sortName)
        return

      let clickField = sortName
      let currentField = searchData.value.sortField
      let currentAction = searchData.value.sortAction
      let nextAction = currentField === clickField && currentAction === 'ASC'
        ? 'DESC' : 'ASC'

      searchData.value.sortAction = nextAction
      searchData.value.sortField = clickField

      query()
    }

    const setSessionStorage = () => {
      const guid = props.guid
      sessionStorage[guid] = JSON.stringify(searchData.value)
    }
    const getSessionStorage = () => {
      const guid = props.guid
      const storedObj = sessionStorage[guid]
      return JSON.parse(storedObj ?? null)
    }

    onMounted(() => {
      const previosSearchModel = getSessionStorage()
      if(props.rememberQuery){
        if (previosSearchModel) {
          searchData.value = previosSearchModel
        }
      }
      query()
    })

    return {
      dataSource,
      queryUrl: props.queryUrl,
      searchData,
      cols,

      nextPage,
      previousPage,
      jumpToPage,
      changePageSize,
      changeSort,

      query,
      queryAll,
      getSelected,

      totalPage,
    };
  },
  template: `
<div>
  <form class="p-3 bg-white custom-shadow">
    <slot name="search" :searchModel="searchData"></slot>
    <pre style="font-size: 8px">{{searchData}}</pre>
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
    {{queryUrl}}
    <div class="row mb-2">
      <slot name="toolbar"></slot>
    </div>
    <div class="table m-0">
      <div class="row list-header bg-gray-light text-nowrap">
        <lc-column 
          v-for="item in cols"
          :column=item
          :searchData=searchData
          @click="changeSort(item)"
          >
        </lc-column>
      </div>
      <template v-if="dataSource.total">
        <div class="row list-body" v-for="item in dataSource.rows">
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
  <pre>{{dataSource}}</pre>
</div>
  `,
};
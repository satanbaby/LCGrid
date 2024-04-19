import fakeData from './fakeApiData.js';
import LCColumn from './LCColumn.js'
import {
  ref,
  reactive,
  computed,
} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
/**
 * todo:
 * 儲存搜尋紀錄再session storage
 * 欄位排序
 */
export default {
  props: {
    // dataSource: Object,
    queryUrl: String,
    cols: Array,
  },
  components: {
    LCColumn,
  },
  setup(props) {
    const resetData = {
      pageSize: 10,
      sortField: 'ID',
      sortAction: 'ASC',
      nowPage: 1,
    };
    let searchData = ref({ ...resetData });
    let dataSource = ref(fakeData.paginateData(searchData.value));
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

    function query() {
      // alert(JSON.stringify(searchData.value, null, 2));
      dataSource.value = { ...fakeData.paginateData(searchData.value) };
      // console.log(dataSource)
      //console.log(fakeData.paginateData(searchData.value))
    }
    function queryAll() {
      searchData.value = { ...resetData };
      query();
    }
    const serializedData = computed(() => {
      return JSON.stringify(
        {
          searchModel: searchData.value,
          grid: dataSource.value,
        },
        null,
        2
      );
    });
    const getTotalPate = () => {
      return Math.ceil(dataSource.value.total / searchData.value.pageSize);
    };
    const totalPage = computed(getTotalPate);
    function getSelected() {
      return dataSource.value.rows.filter((_) => _.selected);
    }

    const changeSort = (clickCol)=>{
      const sortName = clickCol.sortName
      if(!sortName)
      return
      console.log('修改排序狀態', )

      let clickField = sortName
      let currentField = searchData.value.sortField
      let currentAction = searchData.value.sortAction
      let nextAction = currentField === clickField && currentAction === 'ASC'
            ? 'DESC' : 'ASC'

      searchData.value.sortAction = nextAction
      searchData.value.sortField = clickField
      console.log(clickField, currentField, currentAction, nextAction)
    }
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

      serializedData,
      totalPage,
    };
  },
  template: `
<div>
  <form class="p-3 bg-white custom-shadow">
    <slot name="search" :searchModel="searchData"></slot>
    <hr class="mt-0" />
    <div class="text-end">
      <button type="button" class="btn btn-color01 px-4 btn-sm" @click="query">
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
        <l-c-column 
          v-for="item in cols"
          :column=item
          @click="changeSort(item)"
          >
        </l-c-column>
      </div>
      <div class="row list-body" v-for="item in dataSource.rows">
        <slot name="rows" :item></slot>
      </div>
    </div>
  </div>
  <div class="list-pagination mt-3">
    <div>
      每頁
      <select class="form-select form-select-sm" v-model="searchData.pageSize" @change="changePageSize">
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
  <pre>{{serializedData}}</pre>
</div>
  `,
};

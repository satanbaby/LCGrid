import fakeData from './fakeApiData.js';
import LcColumn from './LcColumn.js';
const {
  ref,
  computed,
  onMounted
} = Vue

const DEFAULT_SEARCH_MODEL = {
  pageSize: 10,
  sortField: 'ID',
  sortAction: 'ASC',
  nowPage: 1,
};

export default {
  props: {
    queryUrl: String,
    cols: Array,
    defaultSearchModel: {
      type: Object,
      default: () => ({})
    },
    guid: String,
    initQuery: { type: Boolean, default: () => true },
    rememberQuery: { type: Boolean, default: () => true }
  },
  emits:[
    'row-click',
  ],
  components: {
    LcColumn,
  },
  setup(props, ctx) {
    const searchData = ref({ ...DEFAULT_SEARCH_MODEL, ...props.defaultSearchModel });
    const dataSource = ref({rows: [], total: 0});

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

      if (props.rememberQuery) {
        setSessionStorage(searchData.value);
      }

      // AJAX call to replace fakeData
      dataSource.value = { ...fakeData.paginateData(searchData.value) };
    };

    const queryAll = () => {
      searchData.value = { ...DEFAULT_SEARCH_MODEL };
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
      const guid = props.guid;
      sessionStorage[guid] = JSON.stringify(searchData.value);
    };

    const getSessionStorage = () => {
      const guid = props.guid;
      const storedObj = sessionStorage[guid];
      return JSON.parse(storedObj ?? null);
    };

    onMounted(() => {
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
        ctx.emit('row-click', { data: item });
    }

    return {
      dataSource,
      queryUrl: props.queryUrl,
      searchData,
      cols: ref(props.cols),

      nextPage,
      previousPage,
      jumpToPage,
      changePageSize,
      changeSort,

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
        <div class="row list-body" 
          v-for="item in dataSource.rows" 
          @click="onRowClick(item, $event)"
          >
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

import LCGridVueColumn from './LcGridVueColumn.js';
import {paginateData} from "./LocalPaggingList.js";
import FakeBackend from '../../FakeBackend/FakeBackend.js';

const {
    ref,
    computed,
    onMounted,
    toRefs,
    watchEffect,
    watch,
    provide
} = Vue

const DEFAULT_SEARCH_MODEL = {
    pageSize: 10,
    sortField: 'ID',
    sortAction: 'ASC',
    nowPage: 1,
};

export const LcColumn = {
    name: 'lcColumn',
    props: {
        title: String,
        hintTitle: String,
        sort: String,
    },
    setup(props) {
        return {
            title: props.title
        }
    },
    template: `
  <td :title="hintTitle">
    <slot></slot>
  </td>
  `,
};

export const FooterSelect = {
    name: 'FooterSelect',
    components: {
        dropdown: PrimeVue.Select
    },
    props: {
        totalPage: Number,
        options: Array
    },
    setup(props, context) {
        const virtualScrollerOptions = computed(()=>{
            if (props.totalPage > 20)
                return {
                    itemSize: 40
               }
             else
                 return null;
        })

        const totalPageOptions = computed(()=>{
            return Array.from({ length: Math.max(props.totalPage, 1) }, (_, i) => i + 1)
        })

        return {
            totalPageOptions,
            virtualScrollerOptions
        }
    },
    template: `
        <dropdown
            :options="options ?? totalPageOptions"
            :virtualScrollerOptions="virtualScrollerOptions"
            scrollHeight="300px"
            :pt="{
               root: '',
               input: 'py-1'
            }">
        </dropdown>
    `
}

const gridPrefix = "grid";

export const LcGridVue = {
    components: {
        listTitle: LCGridVueColumn,
        footerSelect: FooterSelect,
        checkbox: PrimeVue.Checkbox,
    },
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
        /** 進入頁面預設查詢條件 */
        entrySearchModel: {
            type: Object,
            default: () => null
        },
        /** 儲存查詢條件用GUID */
        guid: String,
        /** 是否在載入時執行查詢 */
        initQuery: { type: Boolean, default: () => true },
        /** 是否記錄查詢條件 */
        rememberQuery: { type: Boolean, default: () => true },
        /** 開啟checkbox */
        selectable: {
            type: [ Boolean, Function ],
            default: false,
        },
        /** 顯示序號 */
        showIndex: { type: Boolean, default: false },
        /** 序號標題 */
        indexTitle: { type: String, default: "序號" },
        /**
         * 啟用跨頁選取資料
         * true:  切換分頁時不會取消勾選; 查詢/列出全部，都會取消勾選
         * false: 切換分頁/查詢/列出全部，都會取消勾選
         */
        crossPageSelect: Boolean,
        /** 跨頁選取Key */
        selectKey: String,
        /** 是否開啟分頁功能 */
        paggingAble: { type: Boolean, default: true },
        /** 列表外部傳入 */
        list: {
            type: Array
        },
        /** 分頁筆數 */
        pageSizes:{
            type: Array,
            default: [10, 20, 50, 100, 150, 200]
        },
        /** 資料行樣式 */
        rowStyle: Function,
        /** 查詢前驗證行為 */
        beforeQuery: Function
    },
    setup(props, {emit, slots}) {
        const {defaultSearchModel, rememberQuery, guid, queryUrl, cols,
            selectable, showIndex, indexTitle, crossPageSelect, selectKey, paggingAble, list: localList} = toRefs(props)

        const initSearchData = { ...DEFAULT_SEARCH_MODEL, ...props.defaultSearchModel };
        // 不分頁時不設pagesize
        if (!paggingAble.value) {
            delete initSearchData.pageSize;
        }

        const searchData = ref(structuredClone(initSearchData));

        if (props.entrySearchModel) {
            searchData.value = { ...searchData.value, ...props.entrySearchModel };
        }

        const dataSource = ref({ rows: [], total: 0 });
        const selectedItems = ref(new Map())
        const searchError = ref({})

        const timestamp = ref(null)
        provide('clearFilter', timestamp);
        const clearSelectFilterEvent = () => {
            timestamp.value = Date.now()
        };

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

        const query = (fromDom = false, isBlock = true) => {
            if (fromDom) {
                searchData.value.nowPage = 1;
                selectedItems.value.clear();//查詢時清空選取
            }

            let postSearchModel = Object.assign({}, searchData.value);

            if (rememberQuery.value) {
                setSessionStorage();
            }

            if (localList.value) {
                if (!paggingAble.value){
                    dataSource.value = { rows: localList.value, total: localList.value.length }
                }else{
                    dataSource.value = paginateData(localList.value, searchData.value.nowPage, searchData.value.pageSize, searchData.value.sortAction, searchData.value.sortField);
                }
            } else {
                if (props.beforeQuery) {
                    if (!props.beforeQuery(postSearchModel)) {
                        return
                    }
                }

                dataSource.value = FakeBackend.GetList(postSearchModel)
                dataSource.value.rows.forEach(item => {
                    if (selectedItems.value.has(item[selectKey.value]))
                        item.selected = true
                })
            }
        };

        const queryAll = () => {
            searchData.value = structuredClone(initSearchData);
            query(true);
            clearSelectFilterEvent()
        };

        const getTotalPage = () => {
            return Math.ceil(dataSource.value.total / searchData.value.pageSize);
        };

        const totalPage = computed(getTotalPage);

        const getSelected = () => {
            if(crossPageSelect.value)
                return [...selectedItems.value.values()]
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
            sessionStorage[gridPrefix + guid.value] = JSON.stringify(searchData.value);
        };

        const getSessionStorage = () => {
            const storedObj = sessionStorage[gridPrefix + guid.value];

            return JSON.parse(storedObj ?? null, (key, value) => {
                const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
                if (typeof value == "string" && dateFormat.test(value)) {
                    value = new Date(value);
                }
                return value;
            });
        };

        const clearSessionStorage = () => {
            sessionStorage.removeItem(gridPrefix + guid.value);
        };

        if (rememberQuery.value) {
            const previousSearchModel = getSessionStorage();
            if (previousSearchModel) {
                searchData.value = previousSearchModel;
            }
        }

        const columns = ref([])
        onMounted(() => {
            watchEffect(() => {
                columns.value = slots.rows({})
                    .filter((child) => child.type.name === "lcColumn")
                    .map(_ => _.props)
                    .map(_ => {
                        return {columnName: _.title, sortName: _.sort}
                    })
            });

            if (props.initQuery) {
                query();
            }

            if (localList.value) {
                watch(localList, (newVal) => {
                    if (!paggingAble.value) {
                        dataSource.value = {rows: localList.value, total: localList.value.length}
                    } else {
                        dataSource.value = paginateData(localList.value, searchData.value.nowPage, searchData.value.pageSize, searchData.value.sortAction, searchData.value.sortField);
                    }
                }, {deep: true, immediate: true})
            }
        });

        const isSelectedAll = computed({
            get() {
                return dataSource.value.total > 0 && dataSource.value.rows.every(item => item.selected);
            },
            set(value) {
                dataSource.value.rows.forEach(item => {
                    item.selected = typeof props.selectable === 'function' && !props.selectable(item) ? false : value
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
            if(!Object.prototype.hasOwnProperty.call(item, selectKey.value))
                throw new Error(`The key field '${selectKey.value}' is not found in the grid object. Ensure the key matches one of the object's properties.`)

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
            showIndex,
            indexTitle,
            isSelectedAll,
            selectedItems,
            searchError,

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

            clearSessionStorage,
        };
    },
    template: `
    <div>
        <div
            v-if="$slots.search"
            class="bg-white mb-3 p-3" v-bind="$attrs">
            <slot name="search" :searchModel="searchData" :searchError></slot>
            <hr class="mt-0" />
            <div class="text-end">
                <slot name="query-bar" :query :queryAll>
                    <button type="button" class="btn btn-color01 px-4 btn-sm me-2" @click="query(true)">
                        <i class="fas fa-search me-2"></i> 查詢
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" @click="queryAll">
                        <i class="fas fa-list-alt me-2"></i> 列出全部
                    </button>
                </slot>
            </div>
        </div>
        <div class="bg-white mb-3 p-3">
            <div class="mb-2">
                <slot name="toolbar" :selectedItems="[...selectedItems.values()]" :searchModel="searchData"></slot>
            </div>
            <div class="table-responsive">
                <table class="table mb-0 table-hover custom-table text-start w-100">
                    <thead>
                    <tr class="table-secondary">
                        <th v-if="selectable" style="--t-width: 1em;">
                            <checkbox
                                v-model="isSelectedAll"
                                :binary="true"></checkbox>
                        </th>
                        <th v-if="showIndex">
                            {{indexTitle}}
                        </th>
                        <list-title
                            v-for="item in columns"
                            :column=item
                            :key=item.columnName
                            :searchData=searchData
                            @click="changeSort(item)"
                        >
                        </list-title>
                    </tr>
                    </thead>
                    <tbody>
                        <template v-if="dataSource.total">
                            <tr
                                 v-for="(item, index) in dataSource.rows"
                                 :key="item[selectKey]"
                                 :class="rowStyle ? rowStyle(item) : ''">
                                <td v-if="selectable" style="--t-width: 1em;">
                                    <checkbox v-if="typeof selectable === 'boolean' ? selectable : selectable(item)"
                                              v-model="item.selected"
                                              @click="toggleSelect(item, $event.target.checked)"
                                              :binary="true"
                                    ></checkbox>
                                </td>
                                <td v-if="showIndex">
                                    {{(searchData.nowPage - 1) * searchData.pageSize + index + 1}}
                                </td>
                                <slot name="rows" :item :index :searchModel="searchData"></slot>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="text-center text-dark" v-if="!dataSource.total">
                    <slot name="empty">
                        查無資料！
                    </slot>
                </div>
            </div>
        </div>
        <div
            v-if="paggingAble"
            class="page custom_pagination LCGD2-pager justify-content-center shadow-custom rounded-custom bg-white py-2 mt-3 rounded-custom bg-white mb-3 p-3">
            <div class="list-pagination">
                <div> 每頁
                    <footer-select
                        v-model.number="searchData.pageSize"
                        @change="changePageSize"
                        :options="pageSizes"
                    ></footer-select>
                    筆，第 <span>{{searchData.nowPage}}/{{totalPage}}</span> 頁，共 <span>{{dataSource.total}}</span> 筆，
                    <a href="javascript:void(0)" class="link-color" @click="previousPage">上一頁</a>｜跳至第
                    <footer-select
                        v-model="searchData.nowPage"
                        @change="jumpToPage"
                        :totalPage="totalPage"
                    ></footer-select>
                    頁｜<a href="javascript:void(0)" class="link-color" @click="nextPage">下一頁</a>
                </div>
            </div>
        </div>
    </div>`,
};

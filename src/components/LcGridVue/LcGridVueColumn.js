const { ref, computed, toRefs } = Vue

export default {
    props: {
        /** 外部傳入的欄位設定 */
        column: [String, { columnName: String, sortName: String }],
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
        const {searchData: search, column} = toRefs(props)

        if (typeof column.value === 'string') {
            columnName.value = column.value
        } else if (typeof column.value === 'object') {
            columnName.value = column.value.columnName
            sortName.value = column.value.sortName
            sortType.value = column.value.sortType ?? ''
        }

        const getActionStyle = computed(() => {
            if (sortName.value !== search.value.sortField)
                return "fa-caret-left";

            if (search.value.sortAction === 'ASC')
                return 'fa-caret-up';

            if (search.value.sortAction === 'DESC')
                return 'fa-caret-down';
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
    <th class="text-nowrap">
        {{columnName}}
        <i class="sortIcon px-1 fa" :class=getActionStyle v-if="sortName"></i>
    </th>`,
};

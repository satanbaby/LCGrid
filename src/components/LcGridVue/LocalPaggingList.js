/**
 * 將資料進行分頁
 * @param list {Array}
 * @param nowPage {Number}
 * @param pageSize {Number}
 * @param sortAction {String} ASC | DESC
 * @param sortField {String}
 * @returns {{total, rows: any}}
 */
export const paginateData = (list, nowPage, pageSize, sortAction = 'ASC', sortField = 'ID') => {
    // 檢查並拆分排序欄位和排序方式
    const fields = sortField.split(',').map(f => f.trim());
    const actions = sortAction.split(',').map(a => a.trim().toUpperCase());

    // 確保排序方式有效，若無效則預設為 ASC
    const validSortActions = ['ASC', 'DESC'];
    const normalizedActions = actions.map(action =>
        validSortActions.includes(action) ? action : 'ASC'
    );

    // 根據多個排序欄位和排序方式對資料進行排序
    const sortedData = list.slice().sort((a, b) => {
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const action = normalizedActions[i] || 'ASC'; // 如果排序方式不足，預設為 ASC

            if (a[field] > b[field]) {
                return action === 'ASC' ? 1 : -1;
            }
            if (a[field] < b[field]) {
                return action === 'ASC' ? -1 : 1;
            }
            // 如果當前欄位的值相等，繼續檢查下一個欄位
        }
        return 0; // 所有欄位都相等時，保持原順序
    });

    // 計算起始索引和結束索引
    const startIndex = (nowPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // 返回指定頁碼的分頁結果
    const result = sortedData.slice(startIndex, endIndex);
    return {
        rows: result,
        total: sortedData.length
    };
};

# LCGrid

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/satanbaby/LCGrid)

## 快速開始
```html
<lc-grid 
    ref="供父組件選擇的元件名"
    :query-url="發送API路徑"
    :default-search-model="{sortField: 'ID', sortAction: 'DESC'} 預設SearchModel"
    :remember-query="true 是否儲存查詢紀錄"
    :guid="GUID 儲存查詢紀錄用"
    :cols="['欄位1', {columnName: '欄位2', sortName: '資料庫排序欄位名'}]"
    :init-query="true 是否在畫面載入時自動查詢"
    >
    <template #search="{searchModel}">
        <!-- 查詢區域 -->
    </template>
    <template #toolbar>
        <!-- 工具列區域 -->
    </template>
    <template #rows="{item}">
        <!-- 列表區域 -->
    </template>
</lc-grid>
```
# LCGrid

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/satanbaby/LCGrid)

## 功能需求
- 在彈跳視窗中新增承辦人欄位
- 新增資料後，列表中新增一筆資料
- 編輯資料後按下儲存，列表中的資料也會跟著更新
- 點擊刪除按鈕，該筆資料會從列表中移除

## 假後端 API
`src/FakeBackend/FakeBackend.js` 文件模擬了後端 API，提供了以下方法：
- `GetList(searchModel)`: 根據搜尋模型返回分頁資料
- `Get(id)`: 根據 ID 獲取單筆資料
- `Create(item)`: 新增一筆資料
- `Update(id, updatedItem)`: 更新指定 ID 的資料
- `Delete(receNos)`: 刪除指定收件號碼的資料

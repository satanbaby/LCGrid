# LCGrid

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/satanbaby/LCGrid)

## 功能需求
1. 於彈跳視窗中，新增 [承辦人] 欄位(新增按鈕可呼叫彈跳視窗)
1. 新增: 按下儲存後列表新增一筆資料
1. 編輯: 按下儲存後，列表中的資料跟著更新
1. 點擊刪除按鈕，選取的資料資料會從列表中移除

    刪除時需確認是否有選取資料，沒有選取資料需跳出提醒，提醒訊息: 請選取欲刪除資料
1. 新增檢視功能

    列表的狀態欄位，新增 [檢視] 按鈕，所有input欄位接變成純文字，並且將儲存按鈕隱藏，僅剩取消功能
1. 彈出視窗的header，需依照[新增/編輯/檢視]狀態，顯示對應文字

    - 例如新增時，標題為: 彈跳視窗 - 新增
    - 檢視狀態時，標題為: 彈跳視窗 - 檢視
1. 調整列表樣式

    - 當 [到期日期]，小於今天，則列表該欄位字體顏色為紅色
    - 當 [到期日期]，等於今天，則列表該欄位字體顏色為綠色
    - 當 [到期日期]，在十天內，則列表該欄位字體顏色為藍色
    - 其他狀態，顯示黑色

## 假後端 API
`src/FakeBackend/FakeBackend.js` 文件模擬了後端 API，執行方法即可模擬後端更新資料的行為：
- `GetList(searchModel)`: 根據搜尋模型返回分頁資料
- `Get(id)`: 根據 ID 獲取單筆資料
- `Create(item)`: 新增一筆資料
- `Update(id, updatedItem)`: 更新指定 ID 的資料
- `Delete(receNos)`: 刪除指定收件號碼的資料

const list = [];
for (let i = 0; i < 100; i++)
  list.push({
    SN: i + 1,
    ReceNo: '11201010000' + i.toString().padStart(2, '0'),
    CaseNo: 'K000' + i.toString().padStart(2, '0'),
    ComeDate: '113/04/18',
    ReceDate: '114/04/16',
    FinalDate: '113/04/20',
    User: '周OO',
  });

const allField = Object.getOwnPropertyNames(list[0])

function paginateData({pageSize, nowPage, sortAction, sortField}) {
  // 檢查排序方式是否有效，預設為 ASC
  const validSortActions = ['ASC', 'DESC'];
  const action = validSortActions.includes(sortAction) ? sortAction : 'ASC';
  // 檢查排序欄位是否存在
  const validSortFields = allField;
  const field = validSortFields.includes(sortField) ? sortField : 'ID'; // 預設排序欄位為 id
  
  // 根據排序方式和排序欄位對資料進行排序
  const sortedData = list.slice().sort((a, b) => {
    if (action === 'ASC') {
      return a[field] > b[field] ? 1 : -1;
    } else {
      return b[field] > a[field] ? 1 : -1;
    }
  });
  
  // 計算起始索引和結束索引
  const startIndex = (nowPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // 返回指定頁碼的分頁結果
  const result = sortedData.slice(startIndex, endIndex)
  return {
    rows: result,
    total: sortedData.length
  };
}

export default {
  paginateData,
};
// export {
//   AllData: {

//   },
//   Bar,
// }
// export default {
//   total: 93,
//   rows: list,
// };

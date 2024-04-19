const list = [];
for (let i = 0; i < 100; i++)
  list.push({
    SN: i + 1,
    ReceNo: '11201010000' + i,
    CaseNo: 'K000' + i,
    ComeDate: '113/04/18',
    ReceDate: '114/04/16',
    FinalDate: '113/04/20',
    User: '周OO',
  });

function paginateData({ pageSize, nowPage }) {
  // 計算起始索引和結束索引
  const _pageSize = Number.parseInt(pageSize)
  const startIndex = (nowPage - 1) * _pageSize;
  const endIndex = startIndex + _pageSize;
  // 返回指定頁碼的分頁結果
  const result = {
    total: list.length,
    rows: list.slice(startIndex, endIndex),
  };
  return result
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

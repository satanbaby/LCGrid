import './styles.scss';
import { LcGridVue, LcColumn } from './components/LcGridVue/LcGridVue.js';
import LcModal from './components/LcModal/LcModal.js';
import LcDatepicker from './components/LcDatepicker/LcDatepicker.js';
import FakeBackend from './FakeBackend/FakeBackend.js';

const {
  createApp,
  ref
} = Vue;

const app = createApp({
  components: {
    LcGridVue,
    LcColumn,
    LcModal,
    LcDatepicker
  },
  setup() {
    const grid = ref(null);
    const modalData = ref({
      Status: { key: '', label: '' },
      ReceNo: '',
      User: '',
      Content: ''
    })
    const modalRef = ref(null)

    //管理Modal狀態用的Enum
    const modalStatusEnum = ref({
      add: { key: 'add', label: '新增' },
      edit: { key: 'edit', label: '編輯' },
      view: { key: 'view', label: '檢視' }
    })


    const deleteItems = () => {
      const selectedSN = grid.value.getSelected().map(_ => _.SN)
      const selectedReceNo = grid.value.getSelected().map(_ => _.ReceNo)
      if (selectedSN.length === 0) {
        alert('請選取欲刪除資料')
        return;
      }
      if (confirm(`確認刪除${selectedSN.length}筆資料？`)) {
        FakeBackend.Delete(selectedSN)
        const messageReceNos = selectedReceNo.join('、');
        alert('刪除文號:' + messageReceNos);
      }
      grid.value.query();
    }

    /**
     * 依到期日期調整列表樣式
     * @param {Date} Finaldate 公文到期日期
     * @returns 
     */
    const getFinalDateClass = (Finaldate) => {

      const today = new Date();
      today.setHours(0, 0, 0, 0);   //將時間歸零，只比較日期
      const finalDate = new Date(Finaldate);
      finalDate.setHours(0, 0, 0, 0);   //將時間歸零，只比較日期
      const diffDays = (finalDate - today) / (1000 * 60 * 60 * 24); // 計算相差天數(毫秒*秒*分鐘*小時來計算天數)

      if (diffDays < 0) {  //已逾期
        return 'text-danger';
      } else if (diffDays === 0) {  //今日到期
        return 'text-success';
      } else if (diffDays <= 10) {
        return 'text-primary';
      }
      return '';
    }


    const exportList = () => {
      alert('匯出');
    }
    const changeUser = () => {
      alert('異動承辦人');
    }
    /**
     * 打開Modal來add(新增)/edit(編輯)/view(檢視)公文資料
     * @param {string} status Modal狀態(add(新增)/edit(編輯)/view(檢視)))
     * @param {object} doc    傳入公文資料
     */
    const openModal = (status, doc) => {
      if (doc && doc.SN) {
        modalData.value = { ...doc }
      }
      modalData.value.Status = modalStatusEnum.value[status];
      modalRef.value.show();
    }

    const closeModal = () => {
      modalData.value = {};
    }


    const saveModal = () => {
      //檢查欄位
      if (!modalData.value.ReceNo || modalData.value.ReceNo.trim() == '') {
        alert('未填寫公文文號！');
        // console.log('未填寫公文文號');
        return;
      }
      if (!modalData.value.User || modalData.value.User.trim() == '') {
        alert('未填寫承辦人！');
        return;
      }
      //儲存
      if (modalData.value.Status.key === modalStatusEnum.value.add.key) {
        const saveItem = {
          ReceNo: modalData.value.ReceNo,
          User: modalData.value.User
          // Content:modalData.value.Content  //modal欄位有"備註"但建置data無此欄位
        }
        FakeBackend.Create(saveItem)
      }
      else if (modalData.value.Status.key === modalStatusEnum.value.edit.key) {
        const { Status, ...newData } = modalData.value;  //解構賦值(Destructuring Assignment) 排除Status不須存入
        FakeBackend.Update(modalData.value.SN, newData)
      }
      grid.value.query();
      modalRef.value.hide()
    }

    return {
      deleteItems,
      exportList,
      changeUser,
      openModal,
      closeModal,
      saveModal,
      getFinalDateClass,


      modalRef,
      modalData,
      grid,
      modalStatusEnum
    };
  },
});
app.mount('#app')

import './styles.scss';
import { LcGridVue, LcColumn } from './components/LcGridVue/LcGridVue.js';
import LcModal from './components/LcModal/LcModal.js';
import LcDatepicker from './components/LcDatepicker/LcDatepicker.js';
import FakeBackend from './FakeBackend/FakeBackend.js';
import { Modal } from 'bootstrap';
import { computed } from 'vue';

const {
  createApp,
  ref,
  onMounted,
  watch
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
      Status: '',
      ReceNo: '',
      User: '',
      Content: ''
    })
    const modalRef = ref(null)

    const deleteItems = () => {
      const selectedItem = grid.value.getSelected().map(_ => _.ReceNo)
      if (selectedItem.length === 0) {
        alert('請選取欲刪除資料')
        return;
      }
      if (confirm(`確認刪除筆${selectedItem.length}資料？`)) {
        FakeBackend.Delete(selectedItem)
        const messageReceNos = selectedItem.join('、');
        alert('刪除文號:' + messageReceNos);
      }
      else {

      }

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
     * 打開Modal來新增/編輯/檢視公文資料
     * @param {string} status Modal狀態(新增/編輯/檢視)
     * @param {object} doc    傳入公文資料
     */
    const openModal = (status, doc) => {
      if (doc && doc.SN) {
        modalData.value = { ...doc }
      }
      modalData.value.Status = status;
      modalRef.value.show();
    }

    const closeModal = () => {
      modalData.value = {
        Status: '',
        ReceNo: '',
        User: '',
        Content: ''
      }
      modalRef.value.hide()
    }

    const onModalHidden = () => {
      modalData.value = {}
    }

    const saveModal = () => {
      //檢查欄位
      if (modalData.value.ReceNo.trim() === '') {
        alert('未填寫公文文號！');
        // console.log('未填寫公文文號');
        return;
      }
      if (modalData.value.User.trim() === '') {
        alert('未填寫承辦人！');
        return;
      }
      //儲存
      if (modalData.value.Status === '新增') {
        const saveItem = {
          SN: 101,  //先設固定值
          ReceNo: modalData.value.ReceNo,
          CaseNo: `K00100`, //先設固定值
          ComeDate: dayjs().add(0, 'day').toDate(), //先設固定值
          ReceDate: dayjs().add(- 60, 'day').toDate(),  //先設固定值
          FinalDate: dayjs().add(- 30, 'day').toDate(), //先設固定值
          User: modalData.value.User
          // Content:modalData.value.Content  //modal欄位有"備註"但建置data無此欄位
        }
        FakeBackend.Create(saveItem)
      }
      else if (modalData.value.Status === '編輯') {
        FakeBackend.Update(modalData.value.SN, modalData.value)
      }

      closeModal();

    }

    return {
      deleteItems,
      exportList,
      changeUser,
      openModal,
      closeModal,
      onModalHidden,
      saveModal,
      getFinalDateClass,


      modalRef,
      modalData,
      grid,
    };
  },
});
app.mount('#app')

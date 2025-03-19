import './styles.scss';
import { LcGridVue, LcColumn } from './components/LcGridVue/LcGridVue.js';
import LcModal from './components/LcModal/LcModal.js';
import LcDatepicker from './components/LcDatepicker/LcDatepicker.js';
import FakeBackend from './FakeBackend/FakeBackend.js';
import { Modal } from 'bootstrap';

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
      ReceNo: '',
      User: '',
      Content: ''
    })
    const modalRef = ref(null)

    const deleteItems = () => {
      const selectedItem = grid.value.getSelected().map(_ => _.ReceNo)
      const messageReceNos = selectedItem.join('、');
      alert('刪除文號:' + messageReceNos);
    }

    const exportList = () => {
      alert('匯出');
    }
    const changeUser = () => {
      alert('異動承辦人');
    }
    const openModal = (doc) => {
      if (doc) {
        modalData.value = { ...doc }
      }
      modalRef.value.show()
    }

    const closeModal = () => {
      modalData.value = {
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


      modalRef,
      modalData,
      grid,
    };
  },
});
app.mount('#app')

import "./styles.scss";
import { LcGridVue, LcColumn } from "./components/LcGridVue/LcGridVue.js";
import LcModal from "./components/LcModal/LcModal.js";
import LcDatepicker from "./components/LcDatepicker/LcDatepicker.js";
import FakeBackend from "./FakeBackend/FakeBackend.js";
import NoticeModal from "./components/LcModal/DeleteModal.js";
const { createApp, ref } = Vue;

const app = createApp({
  components: {
    LcGridVue,
    LcColumn,
    LcModal,
    LcDatepicker,
    NoticeModal,
    // 需要註冊成元件
  },
  setup() {
    const grid = ref(null);
    const modalData = ref({});
    const modalRef = ref(null);
    const deleteModalRef = ref(null);
    const deleteModalData = ref(null);
    const mode = ref("default");
    const modeText = ref("新增");

    const switchColor = (d) => {
      const today = dayjs();
      const dueDay = dayjs(d);
      const tenDaysBeforeDue = dueDay.subtract(10, "day");
      let color = "";
      if (dueDay.isBefore(today, "day")) {
        color = "text-danger";
      } else if (dueDay.isSame(today, "day")) {
        color = "text-success";
      } else if (
        today.isBefore(dueDay, "day") &&
        today.isAfter(tenDaysBeforeDue, "day")
      ) {
        return "text-primary";
      }
      return color;
    };

    const deleteItems = () => {
      const selectedItem = grid.value.getSelected().map((_) => _.ReceNo);
      if (selectedItem) {
        deleteModalData.value = selectedItem;
      }
      openDeleteModal();
    };

    const deleteCases = () => {
      const confirmAction = confirm(`是否刪除`);
      if (confirmAction) {
        FakeBackend.Delete(deleteModalData.value);
        alert("刪除人員成功!!!");
        grid.value.query(true); //把分頁重設回第 1 頁，清除所有勾選項目
        deleteModalRef.value.hide();
      } else {
        deleteModalRef.value.hide();
      }
    };

    const exportList = () => {
      alert("匯出");
    };
    const changeUser = () => {
      alert("異動承辦人");
    };
    const openModal = ({ item, action }) => {
      modalData.value = {};
      switch (action) {
        case "edit":
          modeText.value = "編輯";
          break;
        case "review":
          modeText.value = "檢視";
          break;
        default:
          modeText.value = "新增";
      }
      mode.value = action;
      if (mode.value === "edit" || mode.value === "review") {
        const data = FakeBackend.Get(item.SN);
        modalData.value = data;
      } else {
        modalData.value = {};
      }
      modalRef.value.show();
      //測試出現不同標題
    };
    // lcmodal-->ref-->show-->index.html-->ref-->index.jsmodalopen = =lll
    //index自己有一層js主要是控制這層但是資料還是綁在modal上面所以這裡就是操作資料要在本來的畫面做處理
    const modalSave = () => {
      const actionText = mode.value === "edit" ? "更新" : "新增";
      const confirmAction = confirm(`是否${actionText}`);
      if (mode.value === "edit" && confirmAction) {
        const data = modalData.value;
        FakeBackend.Update(data.SN, data);
        alert("編輯人員成功!!!");
      } else if (mode.value === "create" && confirmAction) {
        const SN = FakeBackend.GetDataLength() + 1;
        const { ReceNo, User } = modalData.value;
        const today = dayjs();
        const dbShape = {
          SN,
          ReceNo: ReceNo ?? `11201010000${String(SN).padStart(3, "0")}`,
          CaseNo: `K000${String(SN).padStart(3, "0")}`,
          ComeDate: today.toDate(),
          ReceDate: today.add(-60, "day").toDate(),
          FinalDate: today.add(-30, "day").toDate(),
          User,
        };
        FakeBackend.Create(dbShape);
        alert("新增人員成功!!!");
      } else {
        modalRef.value.hide();
      }
      mode.value = "default";
      modalRef.value.hide();
      grid.value.queryAll();
    };

    const openDeleteModal = () => {
      deleteModalRef.value.show();
    };

    const onModalHidden = () => {
      modalData.value = {};
    };

    return {
      deleteItems,
      exportList,
      changeUser,
      openModal,
      onModalHidden,
      modalSave,
      deleteCases,
      switchColor,
      modalRef,
      modalData,
      grid,
      deleteModalRef,
      deleteModalData,
      mode,
      modeText,
    };
  },
});
app.mount("#app");

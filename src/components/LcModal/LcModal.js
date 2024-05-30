const {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} = Vue
import { Modal } from 'bootstrap';

export default {
  name: 'BootstrapModal',
  emits: ['hidden'],
  setup(props, { emit }) {
    const modal = ref(null);
    let modalInstance = null;

    onMounted(()=>{
      // console.dir()
      modal.value.addEventListener('hidden.bs.modal', function (event) {
        emit('hidden');
      })
    })

    onBeforeUnmount(() => {
      if (modalInstance) {
        modalInstance.dispose();
      }
    });

    const show = () => {
      console.log('show', modal.value)
      modalInstance = new Modal(modal.value);
      modalInstance.show();
    };

    const hide = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };

    const handleHidden = () => {
      console.log('hidden')
      emit('hidden');
    };


    return {
      modal,
      show,
      hide,
      handleHidden,
    };
  },
  template: `
  <!-- 新增燈箱 -->
  <div class="modal fade" ref="modal" tabindex="-1" aria-labelledby="addModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"></slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
  `,
}

// export default {
//   props: {
//   },
//   emits:[
//   ],
//   components: {
//   },
//   setup(props, ctx) {
//     onMounted(() => {
//     });
//     return {
//     };
//   },
  
// };

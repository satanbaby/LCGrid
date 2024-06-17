import { toRef } from "vue";

const {
  ref,
  computed,
  toRefs,
  watch,
  onMounted
} = Vue

export default {
  name: 'LabCategory',
  emits: ['update:lab-type', 'update:lab-kind'],
  props: {
    LabType: {
      type: Array,
      default: () => []
    },
    LabKind: {
      type: Array,
      default: () => []
    },
  },
  setup(props, { emit }) {
    const LabType = ref([...props.LabType]);
    const LabKind = ref([...props.LabKind]);
    
    watch(LabType, (newValue) => {
      emit('update:lab-type', newValue);
    });
    watch(LabKind, (newValue) => {
      emit('update:lab-kind', newValue);
    });
    watch(() => props.LabType, (newValue) => {
      console.log(newValue)
      LabType.value = [...newValue];
    });

    return { 
      LabType, LabKind 
    };

  },
  template: `
  <h1>{{LabType}}</h1>
  <label for="jack">
    <input type="checkbox" id="jack" value="Jack" name="Jack" v-model="LabType">
    Jack
  </label>
  <label for="john">
    <input type="checkbox" id="john" value="John" name="John" v-model="LabType">
    John
  </label>
  <label for="mike">
    <input type="checkbox" id="mike" value="Mike" name="Mike" v-model="LabType">
    Mike
  </label>
  <div>
    <label for="Joe">
      <input type="checkbox" id="Joe" value="Joe" name="Joe" v-model="LabKind">
      Joe
    </label>
    <label for="peter">
      <input type="checkbox" id="peter" value="peter" name="peter" v-model="LabKind">
      Peter
    </label>
  </div>
  `,
}

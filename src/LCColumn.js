import { ref, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
export default {
  props: {
    columnName: String,
    sortName: String,
  },
  setup(props) {
    console.log(props.columnName)
    return {
      columnName: props.columnName
    }
  },
  template: `
  <div class="cell">{{columnName}}</div>
  `,
};

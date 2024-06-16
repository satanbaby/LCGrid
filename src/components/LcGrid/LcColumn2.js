const { ref, computed, toRefs, h } = Vue;
export default {
  name: 'lcColumn2',
  props: {
    title: String
  },
  setup(props) {
    return {
        title: props.title
    }
  },
  template: `
  <div class="cell user-select-none" :data-title="title">
    <slot></slot>
  </div>
  `,
};

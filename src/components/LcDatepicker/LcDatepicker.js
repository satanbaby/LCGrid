// 基於primevuedate公用元件，主要把時間格式化為字串
const {
    ref, computed, watch, onMounted, toRef, useAttrs
} = Vue

export default {
    components: {
        calendar: PrimeVue.DatePicker
    },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        formatString: {
            type: String,
            default: 'yy/mm/dd'
        },
        minDate: {
            type: String,
            default: ''
        },
        maxDate: {
            type: String,
            default: ''
        },
        enableTime: {
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {

        const attrs = useAttrs();

        const hasShowTime = computed(() => {
            return 'show-time' in attrs;
        });

        const dayjsFormatString = computed(() => {
            const defaultFormat = props.formatString.toUpperCase().replace('YY', 'YYYY');
            if (!props.enableTime && !hasShowTime.value)
                return defaultFormat
            else
                return `${defaultFormat} HH:mm`
        })

        // 將 props.modelValue 轉換為內部 Date 格式
        const calendarRef = ref(null)
        const internalDate = ref(null)
        const internalHour = ref(null)
        const internalMin = ref(null)

        const modelValue = toRef(props, 'modelValue')

        const minDate = ref(null)
        const maxDate = ref(null)

        onMounted(() => {
            internalDate.value = props.modelValue ? new Date(dayjs(props.modelValue, dayjsFormatString.value)) : null;
            minDate.value = props.minDate ? new Date(dayjs(props.minDate, dayjsFormatString.value)) : null;
            maxDate.value = props.maxDate ? new Date(dayjs(props.maxDate, dayjsFormatString.value)) : null;

            if (props.enableTime) {
                internalHour.value = props.modelValue ? dayjs(props.modelValue).hour() : null;
                internalMin.value = props.modelValue ? dayjs(props.modelValue).minute() : null;
            }
        })

        watch(modelValue, (newVal, oldVal) => {
            internalDate.value = newVal ? new Date(dayjs(newVal, dayjsFormatString.value)) : null;
        })

        // 內部日期轉換為字串格式，並通過 `emit` 更新外部的 `modelValue`
        watch(internalDate, (newVal, oldVal) => {
            if (props.enableTime) {
                newVal = dayjs(internalDate.value ?? new Date()).hour(internalHour.value).minute(internalMin.value).toDate();
            }

            const formattedValue = newVal ? dayjs(newVal).format(dayjsFormatString.value) : null

            // 如果沒值，就不要更新外部model，不然會有model: null的狀態
            if (newVal || modelValue.value) // 外部有值就清空
            {
                emit('update:modelValue', formattedValue);
                if (newVal !== oldVal) {
                    emit('change', formattedValue);
                }
            }
        });

        watch(internalHour, (newVal, oldVal) => {
            internalDate.value = dayjs(internalDate.value ?? new Date()).hour(newVal).toDate();
        });

        watch(internalMin, (newVal, oldVal) => {
            internalDate.value = dayjs(internalDate.value ?? new Date()).minute(newVal).toDate();
        });


        const filteredAttrs = computed(() => {
            // 自動繼承prop時，自動忽略onUpdate:modelValue屬性
            const { 'onUpdate:modelValue': model, ...rest } = attrs;
            return rest;
        });

        return {
            filteredAttrs,
            internalDate,
            internalHour,
            internalMin,
            calendarRef,
            minDate,
            maxDate
        };
    },
    template: `
        <div class="row g-1">
            <div :class="enableTime ? 'col-md-6' : 'col-12'">
                <calendar
                    ref="calendarRef"
                    v-model="internalDate"
                    v-bind="filteredAttrs"
                    show-button-bar
                    :date-format="formatString"
                    show-icon
                    icon-display="input"
                    :min-date="minDate"
                    :max-date="maxDate"
                >
                </calendar>
            </div>
            <div v-if="enableTime" class="d-flex align-items-baseline col-md-6">
                <input-number
                    v-model="internalHour"
                    :min="0"
                    :max="23"
                    :max-fraction-digits="0"
                    ></input-number>
                <span class="mx-1">時</span>
                <input-number
                    v-model="internalMin"
                    :min="0"
                    :max="59"
                    :max-fraction-digits="0"
                    ></input-number>
                <span class="mx-1">分</span>
            </div>
        </div>

    `,
}

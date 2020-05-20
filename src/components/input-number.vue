<template>
    <div class="input-number-wraper">
        <label v-if="label" class="label" :class-required="classRequired">
            {{label}}
        </label>
        <div class="fieldGroup-number number-input" :class="{
          'number-input--inline': inline,
          'number-input--center': center,
          'number-input--controls': controls,
          [`number-input--${size}`]: size,
        }" v-on="listeners">
            <button v-if="controls" class="number-input__button number-input__button--minus" type="button" :disabled="disabled || readonly || !decreasable" @click="decrease"/>
            <input ref="input" class="number-input__input"
                    v-bind="attrs"
                    type="number"
                    :name="name"
                    :value="currentValue"
                    :min="min"
                    :max="max"
                    :step="step"
                    :readonly="readonly || !inputtable"
                    :disabled="disabled || (!decreasable && !increasable)"
                    :placeholder="placeholder"
                    autocomplete="off"
                    @change="change"
                    @paste="paste"
            >
            <button
                    v-if="controls"
                    class="number-input__button number-input__button--plus"
                    type="button"
                    :disabled="disabled || readonly || !increasable"
                    @click="increase"
            />
        </div>
    </div>
</template>

<script>
    const isNaN = Number.isNaN || window.isNaN;
    const REGEXP_NUMBER = /^-?(?:\d+|\d+\.\d+|\.\d+)(?:[eE][-+]?\d+)?$/;
    const REGEXP_DECIMALS = /\.\d*(?:0|9){10}\d*$/;
    const normalizeDecimalNumber = (value, times = 100000000000) => (
        REGEXP_DECIMALS.test(value) ? (Math.round(value * times) / times) : value
    );
    export default {
        name: 'input-number',
        model: {
            event: 'change',
        },
        props: {
            attrs: {
                type: Object,
                default: undefined,
            },
            center: Boolean,
            controls: Boolean,
            disabled: Boolean,
            inputtable: {
                type: Boolean,
                default: true,
            },
            inline: Boolean,
            max: {
                type: Number,
                default: Infinity,
            },
            min: {
                type: Number,
                default: -Infinity,
            },
            name: {
                type: String,
                default: undefined,
            },
            placeholder: {
                type: String,
                default: undefined,
            },
            readonly: Boolean,
            rounded: Boolean,
            size: {
                type: String,
                default: undefined,
            },
            step: {
                type: Number,
                default: 1,
            },
            value: {
                type: Number,
                default: NaN,
            },
            label: {
                type: String
            },
            classRequired: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                currentValue: NaN,
            };
        },
        computed: {
            /**
             * Indicate if the value is increasable.
             * @returns {boolean} Return `true` if it is decreasable, else `false`.
             */
            increasable() {
                const num = this.currentValue;
                return isNaN(num) || num < this.max;
            },
            /**
             * Indicate if the value is decreasable.
             * @returns {boolean} Return `true` if it is decreasable, else `false`.
             */
            decreasable() {
                const num = this.currentValue;
                return isNaN(num) || num > this.min;
            },
            /**
             * Filter listeners
             * @returns {Object} Return filtered listeners.
             */
            listeners() {
                const listeners = {...this.$listeners};
                delete listeners.change;
                return listeners;
            },
        },
        watch: {
            value: {
                immediate: true,
                handler(newValue, oldValue) {
                    if (
                        // Avoid triggering change event when created
                        !(isNaN(newValue) && typeof oldValue === 'undefined')
                        // Avoid infinite loop
                        && newValue !== this.currentValue
                    ) {
                        this.setValue(newValue);
                    }
                },
            },
        },
        methods: {
            /**
             * Change event handler.
             * @param {string} value - The new value.
             */
            change(event) {
                this.setValue(Math.min(this.max, Math.max(this.min, event.target.value)));
            },
            /**
             * Paste event handler.
             * @param {Event} event - Event object.
             */
            paste(event) {
                const clipboardData = event.clipboardData || window.clipboardData;
                if (clipboardData && !REGEXP_NUMBER.test(clipboardData.getData('text'))) {
                    event.preventDefault();
                }
            },
            /**
             * Decrease the value.
             */
            decrease() {
                if (this.decreasable) {
                    let {currentValue} = this;
                    if (isNaN(currentValue)) {
                        currentValue = 0;
                    }
                    this.setValue(Math.min(this.max, Math.max(
                        this.min,
                        normalizeDecimalNumber(currentValue - this.step),
                    )));
                }
            },
            /**
             * Increase the value.
             */
            increase() {
                if (this.increasable) {
                    let {currentValue} = this;
                    if (isNaN(currentValue)) {
                        currentValue = 0;
                    }
                    this.setValue(Math.min(this.max, Math.max(
                        this.min,
                        normalizeDecimalNumber(currentValue + this.step),
                    )));
                }
            },
            /**
             * Set new value and dispatch change event.
             * @param {number} value - The new value to set.
             */
            setValue(value) {
                const oldValue = this.currentValue;
                let newValue = this.rounded ? Math.round(value) : value;
                if (this.min <= this.max) {
                    newValue = Math.min(this.max, Math.max(this.min, newValue));
                }
                this.currentValue = newValue;
                if (newValue === oldValue) {
                    this.$refs.input.value = newValue;
                }
                this.$emit('change', newValue, oldValue);
            },
        },
    };
</script>

<style scoped>
    .input-number-wraper {}
    .label {
        font-size: 14px;
        font-weight: 400;
        color: rgb(51, 51, 51);
        box-sizing: border-box;
        box-shadow: none;
        margin: 0;
        display: block;
        padding: 5px 0;
        overflow-wrap: break-word;
    }
    .label[class-required="required"]::after {
        content: " *";
        color: rgb(168, 0, 0);
        padding-right: 12px;
    }
    .number-input__input:hover {
        border-color: rgb(51, 51, 51);
    }
    .number-input {
        display: block;
        font-size: 0;
        max-width: 100%;
        overflow: hidden;
        position: relative;
    }
    .number-input__button {
        cursor: pointer;
        background-color: #fff;
        border: 0;
        bottom: 1px;
        position: absolute;
        top: 1px;
        width: 2.5rem;
        z-index: 1;
    }
    .number-input__button:focus {
        outline: none;
    }
    .number-input__button:hover::before, .number-input__button:hover::after {
        background-color: #0074d9;
    }
    .number-input__button:disabled {
        opacity: 0.65;
    }
    .number-input__button:disabled::before, .number-input__button:disabled::after {
        background-color: #ddd;
    }
    .number-input__button::before, .number-input__button::after {
        background-color: #111;
        content: "";
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: background-color 0.15s;
    }
    .number-input__button::before {
        height: 1px;
        width: 50%;
    }
    .number-input__button::after {
        height: 50%;
        width: 1px;
    }
    .number-input__button--minus {
        border-bottom-right-radius: 0;
        border-right: 1px solid #ddd;
        border-top-right-radius: 0;
        left: 1px;
    }
    .number-input__button--minus::after {
        visibility: hidden;
    }
    .number-input__button--plus {
        border-bottom-left-radius: 0;
        border-left: 1px solid #ddd;
        border-top-left-radius: 0;
        right: 1px;
    }
    .number-input__input {
        -moz-appearance: textfield;
        background-color: #fff;
        border: 1px solid rgb(166, 166, 166);
        color: rgb(51, 51, 51);
        display: block;
        font-size: 1rem;
        line-height: 1.5;
        max-width: 100%;
        min-height: 1.5rem;
        min-width: 3rem;
        padding: 0.4375rem 0.875rem;
        /*transition: border-color 0.15s;*/
        width: 100%;
        outline: 0;
    }
    .number-input__input::-webkit-outer-spin-button, .number-input__input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    /*.number-input__input:focus {*/
        /*border-color: #0074d9;*/
        /*outline: none;*/
    /*}*/
    .number-input__input:disabled, .number-input__input[readonly] {
        background-color: #f8f8f8;
    }
    .number-input--inline {
        display: inline-block;
    }
    .number-input--inline > input {
        display: inline-block;
        width: 12.5rem;
    }
    .number-input--center > input {
        text-align: center;
    }
    .number-input--controls > input {
        padding-left: 3.375rem;
        padding-right: 3.375rem;
    }
    .number-input--small > input {
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
    }
    .number-input--small.number-input--inline > input {
        width: 1rem;
    }
    .number-input--small.number-input--controls > button {
        width: 2rem;
        background: rgb(244, 244, 244);
    }
    .number-input--small.number-input--controls > input {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
    }
    .number-input--large > input {
        font-size: 1.25rem;
        padding: 0.5rem 1rem;
    }
    .number-input--large.number-input--inline > input {
        width: 15rem;
    }
    .number-input--large.number-input--controls > button {
        width: 3rem;
    }
    .number-input--large.number-input--controls > input {
        padding-left: 4rem;
        padding-right: 4rem;
    }
    .fieldGroup-number:hover {
        border-color: rgb(51, 51, 51);
    }
</style>
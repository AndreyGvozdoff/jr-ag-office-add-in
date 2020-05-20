<template>
    <div class="input-url-wraper">
        <label v-if="label" class="label" :class-required="classRequired">{{ label }}</label>
        <div class="fieldGroup-url">
            <div class="prefix" v-if="!!prefix && prefix.length > 0">
                <span>{{prefix}}</span>
            </div>
            <input
                    class="input-url"
                    type="text"
                    :id="id"
                    :placeholder="placeholder"
                    :value="value"
                    :required="required"
                    v-on:input="updateValue($event.target.value)">
        </div>
    </div>
</template>

<script>
    export default {
        name: "input-url",
        props: {
            id: {
                type: String
            },
            label: {
                type: String
            },
            placeholder: {
                type: String,
                required: false
            },
            classRequired: {
                type: String,
                required: false
            },
            value: {
                type: String
            },
            required: {
                type: Boolean,
                default: false
            },
            prefix: {
                type: String,
                default: "https://"
            }
        },

        methods: {
            updateValue: function (value) {
                this.$emit('input', value);
            }
        }
    }
</script>

<style scoped>
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
    .input-url{
        box-shadow: none;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: 0;
        padding-top: 0;
        padding-right: 12px;
        padding-bottom: 0;
        padding-left: 12px;
        box-sizing: border-box;
        font-size: 14px;
        color: rgb(51, 51, 51);
        width: 100%;
        min-width: 0;
        text-overflow: ellipsis;
        border-radius: 0;
        border-width: initial;
        border-style: none;
        border-color: initial;
        border-image: initial;
        background: none transparent;
        outline: 0;
    }
    .fieldGroup-url:hover {
        border-color: rgb(51, 51, 51);
    }
    .fieldGroup-url {
        box-shadow: none;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        position: relative;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(166, 166, 166);
        border-image: initial;
        background: rgb(255, 255, 255);
    }
    .prefix {
        color: rgb(102, 102, 102);
        display: flex;
        align-items: center;
        padding: 0 10px;
        line-height: 1px;
        white-space: nowrap;
        background: rgb(244, 244, 244);
    }
    .prefix > span {
        padding-bottom: 1px;
    }
</style>

<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',
        components: {},
        data() {
            return {}
        },
        mounted() {},
        computed: {},
        watch: {},
        methods: {}
    };
</script>

<style>
    /*JobRouter Theme*/
    .jobrouter-default-jr-addin {
        background: #3b3e4d;
        color: #fff;
        margin: 0 auto;
        font-family: "Open Sans","Arial Unicode MS",Arial,Helvetica,sans-serif!important;
    }
    .jobrouter-default-jr-addin .ms-Button.ms-Button--primary, .jobrouter-default-jr-addin .root.is-active .pill  {
        background: #59aa6e!important;
    }
    .jobrouter-default-jr-addin .ms-Button.ms-Button--primary:hover {
        background: #3f9054;
    }
    .jobrouter-default-jr-addin .ms-Label {
        color: #fff;
    }
    .jobrouter-default-jr-addin a.ms-Link {
        color: #aaa;
    }
    .jobrouter-default-jr-addin a.ms-Link:hover {
        color: #fc3;
    }
    .jobrouter-default-jr-addin .ms-Panel-main {
        background: #e5e5e5;
        color: #222;
        font-family: "Open Sans","Arial Unicode MS",Arial,Helvetica,sans-serif!important;
    }
    .jobrouter-default-jr-addin .ms-Panel-main .ms-Label {
        color: #222;
    }
    .jobrouter-default-jr-addin .ms-Button--action:not(.is-disabled):not(.ms-Button--primary):hover {
        color: #fc3;
    }
    .jobrouter-default-jr-addin .ms-ChoiceField.isSelected .ms-ChoiceField-field:before {
        border-color: #fc3;
    }
    .jobrouter-default-jr-addin .ms-ChoiceField.isSelected .ms-ChoiceField-field:after {
        border-color: #fc3;
    }
    .jobrouter-default-jr-addin .ms-Button:hover {
        background: #ddd;
    }
    .jobrouter-default-jr-addin .label {
        color:#fff!important;
    }
    .jobrouter-default-jr-addin .ms-TextField.rootIsRequiredLabel .ms-Label:after, .label[class-required="required"]::after,.jobrouter-default-jr-addin .error-msg{
        color: #ff8a80!important;
    }
    .jobrouter-default-jr-addin .number-input__button:hover::before, .jobrouter-default-jr-addin .number-input__button:hover::after {
        background-color: #fc3!important;
    }
    .jobrouter-default-jr-addin .number-input__button:disabled::before, .jobrouter-default-jr-addin .number-input__button:disabled::after {
        background-color: #ddd!important;
    }
    .jobrouter-default-jr-addin .error-msg-block .ms-MessageBar-innerText {
        color:#fff;
    }
    .jobrouter-default-jr-addin .ms-ProgressIndicator-progressBar {
        background-color: #fc3;
    }
    .jobrouter-default-jr-addin .ms-Spinner .ms-Spinner-circle {
        border-color: #fc3 #e5e5e5 #e5e5e5;
    }
    .jobrouter-default-jr-addin .ms-Checkbox.is-checked:not(.is-disabled) .ms-Checkbox-checkbox {
        border-color: #fc3;
        background-color: #fff;
    }
    .jobrouter-default-jr-addin .ms-Checkbox.is-checked .ms-Checkbox-checkbox>i {
        color: #fc3;
    }
    .jobrouter-default-jr-addin .ms-Checkbox:not(.is-checked):hover .ms-Checkbox-checkbox>i {
        color: #fc3!important;
    }
    .jobrouter-default-jr-addin .ms-SpinButton .ms-SpinButton-container .ms-SpinButton-icons .ms-SpinButton-button {
        color: #fc3;
    }

        /*MS-Office Theme (default)*/
    .ms-fabric-ui-default-jr-addin {
        /*font-family: "Segoe UI Light", "Segoe UI", Thonburi, Arial, Verdana, sans-serif;*/
        margin: 0 auto;
        background-color: #fff;
    }
    .error-msg {
        color: rgb(255, 39, 39);
        font-size: 14px;
        font-weight: bold;
    }
    .error-msg-block {
        margin: 15px auto;
    }
    .error-msg-block .ms-MessageBar-innerText {
        font-size: 14px;
    }
    .padding {
        padding: 5px 15px;
    }
    .align-centered{
        text-align: center;
    }
    .align-left{
        text-align: left;
    }
    .align-right{
        text-align: right;
    }
    .flex-box-centered {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .ms-Checkbox {
        border:none!important;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

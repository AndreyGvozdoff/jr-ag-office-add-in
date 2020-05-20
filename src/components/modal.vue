<template>
    <div :class="containerClass">
        <div :class="{modal: true, in: showModal}" :style="{ display: showModal ? 'block' : 'none' }">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div v-if="this.$slots.header" class="modal-header">
                        <button v-if="closeAction" class="close" @click="closeAction">x</button>
                        <slot name="header"></slot>
                    </div>
                    <div v-if="this.$slots.body" class="modal-body">
                        <slot name="body"></slot>
                    </div>
                    <div v-if="this.$slots.footer" class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
        <div :class="{'modal-backdrop': showModal, in: showModal}"></div>
    </div>
</template>

<script>
    export default {
        name: "modal",
        props: {
            showModal: Boolean,
            closeAction: Function,
            containerClass: String
        }
    }
</script>

<style scoped>
    .close {
        float: right;
        font-size: 21px;
        font-weight: bold;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        opacity: 0.2;
        filter: alpha(opacity=20);
    }
    .close:hover,
    .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
        opacity: 0.5;
        filter: alpha(opacity=50);
    }
    button.close {
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
    }
    .modal-open {
        overflow: hidden;
    }
    .modal {
        display: none;
        overflow: hidden;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1050;
        outline: 0;
    }
    .modal.fade .modal-dialog {
        transform: translate(0, -25%);
        transition: transform 0.3s ease-out;
    }
    .modal.in .modal-dialog {
        transform: translate(0, 0);
    }
    .modal-open .modal {
        overflow-x: hidden;
        overflow-y: auto;
    }
    .modal-dialog {
        position: relative;
        width: auto;
        margin: 0 auto;
    }
    .modal-content {
        /*position: relative;*/
        background-color: #fff;
        padding: 15px;
        /*border: 1px solid rgba(0, 0, 0, 0.2);*/
        /*box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);*/
        /*background-clip: padding-box;*/
        /*outline: 0;*/
    }
    .modal-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1040;
        /*background-color: #000;*/
    }
    .modal-backdrop.fade {
        opacity: 0;
        filter: alpha(opacity=0);
    }
    .modal-backdrop.in {
        opacity: 0.5;
        filter: alpha(opacity=50);
    }
    .modal-header * {
        margin: 0 auto;
        padding-bottom: 15px;
    }
    .modal-header .close {
        margin-top: -2px;
    }
    .modal-title {
        margin: 0;
        line-height: 1.42857143;
    }
    /*.modal-body {*/
    /*    position: relative;*/
    /*}*/
    .modal-footer {
        padding: 15px;
        text-align: right;
        border-top: 1px solid #e5e5e5;
    }
    .modal-footer .btn + .btn {
        margin-left: 5px;
        margin-bottom: 0;
    }
    .modal-footer .btn-group .btn + .btn {
        margin-left: -1px;
    }
    .modal-footer .btn-block + .btn-block {
        margin-left: 0;
    }
    .modal-scrollbar-measure {
        position: absolute;
        top: -9999px;
        width: 50px;
        height: 50px;
        overflow: scroll;
    }
    @media (min-width: 768px) {
        .modal-dialog {
            width: 600px;
            margin: 30px auto;
        }
        .modal-content {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }
        .modal-sm {
            width: 300px;
        }
    }
    @media (min-width: 992px) {
        .modal-lg {
            width: 900px;
        }
    }
</style>
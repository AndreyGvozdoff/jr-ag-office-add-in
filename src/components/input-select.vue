<template>
    <div class="input-select-wraper">
        <label v-if="label" class="label" :class-required="classRequired">
            {{label}}
        </label>
    <div class="btn-group">
        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption.name !== undefined">
            {{ selectedOption.name }}
            <span class="caret"></span>
        </li>
        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption.name === undefined">
            {{placeholderText}}
            <span class="caret"></span>
        </li>

        <ul class="dropdown-menu" v-if="showMenu">
            <li v-for="(option, idx) in options" :key="idx">
                <a href="javascript:void(0)" @click="updateOption(option)">
                    {{ option.name }}
                </a>
            </li>
        </ul>
    </div>
    </div>
</template>

<script>
    export default {
        name: "input-select",
        data() {
            return {
                selectedOption: {
                    name: '',
                },
                showMenu: false,
                placeholderText: 'Please select an item',
            }
        },
        props: {
            options: {
                type: [Array, Object]
            },
            selected: {},
            placeholder: [String],
            closeOnOutsideClick: {
                type: [Boolean],
                default: true,
            },
            label: {
                type: String
            },
            classRequired: {
                type: String,
                required: false
            }
        },
        mounted() {
            this.selectedOption = this.selected;
            if (this.placeholder)
            {
                this.placeholderText = this.placeholder;
            }
            if (this.closeOnOutsideClick) {
                document.addEventListener('click', this.clickHandler);
            }
        },
        beforeDestroy() {
            document.removeEventListener('click', this.clickHandler);
        },
        methods: {
            updateOption(option) {
                this.selectedOption = option;
                this.showMenu = false;
                this.$emit('updateOption', this.selectedOption);
            },
            toggleMenu() {
                this.showMenu = !this.showMenu;
            },
            clickHandler(event) {
                const { target } = event;
                const { $el } = this;
                if (!$el.contains(target)) {
                    this.showMenu = false;
                }
            },
        }
    }
</script>

<style scoped>
    .input-select-wraper {}
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
    .btn-group {
        height: 30px;
        position: relative;
        margin-bottom: 5px;
        display: inline-block;
        vertical-align: middle;
        border: 1px solid rgb(166, 166, 166);
    }
    .btn-group a:hover {
        text-decoration: none;
    }
    .btn-group:hover {
        border-color: rgb(51, 51, 51);
    }
    .dropdown-toggle {
        color: #636b6f;
        min-width: 60px;
        padding: 4px 20px 4px 10px;
        text-transform: none;
        float: none;
        box-shadow: none;
        border-radius: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .dropdown-toggle:hover {
        cursor: pointer;
    }
    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        float: left;
        min-width: 90px;
        padding: 0;
        margin: 1px 0 0;
        list-style: none;
        font-size: 14px;
        text-align: left;
        background-color: #fff;
        border: 1px solid rgb(166, 166, 166);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        background-clip: padding-box;
    }
    .dropdown-menu > li > a {
        padding: 10px;
        display: block;
        clear: both;
        font-weight: normal;
        line-height: 1.6;
        color: #333333;
        white-space: nowrap;
        text-decoration: none;
    }
    .dropdown-menu > li > a:hover {
        background: #efefef;
        color: #409FCB;
    }
    .dropdown-menu > li {
        overflow: hidden;
        width: 100%;
        position: relative;
        margin: 0;
    }
    .caret {
        width: 0;
        position: absolute;
        top: 15px;
        height: 0;
        margin-left: -24px;
        vertical-align: middle;
        border-top: 4px dashed;
        border-top: 4px solid \9;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        right: 10px;
    }
    li {
        list-style: none;
    }
</style>
<template>
    <div class="content padding align-left">
        <h4 slot="header">{{$t('form_header_title')}}</h4>
        <div class="error-msg" v-if="$v.enviromentUrl.$error || $v.username.$error || $v.password.$error">{{$t('form_error_required_fields')}}</div>
        <div class="error-msg" v-if="unauthorizedStatus">{{unauthorizedStatus}}</div>
        <div class="log-in-form">
            <form @submit.prevent="">
                <input-url v-model="enviromentUrl" :label="$t('form_url_title')" class-required="required"></input-url>
                <input-number v-model="instanceId" :label="$t('form_instance_title')" :value="0" :step="1" :min="0" size="small" inline controls rounded></input-number>
                <VTextField class="username-input" v-model.trim="username" :label="$t('form_username_title')" required errorMessage=""></VTextField>
                <input-password v-model.trim="password" :label="$t('form_password_title')" :showIcon="enviromentType" name="password" class-required="required" required></input-password>
                <VDefaultButton @click.native="getToken" :primary="true" :text="$t('form_login_btn')"></VDefaultButton>
            </form>
        </div>
    </div>
</template>

<script>
    import {required} from "vuelidate/lib/validators";
    import inputPassword from "@/components/input-password";
    import inputNumber from "@/components/input-number";
    import inputUrl from "@/components/input-url";
    import LocalStorageResource from '@/services/localStorage';
    import jobRouterApi from "@/services/jobRouterApi";
    import currentLang from '../helpers/lang';

    const localStorage = new LocalStorageResource();

    export default {
        name: "login",
        components: {inputPassword, inputNumber, inputUrl},
        data() {
            return {
                selectedTheme: 'ms-fabric-ui-default-jr-addin',
                baseUrl: '',
                enviromentUrl: '',
                username: '',
                password: '',
                instanceId: 0,
                unauthorizedStatus: null,
                token: '',
                enviromentType: this.$enviromentType
            }
        },
        validations: {
            enviromentUrl: { required },
            username: { required },
            password: {required}
        },
        mounted() {
            currentLang.getCurrentLangHelper(this.$route);
            this.getDataFromStorage();
            this.getCurrentTheme();
        },
        watch: {
            enviromentUrl(val) {
                if(val){
                    this.$nextTick(() => this.enviromentUrl = val.replace(/^(https?|ftp):\/\//, ''));
                }
            }
        },
        methods: {
            getToken() {
                this.$v.$touch();
                if(this.$v.$error || this.$v.$invalid) return;
                this.baseUrl = "https://" + this.enviromentUrl.replace(/\/+$/, '');
                    jobRouterApi.getAuthToken(this.baseUrl, this.instanceId, this.username, this.password)
                        .then(res => {
                            this.token = res.tokens[0];
                            let storeObject = {["token"]: this.token, ["enviromentUrl"]: this.baseUrl, ["username"]: this.username};
                            if(this.instanceId > 0) {
                                storeObject["instanceId"] = this.instanceId;
                            }
                            return localStorage.StoreValues(storeObject)
                        }).then(() => {
                        this.$router.push('/');
                    },error => {
                        if(error.bodyText) {
                            let errorParse = JSON.parse(error.bodyText);
                            this.unauthorizedStatus = errorParse.errors['-'][0];
                        } else {
                            this.unauthorizedStatus = this.$i18n.messages[this.$i18n.locale].form_error_unauthorized;
                        }
                    });
            },
            getDataFromStorage() {
                localStorage.GetValues(["enviromentUrl", "instanceId", "username"]).then(result => {
                    this.enviromentUrl = result.enviromentUrl;
                    this.instanceId = !result.instanceId ? this.instanceId : result.instanceId;
                    this.username = result.username;
                });
            },
            getCurrentTheme() {
                localStorage.GetValue("currentTheme").then((res) => {
                    this.selectedTheme = !res ? this.selectedTheme : res;
                    const elementBody = document.querySelector('body');
                    const classBodyTheme = elementBody.classList[1];
                    elementBody.className = elementBody.className.replace(classBodyTheme, this.selectedTheme);
                });
            }
        }
    }
</script>

<style scoped>
    .log-in-form {
        margin-top: 10px;
    }
    .content h4 {
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .jobrouter-default-jr-addin .content h4 {
        color: #fff;
    }
</style>

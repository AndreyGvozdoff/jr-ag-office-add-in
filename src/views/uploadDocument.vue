<template>
    <div class="ms-Grid align-centered" dir="ltr">
        <!--main menu-->
        <div class="ms-Grid-row menu-with-avatar">
            <div class="ms-Grid-col ms-md3 ms-sm3 ms-smPush9">
                <div class="ms-Persona flex-box-centered" @click="isOpenUserInfoSettings = true">
                    <div class="ms-Persona-coin" data-size="13">
                        <div class="ms-Persona-imageArea">
                            <div class="ms-Image ms-Persona-image">
                                <img v-if="userInfo[0]" :src="baseUrl+'/assets/cache/avatars/'+userInfo[0].avatar" class="ms-Image-image ms-Link">
                                <img v-else src="../assets/defaultavatar.png" class="ms-Image-image ms-Link">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--user info panel-->
        <VPanel v-if="isOpenUserInfoSettings" :is-open="isOpenUserInfoSettings" @onDismiss="isOpenUserInfoSettings = false">
            <template slot="header">
                <div class="header-text">
                    {{$t("user_settings_title")}}
                </div>
            </template>
            <template slot="body">
                <div class="panel-content">
                    <VPersona class="user-info" :imageUrl="baseUrl+'/assets/cache/avatars/'+userInfo[0].avatar" :size="13" :text="userInfo[0].preName +' '+ userInfo[0].lastName +' ('+ userInfo[0].id +')'" :secondaryText="baseUrl.replace('https://','')"></VPersona>
                    <ul class="ms-Grid" dir="ltr">
                        <li>
                            <VCheckbox v-model="useSystemLang" :label="$t('use_sys_lng_text')" box-side="end" @click.native="disableSaveBtn = false"></VCheckbox>
                        </li>
                        <li class="ms-Grid-row select-content">
                            <div class="ms-Grid-col ms-sm3 ms-md3 ms-lg3 select-content-text">{{$t("language")}}:</div>
                            <div class="ms-Grid-col ms-sm9 ms-md9 ms-lg9">
                                <dropdownOfficeUiFabricVue v-model="selectedLang" :disabled="useSystemLang" label="" :options="optionsLang" error-message="" @click.native="disableSaveBtn = false"></dropdownOfficeUiFabricVue>
                            </div>
                        </li>
                        <li class="ms-Grid-row select-content">
                            <div class="ms-Grid-col ms-sm3 ms-md3 ms-lg3 select-content-text">{{$t("theme")}}:</div>
                            <div class="ms-Grid-col ms-sm9 ms-md9 ms-lg9">
                                <VChoiceGroup v-model="selectedTheme" :options="optionsTheme" label="" required="" @onChange="onChangeTheme"></VChoiceGroup>
                            </div>
                        </li>
                        <li class="align-centered"><VDefaultButton :primary="true" :disabled="disableSaveBtn" :text="$t('user_settings_save_btn')" @click.native="saveUserSettings"></VDefaultButton></li>
                        <li class="align-centered"><VDefaultButton :text="$t('logout_addin')" @click.native="logOut"></VDefaultButton></li>
                    </ul>
                </div>
            </template>
        </VPanel>
        <!--main-content-->
        <VSpinner :size="3" v-if="showSpinner"></VSpinner>
        <div class="content-header">
            <img class="responsive-img" src="../assets/logo.svg">
            <h4>{{$t('header_title')}}</h4>
        </div>
        <div class="content-main">
            <div class="msg-content" v-if="msgErrors">
                <VMessageBar :type="1" class="error-msg-block">{{msgErrors}}</VMessageBar>
                <VDefaultButton v-if="!uploadStatus" :primary="true" :text="$t('login_again')" @click.native="logOut"></VDefaultButton>
                <VDefaultButton v-if="uploadStatus" :primary="true" :text="$t('reload_addin')" @click.native="reloadAddin"></VDefaultButton>
            </div>
            <div class="itemName">{{fileName}}</div>
            <div v-if="showUploadBtn" class="flex-box-centered">
                <VCheckbox v-model="addInfo" :label="$t('additional_info')" box-side="end"></VCheckbox>
            </div>
            <ul v-if="addInfo" class="ms-Grid add-info" dir="ltr">
                <li class="ms-Grid-row select-content">
                    <div class="ms-Grid-col ms-sm3 ms-md3 ms-lg3 select-content-text">{{$t("comment")}}:</div>
                    <div class="ms-Grid-col ms-sm9 ms-md9 ms-lg9">
                        <VTextField v-model.trim="comment" :multiline="true" :maxlength="commentMaxLimit"></VTextField>
                        <div class="commetn-limit-counter align-right" v-text="(comment.length+'/'+commentMaxLimit)"></div>
                    </div>
                </li>
                <li class="ms-Grid-row select-content">
                    <div class="ms-Grid-col ms-sm3 ms-md3 ms-lg3 select-content-text">{{$t("pageCount")}}:</div>
                    <div class="ms-Grid-col ms-sm9 ms-md9 ms-lg9">
                        <VSpinButton v-model.number="pageCount" :min="0" :max="99999"></VSpinButton>
                    </div>
                </li>
            </ul>
            <div v-if="fileGuid" class="upload-new-file">
                <VToggle v-model="uploadNewDocument" :on-text="$t('upload_new_on')" :off-text="$t('upload_new_off')" :label="$t('upload_new_text')+':'"></VToggle>
            </div>
            <div v-if="showUploadBtn" class="upload-btn">
                <VDefaultButton :disabled="uploadBtnDisabled" :primary="true" :text="$t('upload_btn')" @click.native.once="uploadDocument"></VDefaultButton>
            </div>
            <transition name="fade">
                <div v-if="showProgressBar" class="upload-progress-bar">
                    <VProgressIndicator :percent-complete="progress"></VProgressIndicator>
                    <div class="itemDescription">{{progress}}%</div>
                </div>
            </transition>
            <div class="download-hint" v-if="downloadUrl">
                <VLabel>{{$t('download_text')}}</VLabel>
                <VLink :href="downloadUrl">{{fileName}}</VLink>
            </div>
        </div>
    </div>
</template>

<script>
    import dropdownOfficeUiFabricVue from "@/components/dropdown";
    import LocalStorageResource from "@/services/localStorage";
    import jobRouterApi from "@/services/jobRouterApi";
    import currentLang from "../helpers/lang";
    import Vue from "vue";
    import {languages, options} from '@/settings';

    const localStorage = new LocalStorageResource();

    export default {
        name: "uploadDocument",
        components: {dropdownOfficeUiFabricVue},
        data() {
            return {
                selectedTheme: 'ms-fabric-ui-default-jr-addin',
                optionsTheme: options,
                userInfo: [],
                addInfo: false,
                useSystemLang: false,
                comment: '',
                commentMaxLimit: 255,
                pageCount: 0,
                isOpenUserInfoSettings: false,
                disableSaveBtn: true,
                selectedLang: [],
                optionsLang : [],
                baseUrl: '',
                currentLngFromJobRouterApi: '',
                getCurrentLngFromJobRouterApiStatus: true,
                fileName: '',
                username: '',
                instanceId: 0,
                token: '',
                msgErrors: '',
                progress: 0,
                mimetype: Vue.prototype.$defaultMimetype,
                fileGuid: null,
                downloadUrl: null,
                uploadStatus: false,
                showProgressBar: false,
                showUploadBtn: true,
                showSpinner: false,
                uploadNewDocument: false,
                uploadBtnDisabled: false,
                infoOfficeHost: this.$infoOfficeHost,
                infoOfficePlatform: this.$infoOfficePlatform,
                enviromentType: this.$enviromentType
            }
        },
        mounted() {
            currentLang.getCurrentLangHelper(this.$route, this.currentLngFromJobRouterApi, this.getCurrentLngFromJobRouterApiStatus);
        },
        created() {
            this.getDataFromStorage();
        },
        computed: {},
        watch: {
            "$route": "getDataFromStorage",
            addInfo(){
                this.clearAdditionInfo();
            }
        },
        methods: {
            getDataFromStorage() {
                localStorage.GetValues(["token", "enviromentUrl", "instanceId", "username", "language", "useSysLang"]).then(result => {
                    this.token = result.token;
                    this.baseUrl = result.enviromentUrl;
                    this.instanceId = !result.instanceId ? this.instanceId : result.instanceId;
                    this.username = result.username;
                    this.currentLngFromJobRouterApi = !result.language ? this.currentLngFromJobRouterApi : result.language;
                    this.useSystemLang = !result.useSysLang ? this.useSystemLang : JSON.parse(result.useSysLang);
                }).then(()=>{
                    return this.getUserInfoAndIsAuthenticated();
                })
            },
            getUserInfoAndIsAuthenticated() {
                jobRouterApi.getUserInfo(this.baseUrl, this.instanceId, this.username, this.token).then(res => {
                    this.userInfo.push(res.users[0]);
                    if(!this.currentLngFromJobRouterApi) {
                        this.currentLngFromJobRouterApi = this.userInfo[0].language;
                        localStorage.StoreValue("language", this.currentLngFromJobRouterApi)
                    }
                    currentLang.getCurrentLangHelper(this.$route, this.currentLngFromJobRouterApi, this.getCurrentLngFromJobRouterApiStatus);
                    this.getAllLanguages();
                    this.getFileName();
                    this.getCurrentTheme();
                },(error) => {
                    if (error.status === 401) {
                        localStorage.removeValues(["token", "instanceId", "enviromentUrl", "username"]).then(() => {
                            this.$router.push("/login");
                        });
                    }
                    else {
                        let errorParse = JSON.parse(error.bodyText);
                        this.msgErrors = errorParse.errors['-'][0];
                   }
                });
            },
            getFileName() {
                window.Office.context.document.getFilePropertiesAsync(asyncResult => {
                    if (this.enviromentType === "desktop") {
                        if(asyncResult.status === window.Office.AsyncResultStatus.Failed || asyncResult.value.url === "") {
                            this.msgErrors = this.$i18n.messages[this.$i18n.locale].error_file_not_saved;
                            this.progress = 0;
                            this.uploadStatus = true;
                            this.showUploadBtn = false;
                        } else {
                            this.fileName = decodeURI(asyncResult.value.url.split("\\").pop());
                        }
                    } else {
                        this.fileName = decodeURI(asyncResult.value.url.split("/").pop());
                    }
                });
            },
            getAllLanguages(){
                jobRouterApi.getAllLanguages(this.baseUrl, this.instanceId, this.token).then(res => {
                    for(let i = 0; i < res.length; i++) {
                        this.optionsLang.push({key: res[i].language, text: res[i].language, title: res[i].language});
                            if(this.currentLngFromJobRouterApi === res[i].language){
                                this.selectedLang.push({key: res[i].language, text: res[i].language, title: res[i].language});
                        }
                    }
                },(error) => {
                    this.getCurrentLngFromJobRouterApiStatus = false;
                     let errorParse = JSON.parse(error.bodyText);
                     console.log(errorParse.errors['-'][0]);
                     //remove displaying this error on front and get languages from json file
                     //this.msgErrors = errorParse.errors['-'][0];
                     for(let i = 0; i < languages.length; i++) {
                        this.optionsLang.push({key: languages[i].language, text: languages[i].language, title: languages[i].language});
                            if(this.currentLngFromJobRouterApi === languages[i].language){
                                this.selectedLang.push({key: languages[i].language, text: languages[i].language, title: languages[i].language});
                            }
                        }
                });
            },
            saveUserSettings(){
                localStorage.StoreValues({["language"]:this.selectedLang.length ? this.selectedLang[0].key : '', ["currentTheme"]:this.selectedTheme, ["useSysLang"]:this.useSystemLang}).then(() => {
                    this.isOpenUserInfoSettings = false;
                    this.disableSaveBtn = true;
                    this.currentLngFromJobRouterApi = this.selectedLang.length ? this.selectedLang[0].key : '';
                    currentLang.getCurrentLangHelper(this.$route, this.currentLngFromJobRouterApi, this.getCurrentLngFromJobRouterApiStatus);
                    if (this.enviromentType === "desktop" && !this.fileName) { this.reloadAddin(); }
                },error => {
                    let errorParse = JSON.parse(error.bodyText);
                    this.msgErrors = errorParse.errors['-'][0];
                });
            },
            deleteExistingDocument() {
                jobRouterApi.deleteUploadedDocument(this.baseUrl, this.instanceId, this.fileGuid, this.token).then(() => {},error => {
                    let errorParse = JSON.parse(error.bodyText);
                    this.msgErrors = errorParse.errors['-'][0];
                });
            },
            logOut() {
                localStorage.removeValue("token").then(()=> {
                    this.$router.push('/login');
                });
            },
            reloadAddin() {
                this.showSpinner = true;
                window.location.reload();
            },
            clearAdditionInfo() {
                this.comment = '';
                this.pageCount = 0;
            },
            uploadDocument() {
                this.uploadBtnDisabled = true;
                this.progress = 0;
                this.showProgressBar = true;
                window.Office.context.document.getFileAsync(window.Office.FileType.Compressed, {sliceSize: 1000000},
                    result => {
                        if (result.status === window.Office.AsyncResultStatus.Succeeded) {
                            const myFile = result.value;
                            const sliceCount = myFile.sliceCount;
                            const slicesReceived = 0, gotAllSlices = true, docdataSlices = [];
                            this.getSliceAsync(myFile, 0, sliceCount, gotAllSlices, docdataSlices, slicesReceived);
                        } else {
                            this.msgErrors = result.error.message;
                        }
                    });
            },
            getSliceAsync(file, nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived) {
                file.getSliceAsync(nextSlice, sliceResult => {
                    if (sliceResult.status === "succeeded") {
                        if (!gotAllSlices) {
                            return;
                        }
                        docdataSlices[sliceResult.value.index] = sliceResult.value.data;
                        if (++slicesReceived === sliceCount) {
                            file.closeAsync();
                            this.onGotAllSlices(docdataSlices);
                        } else {
                            this.getSliceAsync(file, ++nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived);
                        }
                    } else {
                        gotAllSlices = false;
                        file.closeAsync();
                        this.msgErrors = sliceResult.error.message;
                    }
                });
            },
            onGotAllSlices(docdataSlices) {
                let docdata = [];
                for (let i = 0; i < docdataSlices.length; i++) {
                    docdata = docdata.concat(docdataSlices[i]);
                }
                /*eslint-disable no-unused-vars*/
                let fileContent = new String();
                for (let j = 0; j < docdata.length; j++) {
                    fileContent += String.fromCharCode(docdata[j]);
                }

                const fileData = new FormData();
                fileData.append("file", this.b64toBlob(btoa(fileContent), this.mimetype), this.fileName);
                fileData.append("source", "Uploaded via Office Add-In");
                if(this.addInfo){
                    if(this.comment){
                        fileData.append("comment", this.comment);
                    }
                    if(this.pageCount > 0){
                        fileData.append("pageCount", this.pageCount);
                    }
                }

                this.showProgressBar = true;
                this.showUploadBtn = false;

                this.uploadStatus = false;
                this.progress = 0;
                if(!this.uploadNewDocument) {
                    //with extra request (ver 1)
                    jobRouterApi.checkIfDocumentExistOnDocumenHub(this.baseUrl, this.instanceId, this.token, this.fileGuid).then((res) => {
                        if(res.length !== 0){
                            this.deleteExistingDocument();
                        }
                    });
                    //with extra request (ver 2)
                    // jobRouterApi.getAllDocuments(this.baseUrl, this.instanceId, this.token).then((res) => {
                    //     let obj = res.documenthub.filter(i => i.guid === this.fileGuid);
                    //     if(obj.length !== 0){
                    //         this.deleteExistingDocument();
                    //     }
                    // },error => {
                    //     let errorParse = JSON.parse(error.bodyText);
                    //     this.msgErrors = errorParse.errors['-'][0];
                    // });
                    //without extra request
                    //jobRouterApi.deleteUploadedDocument(this.baseUrl, this.instanceId, this.fileGuid, this.token);
                }
                this.$http.post(this.baseUrl + "/api/rest/" + (this.instanceId > 0 ? + this.instanceId + "/v2/application/documenthub" : "v2/application/documenthub"), fileData, {
                    headers: {"X-Jobrouter-Authorization": "Bearer " + this.token},
                    progress: e => {
                        if (e.lengthComputable) {
                            this.progress = Math.round(e.loaded / e.total * 100);
                        }
                    }
                }).then(response => {
                    setTimeout(() => {
                        this.showProgressBar = false;
                    }, 1000);

                    this.uploadBtnDisabled = false;
                    this.showUploadBtn = true;
                    this.clearAdditionInfo();
                    this.downloadUrl = response.data.documenthub.downloadUrl;
                    this.fileGuid = response.data.documenthub.guid;
                    this.mimetype = response.data.documenthub.mimetype;
                }, error => {
                    let errorParse = JSON.parse(error.bodyText);
                    this.msgErrors = errorParse.errors['-'][0];

                    this.showProgressBar = false;
                    this.showUploadBtn = false;

                    this.progress = 0;
                    this.uploadStatus = false;
                }).then(()=> { this.uploadStatus = false;});
            },
            b64toBlob(b64Data, contentType = '', sliceSize = 512) {
                const byteCharacters = atob(b64Data);
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                return new Blob(byteArrays, {type: contentType});
            },
            getCurrentTheme() {
                localStorage.GetValue("currentTheme").then((res) => {
                    this.selectedTheme = !res ? this.selectedTheme : res;
                    const elementBody = document.querySelector('body');
                    const classBodyTheme = elementBody.classList[1];
                    elementBody.className = elementBody.className.replace(classBodyTheme, this.selectedTheme);
                });
            },
            onChangeTheme(option) {
                this.disableSaveBtn = false;
                const elementBody = document.querySelector('body');
                const classBodyTheme = elementBody.classList[1];
                elementBody.className = elementBody.className.replace(classBodyTheme, option.key);
            }
        }
    }
</script>

<style scoped>
    .menu-with-avatar{
        padding-top: 10px;
    }
    .responsive-img {
        max-width: 100%;
        height: auto;
    }
    .itemName {
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgb(51, 51, 51);
        font-size: 14px;
        padding-bottom: 15px;
        line-height: 20px;
        overflow: hidden;
    }
    .itemDescription {
        color: rgb(102, 102, 102);
        font-size: 14px;
        line-height: 18px;
    }
    .add-info {
        margin: 0 auto;
        list-style: none;
        padding: 15px 8px 0 8px;
    }
    .add-info li {
        padding-bottom: 15px;
    }
    .add-info li:last-child {
        padding-bottom: 5px;
    }
    .add-info  .select-content-text {
        padding: 0;
        word-break: break-word;
    }
    .commetn-limit-counter {
        font-size: 10px;
    }
    .upload-btn {
        padding-top: 35px;
        padding-bottom: 25px;
    }
    .download-hint {
        padding: 15px 0;
    }
    .upload-new-file {
        margin: 0 auto;
        padding-bottom: 5px;
        padding-top: 10px;
    }
    .msg-content {
        margin: 10px auto;
    }
    .panel-content {
        padding: 0 15px;
    }
    .panel-content ul {
        margin: 0 auto;
        padding: 0;
        list-style: none;
    }
    .panel-content ul li {
        padding: 10px 0;
    }
    .content-header {
        padding-top: 24px;
    }
    .content-header h4 {
        font-size: 16px;
        font-weight: normal;
    }
    .select-content-text {
        padding-top: 6px;
    }
    .panel-content ul li.select-content, .user-info {
        padding-bottom: 14px;
    }
    .header-text {
        text-align: center;
    }
    @media (max-width: 480px) {
        .header-text {
            position: fixed;
            top: 5px;
            left: 15px;
        }
    }

    /*JobRouter Theme*/
    .jobrouter-default-jr-addin .content-header h4, .jobrouter-default-jr-addin .itemName {
        color: #fff;
    }
    .jobrouter-default-jr-addin .itemDescription {
        color: #fc3;
    }
    .jobrouter-default-jr-addin .add-info{
        color: #fff;
    }
</style>

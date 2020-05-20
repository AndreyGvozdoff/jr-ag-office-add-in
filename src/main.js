import Vue from 'vue';
import App from './App';
import VueResource from 'vue-resource';
import router from './router'
import Fabric from '@johannes-z/office-ui-fabric-vue';
import Vuelidate from 'vuelidate';
import VueI18n from 'vue-i18n';
import messages from './lang';

//import '@johannes-z/office-ui-fabric-vue/dist/office-ui-fabric-vue.css';
//import '@johannes-z/office-ui-fabric-vue/src/css/fabric.core.css'

require('@johannes-z/office-ui-fabric-vue/dist/office-ui-fabric-vue.css');
require('@johannes-z/office-ui-fabric-vue/src/css/fabric.core.css');

Vue.use(Fabric);

Vue.use(VueI18n);
export const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: messages
});

Vue.use(VueResource);
Vue.use(Vuelidate);

Vue.config.productionTip = false;
//Vue.prototype.$http = axios;

window.Office.onReady((info) => {
    Vue.prototype.$enviromentType = window.top === window ? 'desktop' : 'browser';
    if(Object.keys(window.Office.context).length !== 0) {
        Vue.prototype.$infoOfficeContentLanguage = window.Office.context.contentLanguage.split("-")[0];
        Vue.prototype.$infoOfficeDisplayLanguage = window.Office.context.displayLanguage.split("-")[0];
        Vue.prototype.$documentUrl = window.Office.context.document.url;
    }

    Vue.prototype.$infoOfficeHost = info.host;
    Vue.prototype.$infoOfficePlatform = info.platform;

    if (info.host === window.Office.HostType.Excel) {
        Vue.prototype.$defaultMimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if(info.host === window.Office.HostType.Word) {
        Vue.prototype.$defaultMimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (info.host === window.Office.HostType.PowerPoint){
        Vue.prototype.$defaultMimetype = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else {
        Vue.prototype.$defaultMimetype = 'application/octet-stream';
    }
    if (info.platform === window.Office.PlatformType.PC) {
        //Example: Make minor layout changes in the task pane.
    }
    console.log(`Office.js is now ready in ${info.host} on ${info.platform}`);
    //type of:
    //host:
        //Word: "Word"
        //Excel: "Excel"
        //PowerPoint: "PowerPoint"
        //Outlook: "Outlook"
        //OneNote: "OneNote"
        //Project: "Project"
        //Access: "Access"
        //Visio: "Visio"
    //platform:
        // PC: "PC"
        // OfficeOnline: "OfficeOnline"
        // Mac: "Mac"
        // iOS: "iOS"
        // Android: "Android"
        // Universal: "Universal"
    new Vue({
        router,
        i18n,
        render: h => h(App)
    }).$mount('#app');
}).then(() => {
    if (Object.keys(window.Office.context).length === 0) {
        let app = document.getElementById("app");
        app.insertAdjacentHTML("beforeend", "<div class='flex-box-centered' style='height: 100vh;'>" +
            "<div class='error-msg-block align-centered'>" +
            "<p class='error-msg'>Sorry, this add-in works only inside Office client</p>" +
            "<a target='_blank' href='https://www.office.com/'>Go to office.com ></a>" +
            "</div>" +
            "</div>");
    }
});


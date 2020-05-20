import LocalStorageResource from '@/services/localStorage';
import Vue from "vue";
import {i18n} from "@/main";

const localStorage = new LocalStorageResource();
export default {
    getCurrentLangHelper(url, lang) {
       localStorage.GetValue("language").then((res) => {
            let currentLngFromOffice = Vue.prototype.$infoOfficeContentLanguage;
            let currentLngFromJobRouterApi = !lang ? res : lang;

            if (!currentLngFromJobRouterApi && url.path === '/login') {
                //fix Ukrainian language
                if(currentLngFromOffice === 'uk') {
                    return i18n.locale = 'ru';
                }else{
                    return i18n.locale = currentLngFromOffice;
                }
            }
            else if (currentLngFromJobRouterApi === 'english') {
                return i18n.locale = 'en';
            } else if (currentLngFromJobRouterApi === 'german') {
                return i18n.locale = 'de';
            } else if (currentLngFromJobRouterApi === 'russian') {
                return i18n.locale = 'ru';
            }
       });
    }
}

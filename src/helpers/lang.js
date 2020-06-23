import LocalStorageResource from '@/services/localStorage';
import Vue from "vue";
import {i18n} from "@/main";
import {languages} from '@/settings';

const localStorage = new LocalStorageResource();
export default {
    getCurrentLangHelper(url, lang, status) {
        localStorage.GetValues(["useSysLang", "language"]).then((res) => {
            let useSysLang = JSON.parse(res.useSysLang);
            let currentLngFromOffice = Vue.prototype.$infoOfficeContentLanguage;
            let currentLngFromJobRouterApi = !lang ? res.language : lang;

            if (!currentLngFromJobRouterApi && url.path === '/login') {
                //fix Ukrainian language
                if(currentLngFromOffice === 'uk') {
                    return i18n.locale = 'ru';
                }else{
                    return i18n.locale = currentLngFromOffice;
                }
            }
            else if (useSysLang) {
                   //fix Ukrainian language
                if(currentLngFromOffice === 'uk') {
                    return i18n.locale = 'ru';
                }else{
                    return i18n.locale = currentLngFromOffice;
                }
            }
            else if (status && currentLngFromJobRouterApi === 'english') {
                return i18n.locale = 'en';
            } else if (status && currentLngFromJobRouterApi === 'german') {
                return i18n.locale = 'de';
            } else if (status && currentLngFromJobRouterApi === 'russian') {
                return i18n.locale = 'ru';
            }
            else if(!status) {
                for(let i = 0; i < languages.length; i++) {
                    if(currentLngFromJobRouterApi === languages[i].language) {
                        return i18n.locale = languages[i].locale;
                    }
                 }
            }
       });
    }
}

import Vue from "vue";
import VueResource from "vue-resource";
Vue.use(VueResource);

export default {
    getAuthToken(baseUrl, instanceId, user, pswd){
        return Vue.http.post(baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/application/tokens" : "application/tokens"), {
            "username": user,
            "password": pswd,
            "lifetime": 3600
        }).then(res => {
            return res.data;
        });
    },
    getUserInfo(baseUrl, instanceId, user, token){
        return Vue.http.get( baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/application/users/" + user : "application/users/" + user),
            {headers: {"X-Jobrouter-Authorization": "Bearer " + token}}
            )
            .then(res => {
                return res.data
            });
    },
    getFullUserInfo(baseUrl, instanceId, user, token){
        return Vue.http.get( baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/configuration/users/" + user : "configuration/users/" + user),
            {headers: {"X-Jobrouter-Authorization": "Bearer " + token}})
            .then(res => {
                return res.data;
            });
    },
    deleteUploadedDocument(baseUrl, instanceId, fileGuid, token){
        return Vue.http.delete(baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/v2/application/documenthub/" + fileGuid : "v2/application/documenthub/" + fileGuid),
            {headers: {"X-Jobrouter-Authorization": "Bearer " + token}})
            .then( (res) => {
                return res.data
            });
    },
    getAllDocuments(baseUrl, instanceId, token){
        return Vue.http.get(baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/v2/application/documenthub" : "v2/application/documenthub"),
            {headers: {"X-Jobrouter-Authorization": "Bearer " + token}})
            .then( (res) => {
                return res.data
            });
    },
    checkIfDocumentExistOnDocumenHub(baseUrl, instanceId, token, fileGuid){
        return Vue.http.get(baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/v2/application/documenthub" : "v2/application/documenthub"),
            {headers: {"X-Jobrouter-Authorization": "Bearer " + token}})
            .then( (res) => {
                return res.data.documenthub.filter(i => i.guid === fileGuid);
            });
    },
    getAllLanguages(baseUrl, instanceId, token){
        return Vue.http.get(baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/configuration/languages" : "configuration/languages"),
            {headers: {"X-Jobrouter-Authorization": "Bearer " + token}})
            .then(res => {
                return res.data.languages.filter((v,i,a)=>a.findIndex(t=>(t.language === v.language))===i);
            });
    },
    uploadCurrentDocument(baseUrl, instanceId, file, progress, token){
        return Vue.http.post(baseUrl + "/api/rest/" + (instanceId > 0 ? + instanceId + "/v2/application/documenthub" : "v2/application/documenthub"), file,
            {
                headers: {"X-Jobrouter-Authorization": "Bearer " + token},
                /*eslint-disable no-unused-vars*/
                progress: e  => {
                    if (e.lengthComputable) {
                        progress = Math.round(e.loaded / e.total * 100);
                    }
                }
            }
        ).then(res => {
            return res.data
        })
    }
}

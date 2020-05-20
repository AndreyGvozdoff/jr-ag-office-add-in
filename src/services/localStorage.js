export default class LocalStorageResource {
    StoreValue(key, value) {
        return window.OfficeRuntime.storage.setItem(key, value);
    }
    GetValue(key) {
        return window.OfficeRuntime.storage.getItem(key);
    }
    removeValue(key) {
        return window.OfficeRuntime.storage.removeItem(key);
    }
    GetValues(keys) {
        return window.OfficeRuntime.storage.getItems(keys);
    }
    StoreValues(keys, values) {
        return window.OfficeRuntime.storage.setItems(keys, values);
    }
    removeValues(keys) {
        return window.OfficeRuntime.storage.removeItems(keys);
    }
}
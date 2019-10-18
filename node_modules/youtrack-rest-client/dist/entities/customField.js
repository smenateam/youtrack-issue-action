"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customFieldDefaults_1 = require("./customFieldDefaults");
class CustomFieldImpl {
    constructor() {
        this.aliases = '';
        this.fieldDefaults = new customFieldDefaults_1.CustomFieldDefaultsImpl();
        this.hasRunningJob = false;
        this.isAutoAttached = false;
        this.isDisplayedInIssueList = false;
        this.isUpdateable = false;
        this.localizedName = '';
        this.name = '';
        this.ordinal = 0;
        this.id = '';
    }
}
exports.CustomFieldImpl = CustomFieldImpl;

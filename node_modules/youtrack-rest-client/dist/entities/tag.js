"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urls_1 = require("../config/urls");
const base_1 = require("./base");
class TagEndpoint extends base_1.BaseEndpoint {
    all() {
        return this.toPromise(this.client.get(urls_1.urls.TAGS)).then(response => {
            return response;
        });
    }
}
exports.TagEndpoint = TagEndpoint;

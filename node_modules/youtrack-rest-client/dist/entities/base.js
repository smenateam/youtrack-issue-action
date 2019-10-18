"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format = require("string-template");
class BaseEndpoint {
    constructor(client) {
        this.client = client;
    }
    format(template, values) {
        return format(template, values);
    }
    toPromise(request) {
        return Promise.resolve(request.then(response => {
            return response;
        }).catch(error => {
            return Promise.reject(error);
        }));
    }
}
exports.BaseEndpoint = BaseEndpoint;

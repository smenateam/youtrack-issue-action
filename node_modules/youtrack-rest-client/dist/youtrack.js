"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const user_1 = require("./endpoints/user");
const tag_1 = require("./endpoints/tag");
const issue_1 = require("./endpoints/issue");
const project_1 = require("./endpoints/project");
const agile_1 = require("./endpoints/agile");
const sprint_1 = require("./endpoints/sprint");
const workitem_1 = require("./endpoints/workitem");
const comment_1 = require("./endpoints/comment");
class Youtrack {
    constructor(options) {
        this.defaultRequestOptions = { jar: true, json: true };
        this.defaultRequestOptions = Object.assign({}, this.defaultRequestOptions, { headers: {
                Authorization: `Bearer ${options.token}`
            } });
        this.baseUrl = this.formBaseUrl(options.baseUrl);
        this.users = new user_1.UserEndpoint(this);
        this.tags = new tag_1.TagEndpoint(this);
        this.issues = new issue_1.IssueEndpoint(this);
        this.projects = new project_1.ProjectEndpoint(this);
        this.agiles = new agile_1.AgileEndpoint(this);
        this.sprints = new sprint_1.SprintEndpoint(this);
        this.workItems = new workitem_1.WorkItemEndpoint(this);
        this.comments = new comment_1.CommentEndpoint(this);
    }
    post(url, params = {}, headers = {}) {
        return request.post(this.baseUrl + url, this.prepareParams(params, headers));
    }
    get(url, params = {}, headers = {}) {
        return request.get(this.baseUrl + url, this.prepareParams(params, headers));
    }
    delete(url, params = {}, headers = {}) {
        return request.delete(this.baseUrl + url, this.prepareParams(params, headers));
    }
    put(url, params = {}, headers = {}) {
        return request.put(this.baseUrl + url, this.prepareParams(params, headers));
    }
    formBaseUrl(baseUrl) {
        if (baseUrl.match(/\/$/)) {
            baseUrl = baseUrl.slice(0, -1);
        }
        if (!baseUrl.match(/api$/i)) {
            baseUrl += "/api";
        }
        return baseUrl;
    }
    prepareParams(params, customHeaders) {
        if ('headers' in this.defaultRequestOptions && Object.keys(customHeaders).length > 0) {
            // merge the header parameters
            const _a = this.defaultRequestOptions, { headers } = _a, defaultOptions = __rest(_a, ["headers"]);
            return Object.assign({}, defaultOptions, params, { headers: Object.assign({}, headers, customHeaders) });
        }
        if ('headers' in this.defaultRequestOptions) {
            return Object.assign({}, this.defaultRequestOptions, params);
        }
        return Object.assign({}, this.defaultRequestOptions, params, { headers: Object.assign({}, customHeaders) });
    }
}
exports.Youtrack = Youtrack;

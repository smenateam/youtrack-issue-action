"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
class PrFieldError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
class YoutrackError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
const youtrack = {
    youtrackAxiosInstance: null,
    init(youtrackBaseURL, youtrackToken) {
        const youtrackConfig = {
            baseURL: youtrackBaseURL,
            headers: {
                Authorization: `Bearer ${youtrackToken}`,
            },
        };
        this.youtrackAxiosInstance = axios_1.default.create(youtrackConfig);
        return {
            getIssueById: this.getIssueById.bind(this),
            updateIssue: this.updateIssue.bind(this),
            findFieldByName: this.findFieldByName.bind(this),
        };
    },
    getIssueById(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: issue } = yield this.youtrackAxiosInstance.get(`/api/issues/${issueId}/`, {
                    params: {
                        fields: "fields(name,id,value(text))",
                    },
                });
                return issue;
            }
            catch (error) {
                const errorMessage = `Request failed with status code ${error.response.status}: ${error.response.data.error_description}`;
                throw new YoutrackError(errorMessage);
            }
        });
    },
    updateIssue(issueId, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: issue } = yield this.youtrackAxiosInstance.post(`/api/issues/${issueId}`, requestData, {
                    params: {
                        fields: "fields(name,id,value(text))",
                    },
                });
                return issue;
            }
            catch (error) {
                const errorMessage = `Request failed with status code ${error.response.status}: ${error.response.data.error_description}`;
                throw new YoutrackError(errorMessage);
            }
        });
    },
    findFieldByName(fields, name) {
        const field = fields.find((field) => {
            if (field.name === name)
                return true;
            return false;
        });
        if (field)
            return field;
        const errorMessage = `Поле с именем ${name} не найдено`;
        throw new YoutrackError(errorMessage);
    },
};
function addPrLinkInPrField(prField, prLink, merged = false) {
    const status = merged ? "x" : " ";
    const oldPrFieldValue = prField.value;
    const newPrFieldValue = {
        text: `- [${status}]${prLink}\n`,
    };
    if (oldPrFieldValue) {
        const regexPrLink = new RegExp(`${prLink}\\b`);
        const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);
        if (textHasPrLink)
            throw new PrFieldError(`Добовляемая ссылка на pull request: ${prLink} уже есть в описании`);
        const textHasLineBreakInTheEnd = !!oldPrFieldValue.text.match(/\n$/);
        newPrFieldValue.text = textHasLineBreakInTheEnd
            ? `${oldPrFieldValue.text}${newPrFieldValue.text}`
            : `${oldPrFieldValue.text}\n${newPrFieldValue.text}`;
    }
    prField.value = newPrFieldValue;
    return prField;
}
function crossOutPrLinkInPrField(prField, prLink) {
    const oldPrFieldValue = prField.value;
    if (!oldPrFieldValue)
        throw new PrFieldError(`Удаляемая ссылка на pull request: ${prLink} не найдена, т.к. описание пустое`);
    const regexPrLink = new RegExp(`${prLink}\\b`);
    const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);
    if (!textHasPrLink)
        throw new PrFieldError(`Удаляемая ссылка на pull request: ${prLink} не найдена в описании`);
    const regexPrLinkCheckbox = new RegExp(`- \\[.]${prLink}\\b`, "g");
    const newPrFieldValue = {
        text: oldPrFieldValue.text.replace(regexPrLinkCheckbox, `~~${prLink}~~`),
    };
    prField.value = newPrFieldValue;
    return prField;
}
function reAddPrLinkInPrField(prField, prLink) {
    const oldPrFieldValue = prField.value;
    if (!oldPrFieldValue)
        return addPrLinkInPrField(prField, prLink);
    const regexPrLink = new RegExp(`${prLink}\\b`);
    const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);
    if (!textHasPrLink)
        return addPrLinkInPrField(prField, prLink);
    const regexPrLinkСrossedOut = new RegExp(`~~${prLink}~~`, "g");
    const newPrFieldValue = {
        text: oldPrFieldValue.text.replace(regexPrLinkСrossedOut, `- [ ]${prLink}`),
    };
    prField.value = newPrFieldValue;
    return prField;
}
function updateCheckboxPrLinkInPrField(prField, prLink, merged) {
    const oldPrFieldValue = prField.value;
    if (!oldPrFieldValue)
        return addPrLinkInPrField(prField, prLink, true);
    const regexPrLink = new RegExp(`${prLink}\\b`);
    const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);
    if (!textHasPrLink)
        return addPrLinkInPrField(prField, prLink, true);
    const status = merged ? "x" : " ";
    const regexPrLinkCheckbox = new RegExp(`- \\[.]${prLink}\\b`, "g");
    const newPrFieldValue = {
        text: oldPrFieldValue.text.replace(regexPrLinkCheckbox, `- [${status}]${prLink}`),
    };
    prField.value = newPrFieldValue;
    return prField;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const youtrackBaseURL = core.getInput("youtrack_url", { required: true });
            const youtrackToken = core.getInput("youtrack_token", { required: true });
            const repo_token = core.getInput("repo_token", { required: true });
            const prTitle = github.context.payload.pull_request["title"];
            const prHtmlUrl = github.context.payload.pull_request["html_url"];
            const prIsMerged = github.context.payload.pull_request["merged"];
            const taskNumRegex = new RegExp("^([A-Za-z]+[\\s-]\\d+)");
            const taskNumMatchResult = prTitle.match(taskNumRegex);
            if (taskNumMatchResult === null) {
                throw new Error(`Не найден номер youtrack задачи в ${prTitle}`);
            }
            let taskNum = taskNumMatchResult[1];
            taskNum = taskNum.replace(/\s/, "-");
            const prTitleWithoutTaskNumRegex = new RegExp("^[A-Za-z]+[\\s-]\\d+[^a-zA-Z0-9А-Яа-я]+");
            let prTitleWithoutTaskNum = "не удалось определить название задачи";
            const prTitleWithoutTaskNumMatchResult = prTitle.match(prTitleWithoutTaskNumRegex);
            if (prTitleWithoutTaskNumMatchResult) {
                prTitleWithoutTaskNum = prTitleWithoutTaskNumMatchResult[1];
            }
            const prLink = `${prHtmlUrl} - ${prTitleWithoutTaskNum}`;
            const youtrack_issue_url = `${youtrackBaseURL}/issue/${taskNum}`;
            const client = new github.GitHub(repo_token);
            const youtrackApi = youtrack.init(youtrackBaseURL, youtrackToken);
            const youtrackIssue = yield youtrackApi.getIssueById(taskNum);
            const prField = youtrackApi.findFieldByName(youtrackIssue.fields, "Pull Requests");
            let newPrField = prField;
            switch (github.context.payload.action) {
                case "opened": {
                    yield client.issues.createComment({
                        owner: github.context.repo.owner,
                        repo: github.context.repo.repo,
                        issue_number: github.context.payload.pull_request.number,
                        body: youtrack_issue_url,
                    });
                    newPrField = addPrLinkInPrField(prField, prLink);
                    break;
                }
                case "reopened": {
                    newPrField = reAddPrLinkInPrField(prField, prLink);
                    break;
                }
                case "closed": {
                    if (prIsMerged) {
                        newPrField = updateCheckboxPrLinkInPrField(prField, prLink, true);
                    }
                    else {
                        newPrField = crossOutPrLinkInPrField(prField, prLink);
                    }
                    break;
                }
                default:
                    break;
            }
            yield youtrackApi.updateIssue(taskNum, {
                fields: [newPrField],
            });
        }
        catch (error) {
            if (error instanceof PrFieldError) {
                console.log("PrFieldError", error);
                return;
            }
            core.setFailed(error.message);
        }
    });
}
run();

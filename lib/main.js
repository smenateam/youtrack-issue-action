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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const youtrack_rest_client_1 = require("youtrack-rest-client");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const youtrack_token = core.getInput('youtrack_token', { required: true });
            const youtrack_url = core.getInput('youtrack_url', { required: true });
            const pr_title = github.context.payload.pull_request["title"];
            const html_url = github.context.payload.pull_request["html_url"];
            const regex = new RegExp('^([A-Z]+\\-\\d+)');
            const task_num = pr_title.match(regex)[1];
            const config = {
                baseUrl: youtrack_url,
                token: youtrack_token
            };
            const youtrack = new youtrack_rest_client_1.Youtrack(config);
            let task_id;
            youtrack.issues.byId(task_num).then((issue) => {
                task_id = issue.id;
                youtrack.comments.create(task_id, {
                    text: html_url
                });
            });
            var youtrack_issue_url = "${youtrack_url}/issue/${task_num}";
            console.log(youtrack_issue_url);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();

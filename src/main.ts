import * as core from '@actions/core';
import * as github from '@actions/github';
import {Issue, Youtrack} from "youtrack-rest-client";


async function run() {
  try {

    const youtrack_token = core.getInput('youtrack_token', {required: true});
    const youtrack_url = core.getInput('youtrack_url', {required: true});
    const pr_title = github.context.payload.pull_request["title"];
    const html_url = github.context.payload.pull_request["html_url"];
    const regex = new RegExp('^([A-Z]+\\-\\d+)');
    const task_num = pr_title.match(regex)[1];
    const config = {
      baseUrl: youtrack_url,
      token: youtrack_token
    };
    const youtrack = new Youtrack(config);
    let task_id;
    youtrack.issues.byId(task_num).then((issue: Issue) => {
      task_id = issue.id;
      youtrack.comments.create(task_id, {
        text: html_url
      });
    });
    const youtrack_issue_url = youtrack_url + "/issue/" + task_num;
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

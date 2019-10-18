import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {

    //console.log(github.context.payload.pull_request)
    const pr_title = github.context.payload.pull_request["title"];
    console.log(pr_title);
    const regex = new RegExp('^([A-Z]+\\-\\d+)');
    const task_num = pr_title.match(regex)[1];
    console.log(task_num)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {

    console.log(github.context.payload.pull_request)
    if (github.context.payload.hasOwnProperty("pull_request")){
        const pull_request = github.context.payload.pull_request
        if (pull_request.hasOwnProperty("title")){
          console.log(pull_request["title"])
        }
    }

    console.log()
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

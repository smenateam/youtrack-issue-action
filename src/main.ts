import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    console.log(github.context.payload.pull_request)
    console.log(typeof github.context.payload.pull_request)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

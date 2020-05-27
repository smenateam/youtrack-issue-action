import * as core from "@actions/core";
import * as github from "@actions/github";

import youtrack, { PrFieldError } from "@/youtrack/youtrackApi";
import {
  addPrLinkInPrField,
  reAddPrLinkInPrField,
  updateCheckboxPrLinkInPrField,
  crossOutPrLinkInPrField,
} from "@/helpers/index";
import { PrField } from "@/types/youtrack";

async function run() {
  try {
    const youtrackBaseURL = core.getInput("youtrack_url", { required: true });
    const youtrackToken = core.getInput("youtrack_token", { required: true });
    const repo_token = core.getInput("repo_token", { required: true });

    const prTitle: string = github.context.payload.pull_request["title"];
    const prHtmlUrl: string = github.context.payload.pull_request["html_url"];
    const prIsMerged: boolean = github.context.payload.pull_request["merged"];

    const taskNumRegex = new RegExp("^([A-Za-z]+[\\s-]\\d+)");
    const taskNumMatchResult = prTitle.match(taskNumRegex);

    if (taskNumMatchResult === null) {
      throw new Error(`Не найден номер youtrack задачи в ${prTitle}`);
    }

    let taskNum = taskNumMatchResult[1];
    taskNum = taskNum.replace(/\s/, "-");

    const prTitleWithoutTaskNumRegex = new RegExp(
      "^[A-Za-z]+[\\s-]\\d+[^a-zA-Z0-9А-Яа-я]+"
    );

    const prTitleWithoutTaskNum = prTitle.replace(
      prTitleWithoutTaskNumRegex,
      ""
    );

    const prLink = `${prHtmlUrl} - ${prTitleWithoutTaskNum}`;

    const youtrack_issue_url = `${youtrackBaseURL}/issue/${taskNum}`;

    const client = new github.GitHub(repo_token);

    const youtrackApi = youtrack.init(youtrackBaseURL, youtrackToken);

    const youtrackIssue = await youtrackApi.getIssueById(taskNum);

    const prField = youtrackApi.findFieldByName(
      youtrackIssue.fields,
      "Pull Requests"
    ) as PrField;
    let newPrField = prField;

    switch (github.context.payload.action) {
      case "opened": {
        await client.issues.createComment({
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
        } else {
          newPrField = crossOutPrLinkInPrField(prField, prLink);
        }
        break;
      }
      default:
        break;
    }

    await youtrackApi.updateIssue(taskNum, {
      fields: [newPrField],
    });
  } catch (error) {
    if (error instanceof PrFieldError) {
      console.log("PrFieldError", error);
      return;
    }
    core.setFailed(error.message);
  }
}

run();

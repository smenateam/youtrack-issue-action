import * as core from "@actions/core";
import * as github from "@actions/github";

import youtrack, { PrFieldError } from "@/youtrack/youtrackApi";
import {
  addPrInText,
  reAddPrInText,
  updMergeStatusOfPrInText,
  delPrFromText,
  changePrTitleInText,
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

    const pr = {
      link: prHtmlUrl,
      title: prTitle,
      titleWithoutTaskNum: prTitleWithoutTaskNum,
    };

    const youtrack_issue_url = `${youtrackBaseURL}/issue/${taskNum}`;

    const client = new github.GitHub(repo_token);

    const youtrackApi = youtrack.init(youtrackBaseURL, youtrackToken);

    const youtrackIssue = await youtrackApi.getIssueById(taskNum);

    const prField = youtrackApi.findFieldByName(
      youtrackIssue.fields,
      "Pull Requests"
    ) as PrField;

    const prFieldText = prField.value ? prField.value.text : "";

    switch (github.context.payload.action) {
      case "edited": {
        prField.value = {
          text: changePrTitleInText(prFieldText, pr),
        };
        break;
      }
      case "opened": {
        await client.issues.createComment({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: github.context.payload.pull_request.number,
          body: youtrack_issue_url,
        });

        prField.value = {
          text: addPrInText(prFieldText, pr),
        };
        break;
      }
      case "reopened": {
        prField.value = {
          text: reAddPrInText(prFieldText, pr),
        };
        break;
      }
      case "closed": {
        if (prIsMerged) {
          prField.value = {
            text: updMergeStatusOfPrInText(prFieldText, pr, true),
          };
        } else {
          prField.value = {
            text: delPrFromText(prFieldText, pr),
          };
        }
        break;
      }
      default:
        break;
    }

    await youtrackApi.updateIssue(taskNum, {
      fields: [prField],
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

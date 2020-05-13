import * as core from "@actions/core";
import * as github from "@actions/github";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

class PrFieldError extends Error {
  name: "PrFieldError";
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
class YoutrackError extends Error {
  name: "YoutrackError";
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
const youtrack = {
  youtrackAxiosInstance: null as AxiosInstance,
  init(youtrackBaseURL: string, youtrackToken: string) {
    const youtrackConfig: AxiosRequestConfig = {
      baseURL: youtrackBaseURL,
      headers: {
        Authorization: youtrackToken,
      },
    };
    this.youtrackAxiosInstance = axios.create(youtrackConfig);
    return {
      getIssueFieldById: this.getIssueFieldById.bind(this),
      updateIssue: this.updateIssue.bind(this),
    };
  },
  async getIssueFieldById(issueId: string, fieldId: string) {
    try {
      const { data: prField } = await this.youtrackAxiosInstance.get(
        `/api/issues/${issueId}/customFields/${fieldId}`,
        {
          params: {
            fields: "name,id,value(text)",
          },
        }
      );
      return prField;
    } catch (error) {
      console.log("getIssueFieldById error", error);
      const errorMessage = `Request failed with status code ${error.response.status}: ${error.response.data.error_description}`;
      throw new YoutrackError(errorMessage);
    }
  },
  async updateIssue(issueId: string, requestData: any) {
    try {
      const { data: issue } = await this.youtrackAxiosInstance.post(
        `/api/issues/${issueId}`,
        requestData
      );
      return issue;
    } catch (error) {
      console.log("updateIssue error", error);
      const errorMessage = `Request failed with status code ${error.response.status}: ${error.response.data.error_description}`;
      throw new YoutrackError(errorMessage);
    }
  },
};

function addPrLinkInPrField(
  prField: any,
  prLink: string,
  merged: boolean = false
) {
  const status = merged ? "x" : " ";

  const oldPrFieldValue = prField.value;

  const newPrFieldValue = {
    text: `- [${status}]${prLink}\n`,
  };

  if (oldPrFieldValue) {
    const regexPrLink = new RegExp(`${prLink}`);
    const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

    if (textHasPrLink)
      throw new PrFieldError(
        `Добовляемая ссылка на pull request: ${prLink} уже есть в описании`
      );

    const textHasLineBreakInTheEnd = !!oldPrFieldValue.text.match(/\n$/);
    newPrFieldValue.text = textHasLineBreakInTheEnd
      ? `${oldPrFieldValue.text}${newPrFieldValue.text}`
      : `${oldPrFieldValue.text}\n${newPrFieldValue.text}`;
  }

  prField.value = newPrFieldValue;

  return prField;
}
function deletePrLinkInPrField(prField: any, prLink: string) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue)
    throw new PrFieldError(
      `Удаляемая ссылка на pull request: ${prLink} не найдена, т.к. описание пустое`
    );

  const regexPrLink = new RegExp(`${prLink}`);
  const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

  if (!textHasPrLink)
    throw new PrFieldError(
      `Удаляемая ссылка на pull request: ${prLink} не найдена в описании`
    );

  const regexPrLinkCheckbox = new RegExp(`- \\[.]${prLink}\\b\\n?`, "g");
  const newPrFieldValue = {
    text: oldPrFieldValue.text.replace(regexPrLinkCheckbox, ""),
  };

  prField.value = newPrFieldValue;

  return prField;
}
function updatePrLinkInPrField(prField: any, prLink: string, merged: boolean) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue) return addPrLinkInPrField(prField, prLink, true);

  const regexPrLink = new RegExp(`${prLink}`);
  const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

  if (!textHasPrLink) return addPrLinkInPrField(prField, prLink, true);

  const status = merged ? "x" : " ";

  const regexPrLinkCheckbox = new RegExp(`- \\[.]${prLink}\\b`, "g");
  const newPrFieldValue = {
    text: oldPrFieldValue.text.replace(
      regexPrLinkCheckbox,
      `- [${status}]${prLink}`
    ),
  };
  prField.value = newPrFieldValue;

  return prField;
}

async function run() {
  try {
    const youtrackFieldId = core.getInput("youtrack_field_id", {
      required: true,
    });
    const youtrackBaseURL = core.getInput("youtrack_url", { required: true });
    const youtrackToken = core.getInput("youtrack_token", { required: true });
    const repo_token = core.getInput("repo_token", { required: true });

    const prTitle = github.context.payload.pull_request["title"];
    const prHtmlUrl = github.context.payload.pull_request["html_url"];
    const prIsMerged = github.context.payload.pull_request["merged"];

    const regex = new RegExp("^([A-Za-z]+[\\s-]\\d+)");
    let taskNum = prTitle.match(regex);

    if (taskNum === null) {
      throw new Error(`Не найден номер youtrack задачи в ${prTitle}`);
    }

    taskNum = prTitle.match(regex)[1];

    taskNum = taskNum.replace(/\s/, "-");

    const youtrack_issue_url = `${youtrackBaseURL}/issue/${taskNum}`;

    const client = new github.GitHub(repo_token);

    const youtrackApi = youtrack.init(youtrackBaseURL, youtrackToken);

    console.log("taskNum", taskNum);
    console.log("youtrackFieldId", youtrackFieldId);
    console.log("youtrackBaseURL", youtrackBaseURL);
    console.log("youtrackToken", youtrackToken);
    switch (github.context.payload.action) {
      case "opened": {
        await client.issues.createComment({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: github.context.payload.pull_request.number,
          body: youtrack_issue_url,
        });
        const prField = await youtrackApi.getIssueFieldById(
          taskNum,
          youtrackFieldId
        );
        console.log("prField", prField);
        const newPrField = addPrLinkInPrField(prField, prHtmlUrl);
        console.log("newPrField", newPrField);
        await youtrackApi.updateIssue(taskNum, {
          fields: [newPrField],
        });
        break;
      }
      case "reopened": {
        const prField = await youtrackApi.getIssueFieldById(
          taskNum,
          youtrackFieldId
        );
        console.log("prField", prField);
        const newPrField = addPrLinkInPrField(prField, prHtmlUrl);
        console.log("newPrField", newPrField);
        await youtrackApi.updateIssue(taskNum, {
          fields: [newPrField],
        });
        break;
      }
      case "closed": {
        const prField = await youtrackApi.getIssueFieldById(
          taskNum,
          youtrackFieldId
        );
        console.log("prField", prField);
        let newPrField = prField;
        if (prIsMerged) {
          newPrField = updatePrLinkInPrField(prField, prHtmlUrl, true);
        } else {
          newPrField = deletePrLinkInPrField(prField, prHtmlUrl);
        }
        console.log("newPrField", newPrField);
        await youtrackApi.updateIssue(taskNum, {
          fields: [newPrField],
        });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    if (error instanceof PrFieldError) {
      console.log("PrFieldError", error);
      return;
    }
    core.setFailed(error);
  }
}

run();

import * as core from "@actions/core";
import * as github from "@actions/github";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
interface Issue {
  fields: IssueField[];
  $type: string;
}
interface IssueField<Value = { [key: string]: any }> {
  value: Value | null;
  name: string;
  id: string;
  $type: string;
}
type PrField = IssueField<{ text: string }>;

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
        Authorization: `Bearer ${youtrackToken}`,
      },
    };
    this.youtrackAxiosInstance = axios.create(youtrackConfig);
    return {
      getIssueById: this.getIssueById.bind(this),
      updateIssue: this.updateIssue.bind(this),
      findFieldByName: this.findFieldByName.bind(this),
    };
  },
  async getIssueById(issueId: string) {
    try {
      const { data: issue } = await this.youtrackAxiosInstance.get<Issue>(
        `/api/issues/${issueId}/`,
        {
          params: {
            fields: "fields(name,id,value(text))",
          },
        }
      );
      return issue;
    } catch (error) {
      const errorMessage = `Request failed with status code ${error.response.status}: ${error.response.data.error_description}`;
      throw new YoutrackError(errorMessage);
    }
  },
  async updateIssue(issueId: string, requestData: any) {
    try {
      const { data: issue } = await this.youtrackAxiosInstance.post<Issue>(
        `/api/issues/${issueId}`,
        requestData,
        {
          params: {
            fields: "fields(name,id,value(text))",
          },
        }
      );
      return issue;
    } catch (error) {
      const errorMessage = `Request failed with status code ${error.response.status}: ${error.response.data.error_description}`;
      throw new YoutrackError(errorMessage);
    }
  },
  findFieldByName(fields: IssueField[], name: string) {
    const field = fields.find((field) => {
      if (field.name === name) return true;
      return false;
    });

    if (field) return field;

    const errorMessage = `Поле с именем ${name} не найдено`;
    throw new YoutrackError(errorMessage);
  },
};

function addPrLinkInPrField(
  prField: PrField,
  prLink: string,
  merged: boolean = false
) {
  const status = merged ? "x" : " ";

  const oldPrFieldValue = prField.value;

  const newPrFieldValue = {
    text: `- [${status}]${prLink}\n`,
  };

  if (oldPrFieldValue) {
    const regexPrLink = new RegExp(`${prLink}\\b`);
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
function crossOutPrLinkInPrField(prField: PrField, prLink: string) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue)
    throw new PrFieldError(
      `Удаляемая ссылка на pull request: ${prLink} не найдена, т.к. описание пустое`
    );

  const regexPrLink = new RegExp(`${prLink}\\b`);
  const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

  if (!textHasPrLink)
    throw new PrFieldError(
      `Удаляемая ссылка на pull request: ${prLink} не найдена в описании`
    );

  const regexPrLinkCheckbox = new RegExp(`- \\[.]${prLink}\\b`, "g");
  const newPrFieldValue = {
    text: oldPrFieldValue.text.replace(regexPrLinkCheckbox, `~~${prLink}~~`),
  };

  prField.value = newPrFieldValue;

  return prField;
}
function reAddPrLinkInPrField(prField: PrField, prLink: string) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue) return addPrLinkInPrField(prField, prLink);

  const regexPrLink = new RegExp(`${prLink}\\b`);
  const textHasPrLink = !!oldPrFieldValue.text.match(regexPrLink);

  if (!textHasPrLink) return addPrLinkInPrField(prField, prLink);

  const regexPrLinkСrossedOut = new RegExp(`~~${prLink}~~`, "g");
  const newPrFieldValue = {
    text: oldPrFieldValue.text.replace(regexPrLinkСrossedOut, `- [ ]${prLink}`),
  };
  prField.value = newPrFieldValue;

  return prField;
}
function updateCheckboxPrLinkInPrField(
  prField: PrField,
  prLink: string,
  merged: boolean
) {
  const oldPrFieldValue = prField.value;

  if (!oldPrFieldValue) return addPrLinkInPrField(prField, prLink, true);

  const regexPrLink = new RegExp(`${prLink}\\b`);
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

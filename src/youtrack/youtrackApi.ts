import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

import { Issue, IssueField } from "@/types/youtrack";

export class PrFieldError extends Error {
  name: "PrFieldError";
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class YoutrackError extends Error {
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
      console.log(issue);
      return issue;
    } catch (error) {
      console.log(error);
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

export default youtrack;

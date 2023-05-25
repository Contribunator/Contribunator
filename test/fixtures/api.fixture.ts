import { expect } from "@playwright/test";

import { createRequest } from "node-mocks-http";
import postPullRequest, { TransformToPR } from "@/util/postPullRequest";

const SUCCESS_URL = "success";

class Mocktokit {
  public rest;
  private eventHandlers: Record<string, any[]> = {};
  constructor() {
    this.rest = {
      repos: {
        createOrUpdateFiles: async (data: any) => {
          this.emit("createOrUpdateFiles", data);
        },
      },
      pulls: {
        create: async (data: any) => {
          this.emit("pullRequest", data);
          return {
            data: {
              html_url: SUCCESS_URL,
            },
          };
        },
      },
    };
  }

  on(eventName: string, handler: any) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }

  emit(eventName: string, data: any) {
    const handlers = this.eventHandlers[eventName];
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}

type ApiFixtureProps = {
  schema?: any;
  transform: TransformToPR;
  postBase: any;
  prBase: any;
};

export class ApiFixture {
  private moctokit: Mocktokit;
  private mock: any;
  private schema: any;
  private transform: TransformToPR;
  private postBase: any;
  private prBase: any;

  constructor(props: ApiFixtureProps) {
    this.schema = props.schema;
    this.transform = props.transform;
    this.postBase = props.postBase;
    this.prBase = props.prBase;

    const moctokit = new Mocktokit();
    this.moctokit = moctokit;
    this.mock = {
      plugin: () =>
        class {
          constructor() {
            return moctokit;
          }
        },
    };
  }
  async post(body: any) {
    // we pass moktokit to hook into generated PR
    const tweetHandler = postPullRequest(
      this.schema,
      this.transform,
      this.mock
    );
    const req = createRequest({ json: async () => body });
    return (await tweetHandler(req)).json();
  }

  // Note: merges the base params with the passed params
  async expect(body: any, { pr, error }: { error?: string; pr?: any }) {
    let promise;
    if (pr) {
      const moctokit = this.moctokit;
      promise = new Promise((resolve) => {
        moctokit.on("pullRequest", resolve);
      });
    }
    const res = await this.post({ ...this.postBase, ...body });
    const expected = error ? { error } : { prUrl: SUCCESS_URL };
    await expect(res).toEqual(expected);
    if (pr) {
      await expect(await promise).toEqual({ ...this.prBase, ...pr });
    }
  }
}

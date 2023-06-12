import { APIRequestContext } from "@playwright/test";

export class ApiFixture {
  private url = "/api/contribute";

  constructor(private request: APIRequestContext) {}

  async post(body: any) {
    const res = await this.request.post(this.url, { data: body });
    return res.json();
  }
}

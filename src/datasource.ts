import { IntegrationBase } from "@budibase/types"
import fetch from "node-fetch"
import { CreateQuery, DeleteQuery, ListQuery, ReadQuery, UpdateQuery } from "./types"
import { toBase64 } from "./util"

interface RequestOpts {
  method: string
  body?: string
  headers?: { [key: string]: string }
}

interface BitbucketApiConfig {
  username: string;
  appPassword: string;
}

const BITBUCKET_V2_API_BASE_URL = "https://api.bitbucket.org/2.0"
const BITBUCKET_REPOSITORIES_URL = `${BITBUCKET_V2_API_BASE_URL}/repositories`

class CustomIntegration implements IntegrationBase {
  private readonly authHeaderValue: string;

  constructor(config: BitbucketApiConfig) {
      const encodedCreds = toBase64(`${config.username}:${config.appPassword}`);
      this.authHeaderValue = `Basic ${encodedCreds}`;
  }

  async create(query: CreateQuery) {
    const opts = {
      method: "POST",
      ...(query.body ? {
        body: query.body,
        headers: {
          "Content-Type": "application/json",
        },
      } : {})
    }

    return this.request(`${BITBUCKET_REPOSITORIES_URL}/${query.workspaceId}/${query.repoSlug}`, opts);
  }

  async read(query: ReadQuery) {
    const opts = {
      method: "GET",
    };

    return this.request(`${BITBUCKET_REPOSITORIES_URL}/${query.workspaceId}/${query.repoSlug}`, opts);
  }

  async list(query: ListQuery) {
    const url = new URL(`${BITBUCKET_REPOSITORIES_URL}/${query.workspaceId}`);
    if (query.role) {
      url.searchParams.append("role", query.role);
    }
    if (query.query) {
      url.searchParams.append("q", query.query);
    }
    if (query.sort) {
      url.searchParams.append("sort", query.sort);
    }
    if (query.page) {
      url.searchParams.append("page", String(query.page));
    }
    if (query.pageLength) {
      url.searchParams.append("pagelen", String(query.pageLength));
    }

    const opts = {
      method: "GET",
    };

    return this.request(url, opts);
  }

  async update(query: UpdateQuery) {
    const opts = {
      method: "PUT",
      body: query.body,
      headers: {
        "Content-Type": "application/json",
      },
    }

    return this.request(`${BITBUCKET_REPOSITORIES_URL}/${query.workspaceId}/${query.repoSlug}`, opts);
  }

  async delete(query: DeleteQuery) {
    const url = new URL(`${BITBUCKET_REPOSITORIES_URL}/${query.workspaceId}/${query.repoSlug}`);
    if (query.redirectTo) {
      url.searchParams.append("redirect_to", query.redirectTo);
    }

    const opts = {
      method: "DELETE",
    }

    return this.request(url, opts);
  }

  private async request(url: string | URL, opts: RequestOpts) {
    await this.addAuthHeader(opts);

    const response = await fetch(url, opts)
    if (response.status <= 300) {
      try {
        const contentType = response.headers.get("content-type")
        if (contentType?.includes("json")) {
          return await response.json()
        } else {
          return await response.text()
        }
      } catch (err) {
        return await response.text()
      }
    } else {
      const err = await response.text()
      throw new Error(`${err} -- ${JSON.stringify(opts)}`)
    }
  }

  private async addAuthHeader(opts: RequestOpts) {
    const authHeader = { Authorization: this.authHeaderValue };
    opts.headers = opts.headers ? { ...opts.headers, ...authHeader } : authHeader; 
  }
}

export default CustomIntegration

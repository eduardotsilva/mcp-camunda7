export class CamundaClient {
  private baseUrl: string;
  private authHeader: string;

  constructor() {
    const baseUrl = process.env.CAMUNDA_BASE_URL;
    const username = process.env.CAMUNDA_USERNAME;
    const password = process.env.CAMUNDA_PASSWORD;

    if (!baseUrl) throw new Error("CAMUNDA_BASE_URL is required");
    if (!username) throw new Error("CAMUNDA_USERNAME is required");
    if (!password) throw new Error("CAMUNDA_PASSWORD is required");

    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.authHeader =
      "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(this.baseUrl + path);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options?: { params?: Record<string, unknown>; body?: unknown }
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers: Record<string, string> = {
      Authorization: this.authHeader,
      Accept: "application/json",
    };

    const init: RequestInit = { method, headers };

    if (options?.body !== undefined) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorBody = await response.json();
        errorMessage =
          (errorBody as { message?: string }).message ||
          JSON.stringify(errorBody);
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(
        `Camunda API error ${response.status}: ${errorMessage}`
      );
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, { params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, { body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  async del<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("DELETE", path, { params });
  }

  async postMultipart<T>(path: string, formData: FormData): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorBody = await response.json();
        errorMessage =
          (errorBody as { message?: string }).message ||
          JSON.stringify(errorBody);
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(
        `Camunda API error ${response.status}: ${errorMessage}`
      );
    }

    return response.json() as Promise<T>;
  }
}

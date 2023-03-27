export class ApiService {
  private baseUrl: string;
  // singleton
  private static instance: ApiService;
  private constructor() {
    this.baseUrl = "https://api.orderly.org/v1";
  }
  static getInstance() {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  getTokensInfo() {
    return this.get("/public/token");
  }

  get(url: string) {
    return this._request(url, {
      method: "GET",
    });
  }

  private _request(url: string, options: RequestInit) {
    return fetch(`${this.baseUrl}${url}`, options).then((res) => res.json());
  }
}

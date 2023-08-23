import axios, { AxiosInstance } from "axios";

export class Api {
  static base: AxiosInstance;

  static instance(token: string): AxiosInstance {
    if (!this.base) {
      this.base = axios.create({
        baseURL: "https://api.openai.com",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return this.base;
  }

  public static request(): AxiosInstance {
    return this.base;
  }
}

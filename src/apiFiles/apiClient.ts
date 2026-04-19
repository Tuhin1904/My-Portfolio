// apiClient.ts
import { store } from "@/store";
import { clearTokens, setTokens } from "@/store/slices/AuthSlice";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = () => store.getState().auth.accessToken;
const getRefreshToken = () => store.getState().auth.refreshToken;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessTokenBlock = getAccessToken();

    if (accessTokenBlock) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessTokenBlock}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (originalRequest?.url?.includes("/auth/refresh")) {
      store.dispatch(clearTokens());
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshTokenBlock = getRefreshToken();
        if (!refreshTokenBlock) {
          store.dispatch(clearTokens());
          return Promise.reject(error);
        }
        const response = await apiClient.post(`${API_BASE_URL}/auth/refresh`, {
          refreshTokenBlock,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        store.dispatch(
          setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          }),
        );

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequest<T = any> {
  method: ApiMethod;
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}

export const apiRequest = async <T = any>({
  method,
  url,
  data,
  params,
  headers,
}: ApiRequest): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      params,
      headers,
    };

    const response = await apiClient(config);
    return response?.data || response;
  } catch (error: any) {
    return Promise.reject({
      message: error?.response?.data?.message || "Something went wrong",
      status: error?.response?.status,
      data: error?.response?.data,
    });
  }
};

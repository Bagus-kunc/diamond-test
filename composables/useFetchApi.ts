// types.ts
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status?: number;
}

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

// constants.ts
export const API_ENDPOINTS = {
  GACHA_SPIN: 'gacha/spin',
  // Add other endpoints here
} as const;

// useFetchApi.ts
import { Ref } from 'vue';
import { ApiResponse, FetchOptions } from './types';

interface RuntimeConfig {
  public: {
    API_URL: string;
  };
}

const useFetchApi = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  opts: FetchOptions = {},
): Promise<ApiResponse<T>> => {
  const config = useRuntimeConfig() as RuntimeConfig;

  // Cookie refs with proper typing
  const TOKEN = useCookie<string | null>('TOKEN');
  const USER = useCookie<Record<string, any> | null>('USER');
  const VALID_PASSWORD = useCookie<boolean | null>('VALID_PASSWORD');
  const LOCALE = useCookie<string>('LOCALE', {
    default: () => 'en', // Default language
  });

  const clearAuth = () => {
    localStorage.clear();
    sessionStorage.clear();
    TOKEN.value = null;
    USER.value = null;
    VALID_PASSWORD.value = null;
  };

  try {
    const response = await $fetch<ApiResponse<T>>(url, {
      ...opts,
      method,
      baseURL: config.public.API_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(TOKEN.value ? { Authorization: `Bearer ${TOKEN.value}` } : {}),
        ...opts.headers,
      },
      params: {
        ...opts.params,
        lang: LOCALE.value,
      },
      onRequestError({ error }) {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
      onResponseError({ response }) {
        const status = response?.status;

        if (status === 401) {
          if (url === API_ENDPOINTS.GACHA_SPIN) {
            clearAuth();
            return Promise.reject('refetch');
          }

          clearAuth();
          navigateTo('/');
          return Promise.reject(new Error('Unauthorized access'));
        }

        if (status === 404) {
          return Promise.reject(new Error('Resource not found'));
        }

        if (status >= 500) {
          return Promise.reject(new Error('Server error occurred'));
        }

        return Promise.reject(response);
      },
    });

    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default useFetchApi;

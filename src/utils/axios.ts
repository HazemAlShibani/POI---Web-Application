import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverPOI });

console.log(CONFIG.site.serverPOI);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      error.response?.data?.message || error?.response?.data?.error || 'Something went wrong!'
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/profile',
    signIn: '/login',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  media: {
    upload: '/upload/image',
  },

  user: {
    sendNotificationToken: '/admin/notification-setup',
    faculty: '/universities/list',
    regCoach: '/register/coach',
    delete: (id: Number) => `/user/ban/${id}`,
    regDebater: '/register/debater',
    regJudge: '/register/judge',
    couch: '/coach/index',
    all: '/user/index',
    one: (id: Number) => `/user/${id}`,
    applications: '/debates/applications',
    applicationDes: '/debates/applications/respond',
  },
  debate: {
    createDebate: '/debates',
    allDebate: '/debates',
    one: (id: Number) => `/debates/${id}`,
    createMotion: '/motion/create',
    getMotion: '/motion/get',
    deleteMotion: (id: Number) => `/motion/delete/${id}`,
    getAssignDebaters: (id: Number) => `/debates/${id}/teams/index`,
    sendAssignDebaters: '/debates/applivations/teams',
  },
  blog: {
    create: '',
    all: '',
    delete: (id: Number) => `/blog/${id}`,
    getOne: (id: Number) => `/blogs/${id}`,
  },
};

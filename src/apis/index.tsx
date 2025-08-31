import type { CreateDebateData } from 'src/sections/product/product-new-edit-form';
import type { CreateMotionData } from 'src/sections/product/product-new-motion-form';
import type { ApplyUserData } from 'src/layouts/components/notifications-drawer/notification-item';

import { Link } from 'react-router-dom';

import axios, { endpoints } from 'src/utils/axios';

import { CustomError } from './type';

import type {
  OnePost,
  AllPosts,
  CoachData,
  OneDebate,
  UploadData,
  AllDebates,
  AllMotions,
  FacultyData,
  ArticleInfo,
  UserInfomation,
  RegisterUserData,
  AllNotifications,
  OneUserInfomation,
} from './type';

export const uploadFile = async (file: File): Promise<UploadData> => {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);
    formData.append('actor', 'user');

    const res = await axios.post(endpoints.media.upload, formData);
    return res.data;
  } catch (error) {
    console.error('Error during fetch data by ID', error);
    throw new CustomError(error.message);
  }
};

export const registerUserHandler = async (data: RegisterUserData) => {
  try {
    let endpoint = '';

    if (data.role === 'Coach') {
      endpoint = endpoints.user.regCoach;
    } else if (data.role === 'Judge') {
      endpoint = endpoints.user.regJudge;
    } else {
      endpoint = endpoints.user.regDebater;
    }

    const res = await axios.post(endpoint, data.data);
    return res.data;
  } catch (error) {
    console.error('Error during fetch data by ID', error);
    throw error;
  }
};

export const deleteUserHandler = async (id: Number) => {
  try {
    const res = await axios.get(endpoints.user.delete(id));
    return res.data;
  } catch (error) {
    console.error('Error during fetch data by ID', error);
    throw error;
  }
};

export const getFacultyData = async (): Promise<FacultyData[]> => {
  try {
    const res = await axios.get(endpoints.user.faculty);

    return res.data.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getcoachData = async (): Promise<CoachData[]> => {
  try {
    const res = await axios.get(endpoints.user.couch);
    return res.data.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getallUsers = async (): Promise<UserInfomation[]> => {
  try {
    const res = await axios.get(endpoints.user.all);

    const extracted = res?.data?.data?.map((item: any) => ({
      ...item.profile,
      guard: item.guard,
    }));

    return extracted;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getoneUser = async (id: Number): Promise<OneUserInfomation> => {
  try {
    const res = await axios.get(endpoints.user.one(id));

    const extracted = {
      ...res?.data?.data?.profile,
      guard: res?.data?.data?.guard,
      team: res?.data?.data?.team,
      coach_name: res?.data?.data?.coach_name,
    };

    return extracted;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const applyToJoin = async (data: ApplyUserData) => {
  try {
    const res = await axios.post(endpoints.user.applicationDes, data);
    return res.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const createDebateHandler = async (data: CreateDebateData) => {
  try {
    const res = await axios.post(endpoints.debate.createDebate, data);
    return res.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

// ----------
export const getAllDebates = async (): Promise<AllDebates[]> => {
  try {
    const res = await axios.get(endpoints.debate.allDebate);
    return res.data.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getAllApplications = async (): Promise<AllNotifications[]> => {
  try {
    const res = await axios.get(endpoints.user.applications);

    const notifications = res.data.data.map((ele: any) => ({
      id: ele.id,
      user_id: ele.user_id,
      type: 'friend',
      title: (
        <p>
          <Link
            to={`/dashboard/user/${ele.user_id}/edit`}
            style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}
          >
            <strong>{`${ele.user.profile.first_name} ${ele.user.profile.last_name}`}</strong>
          </Link>{' '}
          ask to join{' '}
          <Link
            to={`/dashboard/product/${ele.debate_id}`}
            style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}
          >
            a debate{' '}
          </Link>
        </p>
      ),
      avatarUrl: ele.user.profile.profile_picture_url,
      category: ele.user.guard.charAt(0).toUpperCase() + ele.user.guard.slice(1).toLowerCase(),
      debate_id: ele.debate_id,
      createdAt: ele.date,
    }));

    return notifications;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getoneDebate = async (id: Number): Promise<OneDebate> => {
  try {
    const res = await axios.get(endpoints.debate.one(id));

    return res.data.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const createMotionHandler = async (data: CreateMotionData) => {
  try {
    const res = await axios.post(endpoints.debate.createMotion, data);
    return res.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getAllMotions = async (): Promise<AllMotions[]> => {
  try {
    const res = await axios.get(endpoints.debate.getMotion);
    return res.data?.data?.[0];
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const deleteOneMotions = async (id: Number) => {
  try {
    const res = await axios.delete(endpoints.debate.deleteMotion(id));
    return res.data.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getAssignDebaters = async (id: Number) => {
  try {
    const res = await axios.get(endpoints.debate.getAssignDebaters(id));
    return res.data.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const sendFCMToken = async (token: string) => {
  try {
    const res = await axios.post(endpoints.user.sendNotificationToken, {
      fcm_token: token,
    });

    return res.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const createArticleHandler = async (data: ArticleInfo) => {
  try {
    const res = await axios.post(endpoints.blog.create, data);
    return res.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getArticlesHandler = async (): Promise<AllPosts[]> => {
  try {
    // const res = await axios.get(endpoints.blog.all);
    // return res.data;
    return [
      {
        id: 1,
        title: 'Mastering React with TypeScript',
        publish: 'course',
        description:
          'A deep dive into scalable React development with TypeScript, featuring reusable patterns and UI best practices.',
        createdAt: '2025-08-26',
      },
      {
        id: 2,
        title: 'Mastering 2',
        publish: 'article',
        description:
          'A deep dive into scalable React development with TypeScript, featuring reusable patterns and UI best practices.',
        createdAt: '2025-08-29',
      },
      {
        id: 3,
        title: 'Mastering 3',
        publish: 'article',
        description:
          'A deep dive into scalable React development with TypeScript, featuring reusable patterns and UI best practices.',
        createdAt: '2025-01-29',
      },
    ];
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const deleteArticleHandler = async (id: Number) => {
  try {
    const res = await axios.delete(endpoints.blog.delete(id));
    return res.data;
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

export const getOneArticleHandler = async (id: Number): Promise<OnePost> => {
  try {
    // const res = await axios.get(endpoints.blog.getOne(id));
    // return res.data;

    return {
      title: 'Exploring the Future of AI in Everyday Life',
      description:
        'A deep dive into how AI is transforming our lives, industries, and future possibilities.',
    };
  } catch (error) {
    console.error('Error during fetch data', error);
    throw error;
  }
};

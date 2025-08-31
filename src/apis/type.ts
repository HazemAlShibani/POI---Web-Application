export type UploadFileArgs = {
  file: File;
};

export interface UploadData {
  public_id: string;
  url: string;
}

export class CustomError extends Error {
  attributes: Record<string, any>;

  constructor(message: string, attributes?: Record<string, any>) {
    super(message);
    this.name = 'CustomError';
    this.attributes = attributes || {};
  }
}

export interface FacultyData {
  id: number;
  name: string;
  faculties: {
    id: number;
    university_id: number;
    name: string;
  }[];
}

export interface CoachData {
  profile: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    governorate: string;
    profile_picture_url: string | null;
    birth_date: string; // ISO date string
    education_degree: string;
    faculty: string;
    university: string;
  };
  team: string;
  guard: string;
}

export type UserInfomation = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  governorate: string;
  profile_picture_url: string;
  birth_date: string;
  education_degree: string;
  faculty: string;
  university: string;
  guard: string;
  account: string;
};

export type OneUserInfomation = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  mobile_number: string;
  account: string;
  education_degree: string;
  faculty: string;
  university: string;
  governorate: string;
  guard: string;
  team: string;
  profile_picture_url: string;
  coach_name?: string;
};

export type RegisterUserData = {
  role: string;
  data: {
    profile_picture_url: string;
    public_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    mobile_number: string;
    birth_date: string;
    faculty_id: number;
    governorate: string;
    education_degree: string;
  };
};

export type AllNotifications = {
  id: number;
  user_id: string | number;
  type: 'friend';
  title: JSX.Element;
  avatarUrl: string;
  category: string;
  debate_id: string | number;
  createdAt: string | Date;
};

export type AllDebates = {
  applicants_count: number;
  debate_id: number;
  filter?: string | null;
  is_able_to_apply: boolean;
  start_date: string;
  start_time: string;
  status: string;
  type: string;
};

export type OneDebate = {
  applicants_count: number;
  chair_judge?: string | null;
  debate_id: number;
  filter?: string | null;
  is_able_to_apply: boolean;
  motion?: string | null;
  start_date: string;
  start_time: string;
  status: string;
  type: string;
};

export type AllMotions = {
  motion_id: number;
  sentence: string;
  sub_classification:
    | {
        sub_classification: string;
        sub_classification_id: number;
        classification: string;
      }[]
    | [];
};

export type ArticleInfo = {
  title: string;
  description: string;
  type: string;
};

export type AllPosts = {
  id: number;
  title: string;
  publish: string;
  description: string;
  createdAt: string;
};

export type OnePost = {
  title: string;
  description: string;
};

import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'src/routes/hooks';

import { getoneUser } from 'src/apis';
import { CONFIG } from 'src/config-global';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User edit | Dashboard - ${CONFIG.site.name}` };

export type CurentUser = {
  id: number;
  user_id: number;
  city: string;
  role: string;
  email: string;
  name: string;
  university: string;
  avatarUrl: string;
  faculty: string;
  phoneNumber: string;
  education_degree: string;
  status: string;
  birth_date: string;
  team: string;
  coach_name?: string;
};

export default function Page() {
  const { id = '' } = useParams();

  const { data: oneOfUsers } = useQuery({
    queryKey: ['get-one-user', id],
    queryFn: () => getoneUser(Number(id)),
    enabled: () => !!id,
    select: (data) => ({
      id: data.id,
      user_id: data.user_id,
      city: data.governorate,
      role: data.guard[0].toUpperCase() + data.guard.slice(1),
      email: data.email,
      name: `${data.first_name} ${data.last_name}`,
      university: data.university,
      avatarUrl: data.profile_picture_url,
      faculty: data.faculty,
      phoneNumber: data.mobile_number,
      education_degree: data.education_degree,
      status: data.account,
      birth_date: data.birth_date,
      team: data.team,
      coach_name: data.coach_name,
    }),
  });

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserEditView user={oneOfUsers} />
    </>
  );
}

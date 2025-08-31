import type { CurentUser } from 'src/pages/dashboard/user/edit';

import { useForm } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { List, Avatar, ListItem, Typography, ListItemText, ListItemAvatar } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { deleteUserHandler } from 'src/apis';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: CurentUser;
};

export function UserEditForm({ currentUser }: Props) {
  const router = useRouter();
  const [state, setState] = useState({
    avatarUrl: '',
    name: '',
    email: '',
    faculty: '',
    coach: '',
    mobile_number: '',
    birth_date: '',
    governorate: '',
    education_degree: '',
    role: '',
    user_id: 0,
    status: '',
  });

  useEffect(() => {
    if (currentUser) {
      setState({
        user_id: currentUser?.user_id,
        avatarUrl: currentUser?.avatarUrl || '',
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        faculty: currentUser?.faculty || '',
        coach: currentUser?.coach_name || '',
        mobile_number: currentUser?.phoneNumber || '',
        birth_date: currentUser?.birth_date || '',
        governorate: currentUser?.city || '',
        education_degree: currentUser?.education_degree || '',
        role: currentUser?.role || '',
        status: currentUser.status || '',
      });
    }
  }, [currentUser]);

  const methods = useForm({
    mode: 'onSubmit',
  });

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const { handleSubmit } = methods;

  const { mutate: registerUser, isPending: isPendingRegisterUser } = useMutation({
    mutationKey: ['register-user'],
    mutationFn: async (id: Number) => deleteUserHandler(id),
    onSuccess: () => {
      toast.success('Delete success!');
      router.push(paths.dashboard.user.list);
    },
    onError: (errordata) => {
      toast.error(`Delete failed! ${errordata}`);
    },
  });

  const onSubmit = handleSubmit(async () => {
    try {
      registerUser(state.user_id);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ mb: 5 }}>
              {state.avatarUrl ? (
                <Field.UploadAvatar
                  value={state.avatarUrl}
                  name="avatarUrl"
                  disabled
                  maxSize={3145728}
                />
              ) : (
                <Avatar sx={{ width: 128, height: 128, margin: '0 auto' }}>
                  <Iconify icon="ic:baseline-image" width={54} />
                </Avatar>
              )}
            </Box>

            <Stack justifyContent="center" alignItems="center" sx={{ my: 3 }}>
              <LoadingButton
                disabled={state.status === 'banned'}
                type="submit"
                variant="soft"
                color="error"
                loading={isPendingRegisterUser}
              >
                {state.status === 'banned' ? 'Already banned' : 'Banned user'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Field.Text
              style={{ marginBottom: '25px' }}
              fullWidth
              disabled
              value={state.role}
              name="role"
              label="Role"
            />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text disabled value={state.name} name="name" label="Full name" />
              <Field.Text disabled value={state.email} name="email" label="Email address" />
              <Field.Text
                disabled
                value={state.mobile_number}
                name="mobile_number"
                label="Phone number"
              />

              <Field.Text
                fullWidth
                disabled
                value={state.governorate}
                name="governorate"
                label="Governorate"
              />

              <Field.Text
                disabled
                value={state.birth_date?.split('T')[0]}
                name="birth_date"
                label="Birth Date"
              />

              <Field.Text
                fullWidth
                disabled
                value={state.education_degree}
                name="education_degree"
                label="Education degree"
              />

              <Field.Text
                fullWidth
                disabled
                value={state.faculty}
                name="faculty_id"
                label="Faculty"
              />

              {state.role === 'Debater' && (
                <Field.Text fullWidth disabled value={state.coach} name="coach" label="Coach" />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          {state.role === 'Coach' && (
            <Card sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>Debaters</Typography>
              <List
                sx={{
                  bgcolor: 'background.paper',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  },
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                }}
              >
                {[
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 1 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 2 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 3 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 4 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 1 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 2 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 3 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 4 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 1 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 2 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 3 },
                  { name: 'Hazem', email: 'hazem@gmail.com', image: '', user_id: 4 },
                ].map((ele) => (
                  <ListItem onClick={() => handleEditRow(ele.user_id.toString())}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 56, height: 56 }}>
                        {ele.image ? (
                          <Field.UploadAvatar
                            value={state.avatarUrl}
                            name="avatarUrl"
                            disabled
                            maxSize={3145728}
                          />
                        ) : (
                          <Iconify icon="ic:baseline-image" width={24} />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ele.name} secondary={ele.email} />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}

          {(state.role === 'Debater' || state.role === 'Judge') && (
            <Card sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>Debates</Typography>
              <List
                sx={{
                  bgcolor: 'background.paper',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  },
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                }}
              >
                {[
                  { name: '21/1/2003', type: 'Onsite' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Onsite' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Online' },
                  { name: '21/1/2003', type: 'Onsite' },
                  { name: '21/1/2003', type: 'Online' },
                ].map((ele) => (
                  <ListItem>
                    <ListItemText primary={ele.name} secondary={ele.type} />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}

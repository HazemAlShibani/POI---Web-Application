import type { IUserItem } from 'src/types/user';
import type { RegisterUserData } from 'src/apis/type';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { InputAdornment } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';

import { CustomError } from 'src/apis/type';
import { uploadFile, registerUserHandler } from 'src/apis';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod
  .object({
    avatarUrl: schemaHelper.file({ message: { required_error: 'Image is required!' } }),

    profile_picture_url: zod.string().min(1, { message: 'File is required!' }),
    pp_public_id: zod.string().min(1, { message: 'File is required!' }),

    first_name: zod.string().min(1, { message: 'First name is required!' }),
    last_name: zod.string().min(1, { message: 'Last name is required!' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    password: zod
      .string()
      .min(1, { message: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters!' }),
    confirmPassword: zod.string().min(6, 'Password confirmation is required'),

    mobile_number: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    birth_date: zod.string().min(1, { message: 'Birth Date is required!' }),

    faculty_id: zod.object({
      code: zod.string(),
      label: zod.string(),
    }),
    coach_id: zod.object({
      code: zod.string(),
      label: zod.string(),
    }),
    governorate: zod.string().min(1, { message: 'Governorate is required!' }),
    education_degree: zod.string().min(1, { message: 'Education degree is required!' }),

    role: zod.string().min(1, { message: 'Role is required!' }),
  })
  .refine(
    (data) =>
      data.role !== 'Debater' ||
      (data.coach_id.code.trim() !== '' && data.coach_id.label.trim() !== ''),
    {
      message: 'Coach is required!',
      path: ['coach_id'],
    }
  )
  .refine((data) => data.faculty_id.code.trim() !== '' && data.faculty_id.label.trim() !== '', {
    message: 'Faculty is required!',
    path: ['faculty_id'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();

  const password = useBoolean();

  const defaultValues = useMemo(
    () => ({
      avatarUrl: currentUser?.avatarUrl || null,
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      profile_picture_url: '',
      pp_public_id: '',
      password: '',
      confirmPassword: '',
      faculty_id: {
        code: '',
        label: '',
      },
      coach_id: {
        code: '',
        label: '',
      },
      mobile_number: currentUser?.mobile_number || '',
      birth_date: currentUser?.birth_date || '',
      governorate: currentUser?.governorate || '',
      education_degree: currentUser?.education_degree || '',
      role: currentUser?.role || '',
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const { mutate: uploadFile1Mutate } = useMutation({
    mutationKey: ['upload-file1-offer'],
    mutationFn: async (args: File) => uploadFile(args),
    onSuccess: (data) => {
      // @ts-ignore
      methods.setValue('avatarUrl', data.data.url);
      // @ts-ignore
      methods.setValue('profile_picture_url', data.data.url);
      // @ts-ignore
      methods.setValue('pp_public_id', data.data.public_id);
      // @ts-ignore
      methods.clearErrors('avatarUrl');
    },
    onError: (error) => {
      if (error instanceof CustomError) {
        methods.setError('avatarUrl', error);
      }
    },
  });

  const { mutate: registerUser, isPending: isPendingRegisterUser } = useMutation({
    mutationKey: ['register-user'],
    mutationFn: async (data: RegisterUserData) => registerUserHandler(data),
    onSuccess: () => {
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
    },
    onError: (errordata) => {
      toast.error(currentUser ? `Update failed! ${errordata}` : `Create failed! ${errordata}`);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const FinalData = {
        role: data.role,
        data: {
          profile_picture_url: data.profile_picture_url,
          public_id: data.pp_public_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          mobile_number: `0${data.mobile_number.slice(4)}`,
          birth_date: data.birth_date,
          faculty_id: Number(data.faculty_id.code),
          governorate: data.governorate,
          education_degree: data.education_degree.toLowerCase(),
          ...(data.role === 'Debater' && { coach_id: Number(data.coach_id.code) }),
        },
      };

      registerUser(FinalData);
    } catch (error) {
      console.error(error);
    }
  });

  const uploadImage = (data: File[]) => {
    uploadFile1Mutate(data[0]);
    methods.setValue('avatarUrl', data[0]);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={currentUser ? 12 : 4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={uploadImage}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete user
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>
        {!currentUser && (
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Field.RoleSelect
                style={{ marginBottom: '25px' }}
                fullWidth
                name="role"
                label="Role"
                placeholder="Choose a Role"
              />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <Field.Text name="first_name" label="First name" />
                <Field.Text name="last_name" label="Last name" />
                <Field.Text name="email" label="Email address" />
                <Field.Phone name="mobile_number" label="Phone number" />

                <Field.Text
                  sx={{ mb: 1 }}
                  name="password"
                  placeholder="password"
                  type={password.value ? 'text' : 'password'}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Field.Text
                  name="confirmPassword"
                  placeholder="confirm password"
                  type={password.value ? 'text' : 'password'}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Field.ReagionSelect
                  fullWidth
                  name="governorate"
                  label="Governorate"
                  placeholder="Choose a Governorate"
                />

                <Field.DatePicker name="birth_date" label="Birth Date" />

                <Field.EducationSelect
                  fullWidth
                  name="education_degree"
                  label="Education degree"
                  placeholder="Choose a Education degree"
                />

                <Field.FacultySelect
                  fullWidth
                  name="faculty_id"
                  label="Faculty"
                  placeholder="Choose a Faculty"
                />
              </Box>

              {watch('role') === 'Debater' && (
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <Field.CoachSelect
                    fullWidth
                    name="coach_id"
                    label="Coach"
                    placeholder="Choose a Coach"
                  />
                </Stack>
              )}

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isPendingRegisterUser}>
                  {!currentUser ? 'Create user' : 'Save changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        )}
      </Grid>
    </Form>
  );
}

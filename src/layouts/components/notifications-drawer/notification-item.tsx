import type { AllNotifications } from 'src/apis/type';
import type { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { applyToJoin } from 'src/apis';

import { Iconify } from 'src/components/iconify';

export type ApplyUserData = {
  response: string;
  application_id: number;
};

export function NotificationItem({
  notification,
  refetch,
}: {
  notification: AllNotifications;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AllNotifications[], Error>>;
}) {
  console.log(notification);

  const { mutate: registerUser, isPending } = useMutation({
    mutationKey: ['application-user'],
    mutationFn: async (data: ApplyUserData) => applyToJoin(data),
    onSuccess: () => {
      toast.success('Update success!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Update failed! ${error}`);
    },
  });

  const acceptNotification = () => {
    registerUser({
      application_id: notification.id,
      response: 'approved',
    });
  };

  const rejectNotification = () => {
    registerUser({
      application_id: notification.id,
      response: 'rejected',
    });
  };

  const renderAvatar = (
    <ListItemAvatar>
      {notification.avatarUrl ? (
        <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'background.neutral' }}
        >
          <Iconify icon="material-symbols:person-raised-hand-rounded" />
        </Stack>
      )}
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={notification.title}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notification.createdAt)}
          {notification.category}
        </Stack>
      }
    />
  );

  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <LoadingButton
        onClick={acceptNotification}
        size="small"
        variant="contained"
        loading={isPending}
      >
        Accept
      </LoadingButton>
      <LoadingButton
        onClick={rejectNotification}
        size="small"
        variant="outlined"
        loading={isPending}
      >
        Decline
      </LoadingButton>
    </Stack>
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-center',
        borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
      }}
    >
      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {notification.type === 'friend' && friendAction}
      </Stack>
    </ListItemButton>
  );
}

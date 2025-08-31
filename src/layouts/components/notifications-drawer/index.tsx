import type { AllNotifications } from 'src/apis/type';
import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuth } from 'src/AuthContext';
import { getAllApplications } from 'src/apis';

import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';

import { NotificationItem } from './notification-item';

// ----------------------------------------------------------------------

export type NotificationsDrawerProps = IconButtonProps & {
  data?: [];
};

export function NotificationsDrawer({ data = [], sx, ...other }: NotificationsDrawerProps) {
  const drawer = useBoolean();
  const { hasNewApplications, setHasNewApplications } = useAuth();

  const [notifications, setNotifications] = useState<AllNotifications[]>();

  const { data: allApplications, refetch } = useQuery({
    queryKey: ['get-all-applications'],
    queryFn: () => getAllApplications(),
  });

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>
    </Stack>
  );

  const renderList = (
    <Scrollbar>
      <Box component="ul">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
              <NotificationItem refetch={refetch} notification={notification} />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              mt: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Iconify color="text.secondary" width="30px" icon="ic:baseline-notifications-off" />
            <Typography
              sx={{ fontSize: '20px', fontWeight: 'bold' }}
              variant="body2"
              color="text.secondary"
            >
              No Applications
            </Typography>
          </Box>
        )}
      </Box>
    </Scrollbar>
  );

  useEffect(() => {
    if (allApplications) {
      setNotifications(allApplications);
    }

    if (hasNewApplications) {
      refetch();
      setHasNewApplications(false);
    }
  }, [allApplications, hasNewApplications, refetch, setHasNewApplications]);

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={drawer.onTrue}
        sx={sx}
        {...other}
      >
        <Badge color="error">
          <SvgIcon>
            <path
              fill="currentColor"
              d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
            />
          </SvgIcon>
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 1, maxWidth: 420 } }}
      >
        {renderHead}

        {renderList}
      </Drawer>
    </>
  );
}

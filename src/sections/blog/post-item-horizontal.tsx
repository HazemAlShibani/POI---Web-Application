import type { AllPosts } from 'src/apis/type';
import type { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';
import { deleteArticleHandler } from 'src/apis';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  post: AllPosts;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AllPosts[], Error>>;
};

export function PostItemHorizontal({ post, refetch }: Props) {
  const theme = useTheme();

  const popover = usePopover();

  const { id, title, publish, createdAt, description } = post;

  const { mutate, isPending } = useMutation({
    mutationKey: ['application-user'],
    mutationFn: async (id_data: Number) => deleteArticleHandler(id_data),
    onSuccess: () => {
      toast.success('Update success!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Update failed! ${error}`);
    },
  });

  const onSub = () => {
    mutate(id);
    popover.onClose();
  };

  return (
    <>
      <Card sx={{ display: 'flex' }}>
        <Stack spacing={1} sx={{ p: theme.spacing(3, 3, 2, 3) }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Label variant="soft" color={(publish === 'article' && 'info') || 'default'}>
              {publish}
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(createdAt)}
            </Box>
          </Box>

          <Stack spacing={1} flexGrow={1}>
            <Link
              component={RouterLink}
              href={paths.dashboard.blog.details(id.toString())}
              color="inherit"
              variant="subtitle2"
              sx={{ ...maxLine({ line: 2 }) }}
            >
              {title}
            </Link>

            <Typography variant="body2" sx={{ ...maxLine({ line: 2 }), color: 'text.secondary' }}>
              {description}
            </Typography>
          </Stack>

          <Box display="flex" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          </Box>
        </Stack>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem onClick={onSub} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            {isPending ? 'Loading...' : 'Delete'}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

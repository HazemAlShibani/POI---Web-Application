import type { AllPosts } from 'src/apis/type';
import type { IPostFilters } from 'src/types/blog';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useSetState } from 'src/hooks/use-set-state';

import { getArticlesHandler } from 'src/apis';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostListHorizontal } from '../post-list-horizontal';

// ----------------------------------------------------------------------

export function PostListView() {
  const {
    data: postData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['get-all-articles'],
    queryFn: () => getArticlesHandler(),
  });

  const filters = useSetState<IPostFilters>({ publish: 'all' });

  const dataFiltered = applyFilter({ inputData: postData, filters: filters.state });

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      filters.setState({ publish: newValue });
    },
    [filters]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.blog.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.blog.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New post
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs
        value={filters.state.publish}
        onChange={handleFilterPublish}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        {['all', 'article', 'course'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.state.publish) && 'filled') || 'soft'}
                color={(tab === 'article' && 'info') || 'default'}
              >
                {tab === 'all' && postData?.length}

                {tab === 'article' &&
                  postData?.filter((post) => post?.publish === 'article').length}

                {tab === 'course' && postData?.filter((post) => post?.publish === 'course').length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
        s
      </Tabs>

      <PostListHorizontal refetch={refetch} posts={dataFiltered} loading={isLoading} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: AllPosts[] | undefined;
  filters: IPostFilters;
};

const applyFilter = ({ inputData, filters }: ApplyFilterProps) => {
  const { publish } = filters;

  if (publish !== 'all' && inputData) {
    inputData = inputData.filter((post) => post.publish === publish);
  }

  return inputData;
};

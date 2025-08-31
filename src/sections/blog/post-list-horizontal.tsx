import type { AllPosts } from 'src/apis/type';
import type { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { PostItemSkeleton } from './post-skeleton';
import { PostItemHorizontal } from './post-item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  posts: AllPosts[] | undefined;
  loading?: boolean;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AllPosts[], Error>>;
};

export function PostListHorizontal({ posts, loading, refetch }: Props) {
  const renderLoading = <PostItemSkeleton variant="horizontal" />;

  const renderList = posts?.map((post) => (
    <PostItemHorizontal refetch={refetch} key={post.id} post={post} />
  ));

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {posts && posts.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}

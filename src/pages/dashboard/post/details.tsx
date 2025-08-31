import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { getOneArticleHandler } from 'src/apis';

import { PostDetailsView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Post details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const {
    data: oneOfArticle,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['get-one-debate', id],
    queryFn: () => getOneArticleHandler(Number(id)),
    enabled: () => !!id,
  });

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostDetailsView post={oneOfArticle} loading={isPending} error={isError} />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'UI: The starting point for your next project',
  description:
    'The starting point for your next project with, built on the newest version of Material-UI ©, ready to be customized to your style',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <HomeView />
    </>
  );
}

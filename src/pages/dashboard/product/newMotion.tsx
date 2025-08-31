import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductCreateMotionView } from 'src/sections/product/view/product-create-motion-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Motion Sentence | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductCreateMotionView />
    </>
  );
}

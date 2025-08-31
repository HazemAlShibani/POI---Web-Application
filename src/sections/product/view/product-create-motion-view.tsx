import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewMotionForm } from '../product-new-motion-form';

// ----------------------------------------------------------------------

export function ProductCreateMotionView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new Motion Sentence"
        links={[
          // { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Debate', href: paths.dashboard.product.root },
          { name: 'New Motion Sentence' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewMotionForm />
    </DashboardContent>
  );
}

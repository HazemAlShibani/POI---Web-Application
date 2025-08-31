import type { CurentUser } from 'src/pages/dashboard/user/edit';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserEditForm } from '../user-edit-form';

// ----------------------------------------------------------------------

type Props = {
  user?: CurentUser;
};

export function UserEditView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="View"
        links={[
          // { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Users', href: paths.dashboard.user.list },
          { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}

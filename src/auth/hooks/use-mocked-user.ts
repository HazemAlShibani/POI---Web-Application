import { _mock } from 'src/_mock';

// eslint-disable-next-line import/no-cycle
import { useAuthContext } from 'src/auth/hooks';

export function useMockedUser() {
  const { user: reciveInfo } = useAuthContext();

  const user = {
    id: reciveInfo?.id,
    displayName: reciveInfo?.name,
    email: reciveInfo?.email,
    photoURL: _mock.image.avatar(24),
    phoneNumber: _mock.phoneNumber(1),
    role: 'admin',
    isPublic: true,
  };

  return { user };
}

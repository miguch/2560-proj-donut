import useUser from '../hooks/useUser';
import NotFoundPage from './NotFoundPage';

export default function PageGuard({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: String[];
}) {
  const { user, error, isLoading } = useUser();
  if (isLoading || error) {
    return <></>;
  }
  if (allowedRoles.includes(user?.type!)) {
    return children;
  }
  return <NotFoundPage></NotFoundPage>;
}

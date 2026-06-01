import { Redirect } from 'expo-router';

import { useAuth } from '@/src/contexts/auth';

export default function Index() {
  const { isAuthenticated } = useAuth();

  return <Redirect href={isAuthenticated ? '/team' : '/login'} />;
}
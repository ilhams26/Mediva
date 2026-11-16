import { useAuth } from '../hooks/useAuth';
import { DashboardStaf } from './DashboardStaf';
import { DashboardAdmin } from './DashboardAdmin';

export function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <DashboardAdmin />;
  }

  return <DashboardStaf />;
}

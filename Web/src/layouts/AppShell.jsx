import { Sidebar } from '../components/Sidebar';
import './AppShell.css';

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}

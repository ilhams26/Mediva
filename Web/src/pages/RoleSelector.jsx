import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import './RoleSelector.css';

export function RoleSelector() {
  const navigate = useNavigate();
  const { loginFake } = useAuth();

  const handleLogin = (role) => {
    loginFake(role);
    navigate('/');
  };

  return (
    <div className="role-selector">
      <div className="selector-card">
        <h1 className="text-brand" style={{ marginBottom: '12px' }}>Mediva</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Smart Medicine Platform - Pilih Peran
        </p>
        
        <div className="role-buttons">
          <Button 
            size="lg" 
            onClick={() => handleLogin('staf')}
            style={{ width: '100%', marginBottom: '12px' }}
          >
            Login Staf
          </Button>
          <Button 
            size="lg" 
            onClick={() => handleLogin('admin')}
            style={{ width: '100%' }}
          >
            Login Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

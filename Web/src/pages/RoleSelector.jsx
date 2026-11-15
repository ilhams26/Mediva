import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export function RoleSelector() {
  const navigate = useNavigate();
  const { loginFake } = useAuth();

  const handleLogin = (role) => {
    loginFake(role);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-mediva-page to-mediva-sidebar p-6">
      <div className="w-full max-w-md rounded-mediva-2xl border border-white bg-white/92 p-10 shadow-mediva-login">
        <h1 className="mb-3 text-3xl font-bold text-mediva-primary">
          Mediva
        </h1>
        <p className="mb-8 text-[13px] text-mediva-muted">
          Smart Medicine Platform - Pilih Peran
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            variant="primary"
            onClick={() => handleLogin('staf')}
            className="w-full h-12"
          >
            Login Staf
          </Button>
          <Button 
            variant="primary"
            onClick={() => handleLogin('admin')}
            className="w-full h-12"
          >
            Login Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";

export function RoleSelector() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      let msg;
      if (!err?.response) {
        msg =
          "Tidak dapat terhubung ke server backend. Pastikan `php artisan serve` berjalan di http://127.0.0.1:8000 dan alamat Vite (localhost/127.0.0.1) cocok dengan konfigurasi CORS.";
      } else {
        msg =
          err.response.data?.errors?.login_id?.[0] ??
          err.response.data?.message ??
          "Login gagal. Periksa username dan password.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-mediva-page to-mediva-sidebar p-6">
      <div className="w-full max-w-md rounded-mediva-2xl border border-white bg-white/92 p-10 shadow-mediva-login">
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Mediva" className="h-16 w-auto" />
        </div>
        <p className="mb-8 text-center text-[13px] text-mediva-muted">
          Login Staf / Admin
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-mediva-text mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-2.5 border border-mediva-border rounded-lg focus:ring-2 focus:ring-mediva-primary/30 focus:border-mediva-primary outline-none transition text-sm"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mediva-text mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-2.5 border border-mediva-border rounded-lg focus:ring-2 focus:ring-mediva-primary/30 focus:border-mediva-primary outline-none transition text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-lg bg-mediva-primary text-white font-semibold hover:bg-mediva-primary/90 disabled:opacity-60 transition text-sm"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

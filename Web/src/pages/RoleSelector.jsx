import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";
import { Login3DBackground } from "../components/Login3DBackground";

export function RoleSelector() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookDown, setLookDown] = useState(0);
  const [eyesClosed, setEyesClosed] = useState(false);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 6;
    const rotateY = (x / rect.width) * 6;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

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
          "Tidak dapat terhubung ke server backend. Pastikan `php artisan serve` berjalan di http://127.0.0.1:8000.";
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
    <div className="login-radial-bg fixed inset-0 flex h-screen w-screen flex-col items-center justify-end overflow-hidden pb-6 sm:pb-8 select-none">
      {/* 3D WebGL Scene & Ambient Auroras */}
      <Login3DBackground
        stageRef={stageRef}
        lookDown={lookDown}
        eyesClosed={eyesClosed}
      />

      {/* Stage Wrapper */}
      <div
        ref={stageRef}
        className="relative z-10 w-full max-w-[370px] px-3 sm:px-0 transition-all duration-200"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Card with Glassmorphism, 3D tilt, and Tailwind shimmer light sweep */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(30,136,229,0.25)] backdrop-blur-xl transition-transform duration-200 ease-out sm:p-7"
        >
          {/* Shimmer light sweep passing across the card every few seconds */}
          <div className="pointer-events-none absolute -inset-y-0 -left-full w-2/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-card-shimmer" />

          {/* Logo Brand */}
          <div className="mb-2 flex justify-center">
            <img
              src={logo}
              alt="Mediva Logo"
              className="h-11 w-auto drop-shadow-sm sm:h-12"
            />
          </div>

          {/* Text dibawah logo */}
          <p className="mb-4 text-center text-xs font-bold tracking-wider text-blue-900 uppercase">
            SELAMAT DATANG KE MEDIVA
          </p>

          {error && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-xs text-red-700 shadow-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setLookDown(0.3)}
                onBlur={() => setLookDown(0)}
                placeholder="Masukkan username"
                className="w-full rounded-xl border border-blue-100 bg-white/90 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setEyesClosed(true)}
                onBlur={() => setEyesClosed(false)}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-blue-100 bg-white/90 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-1 flex h-10 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-xs font-bold text-white shadow-md shadow-blue-500/30 transition hover:from-blue-700 hover:to-sky-600 hover:shadow-lg disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="h-3.5 w-3.5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk ke Sistem</span>
                )}
              </span>
            </button>
          </form>

          {/* Footer note: hanya Lupa Password di kanan */}
          <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => alert("Silakan hubungi administrator sistem untuk mereset kata sandi.")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
            >
              Lupa Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

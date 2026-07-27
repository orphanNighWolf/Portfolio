import { useState, FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Lock, Mail, AlertTriangle } from "lucide-react";
import Button from "@/components/Button";
import { FormInput, FormLabel } from "@/components/FormElements";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate({ from: "/login" });
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;
      
      setAuth(accessToken, user);
      setIsLockedOut(false);
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number; data?: { message?: string; lockout?: boolean } } };
      const msg = axiosError.response?.data?.message || "Failed to log in. Please try again.";
      if (axiosError.response?.status === 429 || axiosError.response?.data?.lockout) {
        setIsLockedOut(true);
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-h3 font-bold font-display tracking-tight text-text-primary">Admin Gateway</h2>
        <p className="text-text-muted text-xs mt-1.5 font-mono">// ESTABLISH_SECURE_AUTH_LINK</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-error/10 border border-error/20 text-error text-xs rounded-xl p-4 mb-6 font-mono">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <FormLabel htmlFor="email" required>Admin Email</FormLabel>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-3.5 text-text-muted" />
            <FormInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder="aniketsaini0596@gmail.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <FormLabel htmlFor="password" required>Access Password</FormLabel>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-3.5 text-text-muted" />
            <FormInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || isLockedOut}
          className="w-full mt-2"
        >
          {isLockedOut ? "ACCOUNT LOCKED" : isLoading ? "AUTHORIZING LINK..." : "SECURE CONNECTION"}
        </Button>
      </form>
    </div>
  );
}

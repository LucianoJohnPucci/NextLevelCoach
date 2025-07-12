import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient"; // adjust path as needed

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const type = searchParams.get("type");

    if (type === "recovery" && accessToken) {
      // Optionally, you can show a password reset form here
      setStatus("show-form");
    } else {
      setStatus("invalid");
    }
  }, [searchParams]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "invalid") return <div>Invalid or expired link.</div>;

  // Render your password reset form here
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) return <div>Your password has been reset! You can now log in.</div>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Reset your password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block mb-1">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            minLength={8}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            minLength={8}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-primary text-white rounded px-4 py-2 mt-2 w-full"
          disabled={submitting}
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}


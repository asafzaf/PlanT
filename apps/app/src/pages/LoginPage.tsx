import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/authHook";
import { useI18n } from "../i18n/useI18n";
import type { IUserLoginDTO } from "@shared/types";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: IUserLoginDTO = { email, password };

    loginMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/dashboard");
      },
      onError: (error) => {
        setErrors({
          form: error.message || "Login failed. Please try again.",
        });
      },
    });
  };

  return (
    <div className="auth_container">
      <div className="auth_card">
        <h1 className="auth_title">{"Login"}</h1>

        <form onSubmit={handleSubmit} className="auth_form">
          {/* Email */}
          <div className="form_group">
            <label htmlFor="email" className="form_label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form_input ${errors.email ? "input_error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              disabled={loginMutation.isPending}
            />
            {errors.email && <span className="form_error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form_group">
            <label htmlFor="password" className="form_label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form_input ${errors.password ? "input_error" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              disabled={loginMutation.isPending}
            />
            {errors.password && (
              <span className="form_error">{errors.password}</span>
            )}
          </div>

          {/* Form error */}
          {(errors.form || loginMutation.isError) && (
            <div className="form_error_message">
              {errors.form || loginMutation.error?.message || "Login failed"}
            </div>
          )}

          <button
            type="submit"
            className="auth_submit_btn"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth_footer">
          <p>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="auth_link_btn"
              onClick={() => navigate("/register")}
              disabled={loginMutation.isPending}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

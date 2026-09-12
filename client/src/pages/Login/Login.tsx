import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { loginUser } from "../../utils/api";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import logo from "../../assets/images/logo-2.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    try {
      const res = await loginUser(values.email ?? "", values.password ?? "");

      if (res.data) {
        login(res.data.token, res.data.user);
        navigate("/knowledge");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again later",
      );
    }
  };

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive
      ? "auth-card__nav-link auth-card__nav-link_active"
      : "auth-card__nav-link";
  }

  return (
    <main className="auth-page">
      <header className="header">
        <img className="header__logo" alt="MeshAI logo" src={logo} />
      </header>

      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title" className="auth-card__title">
          Sign in
        </h1>
        <p className="auth-card__subtitle">
          Access your organisation&apos;s secure workspace
        </p>

        <nav className="auth-card__nav" aria-label="Authentication section">
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Register
          </NavLink>
        </nav>

        <form className="auth-card__form" noValidate onSubmit={handleSubmit}>
          <label className="auth-card__input-field">
            <span className="auth-card__input-label">Email</span>

            <input
              className={`auth-card__input ${errors.email ? "auth-card__input_error" : ""}`}
              id="email"
              name="email"
              type="email"
              required
              value={values.email ?? ""}
              placeholder="johndoe12345@gmail.com"
              onChange={handleChange}
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            {errors.email && (
              <span id="email-error" className="auth-card__input-error">
                {errors.email}
              </span>
            )}
          </label>

          <label className="auth-card__input-field">
            <span className="auth-card__input-label">Password</span>

            <input
              className={`auth-card__input ${errors.password ? "auth-card__input_error" : ""}`}
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={values.password ?? ""}
              placeholder="12345678"
              onChange={handleChange}
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
            />

            {errors.password && (
              <span id="password-error" className="auth-card__input-error">
                {errors.password}
              </span>
            )}
          </label>

          <button
            type="submit"
            className="auth-card__input-btn"
            disabled={!isValid}
          >
            Login
          </button>

          {submitError && (
            <p className="auth-card__status" role="alert">
              {submitError}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

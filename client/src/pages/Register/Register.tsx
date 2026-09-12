import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { registerUser } from "../../utils/api";
import logo from "../../assets/images/logo-2.png";

export default function Register() {
  const navigate = useNavigate();
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    try {
      await registerUser(
        values.name ?? "",
        values.email ?? "",
        values.password ?? "",
      );

      navigate("/login");
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

      <section className="auth-card" aria-labelledby="register-title">
        <h1 id="register-title" className="auth-card__title">
          Create an account
        </h1>
        <p className="auth-card__subtitle">
          Create your organisation&apos;s secure workspace
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
            <span className="auth-card__input-label">Name</span>

            <input
              className={`auth-card__input ${errors.name ? "auth-card__input_error" : ""}`}
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={40}
              value={values.name ?? ""}
              placeholder="Person"
              onChange={handleChange}
              autoComplete="name"
              aria-describedby={errors.name ? "name-error" : undefined}
            />

            {errors.name && (
              <span id="name-error" className="auth-card__input-error">
                {errors.name}
              </span>
            )}
          </label>

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
            Create Account
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

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

export const Route = createFileRoute("/login")({
  validateSearch: (search): { redirect?: string; email?: string } => ({
    redirect: (search.redirect as string) || undefined,
    email: (search.email as string) || undefined,
  }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const { redirect } = Route.useSearch();

  const { translate: t } = useTranslation();

  async function handleLogInWithEmail(e?: React.FormEvent) {
    if (e) e.preventDefault();

    setMessage("");
    setNotice("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(t("¡Credenciales inválidas!"));
    } else {
      setEmail("");
      setPassword("");
    }
  }

  async function handleMagicLink() {
    setMessage("");
    setNotice("");

    if (!email) {
      setMessage(t("Ingresá tu correo electrónico primero"));
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + (redirect || "/"),
      },
    });

    if (error) {
      setMessage(t("No se pudo enviar el enlace. Intentá de nuevo."));
    } else {
      setNotice(t("Revisá tu correo para el enlace de acceso"));
    }
  }

  return (
    <div className="flex flex-col gap-9 justify-center items-center bg-background text-foreground h-dvh w-screen">
      <div className="text-primary tracking-tighter font-bold text-[36px]">
        OpenBSP
      </div>

      <div className="flex flex-col gap-3 w-[250px]">
        <form onSubmit={handleLogInWithEmail} className="login-form">
          <label>
            <div className="label">{t("Correo electrónico")}</div>
            <input
              className="text"
              placeholder="gori@gmail.com"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>

          <label>
            <div className="label">{t("Contraseña")}</div>
            <input
              className="text"
              placeholder="******"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>

          {message && (
            <div className="self-center text-destructive text-md">
              {message}
            </div>
          )}

          {notice && (
            <div className="self-center text-foreground text-md">
              {notice}
            </div>
          )}

          <button type="submit" className="primary w-full mt-[16px]">
            {t("Entrar")}
          </button>

          <button
            type="button"
            className="self-center text-sm text-muted-foreground underline bg-transparent border-none"
            onClick={handleMagicLink}
          >
            {t("Enviarme un enlace de acceso")}
          </button>
        </form>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

// Landing page for both the "forgot password" recovery link and the admin
// "invite user" link — both establish a session via the URL's access_token
// (handled automatically by detectSessionInUrl in supabase/client.ts) and
// land here to have the user set a password for that account.
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const { translate: t } = useTranslation();

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    setMessage("");

    if (password.length < 6) {
      setMessage(t("La contraseña debe tener al menos 6 caracteres"));
      return;
    }

    if (password !== confirmPassword) {
      setMessage(t("Las contraseñas no coinciden"));
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(t("No se pudo actualizar la contraseña. Pedí un enlace nuevo."));
    } else {
      setDone(true);
      setTimeout(() => navigate({ to: "/" }), 1500);
    }
  }

  return (
    <div className="flex flex-col gap-9 justify-center items-center bg-background text-foreground h-dvh w-screen">
      <div className="text-primary tracking-tighter font-bold text-[36px]">
        OpenBSP
      </div>

      <div className="flex flex-col gap-3 w-[250px]">
        {done ? (
          <div className="self-center text-foreground text-md">
            {t("¡Contraseña actualizada! Redirigiendo...")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <div className="label">{t("Nueva contraseña")}</div>
              <input
                className="text"
                placeholder="******"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </label>

            <label>
              <div className="label">{t("Confirmar contraseña")}</div>
              <input
                className="text"
                placeholder="******"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </label>

            {message && (
              <div className="self-center text-destructive text-md">
                {message}
              </div>
            )}

            <button type="submit" className="primary w-full mt-[16px]">
              {t("Guardar contraseña")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

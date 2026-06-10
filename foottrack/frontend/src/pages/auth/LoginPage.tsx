import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "@/services/api";
import { useAuth } from "@/store/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface LoginForm {
  usuario: string;
  senha: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError("");
      const res = await authApi.login(data);
      login(res.data.data.token, res.data.data.usuario);
      navigate("/");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-2xl font-black text-black">⚽</div>
          <span className="font-condensed font-black text-3xl">Foot<span className="text-primary">Track</span></span>
        </div>

        <div className="bg-surface border border-white/[0.08] rounded-2xl p-8">
          <h2 className="font-condensed font-bold text-2xl mb-1">Bem-vindo de volta</h2>
          <p className="text-muted text-sm mb-7">Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Usuário"
              placeholder="seu_usuario"
              error={errors.usuario?.message}
              {...register("usuario", { required: "Informe o usuário" })}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.senha?.message}
              {...register("senha", { required: "Informe a senha" })}
            />
            {serverError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {serverError}
              </p>
            )}
            <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
              Entrar
            </Button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Não tem conta?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

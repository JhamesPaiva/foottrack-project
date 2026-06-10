import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "@/services/api";
import { useAuth } from "@/store/auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface RegisterForm {
  usuario: string;
  senha: string;
  confirmar_senha: string;
}

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>();
  const senha = watch("senha");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError("");
      const res = await authApi.register(data);
      login(res.data.data.token, res.data.data.usuario);
      navigate("/");
    } catch (err: any) {
      const msgs = err.response?.data?.errors;
      if (msgs) {
        const first = Object.values(msgs).flat()[0] as string;
        setServerError(first);
      } else {
        setServerError(err.response?.data?.message || "Erro ao criar conta.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-2xl font-black text-black">⚽</div>
          <span className="font-condensed font-black text-3xl">Foot<span className="text-primary">Track</span></span>
        </div>

        <div className="bg-surface border border-white/[0.08] rounded-2xl p-8">
          <h2 className="font-condensed font-bold text-2xl mb-1">Criar conta</h2>
          <p className="text-muted text-sm mb-7">Comece a gerenciar seu time hoje</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Usuário"
              placeholder="seu_usuario"
              error={errors.usuario?.message}
              {...register("usuario", {
                required: "Informe o usuário",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Apenas letras, números e _" },
              })}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.senha?.message}
              {...register("senha", {
                required: "Informe a senha",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
              })}
            />
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              error={errors.confirmar_senha?.message}
              {...register("confirmar_senha", {
                required: "Confirme a senha",
                validate: (v) => v === senha || "As senhas não conferem",
              })}
            />
            {serverError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {serverError}
              </p>
            )}
            <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
              Criar Conta
            </Button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

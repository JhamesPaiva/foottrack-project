import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, CheckCircle, RefreshCw, Upload } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { timesApi, temporadasApi } from "@/services/api";
import { useApp } from "@/store/app";
import type { Time, Temporada } from "@/types";

export default function ConfiguracoesPage() {
  const { selectedTime, selectedTemporada, setSelectedTime, setSelectedTemporada } = useApp();
  const toast = useToast();
  const [times, setTimes] = useState<Time[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showTempModal, setShowTempModal] = useState(false);
  const [editingTime, setEditingTime] = useState<Time | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const escudoInputRef = useRef<HTMLInputElement>(null);
  const [escudoTargetId, setEscudoTargetId] = useState<number | null>(null);

  useEffect(() => { loadTimes(); }, []);
  useEffect(() => {
    if (selectedTime) loadTemporadas(selectedTime.id);
  }, [selectedTime]);

  const loadTimes = async () => {
    try {
      const r = await timesApi.listar();
      setTimes(r.data.data);
      if (!selectedTime && r.data.data.length > 0) setSelectedTime(r.data.data[0]);
    } catch {
      toast.error("Erro ao carregar times.");
    }
  };

  const loadTemporadas = async (timeId: number) => {
    try {
      const r = await temporadasApi.listar(timeId);
      setTemporadas(r.data.data);
      const ativa = r.data.data.find((t) => t.status === "ativa");
      if (!selectedTemporada && ativa) setSelectedTemporada(ativa);
    } catch {
      toast.error("Erro ao carregar temporadas.");
    }
  };

  const handleSelectTime = (time: Time) => {
    setSelectedTime(time);
    setSelectedTemporada(null);
    setTemporadas([]);
  };

  const handleDeleteTime = async (id: number) => {
    if (!confirm("Excluir time e todos os dados vinculados?")) return;
    try {
      await timesApi.deletar(id);
      toast.success("Time excluído com sucesso.");
      if (selectedTime?.id === id) {
        setSelectedTime(null);
        setSelectedTemporada(null);
        setTemporadas([]);
      }
      loadTimes();
    } catch {
      toast.error("Erro ao excluir time.");
    }
  };

  const handleToggleTemporada = async (t: Temporada) => {
    try {
      if (t.status === "ativa") {
        await temporadasApi.encerrar(t.id);
        toast.success("Temporada encerrada.");
      } else {
        await temporadasApi.reabrir(t.id);
        toast.success("Temporada reaberta.");
      }
      loadTemporadas(selectedTime!.id);
    } catch {
      toast.error("Erro ao atualizar temporada.");
    }
  };

  const handleEscudoClick = (e: React.MouseEvent, timeId: number) => {
    e.stopPropagation();
    setEscudoTargetId(timeId);
    escudoInputRef.current?.click();
  };

  const handleEscudoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !escudoTargetId) return;

    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      toast.error("Formato inválido. Use PNG, JPG ou JPEG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 5MB.");
      return;
    }

    setUploadingId(escudoTargetId);
    try {
      const r = await timesApi.uploadEscudo(escudoTargetId, file);
      // Atualiza o time na lista
      setTimes((prev) => prev.map((t) => t.id === escudoTargetId ? r.data.data : t));
      // Atualiza selectedTime se for o mesmo
      if (selectedTime?.id === escudoTargetId) setSelectedTime(r.data.data);
      toast.success("Escudo atualizado com sucesso!");
    } catch {
      toast.error("Erro ao fazer upload do escudo.");
    } finally {
      setUploadingId(null);
      setEscudoTargetId(null);
      // Limpa o input para permitir reupload do mesmo arquivo
      if (escudoInputRef.current) escudoInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Time & Temporadas" />

      {/* Input de escudo oculto */}
      <input
        ref={escudoInputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        className="hidden"
        onChange={handleEscudoChange}
        aria-label="Selecionar escudo do time"
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Times */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-condensed font-bold text-lg">Meus Times</h2>
            <Button size="sm" icon={<Plus size={14} />} onClick={() => { setEditingTime(null); setShowTimeModal(true); }}>
              Novo Time
            </Button>
          </div>
          <div className="space-y-3">
            {times.map((time) => (
              <Card
                key={time.id}
                hover
                onClick={() => handleSelectTime(time)}
                className={`p-4 flex items-center gap-4 ${selectedTime?.id === time.id ? "border-primary/50 bg-primary/5" : ""}`}
              >
                {/* Escudo / Avatar com botão de upload */}
                <div className="relative group flex-shrink-0">
                  {time.escudo ? (
                    <img
                      src={`/api/v1/uploads/${time.escudo}`}
                      alt={time.nome}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center font-black text-sm text-white">
                      {time.nome.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  {/* Overlay de upload */}
                  <button
                    className="absolute inset-0 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    onClick={(e) => handleEscudoClick(e, time.id)}
                    title="Alterar escudo"
                  >
                    {uploadingId === time.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={14} className="text-white" />
                    )}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{time.nome}</div>
                  <div className="text-xs text-muted">
                    {[time.cidade, time.categoria, time.ano_fundacao].filter(Boolean).join(" · ")}
                  </div>
                  {time.escudo && (
                    <div className="text-[10px] text-primary mt-0.5">✓ Com escudo</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<Edit2 size={12} />}
                    onClick={(e) => { e.stopPropagation(); setEditingTime(time); setShowTimeModal(true); }} />
                  <Button variant="danger" size="sm" icon={<Trash2 size={12} />}
                    onClick={(e) => { e.stopPropagation(); handleDeleteTime(time.id); }} />
                </div>
              </Card>
            ))}
            {times.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted text-sm">Nenhum time cadastrado ainda.</p>
                <Button size="sm" icon={<Plus size={14} />} className="mt-3" onClick={() => setShowTimeModal(true)}>
                  Criar primeiro time
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Temporadas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-condensed font-bold text-lg">Temporadas</h2>
            <Button size="sm" icon={<Plus size={14} />} disabled={!selectedTime}
              onClick={() => setShowTempModal(true)}>
              Nova Temporada
            </Button>
          </div>

          {selectedTime ? (
            <div className="space-y-3">
              {temporadas.map((temp) => (
                <Card
                  key={temp.id}
                  hover
                  onClick={() => setSelectedTemporada(temp)}
                  className={`p-4 flex items-center gap-4 ${selectedTemporada?.id === temp.id ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">Temporada {temp.nome}</span>
                      <Badge variant={temp.status === "ativa" ? "primary" : "muted"}>
                        {temp.status === "ativa" ? "Ativa" : "Encerrada"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted">
                      {temp.data_inicio && `Início: ${temp.data_inicio}`}
                      {temp.data_fim && ` · Fim: ${temp.data_fim}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost" size="sm"
                    icon={temp.status === "ativa" ? <CheckCircle size={12} /> : <RefreshCw size={12} />}
                    onClick={(e) => { e.stopPropagation(); handleToggleTemporada(temp); }}
                  >
                    {temp.status === "ativa" ? "Encerrar" : "Reabrir"}
                  </Button>
                </Card>
              ))}
              {temporadas.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted text-sm">Nenhuma temporada ainda.</p>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted text-sm">Selecione um time para ver as temporadas.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <TimeModal
        open={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        editing={editingTime}
        onSaved={loadTimes}
      />
      <TemporadaModal
        open={showTempModal}
        onClose={() => setShowTempModal(false)}
        timeId={selectedTime?.id}
        onSaved={() => selectedTime && loadTemporadas(selectedTime.id)}
      />
    </div>
  );
}

function TimeModal({ open, onClose, editing, onSaved }: {
  open: boolean; onClose: () => void; editing: Time | null; onSaved: () => void;
}) {
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Partial<Time>>();
  useEffect(() => { if (open) reset(editing || {}); }, [open, editing]);

  const onSubmit = async (data: Partial<Time>) => {
    try {
      if (editing) await timesApi.atualizar(editing.id, data);
      else await timesApi.criar(data);
      toast.success(editing ? "Time atualizado!" : "Time criado com sucesso!");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao salvar time.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Editar Time" : "Novo Time"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nome *" error={errors.nome?.message} {...register("nome", { required: "Obrigatório" })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Cidade" {...register("cidade")} />
          <Input label="Categoria" {...register("categoria")} />
        </div>
        <Input label="Ano de Fundação" type="number" {...register("ano_fundacao", { valueAsNumber: true })} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{editing ? "Salvar" : "Criar Time"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function TemporadaModal({ open, onClose, timeId, onSaved }: {
  open: boolean; onClose: () => void; timeId?: number; onSaved: () => void;
}) {
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Partial<Temporada>>();
  useEffect(() => { if (open) reset({}); }, [open]);

  const onSubmit = async (data: Partial<Temporada>) => {
    if (!timeId) return;
    try {
      await temporadasApi.criar(timeId, data);
      toast.success("Temporada criada com sucesso!");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao criar temporada.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova Temporada">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nome (ex: 2026) *" {...register("nome", { required: "Obrigatório" })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Data Início" type="date" {...register("data_inicio")} />
          <Input label="Data Fim" type="date" {...register("data_fim")} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>Criar Temporada</Button>
        </div>
      </form>
    </Modal>
  );
}
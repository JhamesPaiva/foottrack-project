import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit2, Trash2, User } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonPlayerCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { jogadoresApi } from "@/services/api";
import { useApp } from "@/store/app";
import { POSICOES } from "@/utils";
import type { Jogador, Posicao } from "@/types";

const POS_OPTIONS = POSICOES.map((p) => ({ value: p, label: p }));
const FILTER_OPTIONS = [{ value: "", label: "Todos" }, ...POS_OPTIONS];

export default function JogadoresPage() {
  const { selectedTemporada } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [search, setSearch] = useState("");
  const [filterPos, setFilterPos] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingJogador, setEditingJogador] = useState<Jogador | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (selectedTemporada) loadJogadores(); }, [selectedTemporada]);

  const loadJogadores = async () => {
    if (!selectedTemporada) return;
    setLoading(true);
    try {
      const r = await jogadoresApi.listar(selectedTemporada.id);
      setJogadores(r.data.data);
    } catch {
      toast.error("Erro ao carregar jogadores.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = jogadores.filter((j) => {
    const matchSearch = j.nome.toLowerCase().includes(search.toLowerCase());
    const matchPos = !filterPos || j.posicao === filterPos;
    return matchSearch && matchPos;
  });

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir jogador e todas as estatísticas?")) return;
    try {
      await jogadoresApi.deletar(id);
      toast.success("Jogador excluído com sucesso.");
      loadJogadores();
    } catch {
      toast.error("Erro ao excluir jogador.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Topbar
        title="Jogadores"
        action={
          <Button size="sm" icon={<Plus size={14} />} onClick={() => { setEditingJogador(null); setShowModal(true); }}
            disabled={!selectedTemporada}>
            Adicionar
          </Button>
        }
      />
      <div className="p-6">
        {!selectedTemporada ? (
          <EmptyState icon="⚽" title="Nenhuma temporada selecionada" description="Configure um time e temporada em Configurações." />
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  className="bg-surface2 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary w-52"
                  placeholder="Buscar jogador..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterPos(opt.value)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      filterPos === opt.value
                        ? "border-primary text-primary bg-primary/10"
                        : "border-white/10 text-muted hover:border-white/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="ml-auto text-xs text-muted self-center">
                {jogadores.length}/40 jogadores
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonPlayerCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<User size={28} />}
                title="Nenhum jogador encontrado"
                description={jogadores.length === 0 ? "Adicione jogadores à temporada." : "Tente outro filtro."}
                action={jogadores.length === 0 ? (
                  <Button size="sm" icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Adicionar Jogador</Button>
                ) : undefined}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((j) => (
                  <Card
                    key={j.id}
                    hover
                    onClick={() => navigate(`/jogadores/${j.id}`)}
                    className="p-5 text-center"
                  >
                    <div className="flex justify-end gap-1 mb-2">
                      <button
                        className="text-muted hover:text-white transition-colors p-1"
                        onClick={(e) => { e.stopPropagation(); setEditingJogador(j); setShowModal(true); }}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="text-muted hover:text-red-400 transition-colors p-1"
                        onClick={(e) => handleDelete(j.id, e)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <Avatar nome={j.nome} foto={j.foto} size="lg" className="mx-auto mb-3" />
                    <div className="font-bold text-sm mb-2 leading-tight">{j.nome}</div>
                    <Badge variant="muted" className="mb-4">{j.posicao || "—"}</Badge>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { key: "Gols", val: j.estatisticas?.gols ?? 0 },
                        { key: "Ast", val: j.estatisticas?.assistencias ?? 0 },
                        { key: "Jogos", val: j.estatisticas?.jogos ?? 0 },
                      ].map((s) => (
                        <div key={s.key}>
                          <div className="font-condensed font-black text-lg text-primary leading-none">{s.val}</div>
                          <div className="text-[10px] text-muted uppercase tracking-wide">{s.key}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <JogadorModal
        open={showModal}
        onClose={() => setShowModal(false)}
        editing={editingJogador}
        temporadaId={selectedTemporada?.id}
        onSaved={loadJogadores}
      />
    </div>
  );
}

function JogadorModal({ open, onClose, editing, temporadaId, onSaved }: {
  open: boolean; onClose: () => void; editing: Jogador | null;
  temporadaId?: number; onSaved: () => void;
}) {
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{ nome: string; posicao: Posicao }>();
  useEffect(() => { if (open) reset({ nome: editing?.nome || "", posicao: editing?.posicao }); }, [open, editing]);

  const onSubmit = async (data: { nome: string; posicao: Posicao }) => {
    try {
      if (editing) await jogadoresApi.atualizar(editing.id, data);
      else if (temporadaId) await jogadoresApi.criar(temporadaId, data);
      toast.success(editing ? "Jogador atualizado!" : "Jogador adicionado!");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao salvar jogador.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Editar Jogador" : "Novo Jogador"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nome *" error={errors.nome?.message} {...register("nome", { required: "Obrigatório" })} />
        <Select
          label="Posição"
          options={POS_OPTIONS}
          placeholder="Selecione a posição"
          {...register("posicao")}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{editing ? "Salvar" : "Adicionar"}</Button>
        </div>
      </form>
    </Modal>
  );
}
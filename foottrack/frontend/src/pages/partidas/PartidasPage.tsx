import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { SkeletonMatchCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { partidasApi, adversariosApi, jogadoresApi } from "@/services/api";
import { useApp } from "@/store/app";
import { formatDate, getResultadoLabel } from "@/utils";
import type { Partida, Adversario, Jogador } from "@/types";

const FILTER_TABS = [
  { label: "Todas", val: "" },
  { label: "Vitórias", val: "vitoria" },
  { label: "Empates", val: "empate" },
  { label: "Derrotas", val: "derrota" },
];

const PER_PAGE = 10;

export default function PartidasPage() {
  const { selectedTemporada, selectedTime } = useApp();
  const toast = useToast();
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => { if (selectedTemporada) loadPartidas(); }, [selectedTemporada]);
  useEffect(() => { setPage(1); }, [filter]);

  const loadPartidas = async () => {
    if (!selectedTemporada) return;
    setLoading(true);
    try {
      const r = await partidasApi.listar(selectedTemporada.id);
      setPartidas(r.data.data);
    } catch {
      toast.error("Erro ao carregar partidas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir partida? As estatísticas dos jogadores serão revertidas.")) return;
    try {
      await partidasApi.deletar(id);
      toast.success("Partida excluída com sucesso.");
      loadPartidas();
    } catch {
      toast.error("Erro ao excluir partida.");
    }
  };

  const filtered = filter ? partidas.filter((p) => p.resultado === filter) : partidas;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const nomeTime = selectedTime?.nome ?? "Meu Time";
  const iniciaisTime = selectedTime?.nome?.slice(0, 2).toUpperCase() ?? "MT";

  return (
    <div className="flex flex-col flex-1">
      <Topbar
        title="Partidas"
        action={
          <Button size="sm" icon={<Plus size={14} />} onClick={() => setShowModal(true)} disabled={!selectedTemporada}>
            Registrar
          </Button>
        }
      />
      <div className="p-6">
        {!selectedTemporada ? (
          <EmptyState icon="⚽" title="Nenhuma temporada selecionada" description="Configure um time em Configurações." />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1 bg-surface2 rounded-xl p-1 w-fit">
                {FILTER_TABS.map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setFilter(t.val)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      filter === t.val ? "bg-surface text-white" : "text-muted hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted">
                {filtered.length} partida{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonMatchCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon="🏟️"
                title="Nenhuma partida registrada"
                description="Registre a primeira partida da temporada."
                action={<Button size="sm" icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Registrar Partida</Button>}
              />
            ) : (
              <>
                <div className="space-y-3">
                  {paginated.map((p) => (
                    <Card key={p.id} className="overflow-hidden">
                      <div
                        className="p-4 grid items-center gap-4 cursor-pointer hover:bg-white/[0.02]"
                        style={{ gridTemplateColumns: "1fr auto 1fr auto" }}
                        onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                      >
                        {/* Time da esquerda */}
                        <div className={`flex items-center gap-3 ${!p.mandante ? "flex-row-reverse text-right" : ""}`}>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                            {p.mandante ? iniciaisTime : (p.adversario?.nome?.slice(0, 2).toUpperCase() ?? "AD")}
                          </div>
                          <div>
                            <div className="font-bold text-sm">
                              {p.mandante ? nomeTime : (p.adversario?.nome ?? "Adversário")}
                            </div>
                            <div className="text-xs text-muted">{p.competicao}</div>
                          </div>
                        </div>

                        {/* Placar */}
                        <div className="text-center min-w-[100px]">
                          <div className={`font-condensed font-black text-3xl ${
                            p.resultado === "vitoria" ? "text-primary" :
                            p.resultado === "empate" ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {p.mandante ? `${p.gols_pro} - ${p.gols_contra}` : `${p.gols_contra} - ${p.gols_pro}`}
                          </div>
                          <div className="text-xs text-muted">{formatDate(p.data_partida)}</div>
                          <Badge
                            variant={p.resultado === "vitoria" ? "primary" : p.resultado === "empate" ? "yellow" : "red"}
                            className="mt-1"
                          >
                            {getResultadoLabel(p.resultado)}
                          </Badge>
                        </div>

                        {/* Time da direita */}
                        <div className={`flex items-center gap-3 ${p.mandante ? "flex-row-reverse text-right" : ""}`}>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xs font-black flex-shrink-0">
                            {p.mandante ? (p.adversario?.nome?.slice(0, 2).toUpperCase() ?? "AD") : iniciaisTime}
                          </div>
                          <div className={p.mandante ? "text-right" : ""}>
                            <div className="font-bold text-sm">
                              {p.mandante ? (p.adversario?.nome ?? "Adversário") : nomeTime}
                            </div>
                            <div className="text-xs text-muted">{p.local}</div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2">
                          {expanded === p.id ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                          <button
                            aria-label="Excluir partida"
                            className="text-muted hover:text-red-400 transition-colors p-1"
                            onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {expanded === p.id && p.estatisticas && p.estatisticas.length > 0 && (
                        <div className="border-t border-white/[0.06] px-5 py-4">
                          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Estatísticas dos Jogadores</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {p.estatisticas.filter((e) => e.participou).map((ep) => (
                              <div key={ep.id} className="flex items-center gap-2 text-sm">
                                <div className="font-medium flex-1">{ep.jogador?.nome ?? `#${ep.jogador_id}`}</div>
                                <div className="flex gap-2 text-xs">
                                  {ep.gols > 0 && <span className="text-primary">⚽{ep.gols}</span>}
                                  {ep.assistencias > 0 && <span className="text-blue-400">🅰️{ep.assistencias}</span>}
                                  {ep.cartoes_amarelos > 0 && <span className="text-yellow-400">🟨{ep.cartoes_amarelos}</span>}
                                  {ep.cartoes_vermelhos > 0 && <span className="text-red-400">🟥</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>

      <PartidaModal
        open={showModal}
        onClose={() => setShowModal(false)}
        temporadaId={selectedTemporada?.id}
        onSaved={loadPartidas}
      />
    </div>
  );
}

interface PartidaFormData {
  adversario_nome: string;
  data_partida: string;
  horario?: string;
  local?: string;
  competicao?: string;
  rodada?: string;
  observacoes?: string;
  mandante: boolean;
  gols_pro: number;
  gols_contra: number;
  estatisticas: {
    jogador_id: number;
    participou: boolean;
    gols: number;
    assistencias: number;
    cartoes_amarelos: number;
    cartoes_vermelhos: number;
  }[];
}

function AdversarioInput({
  value,
  onChange,
  adversarios,
}: {
  value: string;
  onChange: (val: string) => void;
  adversarios: Adversario[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = adversarios.filter((a) =>
    a.nome.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wide">
          Adversário *
        </label>
        <input
          className="bg-surface2 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary transition-colors"
          placeholder="Digite o nome do adversário..."
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-surface border border-white/10 rounded-lg shadow-xl overflow-hidden">
          {suggestions.map((a) => (
            <button
              key={a.id}
              type="button"
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface2 transition-colors flex items-center gap-3"
              onClick={() => { onChange(a.nome); setOpen(false); }}
            >
              <div className="w-7 h-7 rounded-full bg-surface2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {a.nome.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{a.nome}</div>
                {a.cidade && <div className="text-xs text-muted">{a.cidade}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PartidaModal({ open, onClose, temporadaId, onSaved }: {
  open: boolean; onClose: () => void;
  temporadaId?: number; onSaved: () => void;
}) {
  const toast = useToast();
  const [adversarios, setAdversarios] = useState<Adversario[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [adversarioNome, setAdversarioNome] = useState("");

  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm<PartidaFormData>({
    defaultValues: { mandante: true, gols_pro: 0, gols_contra: 0, estatisticas: [] },
  });
  const { fields, replace } = useFieldArray({ control, name: "estatisticas" });

  useEffect(() => {
    if (!open) return;
    reset({ mandante: true, gols_pro: 0, gols_contra: 0, estatisticas: [] });
    setAdversarioNome("");
    adversariosApi.listar().then((r) => setAdversarios(r.data.data));
    if (temporadaId) {
      jogadoresApi.listar(temporadaId).then((r) => {
        setJogadores(r.data.data);
        replace(r.data.data.map((j) => ({
          jogador_id: j.id,
          participou: false,
          gols: 0, assistencias: 0, cartoes_amarelos: 0, cartoes_vermelhos: 0,
        })));
      });
    }
  }, [open, temporadaId]);

  const onSubmit = async (data: PartidaFormData) => {
    if (!temporadaId) return;
    if (!adversarioNome.trim()) {
      toast.warning("Informe o nome do adversário.");
      return;
    }

    try {
      let adversario = adversarios.find(
        (a) => a.nome.toLowerCase() === adversarioNome.trim().toLowerCase()
      );
      if (!adversario) {
        const r = await adversariosApi.criar({ nome: adversarioNome.trim() });
        adversario = r.data.data;
      }

      await partidasApi.criar(temporadaId, {
        ...data,
        adversario_id: adversario.id,
        gols_pro: Number(data.gols_pro),
        gols_contra: Number(data.gols_contra),
        estatisticas: data.estatisticas.map((e) => ({
          ...e,
          gols: Number(e.gols),
          assistencias: Number(e.assistencias),
          cartoes_amarelos: Number(e.cartoes_amarelos),
          cartoes_vermelhos: Number(e.cartoes_vermelhos),
        })),
      });
      toast.success("Partida registrada com sucesso!");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao registrar partida.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Registrar Partida" width="max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        <AdversarioInput
          value={adversarioNome}
          onChange={setAdversarioNome}
          adversarios={adversarios}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Data *" type="date" {...register("data_partida", { required: true })} />
          <Input label="Horário" type="time" {...register("horario")} />
          <Input label="Local" {...register("local")} />
          <Input label="Competição" {...register("competicao")} />
          <Input label="Rodada" {...register("rodada")} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="mandante" {...register("mandante")} className="accent-primary w-4 h-4" />
            <label htmlFor="mandante" className="text-sm font-medium">Mandante</label>
          </div>
          <Input label="Gols Pró" type="number" min={0} {...register("gols_pro")} />
          <Input label="Gols Contra" type="number" min={0} {...register("gols_contra")} />
        </div>

        <Input label="Observações" {...register("observacoes")} />

        {fields.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">
              Estatísticas dos Jogadores
            </p>
            <div className="space-y-1">
              <div className="grid text-[10px] text-muted uppercase tracking-wide mb-1 px-1"
                style={{ gridTemplateColumns: "auto 1fr 70px 70px 55px 55px" }}>
                <span></span>
                <span>Jogador</span>
                <span className="text-center">Gols</span>
                <span className="text-center">Assist.</span>
                <span className="text-center">🟨</span>
                <span className="text-center">🟥</span>
              </div>
              {fields.map((field, index) => {
                const jogador = jogadores.find((j) => j.id === field.jogador_id);
                return (
                  <div
                    key={field.id}
                    className="grid items-center gap-2 py-2 border-b border-white/[0.06]"
                    style={{ gridTemplateColumns: "auto 1fr 70px 70px 55px 55px" }}
                  >
                    <input
                      type="checkbox"
                      {...register(`estatisticas.${index}.participou`)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm font-medium truncate">
                      {jogador?.nome ?? `Jogador ${field.jogador_id}`}
                      {jogador?.posicao && (
                        <span className="text-muted text-xs ml-1">· {jogador.posicao}</span>
                      )}
                    </span>
                    <input type="number" min={0}
                      className="bg-surface2 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:border-primary w-full"
                      {...register(`estatisticas.${index}.gols`)} />
                    <input type="number" min={0}
                      className="bg-surface2 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:border-primary w-full"
                      {...register(`estatisticas.${index}.assistencias`)} />
                    <input type="number" min={0} max={2}
                      className="bg-surface2 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:border-primary w-full"
                      {...register(`estatisticas.${index}.cartoes_amarelos`)} />
                    <input type="number" min={0} max={1}
                      className="bg-surface2 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center outline-none focus:border-primary w-full"
                      {...register(`estatisticas.${index}.cartoes_vermelhos`)} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>Salvar Partida</Button>
        </div>
      </form>
    </Modal>
  );
}
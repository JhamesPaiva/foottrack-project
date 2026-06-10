import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import { adversariosApi } from "@/services/api";
import type { Adversario } from "@/types";

export default function AdversariosPage() {
  const [adversarios, setAdversarios] = useState<Adversario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Adversario | null>(null);

  useEffect(() => { load(); }, []);

  const load = () => adversariosApi.listar().then((r) => setAdversarios(r.data.data));

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir adversário?")) return;
    await adversariosApi.deletar(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-condensed font-bold text-lg">Adversários</h2>
        <Button size="sm" icon={<Plus size={14} />} onClick={() => { setEditing(null); setShowModal(true); }}>
          Novo
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {adversarios.map((adv) => (
          <Card key={adv.id} className="p-3 flex items-center gap-3">
            <Avatar nome={adv.nome} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{adv.nome}</div>
              <div className="text-xs text-muted">{[adv.cidade, adv.categoria].filter(Boolean).join(" · ")}</div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" icon={<Edit2 size={11} />}
                onClick={() => { setEditing(adv); setShowModal(true); }} />
              <Button variant="danger" size="sm" icon={<Trash2 size={11} />}
                onClick={() => handleDelete(adv.id)} />
            </div>
          </Card>
        ))}
      </div>
      <AdversarioModal open={showModal} onClose={() => setShowModal(false)} editing={editing} onSaved={load} />
    </div>
  );
}

function AdversarioModal({ open, onClose, editing, onSaved }: {
  open: boolean; onClose: () => void; editing: Adversario | null; onSaved: () => void;
}) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Partial<Adversario>>();
  useEffect(() => { if (open) reset(editing || {}); }, [open, editing]);

  const onSubmit = async (data: Partial<Adversario>) => {
    if (editing) await adversariosApi.atualizar(editing.id, data);
    else await adversariosApi.criar(data);
    onSaved(); onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Editar Adversário" : "Novo Adversário"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nome *" {...register("nome", { required: true })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Cidade" {...register("cidade")} />
          <Input label="Categoria" {...register("categoria")} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={isSubmitting}>{editing ? "Salvar" : "Criar"}</Button>
        </div>
      </form>
    </Modal>
  );
}

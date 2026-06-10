# ⚽ FootTrack — Plataforma de Gestão de Times de Futebol

Sistema completo para gerenciamento de times amadores e semiprofissionais.
Dark mode · Glassmorphism · Dark UI inspirada no SofaScore/OneFootball.

---

## 🗂️ Estrutura do Projeto

```
foottrack/
├── backend/          # Flask REST API
│   ├── app/
│   │   ├── controllers/    # Camada HTTP
│   │   ├── services/       # Regras de negócio
│   │   ├── repositories/   # Acesso a dados
│   │   ├── models/         # SQLAlchemy ORM
│   │   ├── schemas/        # Marshmallow (validação + serialização)
│   │   ├── routes/         # Flask Blueprints
│   │   └── utils/          # Upload, responses
│   ├── run.py
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # React + Vite + TypeScript
    └── src/
        ├── components/    # UI + Layout reutilizáveis
        ├── pages/         # Páginas por módulo
        ├── services/      # Chamadas à API (Axios)
        ├── store/         # Context API (auth + app)
        ├── hooks/         # useApi
        ├── types/         # TypeScript interfaces
        └── utils/         # Formatadores, constantes
```

---

## 🚀 Como Executar

### 1. Pré-requisitos
- Python 3.12+
- Node.js 18+
- MySQL 8+

---

### 2. Banco de dados

```sql
-- Execute no MySQL:
CREATE DATABASE foottrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ou use o script:
```bash
mysql -u root -p < backend/setup_db.sql
```

---

### 3. Backend

```bash
cd backend

# Criar virtualenv
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as credenciais do banco

# Criar as tabelas
flask --app run db init
flask --app run db migrate -m "initial"
flask --app run db upgrade
# OU simplesmente:
flask --app run init-db

# Rodar servidor de desenvolvimento
python run.py
# API disponível em: http://localhost:5000/api/v1
```

---

### 4. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
# Disponível em: http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/auth/register | Cadastro |
| POST | /api/v1/auth/login | Login → JWT |

### Times
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/times | Listar |
| POST | /api/v1/times | Criar |
| GET | /api/v1/times/:id | Detalhar |
| PUT | /api/v1/times/:id | Editar |
| DELETE | /api/v1/times/:id | Excluir |
| POST | /api/v1/times/:id/escudo | Upload escudo |

### Temporadas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/times/:id/temporadas | Listar |
| POST | /api/v1/times/:id/temporadas | Criar |
| POST | /api/v1/temporadas/:id/encerrar | Encerrar |
| POST | /api/v1/temporadas/:id/reabrir | Reabrir |

### Jogadores
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/temporadas/:id/jogadores | Listar |
| POST | /api/v1/temporadas/:id/jogadores | Criar |
| GET | /api/v1/jogadores/:id | Perfil |
| PUT | /api/v1/jogadores/:id | Editar |
| DELETE | /api/v1/jogadores/:id | Excluir |
| POST | /api/v1/jogadores/:id/foto | Upload foto |
| GET | /api/v1/jogadores/:id/historico | Histórico |

### Partidas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/temporadas/:id/partidas | Listar |
| POST | /api/v1/temporadas/:id/partidas | Registrar + stats |
| GET | /api/v1/partidas/:id | Detalhar |
| PUT | /api/v1/partidas/:id | Editar |
| DELETE | /api/v1/partidas/:id | Excluir |
| GET | /api/v1/temporadas/:id/estatisticas | Estatísticas do time |

### Ranking
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/temporadas/:id/ranking | Ranking completo |
| GET | /api/v1/temporadas/:id/destaques | Artilheiro + Líder Ast. |

### Dashboard & Histórico
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/v1/dashboard | Resumo geral |
| GET | /api/v1/historico | Feed de eventos |

---

## 🏆 Sistema de Pontuação

| Evento | Pontos |
|--------|--------|
| Gol | +5 |
| Assistência | +3 |
| Participação | +1 |
| Cartão Amarelo | -1 |
| Cartão Vermelho | -3 |

---

## 🎨 Artes para Redes Sociais

Formatos suportados para exportação:
- **Instagram Feed** — 1080×1080
- **Instagram Story** — 1080×1920
- **Facebook** — 1200×630
- **X / Twitter** — 1600×900

Exportação em PNG, JPG ou PDF via html2canvas + jsPDF.

---

## 🔐 Segurança

- JWT com expiração de 24h
- Senhas com bcrypt hash
- Todos os dados isolados por `usuario_id`
- Upload limitado a PNG/JPG/JPEG, máx 5MB, redimensionado com Pillow
- CORS restrito à API `/api/*`

---

## 🛠️ Tecnologias

**Backend:** Python 3.12 · Flask · SQLAlchemy · Flask-JWT-Extended · Marshmallow · PyMySQL · bcrypt · Pillow

**Frontend:** React 18 · Vite · TypeScript · TailwindCSS · React Router v6 · Axios · Recharts · react-hook-form · html2canvas · jsPDF

---

## 📝 Variáveis de Ambiente (.env)

```env
FLASK_ENV=development
SECRET_KEY=sua-chave-secreta
JWT_SECRET_KEY=sua-chave-jwt

DB_HOST=localhost
DB_PORT=3306
DB_NAME=foottrack
DB_USER=root
DB_PASSWORD=sua-senha

UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=5242880
```

---

## 🔄 Próximas Evoluções

- [ ] Notificações em tempo real (WebSocket)
- [ ] Exportação de relatórios PDF completos
- [ ] App desktop com Electron
- [ ] PWA (Progressive Web App)
- [ ] Comparativo entre temporadas
- [ ] Integração com WhatsApp para envio de artes

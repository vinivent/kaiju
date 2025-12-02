# 🦎 Kaiju

Marketplace especializado em répteis com sistema de consultas veterinárias online.

## 📦 Pré-requisitos

### Backend
- Java 21+
- Maven 3.6+
- PostgreSQL 12+
- Conta Gmail para envio de emails

### Frontend
- Node.js 18+
- pnpm (recomendado), npm ou yarn

## ⚙️ Configuração

### 1. Banco de Dados

Crie o banco de dados PostgreSQL:

```bash
createdb kaiju
```

Ou via psql:

```sql
psql -U postgres
CREATE DATABASE kaiju;
\q
```

### 2. Variáveis de Ambiente - Backend

Crie um arquivo `.env` na raiz de `backend/`:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=kaiju
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha

# JWT
JWT_SECRET_KEY=sua_chave_secreta_jwt_muito_segura

# Email
APP.MAIL.SENDER.EMAIL=seu_email@gmail.com
GMAIL_APP_PASSWORD=sua_senha_de_app_do_gmail

# Frontend URL
app.base-url=http://localhost:3000
```

**Como obter a senha de app do Gmail:**
1. Acesse [Google Account Security](https://myaccount.google.com/security)
2. Ative a verificação em duas etapas
3. Gere uma "Senha de app" em "Senhas de app"
4. Use essa senha no `GMAIL_APP_PASSWORD`

### 3. Variáveis de Ambiente - Frontend

Crie um arquivo `.env.local` na raiz de `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## 🚀 Instalação e Execução

### Backend

```bash
cd backend

# Instalar dependências e executar
mvn clean install
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`

### Frontend

```bash
cd frontend

# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📡 API Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Registrar novo usuário | ❌ |
| POST | `/login` | Fazer login | ❌ |
| POST | `/logout` | Fazer logout | ✅ |
| GET | `/session` | Validar sessão | ❌ |
| GET | `/verify/{token}` | Verificar conta | ❌ |
| POST | `/resend-verification` | Reenviar email de verificação | ❌ |
| POST | `/forgot-password` | Solicitar recuperação de senha | ❌ |
| POST | `/reset-password` | Redefinir senha | ❌ |
| GET | `/reset-password/validate` | Validar token de reset | ❌ |

### Usuários (`/api/user`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/me` | Obter usuário atual | ✅ |
| GET | `/{id}` | Obter usuário por ID | ✅ |
| PUT | `/{id}` | Atualizar usuário | ✅ |
| DELETE | `/{id}` | Deletar usuário | ✅ |

### Produtos (`/api/products`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/` | Criar produto | ✅ |
| GET | `/` | Listar produtos (paginado) | ❌ |
| GET | `/{id}` | Obter produto por ID | ❌ |
| GET | `/search` | Buscar produtos | ❌ |
| GET | `/count` | Contar produtos | ❌ |

### Veterinários (`/api/veterinarians`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/` | Criar perfil de veterinário | ✅ |
| GET | `/` | Listar veterinários (paginado) | ❌ |
| GET | `/{id}` | Obter veterinário por ID | ❌ |
| GET | `/search` | Buscar veterinários | ❌ |

## ✨ Features

### 🔐 Autenticação e Segurança
- Registro de usuários com verificação por email
- Login com JWT (JSON Web Tokens)
- Recuperação de senha via email
- Rate limiting em endpoints sensíveis
- Headers de segurança (XSS, CSRF, HSTS)
- Envio assíncrono de emails
- Validação de dados de entrada

### 🛒 Marketplace
- Catálogo de produtos especializados para répteis
- Busca e filtros avançados
- Carrinho de compras
- Gestão de estoque
- Sistema de avaliações

### 🏥 Veterinários
- Perfis de veterinários especializados em répteis
- Busca por especialidade e localização
- Consultas online
- Taxa de consulta personalizável
- Integração com WhatsApp

### 🎨 Interface
- Design moderno e responsivo
- Tema dark/light
- Otimização de imagens (Next.js Image)
- Formatação automática de campos
- Validação em tempo real
- Sistema de notificações toast

## 🔒 Segurança

### Rate Limiting
- **Registro**: 5 requisições/minuto por IP
- **Login**: 10 tentativas/minuto por IP
- **Recuperação de senha**: 3 tentativas/minuto por IP
- **Reenvio de verificação**: 3 tentativas/minuto por IP

### Headers de Segurança
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
```

### Boas Práticas
- Senhas criptografadas com BCrypt (salt rounds: 10)
- Tokens JWT com expiração configurável
- Cookies HttpOnly e Secure
- Validação rigorosa de entrada
- Tratamento genérico de erros

## 🛠 Comandos Úteis

### Backend

```bash
# Compilar
mvn clean compile

# Executar testes
mvn test

# Gerar JAR executável
mvn clean package

# Executar JAR
java -jar target/kaiju-0.0.1-SNAPSHOT.jar

# Verificar dependências
mvn dependency:tree
```

### Frontend

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Executar produção
pnpm start

# Linter
pnpm lint

# Atualizar dependências
pnpm update
```

## 📝 Notas Importantes

### Banco de Dados
O Hibernate está configurado com `ddl-auto=update` para desenvolvimento. As tabelas são criadas e atualizadas automaticamente. Para produção, considere usar `ddl-auto=validate` com migrations (Flyway/Liquibase).

### Emails
Os emails são enviados de forma assíncrona através de um pool de threads (2-5 threads, fila de 100). Isso garante que as respostas da API não sejam bloqueadas durante o envio.

### CORS
O CORS está habilitado por padrão no Spring Security. Para produção, configure origens específicas no `SecurityConfig.java`.

### Estrutura de Diretórios

```
kaiju/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   └── package.json
└── README.md
```

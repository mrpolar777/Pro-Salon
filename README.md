# **Pro Salon – Instruções de Instalação e Execução**

Este guia explica como baixar, configurar e executar o **Frontend** e o **Backend** do projeto.

---

## 🚀 **1. Baixar o Projeto**

Você pode escolher entre duas opções:

### ✔️ **Clonar o repositório (recomendado)**

```sh
git clone -b main https://github.com/mrpolar777/Pro-Salon
```

### ✔️ **Ou baixar o arquivo ZIP**

1. Acesse o repositório no GitHub
2. Clique em **Code → Download ZIP**
3. Extraia o conteúdo

---

## 📁 **2. Estrutura do Projeto**

Após baixar, você terá algo assim:

```
/pro-salon/
   ├── backend/
   └── frontend/
```

---

## 📦 **3. Instalar Dependências**

### ➤ **Backend**

No diretório raiz do backend:

```sh
cd backend
npm install
```

### ➤ **Frontend**

No diretório raiz do frontend:

```sh
cd frontend
npm install
```

---

## 🔧 **4. Criar o arquivo `.env` no Backend**

Crie um arquivo `.env` dentro da pasta **backend/** contendo:

```
PORT=5000
MONGO_URI=COLE_AQUI_SUA_STRING_DO_MONGODB
NODE_ENV=development
JWT_SECRET=SUA_CHAVE_ALEATORIA_AQUI
JWT_EXPIRES=7d
URL_FRONTEND=http://localhost:5173
```

📌 **Dicas importantes:**

* `PORT` pode ser qualquer porta livre (ex: 5000)
* `MONGO_URI` deve ser a URL do seu cluster MongoDB
* `JWT_SECRET` deve ser um texto aleatório forte

---

## 🖥️ **5. Executar o Sistema**

### ▶️ **Rodar o Backend**

No diretório **backend/**:

```sh
npm run dev
```

Servidor ficará disponível em:

```
http://localhost:5000
```

---

### ▶️ **Rodar o Frontend**

No diretório **frontend/**:

```sh
npm run dev
```

A aplicação abrirá em:

```
http://localhost:5173
```

---

## 🎉 **6. Pronto!**

Agora você já pode usar o sistema Pro Salon com o frontend e backend funcionando juntos.

# 🏋️‍♂️ API REST – Sistema de Academia

## 📘 Sobre o Projeto

Esta API RESTful foi criada para gerenciar uma academia, possibilitando o controle de **alunos, instrutores, treinos, exercícios** e **avaliações físicas**. O objetivo é facilitar o acompanhamento da rotina de treinos dos alunos, a criação de planos personalizados e o registro de avaliações físicas, promovendo um gerenciamento eficiente da instituição.

---

## 🚀 Funcionalidades

- Cadastro e gerenciamento de alunos e instrutores
- Criação e atribuição de treinos personalizados
- Cadastro de exercícios físicos
- Registro de avaliações físicas dos alunos
- Consulta, atualização e remoção de todos os dados acima

---

## 📚 Endpoints da API

### 🏋️ Treino Controller

| Método | Endpoint         | Descrição                         |
|--------|------------------|-----------------------------------|
| `GET`  | `/treinos/{id}`  | Busca um treino pelo ID           |
| `PUT`  | `/treinos/{id}`  | Atualiza um treino existente      |
| `DELETE` | `/treinos/{id}` | Remove um treino por ID           |
| `GET`  | `/treinos`       | Lista todos os treinos            |
| `POST` | `/treinos`       | Cria um novo treino               |

---

### 👨‍🏫 Instrutor Controller

| Método | Endpoint                 | Descrição                         |
|--------|--------------------------|-----------------------------------|
| `GET`  | `/api/instrutores/{id}`  | Busca um instrutor pelo ID        |
| `PUT`  | `/api/instrutores/{id}`  | Atualiza um instrutor existente   |
| `DELETE` | `/api/instrutores/{id}` | Remove um instrutor por ID        |
| `GET`  | `/api/instrutores`       | Lista todos os instrutores        |
| `POST` | `/api/instrutores`       | Cadastra um novo instrutor        |

---

### 🏃 Exercício Controller

| Método | Endpoint                 | Descrição                         |
|--------|--------------------------|-----------------------------------|
| `GET`  | `/api/exercicios/{id}`   | Busca um exercício pelo ID        |
| `PUT`  | `/api/exercicios/{id}`   | Atualiza um exercício existente   |
| `DELETE` | `/api/exercicios/{id}` | Remove um exercício por ID        |
| `GET`  | `/api/exercicios`        | Lista todos os exercícios         |
| `POST` | `/api/exercicios`        | Cadastra um novo exercício        |

---

### 👨‍🎓 Aluno Controller

| Método | Endpoint              | Descrição                         |
|--------|-----------------------|-----------------------------------|
| `GET`  | `/api/alunos/{id}`    | Busca um aluno pelo ID            |
| `PUT`  | `/api/alunos/{id}`    | Atualiza os dados de um aluno     |
| `DELETE` | `/api/alunos/{id}`  | Remove um aluno                   |
| `GET`  | `/api/alunos`         | Lista todos os alunos             |
| `POST` | `/api/alunos`         | Cadastra um novo aluno            |

---

### 📊 Avaliação Física Controller

| Método | Endpoint              | Descrição                          |
|--------|-----------------------|------------------------------------|
| `GET`  | `/avaliacoes`         | Lista todas as avaliações          |
| `POST` | `/avaliacoes`         | Cadastra uma nova avaliação física |
| `GET`  | `/avaliacoes/{id}`    | Detalha uma avaliação específica   |
| `DELETE` | `/avaliacoes/{id}`  | Remove uma avaliação por ID        |

---

## 🧪 Tecnologias Utilizadas

- Java + Spring Boot
- Swagger para documentação interativa
- PostgreSQL
- Padrão MVC
- DTOs e Controllers bem estruturados

---

## ⚙️ Instruções para Rodar o Projeto

1. Clone o repositório
2. Configure o `application.properties` com seu banco de dados
3. Execute a aplicação com o Spring Boot
4. Acesse a documentação Swagger em: `http://localhost:8080/swagger-ui.html`

---

## 📌 Observações

- Pode ser facilmente estendida para incluir autenticação via JWT
- Você pode integrar com frontend em React ou aplicativo mobile
- Ideal para academias que desejam ter controle digital dos alunos e seus treinos

---

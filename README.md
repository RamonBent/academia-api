# 🏋️‍♂️ academiaApp

## 📘 Sobre o Projeto

Este é um sistema completo para gerenciamento de academias, composto por dois aplicativos móveis desenvolvidos em **React Native** com **TypeScript**. A arquitetura **offline-first** permite que os usuários interajam com os dados mesmo sem uma conexão ativa com a internet. O sistema é ideal para digitalizar o controle de alunos, treinos e avaliações físicas.

  - **AcademiaApp (Aluno):** Permite aos alunos visualizarem seus treinos, exercícios e informações do seu instrutor.
  - **AcademiaAppAdmin (Administrador):** Um painel de controle completo para administradores, que podem realizar operações de **CRUD (criar, ler, atualizar, deletar)** para gerenciar a academia de forma eficiente.

-----

## 🚀 Funcionalidades Principais

  - **Gerenciamento Completo:** Cadastro e controle de alunos e instrutores.
  - **Treinos Personalizados:** Criação e atribuição de treinos customizados.
  - **Catálogo de Exercícios:** Cadastro e visualização de exercícios físicos detalhados.
  - **Acompanhamento de Progresso:** Registro e histórico de avaliações físicas dos alunos.
  - **Sincronização Offline:** Acesso aos dados mesmo sem internet.

-----

## 📱 Visão Geral dos Aplicativos

### AcademiaApp (Aluno)

| Funcionalidade | Descrição |
|---|---|
| **Meus Treinos** | Visualização do treino do dia, incluindo detalhes de exercícios, séries e repetições. |
| **Exercícios** | Consulta de todos os exercícios disponíveis, com informações e instruções visuais. |
| **Meu Instrutor** | Dados de contato e informações do instrutor responsável. |
| **Progresso** | Acompanhamento do histórico de avaliações físicas e evolução. |

### AcademiaAppAdmin (Administrador)

| Funcionalidade | Descrição |
|---|---|
| **Gerenciar Alunos** | Cadastro, edição e remoção de alunos de forma intuitiva. |
| **Gerenciar Instrutores** | Cadastro, edição e remoção de instrutores. |
| **Montar Treinos** | Criação e atribuição de treinos personalizados a cada aluno. |
| **Gerenciar Exercícios** | Adição, edição e remoção de exercícios do banco de dados. |
| **Avaliações Físicas** | Registro e consulta detalhada das avaliações físicas dos alunos. |

-----

## 🛠️ Tecnologias Utilizadas

  - **Frontend Mobile:** React Native, TypeScript, Expo
  - **Arquitetura:** Offline-first com sincronização de dados
  - **Backend:** Java com Spring Boot
  - **Banco de Dados:** PostgreSQL

-----

## ⚙️ Instruções de Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/RamonBent/academia-api
    ```

2.  **Configure o Backend:**

      - Edite o arquivo `application.properties` com as credenciais do seu banco de dados **PostgreSQL**.
      - Inicie a aplicação **Spring Boot**.

3.  **Configure os Aplicativos Mobile:**

      - Navegue para as pastas `academiaApp` e `academiaAppAdmin`.
      - Instale as dependências com `npm install` ou `yarn install`.
      - No arquivo `app.config.ts`, ajuste o endereço IP da sua máquina para que a URL da API aponte para o seu backend local.

    <!-- end list -->

    ```typescript
    // app.config.ts
    import { ExpoConfig, ConfigContext } from '@expo/config';

    export default ({ config }: ConfigContext): any => ({
      ...config,
      extra: {
        ...config.extra,
        API_BASE_URL: "http://192.168.1.76:8080", // Altere para o seu IP local
      },
    });
    ```

      - Execute o aplicativo usando `npx expo start -c`.

-----

Com este sistema, você terá uma solução robusta e moderna para digitalizar a gestão de sua academia.

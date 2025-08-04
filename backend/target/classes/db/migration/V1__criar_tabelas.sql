CREATE TABLE instrutores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    endereco TEXT,
    plano VARCHAR(50),
    instrutor_id INT,
    FOREIGN KEY (instrutor_id) REFERENCES instrutores(id)
);

CREATE TABLE avaliacoes_fisicas (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL,
    data_avaliacao DATE NOT NULL,
    peso DECIMAL(5,2),
    altura DECIMAL(4,2),
    imc DECIMAL(5,2),
    observacoes TEXT,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

CREATE TABLE treinos (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL,
    nome VARCHAR(100),
    objetivo TEXT,
    data_inicio DATE,
    data_fim DATE,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

CREATE TABLE exercicios (
    id SERIAL PRIMARY KEY,
    treino_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    grupo_muscular VARCHAR(50),
    series INT,
    repeticoes INT,
    carga DECIMAL(5,2),
    descanso_segundos INT,
    FOREIGN KEY (treino_id) REFERENCES treinos(id)
);

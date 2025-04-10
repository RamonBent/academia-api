package com.academia.academia_api.DTO.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AlunoRequestDTO {
        private Long id;
        private String nome;
        private LocalDate dataNascimento;
        private String telefone;
        private String email;
        private String endereco;
        private String plano;
        private Long instrutorId;
}
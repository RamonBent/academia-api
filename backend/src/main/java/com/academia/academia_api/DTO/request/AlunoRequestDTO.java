package com.academia.academia_api.DTO.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AlunoRequestDTO {
        private String nome;
        @JsonFormat(pattern = "dd/MM/yyyy")
        private LocalDate dataNascimento;
        private String telefone;
        private String email;
        private String endereco;
        private String plano;
        private Long instrutorId;
}
package com.academia.academia_api.DTO.response;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AlunoResponseDTO {
    private Long id;
    private String nome;
    private LocalDate dataNascimento;
    private String telefone;
    private String email;
    private String endereco;
    private String plano;
    private String nomeInstrutor;

    private List<Long> avaliacoesIds;
    private List<Long> treinosIds;
}

package com.academia.academia_api.DTO.response;

import lombok.Data;
import java.util.List;

@Data
public class InstrutorResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String telefone;
    private String email;
    private List<Long> alunosIds;
}

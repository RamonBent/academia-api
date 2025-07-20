package com.academia.academia_api.DTO.request;

import lombok.Data;

@Data
public class InstrutorRequestDTO {
    private String nome;
    private String cpf;
    private String telefone;
    private String email;
    private String cref;
}

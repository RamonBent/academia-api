package com.academia.academia_api.DTO.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TreinoRequestDTO{
    private String nome;
    private String objetivo;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Long alunoId;
}


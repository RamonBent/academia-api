package com.academia.academia_api.DTO.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TreinoRequestDTO{
    private String nome;
    private String objetivo;
    private String nivel;
    private Long alunosIds;
}


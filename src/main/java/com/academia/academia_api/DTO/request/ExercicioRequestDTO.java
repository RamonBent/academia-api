package com.academia.academia_api.DTO.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExercicioRequestDTO {
    private String nome;
    private String grupoMuscular;
    private Integer series;
    private Integer repeticoes;
    private BigDecimal carga;
    private Integer descansoSegundos;
    private Long treinoId; // ID do treino associado
}

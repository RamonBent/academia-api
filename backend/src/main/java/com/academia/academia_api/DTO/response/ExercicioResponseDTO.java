package com.academia.academia_api.DTO.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExercicioResponseDTO {
    private Long id;
    private String nome;
    private String grupoMuscular;
    private Integer series;
    private Integer repeticoes;
    private BigDecimal carga;
    private Integer descansoSegundos;
    private Long treinoId; // ID do treino associado
}

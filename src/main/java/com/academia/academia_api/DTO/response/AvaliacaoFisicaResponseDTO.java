package com.academia.academia_api.DTO.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AvaliacaoFisicaResponseDTO {
    private Long id;
    private LocalDate dataAvaliacao;
    private BigDecimal peso;
    private BigDecimal altura;
    private BigDecimal imc;
    private String observacoes;
    private String nomeAluno;
}


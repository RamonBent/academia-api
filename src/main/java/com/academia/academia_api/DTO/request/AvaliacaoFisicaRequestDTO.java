package com.academia.academia_api.DTO.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AvaliacaoFisicaRequestDTO {
    private LocalDate dataAvaliacao;
    private BigDecimal peso;
    private BigDecimal altura;
    private BigDecimal imc;
    private String observacoes;
    private Long alunoId;
}

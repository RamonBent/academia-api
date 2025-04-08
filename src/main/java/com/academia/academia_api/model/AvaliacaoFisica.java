package com.academia.academia_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoFisica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataAvaliacao;

    private BigDecimal peso;

    private BigDecimal altura;

    private BigDecimal imc;

    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;
}

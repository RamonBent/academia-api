package com.academia.academia_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String grupoMuscular;

    private Integer series;

    private Integer repeticoes;

    private BigDecimal carga;

    private Integer descansoSegundos;

    @ManyToOne
    @JoinColumn(name = "treino_id")
    private Treino treino;
}


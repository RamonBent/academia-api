package com.academia.academia_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Treino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String objetivo;

    private LocalDate dataInicio;

    private LocalDate dataFim;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @OneToMany(mappedBy = "treino")
    private List<Exercicio> exercicios;
}


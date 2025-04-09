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
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private LocalDate dataNascimento;

    private String telefone;

    @Column(unique = true)
    private String email;

    private String endereco;

    private String plano;

    @ManyToOne
    @JoinColumn(name = "instrutor_id")
    private Instrutor instrutor;

    @OneToMany(mappedBy = "aluno")
    private List<AvaliacaoFisica> avaliacoes;

    @OneToMany(mappedBy = "aluno")
    private List<Treino> treinos;
}

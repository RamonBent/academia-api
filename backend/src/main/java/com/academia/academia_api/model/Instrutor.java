package com.academia.academia_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "instrutores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Instrutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String cpf;

    private String telefone;

    @Column(unique = true)
    private String email;

    @Column(name = "numero_creef", unique = true, nullable = false)
    private String numeroCreef;

    @OneToMany(mappedBy = "instrutor")
    private List<Aluno> alunos;
}

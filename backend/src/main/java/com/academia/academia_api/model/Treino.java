package com.academia.academia_api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "treinos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Treino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String objetivo;

    private String nivel;

    @JsonBackReference
    @ManyToMany(mappedBy = "treinos")
    private List<Aluno> alunos = new ArrayList<>();

}

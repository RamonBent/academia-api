package com.academia.academia_api.DTO.mapper;

import com.academia.academia_api.DTO.request.AlunoRequestDTO;
import com.academia.academia_api.DTO.response.AlunoResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.model.Instrutor;

import java.util.stream.Collectors;

public class AlunoMapper {

    public static Aluno toEntity(AlunoRequestDTO dto, Instrutor instrutor) {
        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setDataNascimento(dto.getDataNascimento());
        aluno.setTelefone(dto.getTelefone());
        aluno.setEmail(dto.getEmail());
        aluno.setEndereco(dto.getEndereco());
        aluno.setPlano(dto.getPlano());
        aluno.setInstrutor(instrutor);
        return aluno;
    }

    public static AlunoResponseDTO toResponseDTO(Aluno aluno) {
        AlunoResponseDTO dto = new AlunoResponseDTO();
        dto.setId(aluno.getId());
        dto.setNome(aluno.getNome());
        dto.setDataNascimento(aluno.getDataNascimento());
        dto.setTelefone(aluno.getTelefone());
        dto.setEmail(aluno.getEmail());
        dto.setEndereco(aluno.getEndereco());
        dto.setPlano(aluno.getPlano());
        dto.setNomeInstrutor(aluno.getInstrutor() != null ? aluno.getInstrutor().getNome() : null);

        dto.setAvaliacoesIds(aluno.getAvaliacoes() != null
                ? aluno.getAvaliacoes().stream().map(a -> a.getId()).collect(Collectors.toList())
                : null);

        dto.setTreinosIds(aluno.getTreinos() != null
                ? aluno.getTreinos().stream().map(t -> t.getId()).collect(Collectors.toList())
                : null);

        return dto;
    }
}


package com.academia.academia_api.DTO.mapper;

import com.academia.academia_api.DTO.request.TreinoRequestDTO;
import com.academia.academia_api.DTO.response.TreinoResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.model.Treino;

import java.util.List;
import java.util.stream.Collectors;

public class TreinoMapper {

    public static Treino toEntity(TreinoRequestDTO dto) {
        Treino treino = new Treino();
        treino.setNome(dto.getNome());
        treino.setObjetivo(dto.getObjetivo());
        treino.setNivel(dto.getNivel());
        return treino;
    }

    public static TreinoResponseDTO toResponseDTO(Treino treino) {
        List<Long> alunosIds = null;

        if (treino.getAlunos() != null) {
            alunosIds = treino.getAlunos()
                    .stream()
                    .map(aluno -> aluno.getId())
                    .collect(Collectors.toList());
        }

        return new TreinoResponseDTO(
                treino.getId(),
                treino.getNome(),
                treino.getObjetivo(),
                treino.getNivel(),
                alunosIds
        );
    }
}

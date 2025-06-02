package com.academia.academia_api.DTO.mapper;

import com.academia.academia_api.DTO.request.TreinoRequestDTO;
import com.academia.academia_api.DTO.response.TreinoResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.model.Treino;

public class TreinoMapper {

    public static Treino toEntity(TreinoRequestDTO dto) {
        Treino treino = new Treino();
        treino.setNome(dto.getNome());
        treino.setObjetivo(dto.getObjetivo());
        treino.setDataInicio(dto.getDataInicio());
        treino.setDataFim(dto.getDataFim());

        if (dto.getAlunoId() != null) {
            Aluno aluno = new Aluno();
            aluno.setId(dto.getAlunoId());
            treino.setAluno(aluno);
        }

        return treino;
    }

    public static TreinoResponseDTO toResponseDTO(Treino treino) {
        Long alunoId = treino.getAluno() != null ? treino.getAluno().getId() : null;

        return new TreinoResponseDTO(
                treino.getId(),
                treino.getNome(),
                treino.getObjetivo(),
                treino.getDataInicio(),
                treino.getDataFim(),
                alunoId
        );
    }
}

package com.academia.academia_api.DTO.mapper;

import com.academia.academia_api.DTO.request.ExercicioRequestDTO;
import com.academia.academia_api.DTO.response.ExercicioResponseDTO;
import com.academia.academia_api.model.Exercicio;
import com.academia.academia_api.model.Treino;

public class ExercicioMapper {

    public static Exercicio toEntity(ExercicioRequestDTO dto) {
        Exercicio exercicio = new Exercicio();
        exercicio.setNome(dto.getNome());
        exercicio.setGrupoMuscular(dto.getGrupoMuscular());
        exercicio.setSeries(dto.getSeries());
        exercicio.setRepeticoes(dto.getRepeticoes());
        exercicio.setCarga(dto.getCarga());
        exercicio.setDescansoSegundos(dto.getDescansoSegundos());
        // Aqui, associamos o treino usando o ID. Em um caso real, seria necessário buscar o treino no banco.
        Treino treino = new Treino();  // Você deve obter o objeto treino por ID
        treino.setId(dto.getTreinoId());
        exercicio.setTreino(treino);
        return exercicio;
    }

    public static ExercicioResponseDTO toResponseDTO(Exercicio exercicio) {
        ExercicioResponseDTO dto = new ExercicioResponseDTO();
        dto.setId(exercicio.getId());
        dto.setNome(exercicio.getNome());
        dto.setGrupoMuscular(exercicio.getGrupoMuscular());
        dto.setSeries(exercicio.getSeries());
        dto.setRepeticoes(exercicio.getRepeticoes());
        dto.setCarga(exercicio.getCarga());
        dto.setDescansoSegundos(exercicio.getDescansoSegundos());
        dto.setTreinoId(exercicio.getTreino().getId());
        return dto;
    }

    public static ExercicioRequestDTO toRequestDTO(Exercicio exercicio) {
        ExercicioRequestDTO dto = new ExercicioRequestDTO();
        dto.setNome(exercicio.getNome());
        dto.setGrupoMuscular(exercicio.getGrupoMuscular());
        dto.setSeries(exercicio.getSeries());
        dto.setRepeticoes(exercicio.getRepeticoes());
        dto.setCarga(exercicio.getCarga());
        dto.setDescansoSegundos(exercicio.getDescansoSegundos());
        dto.setTreinoId(exercicio.getTreino().getId());
        return dto;
    }
}
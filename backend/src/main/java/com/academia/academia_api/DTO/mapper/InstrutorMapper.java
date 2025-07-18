package com.academia.academia_api.DTO.mapper;

import com.academia.academia_api.DTO.request.InstrutorRequestDTO;
import com.academia.academia_api.DTO.response.InstrutorResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.model.Instrutor;

import java.util.stream.Collectors;

public class InstrutorMapper {

    public static Instrutor toEntity(InstrutorRequestDTO dto) {
        Instrutor instrutor = new Instrutor();
        instrutor.setNome(dto.getNome());
        instrutor.setCpf(dto.getCpf());
        instrutor.setTelefone(dto.getTelefone());
        instrutor.setEmail(dto.getEmail());
        instrutor.setNumeroCREEF(dto.getNumeroCREEF());
        return instrutor;
    }

    public static InstrutorResponseDTO toResponseDTO(Instrutor instrutor) {
        InstrutorResponseDTO dto = new InstrutorResponseDTO();
        dto.setId(instrutor.getId());
        dto.setNome(instrutor.getNome());
        dto.setCpf(instrutor.getCpf());
        dto.setTelefone(instrutor.getTelefone());
        dto.setEmail(instrutor.getEmail());

        if (instrutor.getAlunos() != null) {
            dto.setAlunosIds(instrutor.getAlunos()
                    .stream()
                    .map(Aluno::getId)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}

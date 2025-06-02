package com.academia.academia_api.DTO.mapper;

import com.academia.academia_api.DTO.request.AvaliacaoFisicaRequestDTO;
import com.academia.academia_api.DTO.response.AvaliacaoFisicaResponseDTO;
import com.academia.academia_api.model.AvaliacaoFisica;
import com.academia.academia_api.model.Aluno;

public class AvaliacaoFisicaMapper {

    public static AvaliacaoFisica toEntity(AvaliacaoFisicaRequestDTO dto, Aluno aluno) {
        AvaliacaoFisica avaliacao = new AvaliacaoFisica();
        avaliacao.setDataAvaliacao(dto.getDataAvaliacao());
        avaliacao.setPeso(dto.getPeso());
        avaliacao.setAltura(dto.getAltura());
        avaliacao.setImc(dto.getImc());
        avaliacao.setObservacoes(dto.getObservacoes());
        avaliacao.setAluno(aluno);
        return avaliacao;
    }

    public static AvaliacaoFisicaResponseDTO toResponseDTO(AvaliacaoFisica entity) {
        AvaliacaoFisicaResponseDTO dto = new AvaliacaoFisicaResponseDTO();
        dto.setId(entity.getId());
        dto.setDataAvaliacao(entity.getDataAvaliacao());
        dto.setPeso(entity.getPeso());
        dto.setAltura(entity.getAltura());
        dto.setImc(entity.getImc());
        dto.setObservacoes(entity.getObservacoes());
        dto.setNomeAluno(entity.getAluno() != null ? entity.getAluno().getNome() : null);
        return dto;
    }
}

package com.academia.academia_api.service;

import com.academia.academia_api.DTO.mapper.AvaliacaoFisicaMapper;
import com.academia.academia_api.DTO.request.AvaliacaoFisicaRequestDTO;
import com.academia.academia_api.DTO.response.AvaliacaoFisicaResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.model.AvaliacaoFisica;
import com.academia.academia_api.repository.AlunoRepository;
import com.academia.academia_api.repository.AvaliacaoFisicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoFisicaService {

    @Autowired
    private AvaliacaoFisicaRepository avaliacaoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    public AvaliacaoFisicaResponseDTO criar(AvaliacaoFisicaRequestDTO dto) {
        Optional<Aluno> aluno = alunoRepository.findById(dto.getAlunoId());
        if (aluno.isEmpty()) {
            throw new RuntimeException("Aluno não encontrado");
        }

        AvaliacaoFisica avaliacao = AvaliacaoFisicaMapper.toEntity(dto, aluno.get());
        AvaliacaoFisica saved = avaliacaoRepository.save(avaliacao);
        return AvaliacaoFisicaMapper.toResponseDTO(saved);
    }

    public List<AvaliacaoFisicaResponseDTO> listar() {
        return avaliacaoRepository.findAll().stream()
                .map(AvaliacaoFisicaMapper::toResponseDTO)
                .toList();
    }

    public Optional<AvaliacaoFisicaResponseDTO> buscarPorId(Long id) {
        return avaliacaoRepository.findById(id)
                .map(AvaliacaoFisicaMapper::toResponseDTO);
    }

    public void deletar(Long id) {
        avaliacaoRepository.deleteById(id);
    }
}


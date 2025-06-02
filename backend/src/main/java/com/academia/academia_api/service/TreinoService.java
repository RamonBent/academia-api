package com.academia.academia_api.service;

import com.academia.academia_api.DTO.mapper.TreinoMapper;
import com.academia.academia_api.DTO.request.TreinoRequestDTO;
import com.academia.academia_api.DTO.response.TreinoResponseDTO;
import com.academia.academia_api.model.Treino;
import com.academia.academia_api.repository.TreinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TreinoService {

    @Autowired
    private TreinoRepository treinoRepository;

    @Transactional
    public TreinoResponseDTO criarTreino(TreinoRequestDTO requestDTO) {
        Treino treino = TreinoMapper.toEntity(requestDTO);
        Treino savedTreino = treinoRepository.save(treino);
        return TreinoMapper.toResponseDTO(savedTreino);
    }

    public List<TreinoResponseDTO> listarTreinos() {
        return treinoRepository.findAll().stream()
                .map(TreinoMapper::toResponseDTO)
                .toList();
    }

    public Optional<TreinoResponseDTO> buscarTreinoPorId(Long id) {
        return treinoRepository.findById(id)
                .map(TreinoMapper::toResponseDTO);
    }

    @Transactional
    public TreinoResponseDTO atualizarTreino(Long id, TreinoRequestDTO requestDTO) {
        if (treinoRepository.existsById(id)) {
            Treino treino = TreinoMapper.toEntity(requestDTO);
            treino.setId(id);
            Treino updated = treinoRepository.save(treino);
            return TreinoMapper.toResponseDTO(updated);
        }
        return null;
    }

    @Transactional
    public void deletarTreino(Long id) {
        treinoRepository.deleteById(id);
    }
}

package com.academia.academia_api.service;

import com.academia.academia_api.DTO.mapper.ExercicioMapper;
import com.academia.academia_api.DTO.request.ExercicioRequestDTO;
import com.academia.academia_api.DTO.response.ExercicioResponseDTO;
import com.academia.academia_api.model.Exercicio;
import com.academia.academia_api.repository.ExercicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ExercicioService {

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Transactional
    public ExercicioResponseDTO criarExercicio(ExercicioRequestDTO requestDTO) {
        Exercicio exercicio = ExercicioMapper.toEntity(requestDTO);
        Exercicio savedExercicio = exercicioRepository.save(exercicio);
        return ExercicioMapper.toResponseDTO(savedExercicio);
    }

    public List<ExercicioResponseDTO> listarExercicios() {
        List<Exercicio> exercicios = exercicioRepository.findAll();
        return exercicios.stream()
                .map(ExercicioMapper::toResponseDTO)
                .toList();
    }

    public Optional<ExercicioResponseDTO> buscarExercicioPorId(Long id) {
        Optional<Exercicio> exercicio = exercicioRepository.findById(id);
        return exercicio.map(ExercicioMapper::toResponseDTO);
    }

    @Transactional
    public ExercicioResponseDTO atualizarExercicio(Long id, ExercicioRequestDTO requestDTO) {
        if (exercicioRepository.existsById(id)) {
            Exercicio exercicio = ExercicioMapper.toEntity(requestDTO);
            exercicio.setId(id);
            Exercicio updatedExercicio = exercicioRepository.save(exercicio);
            return ExercicioMapper.toResponseDTO(updatedExercicio);
        }
        return null;
    }

    @Transactional
    public void deletarExercicio(Long id) {
        exercicioRepository.deleteById(id);
    }
}


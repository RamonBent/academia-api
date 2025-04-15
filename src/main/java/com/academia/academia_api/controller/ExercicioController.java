package com.academia.academia_api.controller;

import com.academia.academia_api.DTO.request.ExercicioRequestDTO;
import com.academia.academia_api.DTO.response.ExercicioResponseDTO;
import com.academia.academia_api.service.ExercicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/exercicios")
public class ExercicioController {

    @Autowired
    private ExercicioService exercicioService;

    @PostMapping
    public ResponseEntity<ExercicioResponseDTO> criarExercicio(@RequestBody ExercicioRequestDTO requestDTO) {
        ExercicioResponseDTO responseDTO = exercicioService.criarExercicio(requestDTO);
        return ResponseEntity.status(201).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<ExercicioResponseDTO>> listarExercicios() {
        List<ExercicioResponseDTO> responseDTOs = exercicioService.listarExercicios();
        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExercicioResponseDTO> buscarExercicioPorId(@PathVariable Long id) {
        Optional<ExercicioResponseDTO> responseDTO = exercicioService.buscarExercicioPorId(id);
        return responseDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExercicioResponseDTO> atualizarExercicio(@PathVariable Long id,
                                                                   @RequestBody ExercicioRequestDTO requestDTO) {
        ExercicioResponseDTO updatedExercicio = exercicioService.atualizarExercicio(id, requestDTO);
        return updatedExercicio != null ? ResponseEntity.ok(updatedExercicio) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarExercicio(@PathVariable Long id) {
        exercicioService.deletarExercicio(id);
        return ResponseEntity.noContent().build();
    }
}
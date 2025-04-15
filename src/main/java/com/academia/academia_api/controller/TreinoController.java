package com.academia.academia_api.controller;

import com.academia.academia_api.DTO.request.TreinoRequestDTO;
import com.academia.academia_api.DTO.response.TreinoResponseDTO;
import com.academia.academia_api.service.TreinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/treinos")
public class TreinoController {

    @Autowired
    private TreinoService treinoService;

    @PostMapping
    public ResponseEntity<TreinoResponseDTO> criar(@RequestBody TreinoRequestDTO requestDTO) {
        TreinoResponseDTO response = treinoService.criarTreino(requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TreinoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(treinoService.listarTreinos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreinoResponseDTO> buscarPorId(@PathVariable Long id) {
        return treinoService.buscarTreinoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreinoResponseDTO> atualizar(@PathVariable Long id, @RequestBody TreinoRequestDTO requestDTO) {
        TreinoResponseDTO response = treinoService.atualizarTreino(id, requestDTO);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        treinoService.deletarTreino(id);
        return ResponseEntity.noContent().build();
    }
}

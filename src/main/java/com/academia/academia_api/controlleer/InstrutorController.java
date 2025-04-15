package com.academia.academia_api.controlleer;

import com.academia.academia_api.DTO.request.InstrutorRequestDTO;
import com.academia.academia_api.DTO.response.InstrutorResponseDTO;
import com.academia.academia_api.service.InstrutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instrutores")
public class InstrutorController {

    @Autowired
    private InstrutorService instrutorService;

    @PostMapping
    public ResponseEntity<InstrutorResponseDTO> criar(@RequestBody InstrutorRequestDTO dto) {
        return ResponseEntity.ok(instrutorService.criarInstrutor(dto));
    }

    @GetMapping
    public ResponseEntity<List<InstrutorResponseDTO>> listarTodos() {
        return ResponseEntity.ok(instrutorService.listarInstrutores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstrutorResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(instrutorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstrutorResponseDTO> atualizar(@PathVariable Long id, @RequestBody InstrutorRequestDTO dto) {
        return ResponseEntity.ok(instrutorService.atualizarInstrutor(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        instrutorService.deletarInstrutor(id);
        return ResponseEntity.noContent().build();
    }
}

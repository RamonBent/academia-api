package com.academia.academia_api.controller;

import com.academia.academia_api.DTO.request.AlunoRequestDTO;
import com.academia.academia_api.DTO.response.AlunoResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;


    @GetMapping("/hello")
    public String getHelloMessage() {
        return "Hello from Spring Boot!";
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> cadastrarAluno(@RequestBody AlunoRequestDTO dto) {
        AlunoResponseDTO alunoCriado = alunoService.criarAluno(dto);
        return ResponseEntity.ok(alunoCriado);
    }

    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listarAlunos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarAlunoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> atualizarAluno(@PathVariable Long id, @RequestBody AlunoRequestDTO dto) {
        return ResponseEntity.ok(alunoService.atualizarAluno(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirAluno(@PathVariable Long id) {
        System.out.println("Recebida requisição para excluir aluno ID: " + id);
        alunoService.deletarAluno(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public List<Aluno> buscarPorNome(@RequestParam String nome) {
        return alunoService.buscarPorNome(nome);
    }
}

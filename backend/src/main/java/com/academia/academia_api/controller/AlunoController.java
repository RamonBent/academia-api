package com.academia.academia_api.controller;

import com.academia.academia_api.DTO.request.AlunoRequestDTO;
import com.academia.academia_api.DTO.response.AlunoResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.model.Treino;
import com.academia.academia_api.repository.AlunoRepository;
import com.academia.academia_api.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private AlunoRepository alunoRepository;


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

    @PostMapping("/{id}/treinos")
    public ResponseEntity<Void> adicionarTreinosAoAluno(
            @PathVariable Long id,
            @RequestBody List<Long> treinoIds) {
        alunoService.atribuirTreinosAoAluno(id, treinoIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/treinos")
    public ResponseEntity<List<Treino>> listarTreinosDoAluno(@PathVariable Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        return ResponseEntity.ok(aluno.getTreinos());
    }

    @GetMapping("/faixa-etaria")
    public ResponseEntity<Map<String, Integer>> getFaixaEtaria() {
        return ResponseEntity.ok(alunoService.calcularFaixaEtaria());
    }

}

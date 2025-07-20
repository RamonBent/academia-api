package com.academia.academia_api.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.academia.academia_api.model.Treino;
import com.academia.academia_api.repository.TreinoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.academia.academia_api.DTO.mapper.AlunoMapper;
import com.academia.academia_api.DTO.request.AlunoRequestDTO;
import com.academia.academia_api.DTO.response.AlunoResponseDTO;
import com.academia.academia_api.model.Aluno;
import com.academia.academia_api.model.Instrutor;
import com.academia.academia_api.repository.AlunoRepository;
import com.academia.academia_api.repository.InstrutorRepository;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private InstrutorRepository instrutorRepository;

    @Autowired
    private TreinoRepository treinoRepository;

    public AlunoResponseDTO criarAluno(AlunoRequestDTO dto) {
        Instrutor instrutor = null;

        if (dto.getInstrutorId() != null) {
            instrutor = instrutorRepository.findById(dto.getInstrutorId())
                    .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        }

        List<Treino> treinos = new ArrayList<>();
        if (dto.getTreinoIds() != null && !dto.getTreinoIds().isEmpty()) {
            treinos = treinoRepository.findAllById(dto.getTreinoIds());
        }

        Aluno aluno = AlunoMapper.toEntity(dto, instrutor, treinos);

        Aluno salvo = alunoRepository.save(aluno);
        return AlunoMapper.toResponseDTO(salvo);
    }

    public AlunoResponseDTO atualizarAluno(Long id, AlunoRequestDTO dto) {
        Aluno alunoExistente = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Instrutor instrutor = null;
        if (dto.getInstrutorId() != null) {
            instrutor = instrutorRepository.findById(dto.getInstrutorId())
                    .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        }

        // Atualiza campos básicos
        alunoExistente.setNome(dto.getNome());
        alunoExistente.setDataNascimento(dto.getDataNascimento());
        alunoExistente.setTelefone(dto.getTelefone());
        alunoExistente.setEmail(dto.getEmail());
        alunoExistente.setEndereco(dto.getEndereco());
        alunoExistente.setPlano(dto.getPlano());
        alunoExistente.setInstrutor(instrutor);

        // Atualiza treinos
        List<Treino> treinos = new ArrayList<>();
        if (dto.getTreinoIds() != null && !dto.getTreinoIds().isEmpty()) {
            treinos = treinoRepository.findAllById(dto.getTreinoIds());
        }
        alunoExistente.setTreinos(treinos);

        // Atualiza avaliações físicas
        if (dto.getAvaliacoes() != null) {
            alunoExistente.getAvaliacoes().clear();

            alunoExistente.getAvaliacoes().addAll(
                    dto.getAvaliacoes().stream().map(aDto -> {
                        var avaliacao = new com.academia.academia_api.model.AvaliacaoFisica();
                        avaliacao.setDataAvaliacao(aDto.getDataAvaliacao());
                        avaliacao.setPeso(aDto.getPeso());
                        avaliacao.setAltura(aDto.getAltura());
                        avaliacao.setImc(aDto.getImc());
                        avaliacao.setObservacoes(aDto.getObservacoes());
                        avaliacao.setAluno(alunoExistente);
                        return avaliacao;
                    }).collect(Collectors.toList())
            );
        }

        Aluno atualizado = alunoRepository.save(alunoExistente);
        return AlunoMapper.toResponseDTO(atualizado);
    }

    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(AlunoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return AlunoMapper.toResponseDTO(aluno);
    }

    public void deletarAluno(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado");
        }
        alunoRepository.deleteById(id);
    }

    public List<Aluno> buscarPorNome(String nome) {
        return alunoRepository.findByNomeContainingIgnoreCase(nome);
    }

    @Transactional
    public void atribuirTreinosAoAluno(Long alunoId, List<Long> treinoIds) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        List<Treino> treinos = treinoRepository.findAllById(treinoIds);

        aluno.getTreinos().addAll(treinos);

        alunoRepository.save(aluno);
    }
}

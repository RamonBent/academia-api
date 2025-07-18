package com.academia.academia_api.service;

import java.util.List;
import java.util.stream.Collectors;

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

//    public AlunoResponseDTO criarAluno(AlunoRequestDTO dto) {
//        Instrutor instrutor = instrutorRepository.findById(dto.getInstrutorId())
//                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
//
//        Aluno aluno = AlunoMapper.toEntity(dto, instrutor);
//        Aluno salvo = alunoRepository.save(aluno);
//        return AlunoMapper.toResponseDTO(salvo);
//    }

    public AlunoResponseDTO criarAluno(AlunoRequestDTO dto) {
        Instrutor instrutor = null;

        if (dto.getInstrutorId() != null) {
            instrutor = instrutorRepository.findById(dto.getInstrutorId())
                    .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        }

        Aluno aluno = AlunoMapper.toEntity(dto, instrutor);
        Aluno salvo = alunoRepository.save(aluno);
        return AlunoMapper.toResponseDTO(salvo);
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

//    public AlunoResponseDTO atualizarAluno(Long id, AlunoRequestDTO dto) {
//        Aluno alunoExistente = alunoRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
//
//        Instrutor instrutor = instrutorRepository.findById(dto.getInstrutorId())
//                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
//
//        alunoExistente.setNome(dto.getNome());
//        alunoExistente.setDataNascimento(dto.getDataNascimento());
//        alunoExistente.setTelefone(dto.getTelefone());
//        alunoExistente.setEmail(dto.getEmail());
//        alunoExistente.setEndereco(dto.getEndereco());
//        alunoExistente.setPlano(dto.getPlano());
//        alunoExistente.setInstrutor(instrutor);
//
//        Aluno atualizado = alunoRepository.save(alunoExistente);
//        return AlunoMapper.toResponseDTO(atualizado);
//    }

    public AlunoResponseDTO atualizarAluno(Long id, AlunoRequestDTO dto) {
        Aluno alunoExistente = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Instrutor instrutor = null;
        if (dto.getInstrutorId() != null) {
            instrutor = instrutorRepository.findById(dto.getInstrutorId())
                    .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        }

        alunoExistente.setNome(dto.getNome());
        alunoExistente.setDataNascimento(dto.getDataNascimento());
        alunoExistente.setTelefone(dto.getTelefone());
        alunoExistente.setEmail(dto.getEmail());
        alunoExistente.setEndereco(dto.getEndereco());
        alunoExistente.setPlano(dto.getPlano());
        alunoExistente.setInstrutor(instrutor);

        Aluno atualizado = alunoRepository.save(alunoExistente);
        return AlunoMapper.toResponseDTO(atualizado);
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
}

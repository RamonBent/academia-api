package com.academia.academia_api.service;

import com.academia.academia_api.DTO.mapper.InstrutorMapper;
import com.academia.academia_api.DTO.request.InstrutorRequestDTO;
import com.academia.academia_api.DTO.response.InstrutorResponseDTO;
import com.academia.academia_api.model.Instrutor;
import com.academia.academia_api.repository.InstrutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstrutorService {

    @Autowired
    private InstrutorRepository instrutorRepository;

    public InstrutorResponseDTO criarInstrutor(InstrutorRequestDTO dto) {
        Instrutor instrutor = InstrutorMapper.toEntity(dto);
        Instrutor salvo = instrutorRepository.save(instrutor);
        return InstrutorMapper.toResponseDTO(salvo);
    }

    public List<InstrutorResponseDTO> listarInstrutores() {
        return instrutorRepository.findAll()
                .stream()
                .map(InstrutorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public InstrutorResponseDTO buscarPorId(Long id) {
        Instrutor instrutor = instrutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        return InstrutorMapper.toResponseDTO(instrutor);
    }

    public InstrutorResponseDTO atualizarInstrutor(Long id, InstrutorRequestDTO dto) {
        Instrutor instrutor = instrutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));
        instrutor.setNome(dto.getNome());
        instrutor.setCpf(dto.getCpf());
        instrutor.setTelefone(dto.getTelefone());
        instrutor.setEmail(dto.getEmail());
        instrutor.setNumeroCreef(dto.getNumeroCreef());

        Instrutor atualizado = instrutorRepository.save(instrutor);
        return InstrutorMapper.toResponseDTO(atualizado);
    }

    public void deletarInstrutor(Long id) {
        Instrutor instrutor = instrutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instrutor não encontrado"));

        try {
            instrutorRepository.delete(instrutor);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Não é possível excluir o instrutor pois existem alunos vinculados a ele");
        }
    }
}


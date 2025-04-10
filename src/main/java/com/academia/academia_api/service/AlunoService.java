package com.academia.academia_api.service;

import com.academia.academia_api.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlunoService {
    @Autowired
    AlunoRepository alunoRepository;
}

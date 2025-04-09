package com.academia.academia_api.repository;

import com.academia.academia_api.model.AvaliacaoFisica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TreinoRepository extends JpaRepository<AvaliacaoFisica, Long> {
}

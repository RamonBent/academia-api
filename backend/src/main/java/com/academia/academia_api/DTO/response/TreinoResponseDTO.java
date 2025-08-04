package com.academia.academia_api.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreinoResponseDTO {
    private Long id;
    private String nome;
    private String objetivo;
    private String nivel;
    private List<Long> alunosIds;


}

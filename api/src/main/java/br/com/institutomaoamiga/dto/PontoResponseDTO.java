package br.com.institutomaoamiga.dto;

import br.com.institutomaoamiga.entity.Ponto;
import java.util.UUID;

public record PontoResponseDTO(
    UUID id,
    String nome,
    String endereco,
    String bairro,
    String horario,
    String tipo) {
  public static PontoResponseDTO fromEntity(Ponto ponto) {
    return new PontoResponseDTO(
        ponto.getId(),
        ponto.getNome(),
        ponto.getEndereco(),
        ponto.getBairro(),
        ponto.getHorario(),
        ponto.getTipo());
  }
}

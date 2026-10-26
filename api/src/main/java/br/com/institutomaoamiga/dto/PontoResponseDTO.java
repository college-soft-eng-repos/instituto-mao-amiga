package br.com.institutomaoamiga.dto;

import br.com.institutomaoamiga.entity.Ponto;

public record PontoResponseDTO(
    Long id,
    String nome,
    String endereco,
    String diasHorarios,
    String recebeDistribui,
    Double latitude,
    Double longitude) {
  public static PontoResponseDTO fromEntity(Ponto ponto) {
    return new PontoResponseDTO(
        ponto.getId(),
        ponto.getNome(),
        ponto.getEndereco(),
        ponto.getDiasHorarios(),
        ponto.getRecebeDistribui(),
        ponto.getLatitude(),
        ponto.getLongitude());
  }
}
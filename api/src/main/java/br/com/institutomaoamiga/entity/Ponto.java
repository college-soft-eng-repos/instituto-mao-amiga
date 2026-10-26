package br.com.institutomaoamiga.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pontos")
@Getter
@Setter
@NoArgsConstructor
public class Ponto {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nome;

  @Column(nullable = false)
  private String endereco;

  @Column(nullable = false)
  private String diasHorarios;

  @Column(nullable = false, length = 1000)
  private String recebeDistribui;

  @Column(nullable = false)
  private Double latitude;

  @Column(nullable = false)
  private Double longitude;
}
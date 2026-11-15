package br.com.institutomaoamiga.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
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
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String nome;

  @Column(nullable = false)
  private String endereco;

  @Column(nullable = false)
  private String bairro;

  @Column(nullable = false, length = 1000)
  private String horario;

  @Column(nullable = false)
  private String tipo;
}

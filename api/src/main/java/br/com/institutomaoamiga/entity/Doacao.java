package br.com.institutomaoamiga.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doacoes")
@Getter
@Setter
@NoArgsConstructor
public class Doacao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String tipoItem;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private String pontoDestino;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void preencherCriadoEm() {
        if (criadoEm == null) criadoEm = LocalDateTime.now();
    }
}

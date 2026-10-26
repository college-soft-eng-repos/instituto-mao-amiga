package br.com.institutomaoamiga.repository;

import br.com.institutomaoamiga.entity.Ponto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PontoRepository extends JpaRepository<Ponto, Long> {
}
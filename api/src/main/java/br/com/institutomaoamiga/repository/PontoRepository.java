package br.com.institutomaoamiga.repository;

import br.com.institutomaoamiga.entity.Ponto;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PontoRepository extends JpaRepository<Ponto, UUID> {
    boolean existsByNomeIgnoreCase(String nome);

    @Query("SELECT p FROM Ponto p WHERE :filtro = '' " +
            "OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
            "OR LOWER(p.bairro) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    Page<Ponto> buscarPorNomeOuBairro(@Param("filtro") String filtro, Pageable pageable);
}

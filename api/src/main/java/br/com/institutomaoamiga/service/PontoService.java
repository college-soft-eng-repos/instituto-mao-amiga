package br.com.institutomaoamiga.service;

import br.com.institutomaoamiga.dto.PontoResponseDTO;
import br.com.institutomaoamiga.repository.PontoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PontoService {

    private static final int MAX_PAGE_SIZE = 50;

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public Page<PontoResponseDTO> listar(Pageable pageable) {
        int pageSize = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
        Pageable pageableLimitado = PageRequest.of(
                pageable.getPageNumber(),
                pageSize,
                pageable.getSort()
        );

        return pontoRepository.findAll(pageableLimitado)
                .map(PontoResponseDTO::fromEntity);
    }

    public PontoResponseDTO buscarPorId(Long id) {
        return pontoRepository.findById(id)
                .map(PontoResponseDTO::fromEntity)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ponto nao encontrado"
                ));
    }
}
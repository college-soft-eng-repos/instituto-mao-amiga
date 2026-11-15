package br.com.institutomaoamiga.service;

import br.com.institutomaoamiga.dto.DoacaoRequestDTO;
import br.com.institutomaoamiga.dto.DoacaoResponseDTO;
import br.com.institutomaoamiga.entity.Doacao;
import br.com.institutomaoamiga.repository.DoacaoRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DoacaoService {
    private final DoacaoRepository repository;

    public DoacaoService(DoacaoRepository repository) { this.repository = repository; }

    public Page<DoacaoResponseDTO> listar(String filtro, Pageable pageable) {
        return repository.buscarPorTipoItem(filtro == null ? "" : filtro.trim(), pageable).map(DoacaoResponseDTO::fromEntity);
    }

    public DoacaoResponseDTO buscarPorId(UUID id) {
        return DoacaoResponseDTO.fromEntity(encontrar(id));
    }

    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO request) {
        Doacao doacao = new Doacao();
        aplicar(request, doacao);
        doacao.setCriadoEm(LocalDateTime.now());
        return DoacaoResponseDTO.fromEntity(repository.save(doacao));
    }

    @Transactional
    public DoacaoResponseDTO editar(UUID id, DoacaoRequestDTO request) {
        Doacao doacao = encontrar(id);
        aplicar(request, doacao);
        return DoacaoResponseDTO.fromEntity(repository.save(doacao));
    }

    public void excluir(UUID id) { repository.delete(encontrar(id)); }

    private Doacao encontrar(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doação não encontrada"));
    }

    private void aplicar(DoacaoRequestDTO request, Doacao doacao) {
        doacao.setTipoItem(request.tipoItem().trim());
        doacao.setQuantidade(request.quantidade());
        doacao.setPontoDestino(request.pontoDestino().trim());
    }
}

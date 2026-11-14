package br.com.institutomaoamiga.service;

import br.com.institutomaoamiga.dto.PontoRequestDTO;
import br.com.institutomaoamiga.dto.PontoResponseDTO;
import br.com.institutomaoamiga.entity.Ponto;
import br.com.institutomaoamiga.repository.PontoRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PontoService {

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    public List<PontoResponseDTO> listar() {
        return pontoRepository.findAll().stream().map(PontoResponseDTO::fromEntity).toList();
    }

    public PontoResponseDTO buscarPorId(UUID id) {
        return PontoResponseDTO.fromEntity(encontrar(id));
    }

    public PontoResponseDTO cadastrar(PontoRequestDTO request) {
        return PontoResponseDTO.fromEntity(pontoRepository.save(criarPonto(request)));
    }

    @Transactional
    public PontoResponseDTO editar(UUID id, PontoRequestDTO request) {
        Ponto ponto = encontrar(id);
        atualizarPonto(ponto, request);
        return PontoResponseDTO.fromEntity(pontoRepository.save(ponto));
    }

    public void excluir(UUID id) {
        pontoRepository.delete(encontrar(id));
    }

    private Ponto encontrar(UUID id) {
        return pontoRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado"));
    }

    private Ponto criarPonto(PontoRequestDTO request) {
        Ponto ponto = new Ponto();
        atualizarPonto(ponto, request);
        return ponto;
    }

    private void atualizarPonto(Ponto ponto, PontoRequestDTO request) {
        ponto.setNome(request.nome().trim());
        ponto.setEndereco(request.endereco().trim());
        ponto.setBairro(request.bairro().trim());
        ponto.setHorario(request.horario().trim());
        ponto.setTipo(request.tipo().trim());
    }
}

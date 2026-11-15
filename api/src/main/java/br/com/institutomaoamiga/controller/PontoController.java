package br.com.institutomaoamiga.controller;

import br.com.institutomaoamiga.dto.PontoRequestDTO;
import br.com.institutomaoamiga.dto.PontoResponseDTO;
import br.com.institutomaoamiga.service.PontoService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/pontos")
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public List<PontoResponseDTO> listar() {
        return pontoService.listar();
    }

    @GetMapping("/filtro")
    public Page<PontoResponseDTO> buscarPagina(
            @RequestParam(defaultValue = "") String filtro,
            @PageableDefault(size = 10, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        return pontoService.buscarPagina(filtro, pageable);
    }

    @GetMapping("/{id}")
    public PontoResponseDTO buscarPorId(@PathVariable UUID id) {
        return pontoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PontoResponseDTO cadastrar(@Valid @RequestBody PontoRequestDTO request) {
        return pontoService.cadastrar(request);
    }

    @PutMapping("/{id}")
    public PontoResponseDTO editar(@PathVariable UUID id, @Valid @RequestBody PontoRequestDTO request) {
        return pontoService.editar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        pontoService.excluir(id);
    }
}

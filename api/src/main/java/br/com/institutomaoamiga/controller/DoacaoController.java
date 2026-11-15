package br.com.institutomaoamiga.controller;

import br.com.institutomaoamiga.dto.DoacaoRequestDTO;
import br.com.institutomaoamiga.dto.DoacaoResponseDTO;
import br.com.institutomaoamiga.service.DoacaoService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/v1/doacoes")
public class DoacaoController {
    private final DoacaoService service;

    public DoacaoController(DoacaoService service) { this.service = service; }

    @GetMapping("/filtro")
    public Page<DoacaoResponseDTO> listar(
            @RequestParam(defaultValue = "") String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.listar(filtro, pageable);
    }

    @GetMapping("/{id}")
    public DoacaoResponseDTO buscar(@PathVariable UUID id) { return service.buscarPorId(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoacaoResponseDTO cadastrar(@Valid @RequestBody DoacaoRequestDTO request) { return service.cadastrar(request); }

    @PutMapping("/{id}")
    public DoacaoResponseDTO editar(@PathVariable UUID id, @Valid @RequestBody DoacaoRequestDTO request) { return service.editar(id, request); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) { service.excluir(id); }
}

package br.com.institutomaoamiga.controller;

import br.com.institutomaoamiga.dto.PontoResponseDTO;
import br.com.institutomaoamiga.service.PontoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pontos")
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public Page<PontoResponseDTO> listar(
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        return pontoService.listar(pageable);
    }

    @GetMapping("/{id}")
    public PontoResponseDTO buscarPorId(@PathVariable Long id) {
        return pontoService.buscarPorId(id);
    }
}
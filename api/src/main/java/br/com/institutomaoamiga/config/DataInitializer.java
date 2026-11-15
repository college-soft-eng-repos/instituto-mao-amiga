package br.com.institutomaoamiga.config;

import br.com.institutomaoamiga.entity.Ponto;
import br.com.institutomaoamiga.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(PontoRepository repository) {
        return args -> {
            List<Ponto> pontosIniciais = List.of(
                criarPonto("Ponto Praça Cívica", "Praça Cívica", "Setor Central", "Seg a Sex, 9h às 17h", "coleta"),
                criarPonto("Ponto Mercado Central", "Rua 3, 322", "Setor Central", "Seg a Sáb, 8h às 17h", "coleta"),
                criarPonto("Ponto Praça Universitária", "Praça Universitária", "Setor Leste Universitário", "Seg a Sex, 10h às 16h", "distribuição"),
                criarPonto("Ponto Parque Areião", "Parque Areião", "Setor Pedro Ludovico", "Ter e Qui, 9h às 15h", "coleta"),
                criarPonto("Ponto Centro Cultural Oscar Niemeyer", "Av. Deputado Jamel Cecílio", "Residencial Privê dos Girassóis", "Qua e Sáb, 9h às 16h", "coleta"),
                criarPonto("Ponto Terminal Praça A", "Terminal Praça A", "Setor Campinas", "Seg a Sex, 7h às 12h", "distribuição"),
                criarPonto("Ponto Parque Vaca Brava", "Parque Vaca Brava", "Setor Bueno", "Sáb, 8h às 13h", "coleta"),
                criarPonto("Ponto Parque Mutirama", "Rua 66", "Setor Central", "Dom, 8h às 12h", "coleta"),
                criarPonto("Ponto Bosque dos Buritis", "Av. Assis Chateaubriand", "Setor Oeste", "Seg a Sex, 8h às 16h", "coleta"),
                criarPonto("Ponto Parque Flamboyant", "Jardim Goiás", "Jardim Goiás", "Ter e Qui, 9h às 15h", "distribuição"),
                criarPonto("Ponto Terminal Isidória", "Av. 4ª Radial", "Setor Pedro Ludovico", "Seg a Sex, 7h às 18h", "coleta"),
                criarPonto("Ponto Terminal Bandeiras", "Av. Rio Verde", "Jardim Presidente", "Seg a Sáb, 7h às 17h", "coleta"),
                criarPonto("Ponto Cmei Vila Nova", "Rua do Café", "Vila Nova", "Seg a Sex, 8h às 16h", "distribuição"),
                criarPonto("Ponto Feira do Setor Coimbra", "Praça Walter Santos", "Setor Coimbra", "Sáb, 7h às 12h", "coleta"),
                criarPonto("Ponto Praça do Sol", "Rua 9", "Setor Oeste", "Seg a Sex, 9h às 17h", "distribuição"),
                criarPonto("Ponto Centro Comunitário Leste Universitário", "Rua 228", "Setor Leste Universitário", "Seg a Sex, 8h às 17h", "coleta"),
                criarPonto("Ponto Parque Cascavel", "Av. do Lago", "Jardim Atlântico", "Qua e Sáb, 9h às 15h", "coleta"),
                criarPonto("Ponto Praça da T-23", "Av. T-3", "Setor Bueno", "Seg a Sex, 8h às 17h", "distribuição"),
                criarPonto("Ponto Centro de Referência Campinas", "Rua Benjamin Constant", "Setor Campinas", "Seg a Sex, 8h às 17h", "coleta"),
                criarPonto("Ponto Praça da Bíblia", "Rua 202", "Setor Leste Universitário", "Seg a Sex, 9h às 16h", "coleta"),
                criarPonto("Ponto Parque Leolídio di Ramos Caiado", "Av. PL-3", "Residencial Goiânia 2", "Ter e Qui, 9h às 15h", "distribuição"),
                criarPonto("Ponto Ginásio de Campinas", "Rua P-3", "Setor dos Funcionários", "Seg a Sex, 8h às 17h", "coleta"),
                criarPonto("Ponto Praça do Trabalhador", "Av. Independência", "Setor Central", "Seg a Sáb, 8h às 17h", "coleta"),
                criarPonto("Ponto Centro Comunitário Jardim América", "Praça C-108", "Jardim América", "Seg a Sex, 8h às 16h", "distribuição"),
                criarPonto("Ponto Praça do Cruzeiro", "Rua 90", "Setor Sul", "Seg a Sex, 9h às 16h", "coleta")
            );

            pontosIniciais.stream()
                    .filter(ponto -> !repository.existsByNomeIgnoreCase(ponto.getNome()))
                    .forEach(repository::save);
        };
    }

    private static Ponto criarPonto(String nome, String endereco, String bairro, String horario, String tipo) {
        Ponto ponto = new Ponto();
        ponto.setNome(nome);
        ponto.setEndereco(endereco + ", Goiânia - GO");
        ponto.setBairro(bairro);
        ponto.setHorario(horario);
        ponto.setTipo(tipo);
        return ponto;
    }
}

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
                criarPonto("Ponto Parque Mutirama", "Rua 66", "Setor Central", "Dom, 8h às 12h", "coleta")
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

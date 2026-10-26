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
            if (repository.count() > 0) {
                return;
            }

        repository.saveAll(List.of(
          criarPonto(
            "Ponto Praça Cívica",
            "Praça Cívica, Setor Central, Goiânia - GO",
            "Segunda a sexta, das 9h às 17h",
            "Recebe alimentos não perecíveis e roupas; distribui cestas básicas.",
            -16.6809365,
            -49.2563394
          ),
          criarPonto(
            "Ponto Mercado Central",
            "Rua 3, 322, Setor Central, Goiânia - GO, CEP 74043-010",
            "Segunda a sábado, das 8h às 17h",
            "Recebe alimentos e produtos de higiene; distribui kits para famílias cadastradas.",
            -16.6744057,
            -49.2539970
          ),
          criarPonto(
            "Ponto Praça Universitária",
            "Praça Universitária, Setor Leste Universitário, Goiânia - GO",
            "Segunda a sexta, das 10h às 16h",
            "Recebe material escolar e livros; distribui kits educacionais.",
            -16.6770065,
            -49.2441191
          ),
          criarPonto(
            "Ponto Parque Areião",
            "Parque Areião, Setor Pedro Ludovico, Goiânia - GO, CEP 74820-370",
            "Terças e quintas, das 9h às 15h",
            "Recebe roupas e calçados; distribui peças para famílias atendidas.",
            -16.7063337,
            -49.2556666
          ),
          criarPonto(
            "Ponto Centro Cultural Oscar Niemeyer",
            "Avenida Deputado Jamel Cecílio, Residencial Privê dos Girassóis, Goiânia - GO, CEP 74884-527",
            "Quarta e sábado, das 9h às 16h",
            "Recebe livros e brinquedos; distribui itens culturais e infantis.",
            -16.7107547,
            -49.2279081
          ),
          criarPonto(
            "Ponto Terminal Praça A",
            "Terminal Praça A, Setor Campinas, Goiânia - GO, CEP 74543-290",
            "Segunda a sexta, das 7h às 12h",
            "Recebe alimentos e água; distribui kits de alimentação.",
            -16.6735687,
            -49.2845424
          ),
          criarPonto(
            "Ponto Parque Vaca Brava",
            "Parque Vaca Brava, Nova Suíça, Goiânia - GO",
            "Sábados, das 8h às 13h",
            "Recebe roupas, cobertores e agasalhos; distribui para pessoas em vulnerabilidade.",
            -16.7095766,
            -49.2707637
          ),
          criarPonto(
            "Ponto Parque Mutirama",
            "Rua 66, Setor Central, Goiânia - GO, CEP 74055-070",
            "Domingos, das 8h às 12h",
            "Recebe brinquedos e alimentos; distribui kits infantis.",
            -16.6649918,
            -49.2532172
          )
        ));
        };
    }

    private static Ponto criarPonto(
        String nome,
        String endereco,
        String diasHorarios,
        String recebeDistribui,
        Double latitude,
        Double longitude
    ) {
      Ponto ponto = new Ponto();
      ponto.setNome(nome);
      ponto.setEndereco(endereco);
      ponto.setDiasHorarios(diasHorarios);
      ponto.setRecebeDistribui(recebeDistribui);
      ponto.setLatitude(latitude);
      ponto.setLongitude(longitude);
      return ponto;
    }
}
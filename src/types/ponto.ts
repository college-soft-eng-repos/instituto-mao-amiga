export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: 'coleta' | 'distribuição';
};

export type PontoRequest = Omit<Ponto, 'id'>;

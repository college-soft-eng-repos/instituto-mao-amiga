export type TabParamList = {
  Inicio: undefined;
  Historico: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  CadastrarModal: { doacaoId?: string } | undefined;
  FormularioPonto: { pontoId?: string } | undefined;
  Detalhe: { pontoId: string };
  DetalheDoacao: { doacaoId: string };
};

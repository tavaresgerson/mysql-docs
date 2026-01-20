### 14.18.1 Tipos de Monitor InnoDB

Existem dois tipos de monitor `InnoDB`:

- O monitor padrão `InnoDB` exibe os seguintes tipos de informações:

  - Trabalho realizado pelo thread de fundo principal
  - Semaphore aguarda
  - Dados sobre os erros mais recentes de chave estrangeira e bloqueio
  - Lock aguarda transações
  - Bloqueios de tabela e registros mantidos por transações ativas
  - Operações de entrada/saída pendentes e estatísticas relacionadas
  - Insira estatísticas de índice de hash buffer e adaptativo
  - Refazer os dados do log
  - Estatísticas do pool de tampão
  - Dados da operação de linha
- O Monitor de Bloqueio do `InnoDB` imprime informações adicionais sobre os bloqueios como parte da saída padrão do Monitor do `InnoDB`.

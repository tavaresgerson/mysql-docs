### 17.17.1 Tipos de Monitor do InnoDB

Existem dois tipos de monitor do `InnoDB`:

* O monitor padrão do `InnoDB` exibe os seguintes tipos de informações:

  + Trabalho realizado pelo principal fio de fundo
  + Espera de semaforos
  + Dados sobre os erros de chave estrangeira mais recentes e bloqueios
  + Espera de bloqueio para transações
  + Bloqueios de tabela e registro mantidos por transações ativas
  + Operações de I/O pendentes e estatísticas relacionadas
  + Estatísticas do buffer de inserção e do índice de hash adaptativo
  + Dados do log de refazer
  + Estatísticas do pool de buffers
  + Dados das operações de linha

* O monitor de bloqueio do `InnoDB` imprime informações adicionais sobre os bloqueios como parte da saída padrão do monitor do `InnoDB`.
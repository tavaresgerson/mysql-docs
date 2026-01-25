### 14.18.1 Tipos de Monitor InnoDB

Existem dois tipos de monitor `InnoDB`:

* O Monitor `InnoDB` padrão exibe os seguintes tipos de informação:

  + Trabalho realizado pelo main background thread
  + Esperas de Semaphore
  + Dados sobre os erros mais recentes de foreign key e deadlock
  + Esperas de Lock para transactions
  + Locks de tabela e registro mantidos por transactions ativas
  + Operações de I/O pendentes e estatísticas relacionadas
  + Estatísticas do Insert buffer e do adaptive hash index
  + Dados do Redo log
  + Estatísticas do Buffer Pool
  + Dados de operação de linha
* O InnoDB Lock Monitor imprime informações adicionais de lock como parte da saída do Monitor InnoDB padrão.
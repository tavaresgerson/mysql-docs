### 14.6.6 Registro de Refazer

O log de refazer é uma estrutura de dados baseada em disco usada durante a recuperação em caso de falha para corrigir dados escritos por transações incompletas. Durante operações normais, o log de refazer codifica solicitações para alterar dados de tabelas que resultam de instruções SQL ou chamadas de API de nível baixo. As modificações que não terminaram de atualizar os arquivos de dados antes de um desligamento inesperado são regravadas automaticamente durante a inicialização e antes que as conexões sejam aceitas. Para obter informações sobre o papel do log de refazer na recuperação em caso de falha, consulte a Seção 14.19.2, “Recuperação do InnoDB”.

Por padrão, o log de reversão é representado fisicamente no disco por dois arquivos chamados `ib_logfile0` e `ib_logfile1`. O MySQL escreve nos arquivos de log de reversão de forma circular. Os dados no log de reversão são codificados em termos de registros afetados; esses dados são coletivamente chamados de reversão. A passagem dos dados pelo log de reversão é representada por um valor de LSN (Local Sequence Number) sempre crescente.

As informações e os procedimentos relacionados aos registros de revisão são descritos nos seguintes tópicos na seção:

- Alterar o número ou o tamanho dos arquivos de registro de reinicialização do InnoDB
- Tópicos relacionados

#### Alterar o número ou o tamanho dos arquivos de registro de reinicialização do InnoDB

Para alterar o número ou o tamanho dos arquivos de registro de reverso do `InnoDB`, siga os passos abaixo:

1. Pare o servidor MySQL e certifique-se de que ele seja desligado sem erros.

2. Editar `my.cnf` para alterar a configuração do arquivo de log. Para alterar o tamanho do arquivo de log, configure `innodb_log_file_size`. Para aumentar o número de arquivos de log, configure `innodb_log_files_in_group`.

3. Reinicie o servidor MySQL.

Se o `InnoDB` detectar que o tamanho do arquivo de log `innodb_log_file_size` difere do tamanho do arquivo de log de refazer, ele escreve um ponto de verificação de log, fecha e remove os arquivos de log antigos, cria novos arquivos de log no tamanho solicitado e abre os novos arquivos de log.

#### Tópicos relacionados

- Configuração do arquivo de registro novamente
- Seção 8.5.4, “Otimizando o registro de reinicialização do InnoDB”

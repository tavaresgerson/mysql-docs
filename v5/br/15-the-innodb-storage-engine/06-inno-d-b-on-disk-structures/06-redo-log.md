### 14.6.6 Redo Log

O redo log é uma estrutura de dados baseada em disco usada durante o crash recovery para corrigir dados escritos por transações incompletas. Durante operações normais, o redo log codifica solicitações para alterar dados da tabela resultantes de instruções SQL ou chamadas de API de baixo nível. Modificações que não terminaram de atualizar os data files antes de um shutdown inesperado são automaticamente *replayed* durante a inicialização, e antes que as conexões sejam aceitas. Para informações sobre o papel do redo log no crash recovery, consulte a Seção 14.19.2, “InnoDB Recovery”.

Por padrão, o redo log é fisicamente representado em disco por dois arquivos chamados `ib_logfile0` e `ib_logfile1`. O MySQL escreve nos arquivos do redo log de forma circular. Os dados no redo log são codificados em termos de registros afetados; esses dados são coletivamente chamados de *redo*. A passagem de dados pelo redo log é representada por um valor LSN sempre crescente.

Informações e procedimentos relacionados aos redo logs são descritos nos seguintes tópicos nesta seção:

* Alterando o Número ou Tamanho dos Arquivos de Redo Log do InnoDB
* Tópicos Relacionados

#### Alterando o Número ou Tamanho dos Arquivos de Redo Log do InnoDB

Para alterar o número ou o tamanho dos seus arquivos de redo log do `InnoDB`, execute as seguintes etapas:

1. Pare o servidor MySQL e certifique-se de que ele se encerre (shuts down) sem erros.

2. Edite `my.cnf` para alterar a configuração do arquivo de log. Para alterar o tamanho do arquivo de log, configure `innodb_log_file_size`. Para aumentar o número de arquivos de log, configure `innodb_log_files_in_group`.

3. Inicie o servidor MySQL novamente.

Se o `InnoDB` detectar que o `innodb_log_file_size` difere do tamanho do arquivo de redo log, ele escreve um log checkpoint, fecha e remove os arquivos de log antigos, cria novos arquivos de log com o tamanho solicitado e abre os novos arquivos de log.

#### Tópicos Relacionados

* Configuração do Arquivo de Redo Log
* Seção 8.5.4, “Otimizando o Redo Logging do InnoDB”
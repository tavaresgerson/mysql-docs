### 5.4.4 O Log Binário

5.4.4.1 Formatos de registro binário

5.4.4.2 Configuração do formato do log binário

5.4.4.3 Formato de registro binário misto

5.4.4.4 Formato de registro para alterações nas tabelas do banco de dados mysql

O log binário contém “eventos” que descrevem as alterações no banco de dados, como operações de criação de tabelas ou alterações nos dados da tabela. Ele também contém eventos para instruções que poderiam ter feito alterações (por exemplo, uma `DELETE` que não encontrou nenhuma linha), a menos que o registro baseado em linhas seja usado. O log binário também contém informações sobre quanto tempo cada instrução levou para atualizar os dados. O log binário tem dois propósitos importantes:

- Para a replicação, o log binário em um servidor de origem de replicação fornece um registro das alterações de dados a serem enviadas para as réplicas. A fonte envia os eventos contidos em seu log binário para suas réplicas, que executam esses eventos para realizar as mesmas alterações de dados que foram feitas na fonte. Veja Seção 16.2, “Implementação de Replicação”.

- Algumas operações de recuperação de dados exigem o uso do log binário. Após a restauração de um backup, os eventos no log binário que foram registrados após a criação do backup são reexecutados. Esses eventos atualizam as bases de dados a partir do ponto do backup. Consulte Seção 7.5, “Recuperação em Ponto no Tempo (Incremental)".

O log binário não é usado para declarações como `SELECT` ou `SHOW` que não modificam dados. Para registrar todas as declarações (por exemplo, para identificar uma consulta com problemas), use o log de consulta geral. Veja Seção 5.4.3, “O Log de Consulta Geral”.

Executar um servidor com o registro binário habilitado faz com que o desempenho seja ligeiramente mais lento. No entanto, os benefícios do log binário, que permitem configurar a replicação e as operações de restauração, geralmente superam esse pequeno decréscimo de desempenho.

O log binário é geralmente resistente a interrupções inesperadas, pois apenas as transações completas são registradas ou lidas novamente. Consulte Seção 16.3.2, “Tratamento de uma Interrupção Inesperada de uma Replicação” para obter mais informações.

As senhas nas declarações escritas no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. Veja também Seção 6.1.2.3, “Senhas e Registro”.

A discussão a seguir descreve algumas das opções e variáveis do servidor que afetam o funcionamento do registro binário. Para uma lista completa, consulte Seção 16.1.6.4, “Opções e Variáveis de Registro Binário”.

Para habilitar o log binário, inicie o servidor com a opção `--log-bin[=base_name]`. Se não for fornecido um valor para *`base_name`*, o nome padrão é o valor da opção `--pid-file` (que, por padrão, é o nome da máquina do host) seguido de `-bin`. Se o nome de base for fornecido, o servidor escreve o arquivo no diretório de dados, a menos que o nome de base seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente. É recomendável especificar um nome de base explicitamente, em vez de usar o nome do host padrão; consulte Seção B.3.7, “Problemas Conhecidos no MySQL”, para saber o motivo.

Se você fornecer uma extensão no nome do log (por exemplo, `--log-bin=base_name.extension`), a extensão é silenciosamente removida e ignorada.

O aplicativo **mysqld** adiciona uma extensão numérica ao nome da base do log binário para gerar nomes de arquivos de log binário. O número aumenta cada vez que o servidor cria um novo arquivo de log, criando assim uma série ordenada de arquivos. O servidor cria um novo arquivo na série cada vez que um dos seguintes eventos ocorre:

- O servidor é iniciado ou reiniciado
- O servidor descarta os logs.
- O tamanho do arquivo de log atual atinge `max_binlog_size`.

Um arquivo de log binário pode se tornar maior do que [`max_binlog_size`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_replic%C3%A3o#sysvar_max_binlog_size) se você estiver usando transações grandes, pois uma transação é escrita no arquivo de uma só vez, nunca dividida entre arquivos.

Para acompanhar quais arquivos de log binários foram usados, o **mysqld** também cria um arquivo de índice de log binário que contém os nomes dos arquivos de log binário. Por padrão, esse arquivo tem o mesmo nome de base do arquivo de log binário, com a extensão `'.index'`. Você pode alterar o nome do arquivo de índice de log binário com a opção `--log-bin-index[=file_name]`. Você não deve editar manualmente esse arquivo enquanto o **mysqld** estiver em execução; fazer isso confundiria o **mysqld**.

O termo "arquivo de registro binário" geralmente indica um arquivo numerado individual que contém eventos do banco de dados. O termo "registro binário" denota coletivamente o conjunto de arquivos de registro binário numerados, mais o arquivo de índice.

Um cliente que tenha privilégios suficientes para definir variáveis de sistema de sessão restritas (consulte Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”) pode desativar o registro binário de suas próprias declarações usando a instrução `SET sql_log_bin=OFF`.

Por padrão, o servidor registra o comprimento do evento, bem como o próprio evento e usa isso para verificar se o evento foi escrito corretamente. Você também pode fazer com que o servidor escreva verificações de checksum para os eventos, configurando a variável de sistema `binlog_checksum`. Ao ler de volta do log binário, a fonte usa o comprimento do evento por padrão, mas pode ser configurado para usar verificações de checksums, se disponíveis, habilitando a variável de sistema `master_verify_checksum`. O fio de I/O de replicação também verifica os eventos recebidos da fonte. Você pode fazer com que o fio de SQL de replicação use verificações de checksums, se disponíveis, ao ler do log de retransmissão, habilitando a variável de sistema `slave_sql_verify_checksum`.

O formato dos eventos registrados no log binário depende do formato de registro binário. Três tipos de formato são suportados: registro baseado em linhas, registro baseado em declarações e registro de base mista. O formato de registro binário usado depende da versão do MySQL. Para descrições gerais dos formatos de registro, consulte Seção 5.4.4.1, “Formatos de Registro Binário”. Para informações detalhadas sobre o formato do log binário, consulte MySQL Internals: O Log Binário.

O servidor avalia as opções [`--binlog-do-db`](https://pt.wikipedia.org/wiki/Replicação_de_bin%C3%A1rio_do_MySQL#Op%C3%A9rnia_mysqld_binlog-do-db) e [`--binlog-ignore-db`](https://pt.wikipedia.org/wiki/Replicação_de_bin%C3%A1rio_do_MySQL#Op%C3%A9rnia_mysqld_binlog-ignore-db) da mesma forma que avalia as opções [`--replicate-do-db`](https://pt.wikipedia.org/wiki/Replicação_de_replica_do_MySQL#Op%C3%A9rnia_mysqld_replicate-do-db) e [`--replicate-ignore-db`](https://pt.wikipedia.org/wiki/Replicação_de_replica_do_MySQL#Op%C3%A9rnia_mysqld_replicate-ignore-db). Para obter informações sobre como isso é feito, consulte [Seção 16.2.5.1, “Avaliação das opções de replicação e registro binário de nível de banco de dados”](https://pt.wikipedia.org/wiki/Replicação_de_regras_de_op%C3%A9rnia_de_banco_de_dados).

Por padrão, uma replica não escreve em seu próprio log binário nenhuma modificação de dados que recebe da fonte. Para registrar essas modificações, inicie a replica com a opção `--log-slave-updates`, além da opção `--log-bin` (consulte Seção 16.1.6.3, “Opções e variáveis do servidor de replicação”). Isso é feito quando uma replica também deve atuar como fonte para outras réplicas em uma replicação em cadeia.

Você pode excluir todos os arquivos de log binários com a instrução `RESET MASTER`, ou um subconjunto deles com `PURGE BINARY LOGS`. Veja Seção 13.7.6.6, “Instrução RESET” e Seção 13.4.1.1, “Instrução PURGE BINARY LOGS”.

Se você estiver usando replicação, não deve excluir arquivos de log binário antigos na fonte até ter certeza de que nenhuma replica ainda os precise usar. Por exemplo, se suas réplicas nunca estiverem mais de três dias atrasadas, uma vez por dia, você pode executar **mysqladmin flush-logs binary** na fonte e, em seguida, remover quaisquer logs que tenham mais de três dias de idade. Você pode remover os arquivos manualmente, mas é preferível usar `PURGE BINARY LOGS`, que também atualiza com segurança o arquivo de índice do log binário para você (e que pode aceitar um argumento de data). Veja Seção 13.4.1.1, “Instrução PURGE BINARY LOGS”.

Você pode exibir o conteúdo dos arquivos de log binário com o utilitário **mysqlbinlog**. Isso pode ser útil quando você deseja reprocessar instruções no log para uma operação de recuperação. Por exemplo, você pode atualizar um servidor MySQL a partir do log binário da seguinte forma:

```sql
$> mysqlbinlog log_file | mysql -h server_name
```

**mysqlbinlog** também pode ser usado para exibir o conteúdo do arquivo de log de retransmissão, pois eles são escritos no mesmo formato que os arquivos de log binário. Para obter mais informações sobre o utilitário **mysqlbinlog** e como usá-lo, consulte Seção 4.6.7, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”. Para obter mais informações sobre o log binário e as operações de recuperação, consulte Seção 7.5, “Recuperação Ponto no Tempo (Incremental)”.

O registro binário é feito imediatamente após uma declaração ou transação ser concluída, mas antes que quaisquer bloqueios sejam liberados ou qualquer commit seja feito. Isso garante que o log seja registrado na ordem do commit.

As atualizações de tabelas não transacionais são armazenadas no log binário imediatamente após a execução.

Em uma transação não comprometida, todas as atualizações (`UPDATE`, `DELETE` ou `INSERT`) que alteram tabelas transacionais, como as tabelas `InnoDB`, são armazenadas em cache até que uma instrução `COMMIT` seja recebida pelo servidor. Nesse ponto, o **mysqld** escreve toda a transação no log binário antes que a instrução `COMMIT` seja executada.

As modificações em tabelas não transacionais não podem ser desfeitas. Se uma transação que é desfeita incluir modificações em tabelas não transacionais, toda a transação é registrada com uma declaração `ROLLBACK` no final para garantir que as modificações nessas tabelas sejam replicadas.

Quando um fio que lida com a transação é iniciado, ele aloca um buffer de [`binlog_cache_size`](https://pt.wikipedia.org/wiki/Op%C3%A7%C3%B5es_de_binary_log#sysvar_binlog_cache_size) para bufferizar as instruções. Se uma instrução for maior que esse valor, o fio abre um arquivo temporário para armazenar a transação. O arquivo temporário é excluído quando o fio termina.

A variável de status `Binlog_cache_use` mostra o número de transações que usaram este buffer (e possivelmente um arquivo temporário) para armazenar declarações. A variável de status `Binlog_cache_disk_use` mostra quantos desses transações realmente tiveram que usar um arquivo temporário. Essas duas variáveis podem ser usadas para ajustar `binlog_cache_size` para um valor suficientemente grande para evitar o uso de arquivos temporários.

A variável de sistema [`max_binlog_cache_size`](https://pt.wikipedia.org/wiki/Replicação_de_logs_bin%C3%A1rios#sysvar_max_binlog_cache_size), cujo valor padrão é de 4 GB (que também é o máximo), pode ser usada para restringir o tamanho total utilizado para armazenar uma transação com múltiplas instruções. Se uma transação for maior que esse número de bytes, ela falhará e será revertida. O valor mínimo é de 4096.

Se você estiver usando o registro binário e o registro baseado em linhas, as inserções concorrentes são convertidas em inserções normais para as instruções `CREATE ... SELECT` ou `INSERT ... SELECT`. Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas aplicando o log durante uma operação de backup. Se você estiver usando o registro baseado em instruções, a instrução original é escrita no log.

O formato de log binário tem algumas limitações conhecidas que podem afetar a recuperação de backups. Consulte Seção 16.4.1, “Recursos e problemas de replicação”.

O registro binário para programas armazenados é feito conforme descrito em Seção 23.7, “Registro Binário de Programas Armazenados”.

Observe que o formato do log binário difere no MySQL 5.7 das versões anteriores do MySQL, devido às melhorias na replicação. Consulte Seção 16.4.2, “Compatibilidade de replicação entre versões do MySQL”.

Se o servidor não conseguir gravar o log binário, esvaziar os arquivos de log binário ou sincronizar o log binário com o disco, o log binário na fonte pode ficar inconsistente e as réplicas podem perder a sincronização com a fonte. A variável de sistema [`binlog_error_action`](https://pt.wikipedia.org/wiki/Replicação#Op%C3%A7%C3%B5es_de_log_bin%C3%A1rio.3F) controla a ação a ser tomada se um erro desse tipo for encontrado no log binário.

- A configuração padrão, `ABORT_SERVER`, faz o servidor parar o registro binário e desligar. Neste ponto, você pode identificar e corrigir a causa do erro. Na reinicialização, a recuperação prossegue como no caso de um desligamento inesperado do servidor (consulte Seção 16.3.2, “Tratamento de um Desligamento Inesperado de uma Replicação”).

- O parâmetro `IGNORE_ERROR` oferece compatibilidade reversa com versões mais antigas do MySQL. Com este parâmetro, o servidor continua a transação em andamento e registra o erro, depois interrompe o registro binário, mas continua a realizar atualizações. Neste ponto, você pode identificar e corrigir a causa do erro. Para retomar o registro binário, o [`log_bin`](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_log_bin) deve ser habilitado novamente, o que requer o reinício do servidor. Use esta opção apenas se você precisar de compatibilidade reversa e o log binário não for essencial nesta instância do servidor MySQL. Por exemplo, você pode usar o log binário apenas para auditoria ou depuração intermitentes do servidor e não usá-lo para replicação do servidor ou confiar nele para operações de restauração em um ponto no tempo.

Por padrão, o log binário é sincronizado com o disco em cada escrita (`sync_binlog=1`). Se a variável de sistema `sync_binlog` ([replication-options-binary-log.html#sysvar_sync_binlog]) não estiver habilitada e o sistema operacional ou a máquina (não apenas o servidor MySQL) falhar, há a possibilidade de que as últimas declarações do log binário possam ser perdidas. Para evitar isso, habilite a variável de sistema `sync_binlog` ([replication-options-binary-log.html#sysvar_sync_binlog]) para sincronizar o log binário com o disco após cada grupo de commits `N`. Veja Seção 5.1.7, “Variáveis de Sistema do Servidor”. O valor mais seguro para `sync_binlog` ([replication-options-binary-log.html#sysvar_sync_binlog]) é 1 (o padrão), mas este também é o mais lento.

Por exemplo, se você estiver usando tabelas `InnoDB` e o servidor MySQL processar uma instrução `COMMIT`, ele escreve muitas transações preparadas no log binário em sequência, sincroniza o log binário e, em seguida, confirma essa transação no `InnoDB`. Se o servidor sair inesperadamente entre essas duas operações, a transação será revertida pelo `InnoDB` na próxima reinicialização, mas ainda existirá no log binário. Esse problema é resolvido assumindo que `--innodb_support_xa` está definido para 1, que é o valor padrão. Embora essa opção esteja relacionada ao suporte de transações XA no `InnoDB`, ela também garante que o log binário e os arquivos de dados do `InnoDB` sejam sincronizados. Para que essa opção ofereça um maior grau de segurança, o servidor MySQL também deve ser configurado para sincronizar o log binário e os logs do `InnoDB` no disco antes de confirmar a transação. Os logs do `InnoDB` são sincronizados por padrão, e `sync_binlog=1` pode ser usado para sincronizar o log binário. O efeito dessa opção é que, na próxima reinicialização após um crash, após realizar um rollback de transações, o servidor MySQL examina o arquivo mais recente do log binário para coletar os valores dos *`xid`* das transações e calcular a última posição válida no arquivo do log binário. O servidor MySQL então informa ao `InnoDB` para completar quaisquer transações preparadas que foram escritas com sucesso no log binário e trunca o log binário para a última posição válida. Isso garante que o log binário reflita os dados exatos das tabelas do `InnoDB`, e, portanto, a replica permanece em sincronia com a fonte porque não recebe uma instrução que foi revertida.

Nota

`innodb_support_xa` está desatualizado; espere que ele seja removido em uma futura versão. O suporte `InnoDB` para o commit de duas fases em transações XA está sempre ativado a partir do MySQL 5.7.10.

Se o servidor MySQL descobrir durante a recuperação de falhas que o log binário é mais curto do que deveria ser, ele está faltando pelo menos uma transação `InnoDB` com sucesso confirmada. Isso não deve acontecer se `sync_binlog=1` e o sistema de disco/arquivo realizar uma sincronização real quando solicitado (alguns não o fazem), então o servidor imprime uma mensagem de erro `O arquivo de log binário file_name é mais curto do que seu tamanho esperado`. Nesse caso, esse log binário não está correto e a replicação deve ser reiniciada a partir de um novo instantâneo dos dados da fonte.

Os valores das sessões das seguintes variáveis do sistema são escritos no log binário e respeitados pela replica ao analisar o log binário:

- `sql_mode` (exceto que o modo `NO_DIR_IN_CREATE` não é replicado; veja Seção 16.4.1.37, “Replicação e Variáveis”)

- `foreign_key_checks`

- `unique_checks`

- `character_set_client`

- `collation_connection`

- `collation_database`

- `collation_server`

- `sql_auto_is_null`

#### 13.7.6.3 Instrução FLUSH

```sql
FLUSH [NO_WRITE_TO_BINLOG | LOCAL] {
    flush_option [, flush_option] ...
  | tables_option
}

flush_option: {
    BINARY LOGS
  | DES_KEY_FILE
  | ENGINE LOGS
  | ERROR LOGS
  | GENERAL LOGS
  | HOSTS
  | LOGS
  | PRIVILEGES
  | OPTIMIZER_COSTS
  | QUERY CACHE
  | RELAY LOGS [FOR CHANNEL channel]
  | SLOW LOGS
  | STATUS
  | USER_RESOURCES
}

tables_option: {
    table_synonym
  | table_synonym tbl_name [, tbl_name] ...
  | table_synonym WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... FOR EXPORT
}

table_synonym: {
    TABLE
  | TABLES
}
```

A instrução `FLUSH` possui várias formas variantes que limpam ou recarregam diversos caches internos, fazem flush de tables, ou adquirem locks. Para executar `FLUSH`, você deve ter o privilégio `RELOAD`. Opções específicas de flush podem exigir privilégios adicionais, conforme indicado nas descrições das opções.

Note

Não é possível emitir instruções `FLUSH` dentro de stored functions ou triggers. No entanto, você pode usar `FLUSH` em stored procedures, contanto que estas não sejam chamadas de stored functions ou triggers. Consulte Section 23.8, “Restrictions on Stored Programs”.

Por padrão, o servidor grava instruções `FLUSH` no binary log para que elas repliquem para as replicas. Para suprimir o log, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

Note

`FLUSH LOGS`, `FLUSH BINARY LOGS`, `FLUSH TABLES WITH READ LOCK` (com ou sem uma lista de tables), e `FLUSH TABLES tbl_name ... FOR EXPORT` não são gravados no binary log em nenhum caso, pois causariam problemas se replicados para uma replica.

A instrução `FLUSH` causa um implicit commit. Consulte Section 13.3.3, “Statements That Cause an Implicit Commit”.

O utilitário **mysqladmin** fornece uma interface de linha de comando para algumas operações de flush, usando comandos como `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status` e `flush-tables`. Consulte Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”.

O envio de um sinal `SIGHUP` ao servidor causa várias operações de flush semelhantes a várias formas da instrução `FLUSH`. Sinais podem ser enviados pela conta de sistema `root` ou pela conta de sistema proprietária do processo do servidor. Isso permite que as operações de flush sejam realizadas sem a necessidade de se conectar ao servidor, o que exigiria uma conta MySQL com privilégios suficientes para essas operações. Consulte Section 4.10, “Unix Signal Handling in MySQL”.

A instrução `RESET` é semelhante a `FLUSH`. Consulte Section 13.7.6.6, “RESET Statement”, para obter informações sobre como usar `RESET` com replicação.

A lista a seguir descreve os valores permitidos para *`flush_option`* na instrução `FLUSH`. Para descrições dos valores permitidos para *`tables_option`*, consulte FLUSH TABLES Syntax.

* `FLUSH BINARY LOGS`

  Fecha e reabre qualquer arquivo de binary log para o qual o servidor esteja escrevendo. Se o binary logging estiver ativado, o número de sequência do arquivo de binary log é incrementado em um em relação ao arquivo anterior.

  Esta operação não tem efeito sobre tables usadas para os binary e relay logs (conforme controlado pelas variáveis de sistema `master_info_repository` e `relay_log_info_repository`).

* `FLUSH DES_KEY_FILE`

  Recarrega as chaves DES do arquivo que foi especificado com a opção `--des-key-file` no momento da inicialização do servidor.

  Note

  A função `DES_ENCRYPT()` e `DES_DECRYPT()` estão obsoletas no MySQL 5.7, são removidas no MySQL 8.0, e não devem mais ser usadas. Consequentemente, `--des-key-file` e `DES_KEY_FILE` também estão obsoletos e são removidos no MySQL 8.0.

* `FLUSH ENGINE LOGS`

  Fecha e reabre quaisquer logs que podem ser flushed para os storage engines instalados. Isso faz com que o `InnoDB` faça flush de seus logs para o disco.

* `FLUSH ERROR LOGS`

  Fecha e reabre qualquer arquivo de error log para o qual o servidor esteja escrevendo.

* `FLUSH GENERAL LOGS`

  Fecha e reabre qualquer arquivo de general query log para o qual o servidor esteja escrevendo.

  Esta operação não tem efeito sobre tables usadas para o general query log (consulte Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH HOSTS`

  Esvazia o host cache e a tabela `host_cache` do Performance Schema que expõe o conteúdo do cache, e desbloqueia quaisquer hosts bloqueados.

  Para informações sobre por que o flush do host cache pode ser aconselhável ou desejável, consulte Section 5.1.11.2, “DNS Lookups and the Host Cache”.

  Note

  A instrução `TRUNCATE TABLE performance_schema.host_cache`, diferentemente de `FLUSH HOSTS`, não é gravada no binary log. Para obter o mesmo comportamento desta última, especifique `NO_WRITE_TO_BINLOG` ou `LOCAL` como parte da instrução `FLUSH HOSTS`.

* `FLUSH LOGS`

  Fecha e reabre qualquer arquivo de log para o qual o servidor esteja escrevendo.

  O efeito desta operação é equivalente aos efeitos combinados destas operações:

  ```sql
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

* `FLUSH OPTIMIZER_COSTS`

  Recarrega as cost model tables para que o optimizer comece a usar as estimativas de custo atuais armazenadas nelas.

  O servidor grava um warning no error log para quaisquer entradas de cost model table não reconhecidas. Para informações sobre estas tables, consulte Section 8.9.5, “The Optimizer Cost Model”. Esta operação afeta apenas as sessions que começam subsequentemente ao flush. Sessions existentes continuam a usar as estimativas de custo que estavam atuais quando começaram.

* `FLUSH PRIVILEGES`

  Recarrega os privilégios das grant tables no `mysql` system database.

  Recarregar as grant tables é necessário para habilitar atualizações nos privilégios e usuários do MySQL apenas se você fizer tais alterações diretamente nas grant tables; não é necessário para instruções de gerenciamento de conta como `GRANT` ou `REVOKE`, que entram em vigor imediatamente. Consulte Section 6.2.9, “When Privilege Changes Take Effect”, para mais informações.

  Se a opção `--skip-grant-tables` foi especificada na inicialização do servidor para desativar o sistema de privilégios do MySQL, `FLUSH PRIVILEGES` fornece uma maneira de habilitar o sistema de privilégios em tempo de execução (runtime).

  Libera a memória armazenada em cache pelo servidor como resultado das instruções `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Esta memória não é liberada pelas instruções correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias das instruções que causam caching, o uso da memória cache aumenta, a menos que seja liberada com `FLUSH PRIVILEGES`.

* `FLUSH QUERY CACHE`

  Desfragmenta o query cache para utilizar melhor sua memória. `FLUSH QUERY CACHE` não remove nenhuma query do cache, diferentemente de `FLUSH TABLES` ou `RESET QUERY CACHE`.

  Note

  O query cache está obsoleto desde o MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui `FLUSH QUERY CACHE`.

* `FLUSH RELAY LOGS [FOR CHANNEL channel]`

  Fecha e reabre qualquer arquivo de relay log para o qual o servidor esteja escrevendo. Se o relay logging estiver ativado, o número de sequência do arquivo de relay log é incrementado em um em relação ao arquivo anterior.

  A cláusula `FOR CHANNEL channel` permite nomear a replication channel à qual a operação se aplica. Execute `FLUSH RELAY LOGS FOR CHANNEL channel` para fazer flush do relay log para uma replication channel específica. Se nenhum channel for nomeado e não existirem replication channels extras, a operação se aplica ao channel padrão. Se nenhum channel for nomeado e existirem múltiplas replication channels, a operação se aplica a todas as replication channels, com exceção do channel `group_replication_applier`. Para mais informações, consulte Section 16.2.2, “Replication Channels”.

  Esta operação não tem efeito sobre tables usadas para os binary e relay logs (conforme controlado pelas variáveis de sistema `master_info_repository` e `relay_log_info_repository`).

* `FLUSH SLOW LOGS`

  Fecha e reabre qualquer arquivo de slow query log para o qual o servidor esteja escrevendo.

  Esta operação não tem efeito sobre tables usadas para o slow query log (consulte Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH STATUS`

  Faz flush dos indicadores de status.

  Esta operação adiciona os valores das variáveis de status de session do thread atual aos valores globais e redefine os valores de session para zero. Algumas variáveis globais também podem ser redefinidas para zero. Também redefine os contadores para key caches (padrão e nomeados) para zero e define `Max_used_connections` para o número atual de conexões abertas. Esta informação pode ser útil ao depurar uma query. Consulte Section 1.5, “How to Report Bugs or Problems”.

  `FLUSH STATUS` não é afetado por `read_only` ou `super_read_only`, e é sempre gravado no binary log.

  Note

  O valor da variável de sistema `show_compatibility_56` afeta a operação desta opção `FLUSH`. Para detalhes, consulte a descrição dessa variável em Section 5.1.7, “Server System Variables”.

* `FLUSH USER_RESOURCES`

  Redefine todos os indicadores de user resource por hora para zero.

  A redefinição dos indicadores de resource permite que os clientes que atingiram seus limites horários de conexão, query ou update retomem a atividade imediatamente. `FLUSH USER_RESOURCES` não se aplica ao limite máximo de conexões simultâneas que é controlado pela variável de sistema `max_user_connections`. Consulte Section 6.2.16, “Setting Account Resource Limits”.

##### Sintaxe FLUSH TABLES

`FLUSH TABLES` faz flush de tables e, dependendo da variante usada, adquire locks. Qualquer variante `TABLES` usada em uma instrução `FLUSH` deve ser a única opção usada. `FLUSH TABLE` é um sinônimo para `FLUSH TABLES`.

Note

As descrições aqui que indicam que as tables são flushed ao serem fechadas se aplicam de forma diferente para o `InnoDB`, que faz flush do conteúdo da table para o disco, mas as deixa abertas. Isso ainda permite que os arquivos da table sejam copiados enquanto as tables estão abertas, desde que outras atividades não as modifiquem.

* `FLUSH TABLES`

  Fecha todas as tables abertas, força o fechamento de todas as tables em uso e faz flush do query cache e do prepared statement cache. `FLUSH TABLES` também remove todos os resultados de query do query cache, como a instrução `RESET QUERY CACHE`. Para informações sobre query caching e prepared statement caching, consulte Section 8.10.3, “The MySQL Query Cache”. e Section 8.10.4, “Caching of Prepared Statements and Stored Programs”.

  `FLUSH TABLES` não é permitido quando há um `LOCK TABLES ... READ` ativo. Para fazer flush e lock em tables, use `FLUSH TABLES tbl_name ... WITH READ LOCK` em vez disso.

* `FLUSH TABLES tbl_name [, tbl_name] ...`

  Com uma lista de um ou mais nomes de tables separados por vírgula, esta operação é como `FLUSH TABLES` sem nomes, exceto que o servidor faz flush apenas das tables nomeadas. Se uma table nomeada não existir, nenhum erro ocorrerá.

* `FLUSH TABLES WITH READ LOCK`

  Fecha todas as tables abertas e faz lock em todas as tables para todos os databases com um global read lock.

  Esta operação é uma maneira muito conveniente de obter backups se você tiver um file system, como Veritas ou ZFS, que possa tirar snapshots no tempo. Use `UNLOCK TABLES` para liberar o lock.

  `FLUSH TABLES WITH READ LOCK` adquire um global read lock em vez de table locks, portanto, não está sujeito ao mesmo comportamento de `LOCK TABLES` e `UNLOCK TABLES` em relação ao table locking e implicit commits:

  + `UNLOCK TABLES` implicitamente commita qualquer transaction ativa apenas se quaisquer tables estiverem atualmente locked com `LOCK TABLES`. O commit não ocorre para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK` porque esta última instrução não adquire table locks.

  + Iniciar uma transaction faz com que os table locks adquiridos com `LOCK TABLES` sejam liberados, como se você tivesse executado `UNLOCK TABLES`. Iniciar uma transaction não libera um global read lock adquirido com `FLUSH TABLES WITH READ LOCK`.

  Antes do MySQL 5.7.19, `FLUSH TABLES WITH READ LOCK` não é compatível com XA transactions.

  `FLUSH TABLES WITH READ LOCK` não impede que o servidor insira linhas nas log tables (consulte Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`

  Faz flush e adquire read locks para as tables nomeadas.

  Como esta operação adquire table locks, ela requer o privilégio `LOCK TABLES` para cada table, além do privilégio `RELOAD`.

  A operação primeiro adquire exclusive metadata locks para as tables, então ela espera que as transactions que têm essas tables abertas sejam concluídas. Em seguida, a operação faz flush das tables do table cache, reabre as tables, adquire table locks (como `LOCK TABLES ... READ`) e faz downgrade dos metadata locks de exclusive para shared. Depois que a operação adquire locks e faz downgrade dos metadata locks, outras sessions podem ler, mas não modificar, as tables.

  Esta operação se aplica apenas a base tables existentes (não-`TEMPORARY`). Se um nome se refere a uma base table, essa table é usada. Se se refere a uma table `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma view, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

  Use `UNLOCK TABLES` para liberar os locks, `LOCK TABLES` para liberar os locks e adquirir outros locks, ou `START TRANSACTION` para liberar os locks e iniciar uma nova transaction.

  Esta variante de `FLUSH TABLES` permite que as tables sejam flushed e locked em uma única operação. Ela fornece uma solução alternativa para a restrição de que `FLUSH TABLES` não é permitida quando há um `LOCK TABLES ... READ` ativo.

  Esta operação não realiza um `UNLOCK TABLES` implícito, então resulta em um erro se você realizar a operação enquanto houver qualquer `LOCK TABLES` ativo ou usá-la uma segunda vez sem primeiro liberar os locks adquiridos.

  Se uma table flushed foi aberta com `HANDLER`, o handler é implicitamente flushed e perde sua posição.

* `FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`

  Esta variante de `FLUSH TABLES` se aplica a tables `InnoDB`. Ela garante que as alterações nas tables nomeadas tenham sido flushed para o disco para que cópias binárias da table possam ser feitas enquanto o servidor está em execução.

  Como a operação `FLUSH TABLES ... FOR EXPORT` adquire locks em tables em preparação para exportá-las, ela requer os privilégios `LOCK TABLES` e `SELECT` para cada table, além do privilégio `RELOAD`.

  A operação funciona da seguinte forma:

  1.  Adquire shared metadata locks para as tables nomeadas. A operação bloqueia enquanto outras sessions tiverem transactions ativas que modificaram essas tables ou mantiverem table locks para elas. Quando os locks forem adquiridos, a operação bloqueia transactions que tentam atualizar as tables, ao mesmo tempo que permite que operações de read-only continuem.

  2.  Verifica se todos os storage engines para as tables suportam `FOR EXPORT`. Se algum não suportar, ocorre um erro `ER_ILLEGAL_HA` e a operação falha.

  3.  A operação notifica o storage engine para cada table para preparar a table para exportação. O storage engine deve garantir que quaisquer alterações pendentes sejam gravadas no disco.

  4.  A operação coloca a session no modo lock-tables para que os metadata locks adquiridos anteriormente não sejam liberados quando a operação `FOR EXPORT` for concluída.

  Esta operação se aplica apenas a base tables existentes (não-`TEMPORARY`). Se um nome se refere a uma base table, essa table é usada. Se se refere a uma table `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma view, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

  O `InnoDB` suporta `FOR EXPORT` para tables que têm seu próprio `.ibd` file (ou seja, tables criadas com a configuração `innodb_file_per_table` habilitada). O `InnoDB` garante, quando notificado pela operação `FOR EXPORT`, que quaisquer alterações tenham sido flushed para o disco. Isso permite que uma cópia binária do conteúdo da table seja feita enquanto a operação `FOR EXPORT` está em vigor, porque o arquivo `.ibd` é transaction consistent e pode ser copiado enquanto o servidor está em execução. `FOR EXPORT` não se aplica a arquivos de tablespace de sistema do `InnoDB`, ou a tables `InnoDB` que possuem `FULLTEXT` indexes.

  `FLUSH TABLES ...FOR EXPORT` é suportado para tables `InnoDB` particionadas.

  Quando notificado por `FOR EXPORT`, o `InnoDB` grava no disco certos tipos de dados que normalmente são mantidos na memória ou em disk buffers separados fora dos arquivos de tablespace. Para cada table, o `InnoDB` também produz um arquivo chamado `table_name.cfg` no mesmo diretório de database que a table. O arquivo `.cfg` contém metadados necessários para reimportar os arquivos de tablespace posteriormente, no mesmo servidor ou em um servidor diferente.

  Quando a operação `FOR EXPORT` é concluída, o `InnoDB` fez flush de todas as dirty pages para os arquivos de dados da table. Quaisquer entradas do change buffer são mescladas antes do flushing. Neste ponto, as tables estão locked e quiescentes: as tables estão em um estado transactionally consistent no disco e você pode copiar os arquivos de tablespace `.ibd` junto com os arquivos `.cfg` correspondentes para obter um snapshot consistente dessas tables.

  Para o procedimento de reimportar os dados da table copiada para uma instância MySQL, consulte Section 14.6.1.3, “Importing InnoDB Tables”.

  Depois de terminar com as tables, use `UNLOCK TABLES` para liberar os locks, `LOCK TABLES` para liberar os locks e adquirir outros locks, ou `START TRANSACTION` para liberar os locks e iniciar uma nova transaction.

  Enquanto qualquer uma destas instruções estiver em vigor dentro da session, as tentativas de usar `FLUSH TABLES ... FOR EXPORT` produzem um erro:

  ```sql
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

  Enquanto `FLUSH TABLES ... FOR EXPORT` estiver em vigor dentro da session, as tentativas de usar qualquer uma destas instruções produzem um erro:

  ```sql
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```
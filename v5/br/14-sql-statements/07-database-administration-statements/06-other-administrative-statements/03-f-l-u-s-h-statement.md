#### 13.7.6.3 Declaração FLUSH

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

A instrução `FLUSH` tem várias formas variantes que limpam ou reinicializam vários caches internos, limpem tabelas ou adquiram bloqueios. Para executar `FLUSH`, você deve ter o privilégio `RELOAD`. Opções específicas de limpeza podem exigir privilégios adicionais, conforme indicado nas descrições das opções.

Nota

Não é possível emitir declarações `FLUSH` dentro de funções armazenadas ou gatilhos. No entanto, você pode usar `FLUSH` em procedimentos armazenados, desde que esses não sejam chamados a partir de funções ou gatilhos armazenados. Consulte Seção 23.8, “Restrições em Programas Armazenados”.

Por padrão, o servidor escreve as instruções `FLUSH` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

Nota

`FLUSH LOGS`, `FLUSH BINARY LOGS`, `FLUSH TABLES WITH READ LOCK` (com ou sem uma lista de tabelas) e `FLUSH TABLES tbl_name ... FOR EXPORT` não são escritos no log binário, pois causariam problemas se replicados para uma réplica.

A instrução `FLUSH` causa um commit implícito. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

A ferramenta **mysqladmin** fornece uma interface de linha de comando para algumas operações de limpeza, usando comandos como `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status` e `flush-tables`. Veja Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Enviar um sinal `SIGHUP` para o servidor faz com que várias operações de limpeza ocorram, que são semelhantes a várias formas da instrução `FLUSH`. Os sinais podem ser enviados pela conta `root` do sistema ou pela conta do sistema que possui o processo do servidor. Isso permite que as operações de limpeza sejam realizadas sem precisar se conectar ao servidor, o que requer uma conta MySQL com privilégios suficientes para essas operações. Veja Seção 4.10, “Manipulação de Sinais Unix no MySQL”.

A declaração `RESET` é semelhante à `FLUSH`. Consulte Seção 13.7.6.6, “Declaração RESET” para obter informações sobre o uso da declaração `RESET` com replicação.

A lista a seguir descreve os valores permitidos da instrução `FLUSH` *`flush_option`*. Para descrições dos valores permitidos de *`tables_option`*, consulte Sintaxe de FLUSH TABLES.

- `FLUXAR LOGS BINÁRIOS`

  Fecha e reabre qualquer arquivo de registro binário para o qual o servidor está escrevendo. Se o registro binário estiver habilitado, o número de sequência do arquivo de registro binário é incrementado em um em relação ao arquivo anterior.

  Esta operação não afeta as tabelas usadas para os logs binários e de relé (conforme controlado pelas variáveis de sistema `master_info_repository` e `relay_log_info_repository`).

- `FLUSH DES_KEY_FILE`

  Recarrega as chaves DES do arquivo especificado com a opção `--des-key-file` no momento da inicialização do servidor.

  Nota

  As funções [`DES_ENCRYPT()`](https://pt.wikipedia.org/wiki/DES_ENCRYPT) e [`DES_DECRYPT()`](https://pt.wikipedia.org/wiki/DES_DECRYPT) estão desatualizadas no MySQL 5.7, são removidas no MySQL 8.0 e não devem mais ser usadas. Consequentemente, [`--des-key-file`](https://pt.wikipedia.org/wiki/Server_Options#Option_mysqld_des-key-file) e `DES_KEY_FILE` também estão desatualizadas e são removidas no MySQL 8.0.

- `FLUXAR LOGS DO MOTOR`

  Fecha e reabre quaisquer registros descartáveis para os motores de armazenamento instalados. Isso faz com que o `InnoDB` descarte seus registros no disco.

- `LOGAR ERROS DE LIMPEZA`

  Fecha e reabre qualquer arquivo de registro de erros para o qual o servidor está escrevendo.

- `Limpar logs gerais`

  Fecha e reabre qualquer arquivo de registro de consulta geral para o qual o servidor está escrevendo.

  Esta operação não afeta as tabelas usadas para o log de consultas gerais (consulte Seção 5.4.1, “Selecionando destinos de saída do log de consultas gerais e do log de consultas lentas”).

- `FLUSH HOSTS`

  Esvazia o cache do host e a tabela do Schema de Desempenho `host_cache` que exibe o conteúdo do cache e desbloqueia quaisquer hosts bloqueados.

  Para obter informações sobre por que o esvaziamento do cache do host pode ser aconselhável ou desejável, consulte Seção 5.1.11.2, "Consultas DNS e o Cache do Host".

  Nota

  A instrução `TRUNCATE TABLE performance_schema.host_cache`, ao contrário da `FLUSH HOSTS`, não é escrita no log binário. Para obter o mesmo comportamento da última, especifique `NO_WRITE_TO_BINLOG` ou `LOCAL` como parte da instrução `FLUSH HOSTS`.

- `FLUXAR LOGS`

  Fecha e reabre qualquer arquivo de registro para o qual o servidor está escrevendo.

  O efeito dessa operação é equivalente aos efeitos combinados dessas operações:

  ```sql
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

- `FLUSH OPTIMIZER_COSTS`

  Re-leia as tabelas do modelo de custo para que o otimizador comece a usar as estimativas de custo atuais armazenadas nelas.

  O servidor escreve um aviso no log de erros para quaisquer entradas de tabelas de modelo de custo não reconhecidas. Para obter informações sobre essas tabelas, consulte Seção 8.9.5, “O Modelo de Custo do Optimizador”. Esta operação afeta apenas as sessões que começam após o esvaziamento. As sessões existentes continuam a usar as estimativas de custo que estavam em vigor quando começaram.

- `DESFAZER PRIVILÍGIOS`

  Releia os privilégios das tabelas de concessão no banco de dados do sistema `mysql`.

  A recarga das tabelas de concessão é necessária para permitir atualizações dos privilégios e usuários do MySQL apenas se você fizer tais alterações diretamente nas tabelas de concessão; isso não é necessário para declarações de gerenciamento de contas, como `GRANT` ou `REVOKE`, que entram em vigor imediatamente. Consulte Seção 6.2.9, “Quando as Alterações de Privilégio Entram em Vigor” para obter mais informações.

  Se a opção `--skip-grant-tables` foi especificada na inicialização do servidor para desabilitar o sistema de privilégios do MySQL, o comando `FLUSH PRIVILEGES` oferece uma maneira de habilitar o sistema de privilégios em tempo de execução.

  Libera a memória cacheada pelo servidor como resultado das instruções `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelas instruções correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias das instruções que causam o cache, o uso da memória cacheada aumenta, a menos que seja liberada com `FLUSH PRIVILEGES`.

- `Limpar o cache da consulta`

  Desfragmente o cache de consultas para utilizar melhor sua memória. `FLUSH QUERY CACHE` não remove nenhuma consulta do cache, ao contrário de `FLUSH TABLES` ou `RESET QUERY CACHE`.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `FLUSH QUERY CACHE`.

- `FLUSH RELAY LOGS [PARA O CANAL channel]`

  Fecha e reabre qualquer arquivo de registro de retransmissão para o qual o servidor está escrevendo. Se o registro de retransmissão estiver habilitado, o número de sequência do arquivo de registro de retransmissão é incrementado em um em relação ao arquivo anterior.

  A cláusula `FOR CHANNEL` permite que você nomeie qual canal de replicação a operação se aplica. Execute `FLUSH RELAY LOGS FOR CHANNEL channel` para limpar o log do retransmissor para um canal de replicação específico. Se nenhum canal estiver nomeado e não houver canais de replicação extras, a operação se aplica ao canal padrão. Se nenhum canal estiver nomeado e houver vários canais de replicação, a operação se aplica a todos os canais de replicação, com exceção do canal `group_replication_applier`. Para mais informações, consulte Seção 16.2.2, “Canais de Replicação”.

  Esta operação não afeta as tabelas usadas para os logs binários e de relé (conforme controlado pelas variáveis de sistema `master_info_repository` e `relay_log_info_repository`).

- `Limpar logs lentas`

  Fecha e reabre qualquer arquivo de registro de consulta lenta para o qual o servidor está escrevendo.

  Esta operação não afeta as tabelas usadas para o log de consultas lentas (consulte Seção 5.4.1, “Selecionando destinos de saída do log de consultas gerais e do log de consultas lentas”).

- `FLUXAR STATUS`

  Limpa os indicadores de status.

  Essa operação adiciona os valores das variáveis de status de sessão da thread atual aos valores globais e redefiniu os valores de sessão para zero. Algumas variáveis globais também podem ser redefinidas para zero. Também redefiniu os contadores para caches de chaves (padrão e nomeados) para zero e definiu `Max_used_connections` para o número atual de conexões abertas. Esta informação pode ser útil ao depurar uma consulta. Veja Seção 1.5, “Como Relatar Bugs ou Problemas”.

  `FLUSH STATUS` não é afetado por `read_only` ou `super_read_only` e é sempre escrito no log binário.

  Nota

  O valor da variável de sistema `show_compatibility_56` afeta o funcionamento desta opção `FLUSH`. Para obter detalhes, consulte a descrição dessa variável em Seção 5.1.7, “Variáveis de Sistema do Servidor”.

- `FLUXAR RECURSOS DO USUÁRIO`

  Redefine todos os indicadores de recursos do usuário por hora para zero.

  A redefinição dos indicadores de recursos permite que os clientes que atingiram seus limites de conexão, consulta ou atualização por hora retomem a atividade imediatamente. `FLUSH USER_RESOURCES` não se aplica ao limite de conexões simultâneas máximas controlado pela variável de sistema `max_user_connections`. Consulte Seção 6.2.16, “Definindo Limites de Recursos da Conta”.

##### Sintaxe de FLUSH TABLES

`FLUSH TABLES` esvazia as tabelas e, dependendo da variante usada, adquire travamentos. Qualquer variante `TABLES` usada em uma declaração `FLUSH` (flush.html) deve ser a única opção usada. `FLUSH TABLE` é um sinônimo de `FLUSH TABLES`.

Nota

As descrições aqui que indicam que as tabelas são limpas ao serem fechadas se aplicam de maneira diferente ao `InnoDB`, que limpa o conteúdo da tabela para o disco, mas a deixa aberta. Isso ainda permite que os arquivos das tabelas sejam copiados enquanto as tabelas estiverem abertas, desde que nenhuma outra atividade as modifique.

- `FLUSH TABLES`

  Fecha todas as tabelas abertas, obriga todas as tabelas em uso a serem fechadas e descarrega o cache de consultas e o cache de declarações preparadas. `FLUSH TABLES` também remove todos os resultados das consultas do cache de consultas, como a declaração `RESET QUERY CACHE`. Para obter informações sobre o cache de consultas e o cache de declarações preparadas, consulte Seção 8.10.3, “O Cache de Consultas MySQL” e Seção 8.10.4, “Cache de Declarações Preparadas e Programas Armazenados”.

  `FLUSH TABLES` não é permitido quando há um `LOCK TABLES ... READ` ativo. Para esvaziar e bloquear tabelas, use \[`FLUSH TABLES tbl_name ... WITH READ LOCK`]\(flush.html#flush-tables-with-read-lock-with-list] em vez disso.

- `FLUSH TABLES tbl_name [, tbl_name] ...`

  Com uma lista de um ou mais nomes de tabelas separados por vírgula, essa operação é semelhante a `FLUSH TABLES` sem nomes, exceto que o servidor descarta apenas as tabelas nomeadas. Se uma tabela nomeada não existir, não ocorrerá nenhum erro.

- `FLUSH TABLES WITH READ LOCK`

  Fecha todas as tabelas abertas e bloqueia todas as tabelas para todos os bancos de dados com um bloqueio de leitura global.

  Essa operação é uma maneira muito conveniente de fazer backups se você tiver um sistema de arquivos como o Veritas ou ZFS que possa fazer instantâneos no tempo. Use `UNLOCK TABLES` para liberar o bloqueio.

  `FLUSH TABLES WITH READ LOCK` obtém uma bloqueadora de leitura global, em vez de bloqueadoras de tabela, portanto, não está sujeita ao mesmo comportamento que `LOCK TABLES` e `UNLOCK TABLES` em relação ao bloqueio de tabelas e aos commits implícitos:

  - `DESBLOQUEIE TABELAS` compromete implicitamente qualquer transação ativa apenas se quaisquer tabelas estiverem atualmente bloqueadas com `LOCK TABLES`. O compromisso não ocorre para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK`, porque a última instrução não obtém bloqueios de tabelas.

  - Iniciar uma transação faz com que as bloqueadas de tabela adquiridas com `LOCK TABLES` sejam liberadas, como se você tivesse executado `UNLOCK TABLES`. Iniciar uma transação não libera uma bloqueadora de leitura global adquirida com `FLUSH TABLES WITH READ LOCK`.

  Antes do MySQL 5.7.19, `FLUSH TABLES WITH READ LOCK` não é compatível com transações XA.

  `FLUSH TABLES WITH READ LOCK` não impede que o servidor insira linhas nas tabelas de log (consulte Seção 5.4.1, “Selecionando destinos de saída do log de consultas gerais e do log de consultas lentas”).

- `FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`

  Limpa e adquire bloqueios de leitura para as tabelas nomeadas.

  Como essa operação obtém bloqueios de tabela, ela requer o privilégio `LOCK TABLES` para cada tabela, além do privilégio `RELOAD`.

  A operação primeiro obtém bloqueios de metadados exclusivos para as tabelas, então ela aguarda por transações que tenham essas tabelas abertas para serem concluídas. Em seguida, a operação descarrega as tabelas do cache de tabelas, reabre as tabelas, obtém bloqueios de tabela (como `LOCK TABLES ... READ`), e desvaloriza os bloqueios de metadados de exclusivos para compartilhados. Após a operação obter os bloqueios e desvalorizar os bloqueios de metadados, outras sessões podem ler, mas não modificar as tabelas.

  Esta operação só se aplica a tabelas de base existentes (não `TEMPORARY`). Se um nome se refere a uma tabela de base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visualização, ocorre um erro `[ER_WRONG_OBJECT]` (/doc/mysql-errors/5.7/en/server-error-reference.html#error\_er\_wrong\_object). Caso contrário, ocorre um erro `[ER_NO_SUCH_TABLE]` (/doc/mysql-errors/5.7/en/server-error-reference.html#error\_er\_no\_such\_table).

  Use `UNLOCK TABLES` para liberar as bloqueadas, `LOCK TABLES` para liberar as bloqueadas e adquirir outras bloqueadas, ou `START TRANSACTION` para liberar as bloqueadas e iniciar uma nova transação.

  Esta variante de `FLUSH TABLES` permite que as tabelas sejam esvaziadas e bloqueadas em uma única operação. Ela oferece uma solução para a restrição de que o `FLUSH TABLES` não é permitido quando há um `LOCK TABLES ... READ` ativo.

  Esta operação não executa uma `UNLOCK TABLES` implícita, portanto, um erro ocorre se você executar a operação enquanto houver alguma `LOCK TABLES` ativa ou se usá-la novamente sem liberar primeiro as chaves adquiridas.

  Se uma tabela limpa foi aberta com `HANDLER`, o manipulador é limpo implicitamente e perde sua posição.

- `FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`

  Esta variante de `FLUSH TABLES` se aplica a tabelas `InnoDB`. Ela garante que as alterações nas tabelas nomeadas tenham sido descarregadas no disco, para que cópias binárias das tabelas possam ser feitas enquanto o servidor estiver em execução.

  Como a operação `FLUSH TABLES ... FOR EXPORT` adquire travamentos nas tabelas em preparação para a exportação, ela requer os privilégios \[`LOCK TABLES`]\(privileges-provided.html#priv\_lock-tables] e \[`SELECT`]\(privileges-provided.html#priv\_select] para cada tabela, além do privilégio \[`RELOAD`]\(privileges-provided.html#priv\_reload].

  A operação funciona da seguinte maneira:

  1. Ele adquire bloqueios de metadados compartilhados para as tabelas nomeadas. A operação é bloqueada enquanto outras sessões tiverem transações ativas que tenham modificado essas tabelas ou mantido bloqueios de tabela para elas. Quando os bloqueios são adquiridos, a operação bloqueia as transações que tentam atualizar as tabelas, permitindo que as operações de leitura apenas continuem.

  2. Ele verifica se todos os motores de armazenamento das tabelas suportam `FOR EXPORT`. Se algum não o fizer, uma mensagem de erro `ER_ILLEGAL_HA` será exibida e a operação falhará.

  3. A operação notifica o mecanismo de armazenamento de cada tabela para que ela esteja pronta para exportação. O mecanismo de armazenamento deve garantir que quaisquer alterações pendentes sejam escritas no disco.

  4. A operação coloca a sessão no modo de bloqueio de tabelas, para que as bloqueadas de metadados adquiridas anteriormente não sejam liberadas quando a operação `FOR EXPORT` for concluída.

  Esta operação só se aplica a tabelas de base existentes (não `TEMPORARY`). Se um nome se refere a uma tabela de base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visualização, ocorre um erro `[ER_WRONG_OBJECT]` (/doc/mysql-errors/5.7/en/server-error-reference.html#error\_er\_wrong\_object). Caso contrário, ocorre um erro `[ER_NO_SUCH_TABLE]` (/doc/mysql-errors/5.7/en/server-error-reference.html#error\_er\_no\_such\_table).

  O `InnoDB` suporta `FOR EXPORT` para tabelas que possuem seu próprio arquivo `.ibd` (ou seja, tabelas criadas com a configuração `innodb_file_per_table` habilitada). O `InnoDB` garante que, quando notificado pela operação `FOR EXPORT`, quaisquer alterações sejam descarregadas no disco. Isso permite que uma cópia binária do conteúdo da tabela seja feita enquanto a operação `FOR EXPORT` estiver em vigor, porque o arquivo `.ibd` é consistente com as transações e pode ser copiado enquanto o servidor estiver em execução. O `FOR EXPORT` não se aplica aos arquivos de espaço de tabela do `InnoDB` ou às tabelas `InnoDB` que possuem índices `FULLTEXT`.

  A opção `FLUSH TABLES ...FOR EXPORT` é suportada para tabelas `InnoDB` particionadas.

  Quando notificado por `PARA EXPORTAÇÃO`, o `InnoDB` grava no disco certos tipos de dados que normalmente são mantidos na memória ou em buffers de disco separados fora dos arquivos do espaço de tabela. Para cada tabela, o `InnoDB` também produz um arquivo chamado `nome_tabela.cfg` no mesmo diretório do banco de dados da tabela. O arquivo `.cfg` contém metadados necessários para reimportar os arquivos do espaço de tabela mais tarde, no mesmo ou em um servidor diferente.

  Quando a operação `PARA EXPORTAÇÃO` for concluída, o `InnoDB` limpou todas as páginas sujas para os arquivos de dados da tabela. As entradas do buffer de alterações são mescladas antes da limpeza. Neste ponto, as tabelas estão bloqueadas e em repouso: As tabelas estão em um estado consistente em transação no disco e você pode copiar os arquivos do espaço de tabelas `.ibd`, juntamente com os arquivos `.cfg` correspondentes, para obter uma instantânea consistente dessas tabelas.

  Para o procedimento de reimportação dos dados da tabela copiada em uma instância MySQL, consulte Seção 14.6.1.3, “Importação de Tabelas InnoDB”.

  Depois de terminar com as tabelas, use `UNLOCK TABLES` para liberar as bloqueadas, `LOCK TABLES` para liberar as bloqueadas e adquirir outras bloqueadas, ou `START TRANSACTION` para liberar as bloqueadas e iniciar uma nova transação.

  Enquanto qualquer uma dessas declarações estiver em vigor durante a sessão, as tentativas de usar `FLUSH TABLES ... FOR EXPORT` geram um erro:

  ```sql
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

  Enquanto `FLUSH TABLES ... FOR EXPORT` estiver em vigor na sessão, as tentativas de usar qualquer uma dessas instruções produzirão um erro:

  ```sql
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```

#### 15.7.8.3 Declaração FLUSH

```
FLUSH [NO_WRITE_TO_BINLOG | LOCAL] {
    flush_option [, flush_option] ...
  | tables_option
}

flush_option: {
    BINARY LOGS
  | ENGINE LOGS
  | ERROR LOGS
  | GENERAL LOGS
  | HOSTS
  | LOGS
  | PRIVILEGES
  | OPTIMIZER_COSTS
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

A declaração `FLUSH` tem várias formas variantes que limpam ou reinicializam vários caches internos, esvaziam tabelas ou obtêm bloqueios. Cada operação `FLUSH` requer os privilégios indicados em sua descrição.

Nota

Não é possível emitir declarações `FLUSH` dentro de funções armazenadas ou gatilhos. No entanto, você pode usar `FLUSH` em procedimentos armazenados, desde que esses não sejam chamados a partir de funções ou gatilhos armazenados. Veja a Seção 27.8, “Restrições em Programas Armazenados”.

Por padrão, o servidor escreve as instruções `FLUSH` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

Nota

`FLUSH LOGS`, `FLUSH BINARY LOGS`, `FLUSH TABLES WITH READ LOCK` (com ou sem uma lista de tabelas) e `FLUSH TABLES tbl_name ... FOR EXPORT` não são escritos no log binário em nenhum caso, pois causariam problemas se replicados para uma réplica.

A declaração `FLUSH` causa um commit implícito. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

A ferramenta **mysqladmin** fornece uma interface de linha de comando para algumas operações de limpeza, usando comandos como `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status` e `flush-tables`. Veja a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Enviar um sinal `SIGHUP` ou `SIGUSR1` para o servidor faz com que várias operações de varredura ocorram, que são semelhantes a várias formas da instrução `FLUSH`. Os sinais podem ser enviados pela conta de sistema `root` ou pela conta de sistema que possui o processo do servidor. Isso permite que as operações de varredura sejam realizadas sem precisar se conectar ao servidor, o que requer uma conta MySQL que tenha privilégios suficientes para essas operações. Veja a Seção 6.10, “Tratamento de Sinais Unix no MySQL”.

A declaração `RESET` é semelhante à `FLUSH`. Consulte a Seção 15.7.8.6, “Declaração RESET”, para obter informações sobre o uso de `RESET` com replicação.

A lista a seguir descreve os valores permitidos da declaração `FLUSH` `flush_option`. Para descrições dos valores permitidos de `tables_option`, consulte a sintaxe FLUSH TABLES.

- `FLUSH BINARY LOGS`

  Fecha e reabre qualquer arquivo de registro binário para o qual o servidor está escrevendo. Se o registro binário estiver habilitado, o número de sequência do arquivo de registro binário é incrementado em um em relação ao arquivo anterior.

  Esta operação requer o privilégio `RELOAD`.

- `FLUSH ENGINE LOGS`

  Fecha e reabre quaisquer registros descartáveis para os motores de armazenamento instalados. Isso faz com que o `InnoDB` descarte seus logs no disco.

  Esta operação requer o privilégio `RELOAD`.

- `FLUSH ERROR LOGS`

  Fecha e reabre qualquer arquivo de registro de erros para o qual o servidor está escrevendo.

  Esta operação requer o privilégio `RELOAD`.

- `FLUSH GENERAL LOGS`

  Fecha e reabre qualquer arquivo de registro de consulta geral para o qual o servidor está escrevendo.

  Esta operação requer o privilégio `RELOAD`.

  Esta operação não afeta as tabelas usadas para o log de consulta geral (consulte a Seção 7.4.1, “Selecionando destinos de saída do log de consulta geral e do log de consultas lentas”).

- `FLUSH HOSTS`

  Esvazia o cache do host e a tabela do Schema de Desempenho `host_cache` que exibe o conteúdo do cache e desbloqueia quaisquer hosts bloqueados.

  Esta operação requer o privilégio `RELOAD`.

  Para obter informações sobre por que o esvaziamento do cache do host pode ser aconselhável ou desejável, consulte a Seção 7.1.12.3, “Consultas DNS e o Cache do Host”.

  Nota

  `FLUSH HOSTS` é desaconselhável a partir do MySQL 8.0.23; espere-se que ele seja removido em uma futura versão do MySQL. Em vez disso, truncate a tabela do Schema de Desempenho `host_cache`:

  ```
  TRUNCATE TABLE performance_schema.host_cache;
  ```

  A operação `TRUNCATE TABLE` requer o privilégio `DROP` para a tabela, em vez do privilégio `RELOAD`. Você deve estar ciente de que a instrução `TRUNCATE TABLE` não é escrita no log binário. Para obter o mesmo comportamento de `FLUSH HOSTS`, especifique `NO_WRITE_TO_BINLOG` ou `LOCAL` como parte da instrução.

- `FLUSH LOGS`

  Fecha e reabre qualquer arquivo de registro para o qual o servidor está escrevendo.

  Esta operação requer o privilégio `RELOAD`.

  O efeito dessa operação é equivalente aos efeitos combinados dessas operações:

  ```
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

- `FLUSH OPTIMIZER_COSTS`

  Re-leia as tabelas do modelo de custo para que o otimizador comece a usar as estimativas de custo atuais armazenadas nelas.

  Esta operação requer o privilégio `FLUSH_OPTIMIZER_COSTS` ou `RELOAD`.

  O servidor escreve uma mensagem de alerta no log de erros para quaisquer entradas de tabelas de modelo de custo não reconhecidas. Para obter informações sobre essas tabelas, consulte a Seção 10.9.5, “O Modelo de Custo do Otimizador”. Esta operação afeta apenas as sessões que começam após o esvaziamento. As sessões existentes continuam a usar as estimativas de custo que estavam em vigor quando começaram.

- `FLUSH PRIVILEGES`

  Releia os privilégios das tabelas de concessão no esquema do sistema `mysql`. Como parte dessa operação, o servidor lê a tabela `global_grants`, que contém atribuições de privilégios dinâmicas, e registra quaisquer privilégios não registrados encontrados lá.

  A recarga das tabelas de concessão é necessária para permitir atualizações dos privilégios e usuários do MySQL apenas se você fizer tais alterações diretamente nas tabelas de concessão; não é necessário para declarações de gerenciamento de contas como `GRANT` ou `REVOKE`, que entram em vigor imediatamente. Consulte a Seção 8.2.13, “Quando as Alterações de Privilégio Entram em Vigor”, para obter mais informações.

  Esta operação requer o privilégio `RELOAD`.

  Se a opção `--skip-grant-tables` foi especificada na inicialização do servidor para desabilitar o sistema de privilégios do MySQL, o `FLUSH PRIVILEGES` oferece uma maneira de habilitar o sistema de privilégios no tempo de execução.

  Redefine o rastreamento de logins falhos (ou a habilita se o servidor foi iniciado com `--skip-grant-tables`) e desbloqueia quaisquer contas temporariamente bloqueadas. Consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

  Libera a memória cacheada pelo servidor como resultado das instruções `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelas instruções correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias das instruções que causam o cache, há um aumento no uso da memória cacheada, a menos que seja liberada com `FLUSH PRIVILEGES`.

  Limpa o cache de memória usado pelo plugin de autenticação `caching_sha2_password`. Consulte Operação de Cache para Autenticação Conectada a SHA-2.

- `FLUSH RELAY LOGS [FOR CHANNEL channel]`

  Fecha e reabre qualquer arquivo de registro de retransmissão para o qual o servidor está escrevendo. Se o registro de retransmissão estiver habilitado, o número de sequência do arquivo de registro de retransmissão é incrementado em um em relação ao arquivo anterior.

  Esta operação requer o privilégio `RELOAD`.

  A cláusula `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a operação se aplica. Execute `FLUSH RELAY LOGS FOR CHANNEL channel` para limpar o log de retransmissão para um canal de replicação específico. Se nenhum canal estiver nomeado e não houver canais de replicação extras, a operação se aplica ao canal padrão. Se nenhum canal estiver nomeado e houver vários canais de replicação, a operação se aplica a todos os canais de replicação. Para mais informações, consulte a Seção 19.2.2, “Canais de Replicação”.

- `FLUSH SLOW LOGS`

  Fecha e reabre qualquer arquivo de registro de consulta lenta para o qual o servidor está escrevendo.

  Esta operação requer o privilégio `RELOAD`.

  Esta operação não afeta as tabelas usadas para o registro de consultas lentas (consulte a Seção 7.4.1, “Selecionando destinos de saída do registro de consultas gerais e do registro de consultas lentas”).

- `FLUSH STATUS`

  Limpa os indicadores de status.

  Essa operação adiciona os valores das variáveis de status de sessão da thread atual aos valores globais e redefere os valores de sessão para zero. Algumas variáveis globais também podem ser redefinidas para zero. Ela também redefere os contadores para caches de chaves (padrão e nomeados) para zero e define `Max_used_connections` para o número atual de conexões abertas. Esta informação pode ser útil ao depurar uma consulta. Veja a Seção 1.5, “Como Relatar Bugs ou Problemas”.

  `FLUSH STATUS` não é afetado por `read_only` ou `super_read_only` e é sempre escrito no log binário.

  Esta operação requer o privilégio `FLUSH_STATUS` ou `RELOAD`.

- `FLUSH USER_RESOURCES`

  Redefine todos os indicadores de recursos do usuário por hora para zero.

  Esta operação requer o privilégio `FLUSH_USER_RESOURCES` ou `RELOAD`.

  A redefinição dos indicadores de recursos permite que clientes que atingiram seus limites de conexão, consulta ou atualização por hora retomem a atividade imediatamente. `FLUSH USER_RESOURCES` não se aplica ao limite de conexões simultâneas máximas, que é controlado pela variável de sistema `max_user_connections`. Consulte a Seção 8.2.21, “Definindo Limites de Recursos da Conta”.

##### Sintaxe de FLUSH TABLES

`FLUSH TABLES` esvazia tabelas e, dependendo da variante usada, adquire bloqueios. Qualquer variante `TABLES` usada em uma declaração `FLUSH` deve ser a única opção usada. `FLUSH TABLE` é sinônimo de `FLUSH TABLES`.

Nota

As descrições aqui que indicam que as tabelas são limpas ao serem fechadas se aplicam de maneira diferente para `InnoDB`, que limpa o conteúdo da tabela no disco, mas a deixa aberta. Isso ainda permite que os arquivos de tabela sejam copiados enquanto as tabelas estiverem abertas, desde que nenhuma outra atividade as modifique.

- `FLUSH TABLES`

  Fecha todas as tabelas abertas, obriga todas as tabelas em uso a serem fechadas e esvazia o cache de declarações preparadas.

  Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`.

  Para obter informações sobre o cache de declarações preparadas, consulte a Seção 10.10.3, “Cache de declarações preparadas e programas armazenados”.

  `FLUSH TABLES` não é permitido quando há um `LOCK TABLES ... READ` ativo. Para esvaziar e bloquear tabelas, use `FLUSH TABLES tbl_name ... WITH READ LOCK` em vez disso.

- `FLUSH TABLES tbl_name [, tbl_name] ...`

  Com uma lista de um ou mais nomes de tabelas separados por vírgula, essa operação é semelhante a `FLUSH TABLES` sem nomes, exceto que o servidor descarta apenas as tabelas nomeadas. Se uma tabela nomeada não existir, não ocorrerá nenhum erro.

  Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`.

- `FLUSH TABLES WITH READ LOCK`

  Fecha todas as tabelas abertas e bloqueia todas as tabelas para todos os bancos de dados com um bloqueio de leitura global.

  Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`.

  Essa operação é uma maneira muito conveniente de fazer backups se você tiver um sistema de arquivos como Veritas ou ZFS que possa fazer instantâneos no tempo. Use `UNLOCK TABLES` para liberar o bloqueio.

  `FLUSH TABLES WITH READ LOCK` adquire um bloqueio de leitura global em vez de bloqueios de tabela, portanto, não está sujeito ao mesmo comportamento que `LOCK TABLES` e `UNLOCK TABLES` em relação ao bloqueio de tabelas e aos commits implícitos:

  - `UNLOCK TABLES` compromete implicitamente qualquer transação ativa apenas se quaisquer tabelas estiverem atualmente bloqueadas com `LOCK TABLES`. O compromisso não ocorre para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK`, porque a última declaração não adquire bloqueios de tabelas.

  - Iniciar uma transação faz com que os bloqueios de tabela adquiridos com `LOCK TABLES` sejam liberados, como se você tivesse executado `UNLOCK TABLES`. Iniciar uma transação não libera um bloqueio de leitura global adquirido com `FLUSH TABLES WITH READ LOCK`.

  `FLUSH TABLES WITH READ LOCK` não impede que o servidor insira linhas nas tabelas de log (consulte a Seção 7.4.1, “Selecionando destinos de saída do log de consulta geral e do log de consulta lenta”).

- `FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`

  Limpa e adquire bloqueios de leitura para as tabelas nomeadas.

  Essa operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`. Como ela obtém bloqueios de tabela, também requer o privilégio `LOCK TABLES` para cada tabela.

  A operação primeiro adquire bloqueios de metadados exclusivos para as tabelas, então ela aguarda por transações que tenham essas tabelas abertas para serem concluídas. Em seguida, a operação descarrega as tabelas do cache de tabelas, reabre as tabelas, adquire bloqueios de tabela (como `LOCK TABLES ... READ`) e desvaloriza os bloqueios de metadados de exclusivos para compartilhados. Após a operação adquirir os bloqueios e desvalorizar os bloqueios de metadados, outras sessões podem ler, mas não modificar as tabelas.

  Esta operação só se aplica a tabelas de base existentes (não `TEMPORARY)`). Se um nome se refere a uma tabela de base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visualização, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

  Use `UNLOCK TABLES` para liberar as trancas, `LOCK TABLES` para liberar as trancas e adquirir outras trancas, ou `START TRANSACTION` para liberar as trancas e iniciar uma nova transação.

  Esta variante `FLUSH TABLES` permite que as tabelas sejam esvaziadas e bloqueadas em uma única operação. Ela oferece uma solução para a restrição de que `FLUSH TABLES` não é permitido quando há um `LOCK TABLES ... READ` ativo.

  Esta operação não executa um `UNLOCK TABLES` implícito, portanto, um erro ocorre se você executar a operação enquanto houver algum `LOCK TABLES` ativo ou usá-lo novamente sem liberar primeiro as chaves adquiridas.

  Se uma tabela limpa fosse aberta com `HANDLER`, o manipulador seria implicitamente limpo e perderia sua posição.

- `FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`

  Esta variante `FLUSH TABLES` se aplica a tabelas `InnoDB`. Ela garante que as alterações nas tabelas nomeadas foram descarregadas no disco, para que cópias binárias das tabelas possam ser feitas enquanto o servidor estiver em execução.

  Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`. Como ela obtém bloqueios nas tabelas em preparação para a exportação, também requer os privilégios `LOCK TABLES` e `SELECT` para cada tabela.

  A operação funciona da seguinte maneira:

  1. Ele adquire bloqueios de metadados compartilhados para as tabelas nomeadas. A operação é bloqueada enquanto outras sessões tiverem transações ativas que tenham modificado essas tabelas ou mantido bloqueios de tabela para elas. Quando os bloqueios são adquiridos, a operação bloqueia as transações que tentam atualizar as tabelas, permitindo que as operações de leitura apenas continuem.

  2. Ele verifica se todos os motores de armazenamento das tabelas suportam `FOR EXPORT`. Se algum não o fizer, ocorre um erro `ER_ILLEGAL_HA` e a operação falha.

  3. A operação notifica o mecanismo de armazenamento de cada tabela para que ela esteja pronta para exportação. O mecanismo de armazenamento deve garantir que quaisquer alterações pendentes sejam escritas no disco.

  4. A operação coloca a sessão no modo de bloqueio de tabelas, para que as bloqueadas de metadados adquiridas anteriormente não sejam liberadas quando a operação `FOR EXPORT` for concluída.

  Esta operação só se aplica a tabelas de base existentes (não `TEMPORARY`). Se um nome se refere a uma tabela de base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visualização, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

  `InnoDB` suporta `FOR EXPORT` para tabelas que têm seu próprio arquivo `.ibd` (ou seja, tabelas criadas com a configuração `innodb_file_per_table` habilitada). `InnoDB` garante que, quando notificado pela operação `FOR EXPORT`, quaisquer alterações sejam descarregadas no disco. Isso permite que uma cópia binária do conteúdo da tabela seja feita enquanto a operação `FOR EXPORT` estiver em vigor, porque o arquivo `.ibd` é consistente com a transação e pode ser copiado enquanto o servidor estiver em execução. `FOR EXPORT` não se aplica a arquivos de espaço de sistema de tabelas do sistema `InnoDB` ou a tabelas `InnoDB` que têm índices `FULLTEXT`.

  O `FLUSH TABLES ...FOR EXPORT` é suportado para tabelas `InnoDB` particionadas.

  Quando notificado por `FOR EXPORT`, `InnoDB` escreve no disco certos tipos de dados que normalmente são mantidos na memória ou em buffers de disco separados fora dos arquivos do espaço de tabelas. Para cada tabela, `InnoDB` também produz um arquivo chamado `table_name.cfg` no mesmo diretório do banco de dados da tabela. O arquivo `.cfg` contém metadados necessários para reimportar os arquivos do espaço de tabelas mais tarde, no mesmo ou em um servidor diferente.

  Quando a operação `FOR EXPORT` for concluída, o `InnoDB` terá descartado todas as páginas sujas dos arquivos de dados da tabela. As entradas do buffer de alterações serão mescladas antes do descarte. Neste ponto, as tabelas estão bloqueadas e em repouso: As tabelas estão em um estado consistente em transação no disco e você pode copiar os arquivos do espaço de tabelas `.ibd` juntamente com os arquivos correspondentes `.cfg` para obter uma instantânea consistente dessas tabelas.

  Para o procedimento de reimportação dos dados da tabela copiada para uma instância do MySQL, consulte a Seção 17.6.1.3, “Importação de Tabelas InnoDB”.

  Depois de terminar com as tabelas, use `UNLOCK TABLES` para liberar as trancas, `LOCK TABLES` para liberar as trancas e adquirir outras trancas, ou `START TRANSACTION` para liberar as trancas e iniciar uma nova transação.

  Enquanto qualquer uma dessas declarações estiver em vigor durante a sessão, as tentativas de usar `FLUSH TABLES ... FOR EXPORT` produzem um erro:

  ```
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

  Enquanto `FLUSH TABLES ... FOR EXPORT` estiver em vigor durante a sessão, as tentativas de usar qualquer uma dessas declarações produzirão um erro:

  ```
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```

#### 15.7.8.3 Instrução `FLUSH`

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

A instrução `FLUSH` possui várias formas variantes que limpam ou reinicializam vários caches internos, limpam tabelas ou adquirem bloqueios. Cada operação `FLUSH` requer os privilégios indicados em sua descrição.

Nota

Não é possível emitir instruções `FLUSH` dentro de funções armazenadas ou gatilhos. No entanto, você pode usar `FLUSH` em procedimentos armazenados, desde que não sejam chamados a partir de funções armazenadas ou gatilhos. Consulte a Seção 27.10, “Restrições em Programas Armazenados”.

Por padrão, o servidor escreve instruções `FLUSH` no log binário para que sejam replicadas para réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

Nota

`FLUSH LOGS`, `FLUSH BINARY LOGS`, `FLUSH TABLES WITH READ LOCK` (com ou sem uma lista de tabelas) e `FLUSH TABLES tbl_name ... FOR EXPORT` não são escritos no log binário em nenhum caso, pois causariam problemas se fossem replicados para uma réplica.

A instrução `FLUSH` causa um commit implícito. Consulte a Seção 15.3.3, “Instruções que Causam um Commit Implícito”.

A **utilização mysqladmin** fornece uma interface de linha de comando para algumas operações de limpeza, usando comandos como `flush-logs`, `flush-privileges`, `flush-status` e `flush-tables`. Consulte a Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL”.

Enviar um sinal `SIGHUP` ou `SIGUSR1` para o servidor faz com que várias operações de varredura ocorram, que são semelhantes a várias formas da instrução `FLUSH`. Sinais podem ser enviados pela conta de sistema `root` ou pela conta de sistema que possui o processo do servidor. Isso permite que as operações de varredura sejam realizadas sem precisar se conectar ao servidor, o que requer uma conta MySQL que tenha privilégios suficientes para essas operações. Veja a Seção 6.10, “Manipulação de Sinais Unix no MySQL”.

A instrução `RESET` é semelhante a `FLUSH`. Veja a Seção 15.7.8.6, “Instrução RESET”, para informações sobre o uso de `RESET` com replicação.

A lista a seguir descreve os valores permitidos da instrução `FLUSH` *`flush_option`*. Para descrições dos valores permitidos de *`tables_option`*, veja a Sintaxe de FLUSH TABLES.

* `FLUSH BINARY LOGS`

  Fecha e reabre qualquer arquivo de log binário para o qual o servidor está escrevendo. Se o registro binário estiver habilitado, o número de sequência do arquivo de log binário é incrementado em um em relação ao arquivo anterior.

  Esta operação requer o privilégio `RELOAD`.

* `FLUSH ENGINE LOGS`

  Fecha e reabre quaisquer logs que podem ser varridos para os motores de armazenamento instalados. Isso faz com que o `InnoDB` varra seus logs para o disco.

  Esta operação requer o privilégio `RELOAD`.

* `FLUSH ERROR LOGS`

  Fecha e reabre qualquer arquivo de log de erro para o qual o servidor está escrevendo.

  Esta operação requer o privilégio `RELOAD`.

* `FLUSH GENERAL LOGS`

  Fecha e reabre qualquer arquivo de log de consulta geral para o qual o servidor está escrevendo.

  Esta operação requer o privilégio `RELOAD`.

  Esta operação não tem efeito em tabelas usadas para o log de consulta geral (veja a Seção 7.4.1, “Selecionando Destinos de Saída de Log de Consulta Geral e Log de Consulta Lenta”).

* `FLUSH LOGS`

Fecha e reabre qualquer arquivo de registro para o qual o servidor está escrevendo.

Esta operação requer o privilégio `RELOAD`.

O efeito desta operação é equivalente aos efeitos combinados das seguintes operações:

```
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

* `FLUSH OPTIMIZER_COSTS`

Re lê as tabelas do modelo de custo para que o otimizador comece a usar as estimativas de custo atuais armazenadas nelas.

Esta operação requer o privilégio `FLUSH_OPTIMIZER_COSTS` ou `RELOAD`.

O servidor escreve uma mensagem de aviso no log de erro para quaisquer entradas de tabelas de modelo de custo não reconhecidas. Para obter informações sobre essas tabelas, consulte a Seção 10.9.5, “O Modelo de Custo do Otimizador”. Esta operação afeta apenas as sessões que começam após o esvaziamento. As sessões existentes continuam a usar as estimativas de custo que estavam em vigor quando começaram.

* `FLUSH PRIVILEGES`

Observação

Esta declaração é desatualizada e dispara uma mensagem de desatualização quando usada; você deve esperar que `FLUSH PRIVILEGES` seja removida em uma versão futura do MySQL.

Re lê os privilégios das tabelas de concessão no esquema de sistema `mysql`. Como parte desta operação, o servidor lê a tabela `global_grants` contendo atribuições de privilégios dinâmicas e registra quaisquer privilégios não registrados encontrados lá.

Recarregar as tabelas de concessão é necessário para habilitar atualizações nos privilégios e usuários do MySQL apenas se você fizer tais alterações diretamente nas tabelas de concessão; não é necessário para declarações de gerenciamento de contas como `GRANT` ou `REVOKE`, que entram em vigor imediatamente. Consulte a Seção 8.2.13, “Quando as Alterações de Privilégios Entram em Vigor”, para obter mais informações.

Manipular as tabelas de concessão diretamente não é recomendado e deve ser considerado uma funcionalidade desatualizada. Em vez disso, use declarações de controle de acesso, como `CREATE USER`, `GRANT`, `REVOKE`, conforme descrito na Seção 8.2.8, “Adicionar Contas, Atribuir Privilegios e Remover Contas”.

Esta operação requer o privilégio `FLUSH_PRIVILEGES` (desatualizado) ou o privilégio `RELOAD`.

Se a opção `--skip-grant-tables` foi especificada na inicialização do servidor para desabilitar o sistema de privilégios do MySQL, o `FLUSH PRIVILEGES` fornece uma maneira de habilitar o sistema de privilégios em tempo de execução.

Redefine o rastreamento de logins falhos (ou o habilita se o servidor foi iniciado com `--skip-grant-tables`) e desbloqueia quaisquer contas temporariamente bloqueadas. Consulte a Seção 8.2.15, “Gestão de Senhas”.

Libera a memória cacheada pelo servidor como resultado das declarações `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelas declarações correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias das declarações que causam cacheamento, há um aumento no uso da memória cacheada, a menos que seja liberada com `FLUSH PRIVILEGES`.

Limpa o cache em memória usado pelo plugin de autenticação `caching_sha2_password`. Consulte Operação de Cache para Autenticação Pluggable SHA-2.

* `FLUSH RELAY LOGS [FOR CHANNEL channel]`

  Fecha e reabre qualquer arquivo de log de retransmissão para o qual o servidor está escrevendo. Se o registro de retransmissão estiver habilitado, o número de sequência do arquivo de log de retransmissão é incrementado em um em relação ao arquivo anterior.

Esta operação requer o privilégio `RELOAD`.

A cláusula `FOR CHANNEL` permite que você nomeie qual canal de replicação a operação se aplica. Execute `FLUSH RELAY LOGS FOR CHANNEL channel` para limpar o log de retransmissão para um canal de replicação específico. Se nenhum canal estiver nomeado e não houver canais de replicação extras, a operação se aplica ao canal padrão. Se nenhum canal estiver nomeado e houver vários canais de replicação, a operação se aplica a todos os canais de replicação. Para mais informações, consulte a Seção 19.2.2, “Canais de Replicação”.

* `FLUSH SLOW LOGS`

  Fecha e reabre qualquer arquivo de log de consulta lenta para o qual o servidor está escrevendo.

  Esta operação requer o privilégio `RELOAD`.

  Esta operação não tem efeito em tabelas usadas para o log de consulta lenta (consulte a Seção 7.4.1, “Selecionando destinos de saída do Log de Consultas Gerais e do Log de Consultas Lentas”).

* `FLUSH STATUS`

  Limpa os indicadores de status.

  Esta operação adiciona os valores das variáveis de status da sessão do thread atual aos valores globais e reinicia os valores da sessão para zero. Algumas variáveis globais também podem ser reinicializadas para zero. Também reinicia os contadores para caches de chaves (padrão e nomeados) para zero e define `Max_used_connections` para o número atual de conexões abertas. Esta informação pode ser útil ao depurar uma consulta. Consulte a Seção 1.6, “Como Relatar Bugs ou Problemas”.

  `FLUSH STATUS` não é afetado por `read_only` ou `super_read_only`, e é sempre escrito no log binário.

  Esta operação requer o privilégio `FLUSH_STATUS` ou `RELOAD`.

* `FLUSH USER_RESOURCES`

  Reinicia todos os indicadores de recursos do usuário por hora para zero.

  Esta operação requer o privilégio `FLUSH_USER_RESOURCES` ou `RELOAD`.

A reinicialização dos indicadores de recursos permite que clientes que atingiram seus limites de conexão, consulta ou atualização por hora retomem a atividade imediatamente. `FLUSH USER_RESOURCES` não se aplica ao limite de conexões simultâneas máximas, que é controlado pela variável de sistema `max_user_connections`. Veja a Seção 8.2.21, “Definindo Limites de Recursos da Conta”.

##### Sintaxe de FLUSH TABLES

`FLUSH TABLES` esvazia tabelas e, dependendo da variante usada, adquire bloqueios. Qualquer variante `TABLES` usada em uma instrução `FLUSH` deve ser a única opção usada. `FLUSH TABLE` é um sinônimo de `FLUSH TABLES`.

Observação

As descrições aqui que indicam que as tabelas são esvaziadas fechando-as se aplicam de maneira diferente para o `InnoDB`, que esvazia o conteúdo das tabelas para o disco, mas as deixa abertas. Isso ainda permite que os arquivos das tabelas sejam copiados enquanto as tabelas estão abertas, desde que nenhuma outra atividade as modifique.

* `FLUSH TABLES`

  Fecha todas as tabelas abertas, obriga todas as tabelas em uso a serem fechadas e esvazia o cache da instrução preparada.

  Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`.

  Para informações sobre o cache de instruções preparadas, consulte a Seção 10.10.3, “Cache de Instruções Preparadas e Programas Armazenados”.

  `FLUSH TABLES` não é permitido quando há uma `LOCK TABLES ... READ` ativa. Para esvaziar e bloquear tabelas, use `FLUSH TABLES tbl_name ... WITH READ LOCK` em vez disso.

* `FLUSH TABLES tbl_name [, tbl_name] ...`

  Com uma lista de um ou mais nomes de tabelas separados por vírgula, esta operação é como `FLUSH TABLES` sem nomes, exceto que o servidor esvazia apenas as tabelas nomeadas. Se uma tabela nomeada não existir, não ocorre nenhum erro.

  Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`.

* `FLUSH TABLES WITH READ LOCK`

Fecha todas as tabelas abertas e bloqueia todas as tabelas para todos os bancos de dados com um bloqueio de leitura global.

Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`.

Esta operação é uma maneira muito conveniente de obter backups se você tiver um sistema de arquivos como Veritas ou ZFS que pode fazer instantâneos no tempo. Use `UNLOCK TABLES` para liberar o bloqueio.

`FLUSH TABLES WITH READ LOCK` adquire um bloqueio de leitura global em vez de bloqueios de tabela, portanto, não está sujeito ao mesmo comportamento que `LOCK TABLES` e `UNLOCK TABLES` em relação ao bloqueio de tabelas e aos commits implícitos:

+ `UNLOCK TABLES` compromete implicitamente qualquer transação ativa apenas se houver tabelas atualmente bloqueadas com `LOCK TABLES`. O commit não ocorre para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK` porque esta declaração não adquire bloqueios de tabela.

+ Começar uma transação libera os bloqueios de tabela adquiridos com `LOCK TABLES`, como se você tivesse executado `UNLOCK TABLES`. Começar uma transação não libera um bloqueio de leitura global adquirido com `FLUSH TABLES WITH READ LOCK`.

`FLUSH TABLES WITH READ LOCK` não impede que o servidor insira linhas nas tabelas de log (veja a Seção 7.4.1, “Selecionando destinos de saída de log de consulta geral e log de consulta lenta”).

* `FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`

Limpa e adquire bloqueios de leitura para as tabelas nomeadas.

Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`. Como ela adquire bloqueios de tabela, também requer o privilégio `LOCK TABLES` para cada tabela.

A operação primeiro obtém bloqueios de metadados exclusivos para as tabelas, então aguarda por transações que tenham essas tabelas abertas para serem concluídas. Em seguida, a operação esvazia as tabelas do cache de tabelas, reabre as tabelas, obtém blocos de tabela (como `LOCK TABLES ... READ`) e desvaloriza os blocos de metadados de exclusivos para compartilhados. Após a operação obter os blocos e desvalorizar os blocos de metadados, outras sessões podem ler, mas não modificar as tabelas.

Esta operação se aplica apenas a tabelas de base existentes (não `TEMPORARY`). Se um nome se refere a uma tabela de base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visão, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

Use `UNLOCK TABLES` para liberar os blocos, `LOCK TABLES` para liberar os blocos e adquirir outros blocos, ou `START TRANSACTION` para liberar os blocos e iniciar uma nova transação.

Esta variante de `FLUSH TABLES` permite que as tabelas sejam esvaziadas e bloqueadas em uma única operação. Ela fornece uma solução para a restrição de que `FLUSH TABLES` não é permitido quando há uma `LOCK TABLES ... READ` ativa.

Esta operação não realiza um `UNLOCK TABLES` implícito, portanto, um erro ocorre se você executar a operação enquanto houver alguma `LOCK TABLES` ativa ou a usar novamente sem primeiro liberar os blocos adquiridos.

Se uma tabela esvaziada foi aberta com `HANDLER`, o manipulador é esvaziado implicitamente e perde sua posição.

* `FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`

Esta variante de `FLUSH TABLES` se aplica a tabelas `InnoDB`. Ela garante que as alterações nas tabelas nomeadas tenham sido esvaziadas para o disco, para que cópias binárias das tabelas possam ser feitas enquanto o servidor estiver em execução.

Esta operação requer o privilégio `FLUSH_TABLES` ou `RELOAD`. Como ela adquire bloqueios nas tabelas em preparação para exportá-las, também requer os privilégios `LOCK TABLES` e `SELECT` para cada tabela.

A operação funciona da seguinte forma:

1. Ela adquire bloqueios de metadados compartilhados para as tabelas nomeadas. A operação bloqueia enquanto outras sessões tiverem transações ativas que tenham modificado essas tabelas ou mantido bloqueios de tabela para elas. Quando os bloqueios são adquiridos, a operação bloqueia as transações que tentam atualizar as tabelas, permitindo que as operações de leitura apenas continuem.

2. Ela verifica se todos os motores de armazenamento das tabelas suportam `FOR EXPORT`. Se algum não o fizer, ocorre um erro `ER_ILLEGAL_HA` e a operação falha.

3. A operação notifica o motor de armazenamento de cada tabela para que a tabela esteja pronta para exportação. O motor de armazenamento deve garantir que quaisquer alterações pendentes sejam escritas no disco.

4. A operação coloca a sessão no modo lock-tables para que os bloqueios de metadados adquiridos anteriormente não sejam liberados quando a operação `FOR EXPORT` for concluída.

Esta operação se aplica apenas a tabelas base existentes (não `TEMPORARY`). Se um nome se refere a uma tabela base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visão, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

`InnoDB` suporta `FOR EXPORT` para tabelas que possuem seu próprio arquivo `.ibd` (ou seja, tabelas criadas com a configuração `innodb_file_per_table` habilitada). `InnoDB` garante que, ao ser notificado pela operação `FOR EXPORT`, quaisquer alterações tenham sido descarregadas no disco. Isso permite que uma cópia binária do conteúdo da tabela seja feita enquanto a operação `FOR EXPORT` estiver em vigor, porque o arquivo `.ibd` é consistente com as transações e pode ser copiado enquanto o servidor estiver em execução. `FOR EXPORT` não se aplica aos arquivos de espaço de tabela do sistema `InnoDB`, nem às tabelas `InnoDB` que possuem índices `FULLTEXT`.

`FLUSH TABLES ...FOR EXPORT` é suportado para tabelas `InnoDB` particionadas.

Quando notificado pela operação `FOR EXPORT`, `InnoDB` escreve no disco certos tipos de dados que normalmente são mantidos na memória ou em buffers de disco separados fora dos arquivos de espaço de tabela. Para cada tabela, `InnoDB` também produz um arquivo chamado `table_name.cfg` no mesmo diretório do banco de dados da tabela. O arquivo `.cfg` contém metadados necessários para reimportar os arquivos de espaço de tabela mais tarde, no mesmo ou em servidores diferentes.

Quando a operação `FOR EXPORT` for concluída, `InnoDB` descarregou todas as páginas sujas nos arquivos de dados da tabela. As entradas dos buffers de alterações são mescladas antes da descarregada. Neste ponto, as tabelas são bloqueadas e quiescentes: As tabelas estão em um estado consistentemente transacional no disco e você pode copiar os arquivos de espaço de tabela `.ibd` juntamente com os arquivos `.cfg` correspondentes para obter uma instantânea consistente dessas tabelas.

Para o procedimento de reimportar os dados da tabela copiada em uma instância do MySQL, consulte a Seção 17.6.1.3, “Importando Tabelas `InnoDB’”.

Depois de terminar com as tabelas, use `UNLOCK TABLES` para liberar as bloqueadas, `LOCK TABLES` para liberar as bloqueadas e adquirir outras bloqueadas, ou `START TRANSACTION` para liberar as bloqueadas e iniciar uma nova transação.

Enquanto qualquer uma dessas instruções estiver em vigor na sessão, as tentativas de usar `FLUSH TABLES ... FOR EXPORT` produzem um erro:

```
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

Enquanto `FLUSH TABLES ... FOR EXPORT` estiver em vigor na sessão, as tentativas de usar qualquer uma dessas instruções produzem um erro:

```
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```
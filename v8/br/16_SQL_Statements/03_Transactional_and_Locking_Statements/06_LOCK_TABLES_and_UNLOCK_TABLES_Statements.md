### 15.3.6 Declarações LOCK TABLES e UNLOCK TABLES

```
LOCK {TABLE | TABLES}
    tbl_name [[AS] alias] lock_type
    [, tbl_name [[AS] alias] lock_type] ...

lock_type: {
    READ [LOCAL]
  | [LOW_PRIORITY] WRITE
}

UNLOCK {TABLE | TABLES}
```

O MySQL permite que as sessões do cliente adquiram bloqueios de tabela explicitamente para cooperar com outras sessões no acesso às tabelas ou para impedir que outras sessões modifiquem as tabelas durante períodos em que uma sessão requer acesso exclusivo a elas. Uma sessão só pode adquirir ou liberar bloqueios para si mesma. Uma sessão não pode adquirir bloqueios para outra sessão ou liberar bloqueios mantidos por outra sessão.

As trancas podem ser usadas para emular transações ou para obter mais velocidade ao atualizar tabelas. Isso é explicado com mais detalhes em Restrições e condições de bloqueio de tabelas.

`LOCK TABLES` adquire explicitamente bloqueios de tabela para a sessão atual do cliente. Bloqueios de tabela podem ser adquiridos para tabelas base ou visualizações. Você deve ter o privilégio `LOCK TABLES` e o privilégio `SELECT` para cada objeto a ser bloqueado.

Para o bloqueio de visualização, `LOCK TABLES` adiciona todas as tabelas base usadas na visualização ao conjunto de tabelas a serem bloqueadas e as bloqueia automaticamente. Para tabelas que estão por trás de qualquer visualização sendo bloqueada, `LOCK TABLES` verifica se o definidor da visualização (para visualizações `SQL SECURITY DEFINER`) ou o invocador (para todas as visualizações) tem os privilégios adequados nas tabelas.

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, todas as tabelas usadas nos gatilhos também serão bloqueadas implicitamente, conforme descrito em LOCK TABLES e gatilhos.

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, todas as tabelas relacionadas por uma restrição de chave estrangeira são abertas e bloqueadas implicitamente. Para verificações de chave estrangeira, um bloqueio compartilhado de leitura apenas (`LOCK TABLES READ`) é tomado em tabelas relacionadas. Para atualizações em cascata, um bloqueio de escrita sem nada compartilhado (`LOCK TABLES WRITE`) é tomado em tabelas relacionadas que estão envolvidas na operação.

`UNLOCK TABLES` libera explicitamente quaisquer bloqueios de tabela mantidos pela sessão atual. `LOCK TABLES` libera implicitamente quaisquer bloqueios de tabela mantidos pela sessão atual antes de adquirir novos bloqueios.

Outro uso para `UNLOCK TABLES` é liberar o bloqueio de leitura global adquirido com a instrução `FLUSH TABLES WITH READ LOCK`, que permite bloquear todas as tabelas em todos os bancos de dados. Veja a Seção 15.7.8.3, “Instrução FLUSH”. (Essa é uma maneira muito conveniente de fazer backups se você tiver um sistema de arquivos como o Veritas que pode capturar instantâneos no tempo.)

`LOCK TABLE` é sinônimo de `LOCK TABLES`; `UNLOCK TABLE` é sinônimo de `UNLOCK TABLES`.

Um bloqueio de tabela protege apenas contra leituras ou escritas inadequadas por outras sessões. Uma sessão que mantém um bloqueio `WRITE` pode realizar operações de nível de tabela, como `DROP TABLE` ou `TRUNCATE TABLE`. Para sessões que mantêm um bloqueio `READ`, as operações `DROP TABLE` e `TRUNCATE TABLE` não são permitidas.

A discussão a seguir se aplica apenas a tabelas que não são `TEMPORARY`. `LOCK TABLES` é permitido (mas ignorado) para uma tabela `TEMPORARY`. A tabela pode ser acessada livremente pela sessão na qual foi criada, independentemente de qualquer outro bloqueio que possa estar em vigor. Nenhum bloqueio é necessário porque nenhuma outra sessão pode ver a tabela.

- Aquisição de bloqueio de mesa
- Liberação da trava da mesa
- Interação do bloqueio de tabela e transações
- LOCK TABLES e Triggers
- Restrições e condições de bloqueio de tabela

#### Aquisição de bloqueio de mesa

Para adquirir blocos de tabela dentro da sessão atual, use a instrução `LOCK TABLES`, que adquire blocos de metadados (consulte a Seção 10.11.4, “Bloqueio de Metadados”).

Os seguintes tipos de bloqueio estão disponíveis:

`READ [LOCAL]` bloqueio:

- A sessão que possui o bloqueio pode ler a tabela (mas não escrevê-la).

- Múltiplas sessões podem adquirir um bloqueio `READ` para a tabela ao mesmo tempo.

- Outras sessões podem ler a tabela sem adquirir explicitamente um bloqueio `READ`.

- O modificador `LOCAL` permite que instruções `INSERT` não conflitantes (inserções concorrentes) de outras sessões sejam executadas enquanto o bloqueio estiver sendo mantido. (Veja a Seção 10.11.3, “Inserções Concorrentes”.) No entanto, `READ LOCAL` não pode ser usado se você estiver manipulando o banco de dados usando processos externos ao servidor enquanto estiver segurando o bloqueio. Para tabelas `InnoDB`, `READ LOCAL` é o mesmo que `READ`.

`[LOW_PRIORITY] WRITE` bloqueio:

- A sessão que contém o bloqueio pode ler e escrever na tabela.

- Apenas a sessão que possui o bloqueio pode acessar a tabela. Nenhuma outra sessão pode acessá-la até que o bloqueio seja liberado.

- Pedidos de bloqueio da tabela por outras sessões são bloqueados enquanto o bloqueio `WRITE` estiver sendo mantido.

- O modificador `LOW_PRIORITY` não tem efeito. Em versões anteriores do MySQL, ele afetava o comportamento de bloqueio, mas isso não é mais verdade. Agora ele é desaconselhado e seu uso gera uma mensagem de aviso. Use `WRITE` sem `LOW_PRIORITY` em vez disso.

As bloqueadoras `WRITE` têm normalmente uma prioridade maior do que as bloqueadoras `READ`, para garantir que as atualizações sejam processadas o mais rápido possível. Isso significa que, se uma sessão obtém uma bloqueadora `READ` e, em seguida, outra sessão solicita uma bloqueadora `WRITE`, as solicitações subsequentes de bloqueadoras `READ` aguardam até que a sessão que solicitou a bloqueadora `WRITE` tenha obtido a bloqueadora e liberado. (Uma exceção a essa política pode ocorrer para valores pequenos da variável de sistema `max_write_lock_count`; consulte a Seção 10.11.4, “Bloqueio de Metadados”.)

Se a instrução `LOCK TABLES` precisar esperar devido a bloqueios mantidos por outras sessões em qualquer uma das tabelas, ela será bloqueada até que todos os bloqueios possam ser adquiridos.

Uma sessão que requer bloqueios deve adquirir todos os bloqueios necessários em uma única instrução `LOCK TABLES`. Enquanto os bloqueios assim obtidos estiverem sendo mantidos, a sessão só poderá acessar as tabelas bloqueadas. Por exemplo, na sequência de instruções a seguir, ocorre um erro para a tentativa de acessar `t2`, porque ele não foi bloqueado na instrução `LOCK TABLES`:

```
mysql> LOCK TABLES t1 READ;
mysql> SELECT COUNT(*) FROM t1;
+----------+
| COUNT(*) |
+----------+
|        3 |
+----------+
mysql> SELECT COUNT(*) FROM t2;
ERROR 1100 (HY000): Table 't2' was not locked with LOCK TABLES
```

As tabelas no banco de dados `INFORMATION_SCHEMA` são uma exceção. Elas podem ser acessadas sem serem explicitamente bloqueadas, mesmo quando uma sessão mantém bloqueios de tabela obtidos com `LOCK TABLES`.

Você não pode referenciar uma tabela bloqueada várias vezes em uma única consulta usando o mesmo nome. Use aliases (nomes alternativos) e obtenha um bloqueio separado para a tabela e cada alias:

```
mysql> LOCK TABLE t WRITE, t AS t1 READ;
mysql> INSERT INTO t SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> INSERT INTO t SELECT * FROM t AS t1;
```

O erro ocorre para o primeiro `INSERT` porque há duas referências ao mesmo nome para uma tabela bloqueada. O segundo `INSERT` é bem-sucedido porque as referências à tabela usam nomes diferentes.

Se suas declarações referirem-se a uma tabela por meio de um alias, você deve bloquear a tabela usando o mesmo alias. Não funciona bloquear a tabela sem especificar o alias:

```
mysql> LOCK TABLE t READ;
mysql> SELECT * FROM t AS myalias;
ERROR 1100: Table 'myalias' was not locked with LOCK TABLES
```

Por outro lado, se você bloquear uma tabela usando um alias, você deve referenciá-la em suas declarações usando esse alias:

```
mysql> LOCK TABLE t AS myalias READ;
mysql> SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> SELECT * FROM t AS myalias;
```

#### Liberação da trava da mesa

Quando as tabelas bloqueadas por uma sessão são liberadas, todas são liberadas ao mesmo tempo. Uma sessão pode liberar suas blocações explicitamente, ou as blocações podem ser liberadas implicitamente sob certas condições.

- Uma sessão pode liberar suas trancas explicitamente com `UNLOCK TABLES`.

- Se uma sessão emitir uma declaração `LOCK TABLES` para adquirir um bloqueio enquanto já estiver segurando bloqueados, seus bloqueados existentes são liberados implicitamente antes que os novos bloqueados sejam concedidos.

- Se uma sessão iniciar uma transação (por exemplo, com `START TRANSACTION`), uma `UNLOCK TABLES` implícita é realizada, o que faz com que os bloqueios existentes sejam liberados. (Para informações adicionais sobre a interação entre o bloqueio de tabelas e transações, consulte Interação entre o Bloqueio de Tabelas e Transações.)

Se a conexão para uma sessão de cliente for encerrada, seja de forma normal ou anormal, o servidor implicitamente libera todos os bloqueios de tabela mantidos pela sessão (transacionais e não transacionais). Se o cliente se reconectar, os bloqueios deixam de estar em vigor. Além disso, se o cliente tivesse uma transação ativa, o servidor reverte a transação após a desconexão e, se a reconexão ocorrer, a nova sessão começa com o autocommit habilitado. Por essa razão, os clientes podem desejar desabilitar o autoconexão. Com o autoconexão ativado, o cliente não é notificado se a reconexão ocorrer, mas quaisquer bloqueios de tabela ou transação atual são perdidos. Com o autoconexão desativado, se a conexão cair, um erro ocorre para a próxima instrução emitida. O cliente pode detectar o erro e tomar a ação apropriada, como reaquisição dos bloqueios ou refazer a transação. Veja Controle de Reconexão Automática.

Nota

Se você usar `ALTER TABLE` em uma tabela bloqueada, ela pode ser desbloqueada. Por exemplo, se você tentar uma segunda operação `ALTER TABLE`, o resultado pode ser um erro `Table 'tbl_name' was not locked with LOCK TABLES`. Para lidar com isso, bloqueie a tabela novamente antes da segunda alteração. Veja também a Seção B.3.6.1, “Problemas com ALTER TABLE”.

#### Interação do bloqueio de tabela e transações

`LOCK TABLES` e `UNLOCK TABLES` interagem com o uso de transações da seguinte forma:

- `LOCK TABLES` não é seguro para transações e implícita mente confirma qualquer transação ativa antes de tentar bloquear as tabelas.

- `UNLOCK TABLES` compromete implicitamente qualquer transação ativa, mas apenas se `LOCK TABLES` tiver sido usado para adquirir bloqueios de tabela. Por exemplo, no seguinte conjunto de instruções, `UNLOCK TABLES` libera o bloqueio de leitura global, mas não compromete a transação porque nenhum bloqueio de tabela está em vigor:

  ```
  FLUSH TABLES WITH READ LOCK;
  START TRANSACTION;
  SELECT ... ;
  UNLOCK TABLES;
  ```

- Iniciar uma transação (por exemplo, com `START TRANSACTION`) compromete implicitamente qualquer transação atual e libera as blocações de tabela existentes.

- `FLUSH TABLES WITH READ LOCK` adquire um bloqueio de leitura global e não bloqueios de tabela, portanto, não está sujeito ao mesmo comportamento que `LOCK TABLES` e `UNLOCK TABLES` em relação ao bloqueio de tabelas e commits implícitos. Por exemplo, `START TRANSACTION` não libera o bloqueio de leitura global. Veja a Seção 15.7.8.3, “Instrução FLUSH”.

- Outras declarações que implicitamente causam o comprometimento de transações não liberam as blocações de tabelas existentes. Para uma lista dessas declarações, consulte a Seção 15.3.3, “Declarações que Causam um Compromisso Implícito”.

- A maneira correta de usar `LOCK TABLES` e `UNLOCK TABLES` com tabelas transacionais, como as tabelas `InnoDB`, é iniciar uma transação com `SET autocommit = 0` (não `START TRANSACTION`) seguido de `LOCK TABLES`, e não chamar `UNLOCK TABLES` até que você comunique explicitamente a transação. Por exemplo, se você precisar escrever na tabela `t1` e ler da tabela `t2`, você pode fazer isso:

  ```
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

  Quando você chama `LOCK TABLES`, `InnoDB` internamente toma seu próprio bloqueio de tabela, e o MySQL toma seu próprio bloqueio de tabela. `InnoDB` libera seu bloqueio de tabela interno na próxima commit, mas para que o MySQL libere seu bloqueio de tabela, você tem que chamar `UNLOCK TABLES`. Você não deve ter `autocommit = 1`, porque então `InnoDB` libera seu bloqueio de tabela imediatamente após a chamada de `LOCK TABLES`, e deadlocks podem acontecer muito facilmente. `InnoDB` não adquire o bloqueio de tabela interno de forma alguma se `autocommit = 1`, para ajudar as aplicações antigas a evitar deadlocks desnecessários.

- `ROLLBACK` não libera bloqueios de tabela.

#### LOCK TABLES e Triggers

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, todas as tabelas usadas nos gatilhos também serão bloqueadas implicitamente:

- Os bloqueios são tomados ao mesmo tempo que os adquiridos explicitamente com a declaração `LOCK TABLES`.

- O bloqueio de uma tabela usada em um gatilho depende se a tabela é usada apenas para leitura. Nesse caso, um bloqueio de leitura é suficiente. Caso contrário, um bloqueio de escrita é usado.

- Se uma tabela for explicitamente bloqueada para leitura com `LOCK TABLES`, mas precisa ser bloqueada para escrita porque pode ser modificada dentro de um gatilho, uma bloqueadora de escrita é obtida em vez de uma bloqueadora de leitura. (Ou seja, uma bloqueadora de escrita implícita necessária devido à aparência da tabela dentro de um gatilho faz com que um pedido de bloqueadora de leitura explícita para a tabela seja convertido em um pedido de bloqueadora de escrita.)

Suponha que você bloqueie duas tabelas, `t1` e `t2`, usando esta declaração:

```
LOCK TABLES t1 WRITE, t2 READ;
```

Se `t1` ou `t2` tiverem algum gatilho, as tabelas usadas dentro dos gatilhos também serão bloqueadas. Suponha que `t1` tenha um gatilho definido da seguinte forma:

```
CREATE TRIGGER t1_a_ins AFTER INSERT ON t1 FOR EACH ROW
BEGIN
  UPDATE t4 SET count = count+1
      WHERE id = NEW.id AND EXISTS (SELECT a FROM t3);
  INSERT INTO t2 VALUES(1, 2);
END;
```

O resultado da declaração `LOCK TABLES` é que `t1` e `t2` são bloqueados porque aparecem na declaração, e `t3` e `t4` são bloqueados porque são usados dentro do gatilho:

- `t1` está bloqueado para escrita de acordo com o pedido de bloqueio `WRITE`.

- `t2` está bloqueado para escrita, embora o pedido seja para um bloqueio `READ`. Isso ocorre porque `t2` é inserido dentro do gatilho, então o pedido `READ` é convertido em um pedido `WRITE`.

- `t3` está bloqueado para leitura porque só pode ser lido dentro do gatilho.

- `t4` está bloqueado para escrita porque ele pode ser atualizado dentro do gatilho.

#### Restrições e condições de bloqueio de tabela

Você pode usar `KILL` com segurança para encerrar uma sessão que está aguardando um bloqueio de tabela. Veja a Seção 15.7.8.4, “Instrução KILL”.

`LOCK TABLES` e `UNLOCK TABLES` não podem ser usados em programas armazenados.

As tabelas no banco de dados `performance_schema` não podem ser bloqueadas com `LOCK TABLES`, exceto as tabelas `setup_xxx`.

O escopo de um bloqueio gerado por `LOCK TABLES` é um único servidor MySQL. Ele não é compatível com o NDB Cluster, que não tem como impor um bloqueio em nível SQL em múltiplas instâncias do **mysqld**. Você pode impor o bloqueio em um aplicativo de API, em vez disso. Consulte a Seção 25.2.7.10, “Limitações Relacionadas a Nodos Múltiplos do NDB Cluster”, para obter mais informações.

As seguintes declarações são proibidas enquanto uma declaração `LOCK TABLES` estiver em vigor: declarações `CREATE TABLE`, `CREATE TABLE ... LIKE`, `CREATE VIEW`, `DROP VIEW` e DDL sobre funções e procedimentos armazenados e eventos.

Para algumas operações, é necessário acessar as tabelas do sistema no banco de dados `mysql`. Por exemplo, a instrução `HELP` requer o conteúdo das tabelas de ajuda do lado do servidor, e `CONVERT_TZ()` pode precisar ler as tabelas de fuso horário. O servidor bloqueia implicitamente as tabelas do sistema para leitura conforme necessário, para que você não precise bloqueá-las explicitamente. Essas tabelas são tratadas da maneira descrita acima:

```
mysql.help_category
mysql.help_keyword
mysql.help_relation
mysql.help_topic
mysql.time_zone
mysql.time_zone_leap_second
mysql.time_zone_name
mysql.time_zone_transition
mysql.time_zone_transition_type
```

Se você quiser colocar explicitamente uma bloqueadora `WRITE` em qualquer uma dessas tabelas com uma declaração `LOCK TABLES`, a tabela deve ser a única bloqueada; nenhuma outra tabela pode ser bloqueada com a mesma declaração.

Normalmente, você não precisa bloquear tabelas, porque todas as instruções `UPDATE` são atômicas; nenhuma outra sessão pode interferir em nenhuma outra instrução SQL atualmente em execução. No entanto, há alguns casos em que o bloqueio de tabelas pode oferecer uma vantagem:

- Se você vai executar muitas operações em um conjunto de tabelas `MyISAM`, é muito mais rápido bloquear as tabelas que você vai usar. Bloquear as tabelas `MyISAM` acelera a inserção, atualização ou exclusão nelas, porque o MySQL não esvazia o cache de chaves das tabelas bloqueadas até que `UNLOCK TABLES` seja chamado. Normalmente, o cache de chaves é esvaziado após cada instrução SQL.

  A desvantagem de bloquear as tabelas é que nenhuma sessão pode atualizar uma tabela bloqueada com `READ` (incluindo a que contém o bloqueio) e nenhuma sessão pode acessar uma tabela bloqueada com `WRITE` que não seja a que contém o bloqueio.

- Se você estiver usando tabelas para um mecanismo de armazenamento não transacional, você deve usar `LOCK TABLES` se quiser garantir que nenhuma outra sessão modifique as tabelas entre um `SELECT` e um `UPDATE`. O exemplo mostrado aqui requer `LOCK TABLES` para ser executado com segurança:

  ```
  LOCK TABLES trans READ, customer WRITE;
  SELECT SUM(value) FROM trans WHERE customer_id=some_id;
  UPDATE customer
    SET total_value=sum_from_previous_statement
    WHERE customer_id=some_id;
  UNLOCK TABLES;
  ```

  Sem `LOCK TABLES`, é possível que outra sessão possa inserir uma nova linha na tabela `trans` entre a execução das instruções `SELECT` e `UPDATE`.

Você pode evitar usar `LOCK TABLES` em muitos casos usando atualizações relativas (`UPDATE customer SET value=value+new_value`) ou a função `LAST_INSERT_ID()`.

Você também pode evitar o bloqueio de tabelas em alguns casos usando as funções de bloqueio de aconselhamento de nível de usuário `GET_LOCK()` e `RELEASE_LOCK()`. Esses bloqueios são salvos em uma tabela hash no servidor e implementados com `pthread_mutex_lock()` e `pthread_mutex_unlock()` para alta velocidade. Veja a Seção 14.14, “Funções de Bloqueio”.

Consulte a Seção 10.11.1, “Métodos de bloqueio interno”, para obter mais informações sobre a política de bloqueio.

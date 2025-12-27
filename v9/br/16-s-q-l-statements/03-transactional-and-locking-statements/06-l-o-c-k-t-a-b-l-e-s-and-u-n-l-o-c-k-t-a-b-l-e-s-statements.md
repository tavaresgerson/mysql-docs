### 15.3.6 Declarações `LOCK TABLES` e `UNLOCK TABLES`

```
LOCK {TABLE | TABLES}
    tbl_name [[AS] alias] lock_type
    [, tbl_name [[AS] alias] lock_type] ...

lock_type: {
    READ [LOCAL]
  | WRITE
}

UNLOCK {TABLE | TABLES}
```

O MySQL permite que as sessões do cliente adquiram explicitamente bloqueios de tabela com o propósito de cooperar com outras sessões para o acesso a tabelas ou para impedir que outras sessões modifiquem tabelas durante períodos em que uma sessão requer acesso exclusivo a elas. Uma sessão pode adquirir ou liberar blocos apenas para si mesma. Uma sessão não pode adquirir blocos para outra sessão ou liberar blocos mantidos por outra sessão.

Os blocos podem ser usados para emular transações ou para obter mais velocidade ao atualizar tabelas. Isso é explicado com mais detalhes em Restrições e Condições de Bloqueio de Tabela.

`LOCK TABLES` adquiri explicitamente blocos de tabela para a sessão do cliente atual. Blocos de tabela podem ser adquiridos para tabelas base ou visualizações. Você deve ter o privilégio `LOCK TABLES` e o privilégio `SELECT` para cada objeto a ser bloqueado.

Para o bloqueio de visualizações, `LOCK TABLES` adiciona todas as tabelas base usadas na visualização ao conjunto de tabelas a serem bloqueadas e as bloqueia automaticamente. Para tabelas subjacentes a qualquer visualização sendo bloqueada, `LOCK TABLES` verifica se o definidor da visualização (para visualizações `SQL SECURITY DEFINER`) ou o invocante (para todas as visualizações) tem os privilégios adequados nas tabelas.

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, quaisquer tabelas usadas em gatilhos também são bloqueadas implicitamente, conforme descrito em Bloqueio de TABLES e Gatilhos.

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, quaisquer tabelas relacionadas por uma restrição de chave estrangeira são abertas e bloqueadas implicitamente. Para verificações de chave estrangeira, um bloqueio de leitura compartilhado (`LOCK TABLES READ`) é tomado nas tabelas relacionadas. Para atualizações em cascata, um bloqueio de escrita sem nada compartilhado (`LOCK TABLES WRITE`) é tomado nas tabelas relacionadas que estão envolvidas na operação.

`DESBLOQUEIE TABELAS` libera explicitamente quaisquer bloqueios de tabela mantidos pela sessão atual. `BLOQUEIE TABELAS` libera implicitamente quaisquer bloqueios de tabela mantidos pela sessão atual antes de adquirir novos bloqueios.

Outro uso para `DESBLOQUEIE TABELAS` é liberar o bloqueio de leitura global adquirido com a instrução `FLASE TABELAS COM BLOQUEIO DE LEITURA`, que permite que você bloqueie todas as tabelas em todos os bancos de dados. Veja a Seção 15.7.8.3, “Instrução FLASE”. (Esta é uma maneira muito conveniente de obter backups se você tiver um sistema de arquivos como o Veritas que pode fazer instantâneos no tempo.)

`BLOQUEIE TABELA` é um sinônimo de `BLOQUEIE TABELAS`; `DESBLOQUEIE TABELA` é um sinônimo de `DESBLOQUEIE TABELAS`.

Um bloqueio de tabela protege apenas contra leituras ou escritas inadequadas por outras sessões. Uma sessão que mantém um bloqueio `ESCRITA` pode realizar operações de nível de tabela, como `DROP TABLE` ou `TRUNCATE TABLE`. Para sessões que mantêm um bloqueio `LEITURA`, as operações `DROP TABLE` e `TRUNCATE TABLE` não são permitidas.

A discussão a seguir se aplica apenas a tabelas não `TEMPORARY`. `BLOQUEIE TABELAS` é permitido (mas ignorado) para uma tabela `TEMPORARY`. A tabela pode ser acessada livremente pela sessão na qual foi criada, independentemente do que outro bloqueio possa estar em vigor. Nenhum bloqueio é necessário porque nenhuma outra sessão pode ver a tabela.

* Aquisição de Bloqueio de Tabela
* Liberação de Bloqueio de Tabela
* Interação de Bloqueio de Tabela e Transações
* BLOQUEIE TABELAS e Triggers
* Restrições e Condições de Bloqueio de Tabela

#### Aquisição de Bloqueio de Tabela

Para adquirir bloqueios de tabela dentro da sessão atual, use a instrução `BLOQUEIE TABELAS`, que adquire blocos de metadados (veja a Seção 10.11.4, “Bloqueio de Metadados”).

Os seguintes tipos de bloqueio estão disponíveis:

Bloqueio `LEITURA [LOCAL]`:

* A sessão que mantém o bloqueio pode ler a tabela (mas não escrevê-la).

* Múltiplas sessões podem adquirir um bloqueio `READ` para a tabela ao mesmo tempo.

* Outras sessões podem ler a tabela sem adquirir explicitamente um bloqueio `READ`.

* O modificador `LOCAL` permite que declarações `INSERT` não conflitantes (inserções concorrentes) sejam executadas por outras sessões enquanto o bloqueio é mantido. (Veja a Seção 10.11.3, “Inserções Concorrentes”.) No entanto, `READ LOCAL` não pode ser usado se você estiver manipulando o banco de dados usando processos externos ao servidor enquanto mantém o bloqueio. Para tabelas `InnoDB`, `READ LOCAL` é o mesmo que `READ`.

Bloqueio `WRITE`:

* A sessão que mantém o bloqueio pode ler e escrever a tabela.

* Apenas a sessão que mantém o bloqueio pode acessar a tabela. Nenhuma outra sessão pode acessá-la até que o bloqueio seja liberado.

* Os pedidos de bloqueio para a tabela por outras sessões bloqueiam enquanto o bloqueio `WRITE` é mantido.

Bloqueios `WRITE` normalmente têm prioridade mais alta que bloqueios `READ` para garantir que as atualizações sejam processadas o mais rápido possível. Isso significa que, se uma sessão obtém um bloqueio `READ` e, em seguida, outra sessão solicita um bloqueio `WRITE`, os pedidos subsequentes de bloqueio `READ` aguardam até que a sessão que solicitou o bloqueio `WRITE` tenha obtido o bloqueio e o liberado. (Uma exceção a essa política pode ocorrer para valores pequenos da variável de sistema `max_write_lock_count`; veja a Seção 10.11.4, “Bloqueio de Metadados”.)

Se o comando `LOCK TABLES` deve esperar devido a blocos mantidos por outras sessões em qualquer uma das tabelas, ele bloqueia até que todos os blocos possam ser adquiridos.

Uma sessão que requer bloqueios deve adquirir todos os bloqueios necessários em uma única instrução `LOCK TABLES`. Enquanto os bloqueios assim obtidos são mantidos, a sessão pode acessar apenas as tabelas bloqueadas. Por exemplo, na sequência de instruções a seguir, ocorre um erro para a tentativa de acessar `t2` porque ele não foi bloqueado na instrução `LOCK TABLES`:

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

As tabelas no banco de dados `INFORMATION_SCHEMA` são uma exceção. Elas podem ser acessadas sem serem explicitamente bloqueadas, mesmo enquanto uma sessão mantém blocos de tabela obtidos com `LOCK TABLES`.

Você não pode referenciar uma tabela bloqueada várias vezes em uma única consulta usando o mesmo nome. Use aliases em vez disso, e obtenha um bloqueio separado para a tabela e cada alias:

```
mysql> LOCK TABLE t WRITE, t AS t1 READ;
mysql> INSERT INTO t SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> INSERT INTO t SELECT * FROM t AS t1;
```

O erro ocorre para o primeiro `INSERT` porque há duas referências ao mesmo nome para uma tabela bloqueada. O segundo `INSERT` é bem-sucedido porque as referências à tabela usam nomes diferentes.

Se suas instruções referenciarem uma tabela por meio de um alias, você deve bloquear a tabela usando esse mesmo alias. Não funciona bloquear a tabela sem especificar o alias:

```
mysql> LOCK TABLE t READ;
mysql> SELECT * FROM t AS myalias;
ERROR 1100: Table 'myalias' was not locked with LOCK TABLES
```

Por outro lado, se você bloquear uma tabela usando um alias, você deve referenciá-la em suas instruções usando esse alias:

```
mysql> LOCK TABLE t AS myalias READ;
mysql> SELECT * FROM t;
ERROR 1100: Table 't' was not locked with LOCK TABLES
mysql> SELECT * FROM t AS myalias;
```

#### Liberação de Bloqueio de Tabela

Quando os bloqueios de tabela mantidos por uma sessão são liberados, eles são liberados todos ao mesmo tempo. Uma sessão pode liberar seus bloqueios explicitamente com `UNLOCK TABLES`.

* Uma sessão pode liberar seus bloqueios explicitamente com `LOCK TABLES`.

* Se uma sessão emite uma instrução `LOCK TABLES` para adquirir um bloqueio enquanto já mantém blocos, seus blocos existentes são liberados implicitamente antes que os novos blocos sejam concedidos.

* Se uma sessão iniciar uma transação (por exemplo, com `START TRANSACTION`), um `UNLOCK TABLES` implícito é executado, o que faz com que os bloqueios existentes sejam liberados. (Para informações adicionais sobre a interação entre o bloqueio de tabelas e transações, consulte Interação entre o Bloqueio de Tabelas e Transações.)

Se a conexão de uma sessão de cliente for encerrada, seja normalmente ou anormalmente, o servidor libera implicitamente todos os bloqueios de tabelas mantidos pela sessão (transacionais e não transacionais). Se o cliente se reconectar, os bloqueios deixam de estar em vigor. Além disso, se o cliente tivesse uma transação ativa, o servidor reverte a transação após a desconexão e, se a reconexão ocorrer, a nova sessão começa com o autocommit habilitado. Por essa razão, os clientes podem desejar desabilitar o autoconexão. Com o autoconexão em vigor, o cliente não é notificado se a reconexão ocorrer, mas quaisquer bloqueios de tabelas ou transação atual são perdidos. Com o autoconexão desativado, se a conexão cair, ocorre um erro para a próxima instrução emitida. O cliente pode detectar o erro e tomar as medidas apropriadas, como reaquisição dos bloqueios ou refazer a transação. Veja Controle Automático de Reconexão.

Nota

Se você usar `ALTER TABLE` em uma tabela bloqueada, ela pode se tornar desbloqueada. Por exemplo, se você tentar uma segunda operação `ALTER TABLE`, o resultado pode ser um erro `Table 'tbl_name' was not locked with LOCK TABLES`. Para lidar com isso, bloqueie a tabela novamente antes da segunda alteração. Veja também Seção B.3.6.1, “Problemas com ALTER TABLE”.

#### Interação entre o Bloqueio de Tabelas e Transações

`LOCK TABLES` e `UNLOCK TABLES` interagem com o uso de transações da seguinte forma:

* `LOCK TABLES` não é seguro para transações e compromete implicitamente qualquer transação ativa antes de tentar bloquear as tabelas.

* `DESBLOQUEIE TABELAS` compromete implicitamente qualquer transação ativa, mas apenas se `LOCK TABLES` foi usado para adquirir bloqueios de tabela. Por exemplo, no seguinte conjunto de instruções, `DESBLOQUEIE TABELAS` libera o bloqueio de leitura global, mas não compromete a transação porque não há bloqueios de tabela em vigor:

  ```
  FLUSH TABLES WITH READ LOCK;
  START TRANSACTION;
  SELECT ... ;
  UNLOCK TABLES;
  ```

* Começar uma transação (por exemplo, com `START TRANSACTION`) compromete implicitamente qualquer transação atual e libera os bloqueios de tabela existentes.

* `FLUSH TABLES WITH READ LOCK` adquire um bloqueio de leitura global e não bloqueios de tabela, portanto, não está sujeito ao mesmo comportamento que `LOCK TABLES` e `UNLOCK TABLES` em relação ao bloqueio de tabela e aos compromissos implícitos. Por exemplo, `START TRANSACTION` não libera o bloqueio de leitura global. Veja a Seção 15.7.8.3, “Instrução FLUSH”.

* Outras instruções que implicitamente fazem com que as transações sejam comprometidas não liberam os bloqueios de tabela existentes. Para uma lista dessas instruções, veja a Seção 15.3.3, “Instruções que Causam um Compromisso Implícito”.

* A maneira correta de usar `LOCK TABLES` e `UNLOCK TABLES` com tabelas transacionais, como tabelas `InnoDB`, é começar uma transação com `SET autocommit = 0` (não `START TRANSACTION`) seguido de `LOCK TABLES`, e não chamar `UNLOCK TABLES` até que você comprometa explicitamente a transação. Por exemplo, se você precisa escrever na tabela `t1` e ler da tabela `t2`, você pode fazer isso:

  ```
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

Quando você chama `LOCK TABLES`, o `InnoDB` internamente assume seu próprio bloqueio de tabela, e o MySQL assume seu próprio bloqueio de tabela. O `InnoDB` libera seu bloqueio de tabela interno no próximo commit, mas para que o MySQL libere seu bloqueio de tabela, você precisa chamar `UNLOCK TABLES`. Você não deve ter `autocommit = 1`, porque, então, o `InnoDB` libera seu bloqueio de tabela interno imediatamente após a chamada de `LOCK TABLES`, e deadlocks podem acontecer muito facilmente. O `InnoDB` não adquire o bloqueio de tabela interno de forma alguma se `autocommit = 1`, para ajudar aplicações antigas a evitar deadlocks desnecessários.

* `ROLLBACK` não libera blocos de tabela.

#### LOCK TABLES e Triggers

Se você bloquear uma tabela explicitamente com `LOCK TABLES`, quaisquer tabelas usadas em triggers também são bloqueadas implicitamente:

* Os bloqueios são tomados ao mesmo tempo que os adquiridos explicitamente com a instrução `LOCK TABLES`.

* O bloqueio em uma tabela usada em um trigger depende se a tabela é usada apenas para leitura. Se for o caso, um bloqueio de leitura é suficiente. Caso contrário, um bloqueio de escrita é usado.

* Se uma tabela é bloqueada explicitamente para leitura com `LOCK TABLES`, mas precisa ser bloqueada para escrita porque pode ser modificada dentro de um trigger, um bloqueio de escrita é tomado em vez de um bloqueio de leitura. (Ou seja, um bloqueio de escrita implícito necessário devido à aparência da tabela dentro de um trigger causa um pedido de bloqueio de leitura explícito para que a tabela seja convertida em um pedido de bloqueio de escrita.)

Suponha que você bloqueie duas tabelas, `t1` e `t2`, usando esta instrução:

```
LOCK TABLES t1 WRITE, t2 READ;
```

Se `t1` ou `t2` tiverem quaisquer triggers, as tabelas usadas dentro dos triggers também são bloqueadas. Suponha que `t1` tenha um trigger definido assim:

```
CREATE TRIGGER t1_a_ins AFTER INSERT ON t1 FOR EACH ROW
BEGIN
  UPDATE t4 SET count = count+1
      WHERE id = NEW.id AND EXISTS (SELECT a FROM t3);
  INSERT INTO t2 VALUES(1, 2);
END;
```

O resultado da instrução `LOCK TABLES` é que `t1` e `t2` são bloqueados porque aparecem na instrução, e `t3` e `t4` são bloqueados porque são usados dentro do gatilho:

* `t1` é bloqueado para escrita conforme o pedido de bloqueio `WRITE`.

* `t2` é bloqueado para escrita, mesmo que o pedido seja para um bloqueio `READ`. Isso ocorre porque `t2` é inserido dentro do gatilho, então o pedido `READ` é convertido em um pedido `WRITE`.

* `t3` é bloqueado para leitura porque é lido apenas dentro do gatilho.

* `t4` é bloqueado para escrita porque pode ser atualizado dentro do gatilho.

#### Restrições e Condições de Bloqueio de Tabelas

Você pode usar `KILL` com segurança para terminar uma sessão que está esperando por um bloqueio de tabela. Veja a Seção 15.7.8.4, “Instrução KILL”.

`LOCK TABLES` e `UNLOCK TABLES` não podem ser usados dentro de programas armazenados.

Tabelas no banco de dados `performance_schema` não podem ser bloqueadas com `LOCK TABLES`, exceto as tabelas `setup_xxx`.

O escopo de um bloqueio gerado por `LOCK TABLES` é um único servidor MySQL. Não é compatível com o NDB Cluster, que não tem como impor um bloqueio de nível SQL em múltiplas instâncias do **mysqld**. Você pode impor o bloqueio em um aplicativo de API. Veja a Seção 25.2.7.10, “Limitações Relacionadas a Múltiplos Nodos do NDB Cluster”, para mais informações.

As seguintes instruções são proibidas enquanto uma instrução `LOCK TABLES` estiver em vigor: `CREATE TABLE`, `CREATE TABLE ... LIKE`, `CREATE VIEW`, `DROP VIEW` e instruções DDL em funções e procedimentos armazenados e eventos.

Para algumas operações, é necessário acessar as tabelas do sistema no banco de dados `mysql`. Por exemplo, a instrução `HELP` requer o conteúdo das tabelas de ajuda do lado do servidor, e o `CONVERT_TZ()` pode precisar ler as tabelas de fuso horário. O servidor implicitamente bloqueia as tabelas do sistema para leitura conforme necessário, para que você não precise bloqueá-las explicitamente. Essas tabelas são tratadas da maneira descrita acima:

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

Se você quiser colocar explicitamente um bloqueio `WRITE` em qualquer uma dessas tabelas com uma instrução `LOCK TABLES`, a tabela deve ser a única bloqueada; nenhuma outra tabela pode ser bloqueada com a mesma instrução.

Normalmente, você não precisa bloquear tabelas, porque todas as instruções `UPDATE` individuais são atômicas; nenhuma outra sessão pode interferir em qualquer outra instrução SQL atualmente em execução. No entanto, há alguns casos em que bloquear tabelas pode oferecer uma vantagem:

* Se você vai executar muitas operações em um conjunto de tabelas `MyISAM`, é muito mais rápido bloquear as tabelas que você vai usar. Bloquear tabelas `MyISAM` acelera a inserção, atualização ou exclusão nelas, porque o MySQL não limpa o cache de chaves para as tabelas bloqueadas até que `UNLOCK TABLES` seja chamado. Normalmente, o cache de chaves é limpo após cada instrução SQL.

O inconveniente de bloquear as tabelas é que nenhuma sessão pode atualizar uma tabela bloqueada para leitura (incluindo a que está segurando o bloqueio) e nenhuma sessão pode acessar uma tabela bloqueada para escrita, exceto a que está segurando o bloqueio.

* Se você está usando tabelas para um motor de armazenamento não transacional, você deve usar `LOCK TABLES` se quiser garantir que nenhuma outra sessão modifique as tabelas entre um `SELECT` e uma `UPDATE`. O exemplo mostrado aqui requer `LOCK TABLES` para ser executado com segurança:

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

Você também pode evitar bloquear tabelas em alguns casos usando as funções de bloqueio de nível de usuário `GET_LOCK()` e `RELEASE_LOCK()`. Esses bloqueios são salvos em uma tabela hash no servidor e implementados com `pthread_mutex_lock()` e `pthread_mutex_unlock()` para alta velocidade. Veja a Seção 14.14, “Funções de Bloqueio”.

Veja a Seção 10.11.1, “Métodos de Bloqueio Interno”, para mais informações sobre a política de bloqueio.
### 11.2.5 Limitações de YEAR(2) de 2 Dígitos e Migração para YEAR de 4 Dígitos

Esta seção descreve problemas que podem ocorrer ao usar o tipo de dado `YEAR(2)` de 2 dígitos e fornece informações sobre como converter colunas `YEAR(2)` existentes para colunas com valores de ano de 4 dígitos, que podem ser declaradas como `YEAR` com uma largura de exibição implícita de 4 caracteres, ou, de forma equivalente, como `YEAR(4)` com uma largura de exibição explícita.

Embora o range interno de valores para `YEAR`/`YEAR(4)` e o tipo obsoleto `YEAR(2)` seja o mesmo (`1901` a `2155` e `0000`), a largura de exibição para `YEAR(2)` torna esse tipo inerentemente ambíguo, pois os valores exibidos indicam apenas os dois últimos dígitos dos valores internos e omitem os dígitos do século. O resultado pode ser uma perda de informação em certas circunstâncias. Por esse motivo, evite usar `YEAR(2)` em suas aplicações e utilize `YEAR`/`YEAR(4)` sempre que precisar de um tipo de dado de valor de ano. A partir do MySQL 5.7.5, o suporte a `YEAR(2)` foi removido e colunas `YEAR(2)` de 2 dígitos existentes devem ser convertidas para colunas `YEAR` de 4 dígitos para se tornarem utilizáveis novamente.

#### Limitações de YEAR(2)

Problemas com o tipo de dado `YEAR(2)` incluem ambiguidade de valores exibidos e possível perda de informação quando os valores são despejados e recarregados ou convertidos em *strings*.

* Valores `YEAR(2)` exibidos podem ser ambíguos. É possível que até três valores `YEAR(2)` que possuem valores internos diferentes tenham o mesmo valor exibido, conforme demonstra o exemplo a seguir:

  ```sql
  mysql> CREATE TABLE t (y2 YEAR(2), y4 YEAR);
  Query OK, 0 rows affected, 1 warning (0.01 sec)

  mysql> INSERT INTO t (y2) VALUES(1912),(2012),(2112);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> UPDATE t SET y4 = y2;
  Query OK, 3 rows affected (0.00 sec)
  Rows matched: 3  Changed: 3  Warnings: 0

  mysql> SELECT * FROM t;
  +------+------+
  | y2   | y4   |
  +------+------+
  |   12 | 1912 |
  |   12 | 2012 |
  |   12 | 2112 |
  +------+------+
  3 rows in set (0.00 sec)
  ```

* Se você usar o **mysqldump** para despejar a tabela criada no exemplo anterior, o arquivo *dump* representa todos os valores `y2` usando a mesma representação de 2 dígitos (`12`). Se você recarregar a tabela a partir do arquivo *dump*, todas as linhas resultantes terão o valor interno `2012` e o valor de exibição `12`, perdendo assim as distinções entre elas.

* A conversão de um valor de dado `YEAR` de 2 ou 4 dígitos para o formato *string* usa a largura de exibição do tipo de dado. Suponha que uma coluna `YEAR(2)` e uma coluna `YEAR`/`YEAR(4)` contenham ambas o valor `1970`. Atribuir cada coluna a uma *string* resulta em um valor de `'70'` ou `'1970'`, respectivamente. Ou seja, ocorre perda de informação na conversão de `YEAR(2)` para *string*.

* Valores fora do range de `1970` a `2069` são armazenados incorretamente quando inseridos em uma coluna `YEAR(2)` em uma tabela `CSV`. Por exemplo, a inserção de `2211` resulta em um valor de exibição de `11`, mas um valor interno de `2011`.

Para evitar esses problemas, use o tipo de dado `YEAR` ou `YEAR(4)` de 4 dígitos em vez do tipo de dado `YEAR(2)` de 2 dígitos. Sugestões sobre estratégias de migração aparecem posteriormente nesta seção.

#### Suporte Reduzido/Removido para YEAR(2) no MySQL 5.7

Antes do MySQL 5.7.5, o suporte para `YEAR(2)` foi diminuído. A partir do MySQL 5.7.5, o suporte para `YEAR(2)` foi removido.

* Definições de coluna `YEAR(2)` para novas tabelas produzem *warnings* ou *errors*:

  + Antes do MySQL 5.7.5, as definições de coluna `YEAR(2)` para novas tabelas são convertidas (com um *warning* `ER_INVALID_YEAR_COLUMN_LENGTH`) para colunas `YEAR` de 4 dígitos:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    Query OK, 0 rows affected, 1 warning (0.04 sec)

    mysql> SHOW WARNINGS\G
    *************************** 1. row ***************************
      Level: Warning
       Code: 1818
    Message: YEAR(2) column type is deprecated. Creating YEAR(4) column instead.
    1 row in set (0.00 sec)

    mysql> SHOW CREATE TABLE t1\G
    *************************** 1. row ***************************
           Table: t1
    Create Table: CREATE TABLE `t1` (
      `y` year(4) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    1 row in set (0.00 sec)
    ```

  + A partir do MySQL 5.7.5, as definições de coluna `YEAR(2)` para novas tabelas produzem um *error* `ER_INVALID_YEAR_COLUMN_LENGTH`:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    ERROR 1818 (HY000): Supports only YEAR or YEAR(4) column.
    ```

* Colunas `YEAR(2)` em tabelas existentes permanecem como `YEAR(2)`:

  + Antes do MySQL 5.7.5, `YEAR(2)` é processado em *Queries* como nas versões mais antigas do MySQL.

  + A partir do MySQL 5.7.5, colunas `YEAR(2)` em *queries* produzem *warnings* ou *errors*.

* Vários programas ou comandos convertem colunas `YEAR(2)` para colunas `YEAR` de 4 dígitos automaticamente:

  + Comandos `ALTER TABLE` que resultam em uma reconstrução de tabela.

  + `REPAIR TABLE` (que `CHECK TABLE` recomenda que você use, se encontrar uma tabela que contenha colunas `YEAR(2)`).

  + **mysql_upgrade** (que usa `REPAIR TABLE`).

  + Despejar com **mysqldump** e recarregar o arquivo *dump*. Diferentemente das conversões executadas pelos três itens anteriores, um *dump* e *reload* tem o potencial de alterar valores de dados.

Um *upgrade* do MySQL geralmente envolve pelo menos um dos dois últimos itens. No entanto, com relação a `YEAR(2)`, **mysql_upgrade** é preferível ao **mysqldump**, que, conforme observado, pode alterar valores de dados.

#### Migrando de YEAR(2) para YEAR de 4 Dígitos

Para converter colunas `YEAR(2)` de 2 dígitos para colunas `YEAR` de 4 dígitos, você pode fazê-lo manualmente a qualquer momento, sem realizar um *upgrade*. Alternativamente, você pode fazer o *upgrade* para uma versão do MySQL com suporte reduzido ou removido para `YEAR(2)` (MySQL 5.6.6 ou posterior) e, em seguida, permitir que o MySQL converta as colunas `YEAR(2)` automaticamente. Neste último caso, evite fazer o *upgrade* despejando e recarregando seus dados, pois isso pode alterar os valores de dados. Além disso, se você usa *replication*, há considerações de *upgrade* que você deve levar em conta.

Para converter colunas `YEAR(2)` de 2 dígitos para `YEAR` de 4 dígitos manualmente, use `ALTER TABLE` ou `REPAIR TABLE`. Suponha que uma tabela `t1` tenha esta definição:

```sql
CREATE TABLE t1 (ycol YEAR(2) NOT NULL DEFAULT '70');
```

Modifique a coluna usando `ALTER TABLE` da seguinte forma:

```sql
ALTER TABLE t1 FORCE;
```

O comando `ALTER TABLE` converte a tabela sem alterar os valores `YEAR(2)`. Se o servidor for uma *replication source*, o comando `ALTER TABLE` é replicado para as *replicas* e realiza a alteração de tabela correspondente em cada uma delas.

Outro método de migração é realizar um *binary upgrade*: Fazer o *upgrade* do MySQL *in place* (no local) sem despejar e recarregar seus dados. Em seguida, execute **mysql_upgrade**, que usa `REPAIR TABLE` para converter colunas `YEAR(2)` de 2 dígitos para colunas `YEAR` de 4 dígitos sem alterar os valores de dados. Se o servidor for uma *replication source*, os comandos `REPAIR TABLE` são replicados para as *replicas* e fazem as alterações de tabela correspondentes em cada uma delas, a menos que você invoque **mysql_upgrade** com a opção `--skip-write-binlog`.

*Upgrades* em *replication servers* geralmente envolvem fazer o *upgrade* das *replicas* para uma versão mais recente do MySQL e, em seguida, fazer o *upgrade* da *source*. Por exemplo, se uma *source* e uma *replica* estiverem ambas executando o MySQL 5.5, uma sequência de *upgrade* típica envolve o *upgrade* da *replica* para 5.6 e, em seguida, o *upgrade* da *source* para 5.6. Com relação ao tratamento diferente de `YEAR(2)` a partir do MySQL 5.6.6, essa sequência de *upgrade* resulta em um problema: Suponha que a *replica* tenha sido atualizada, mas a *source* ainda não. Em seguida, a criação de uma tabela contendo uma coluna `YEAR(2)` de 2 dígitos na *source* resulta em uma tabela contendo uma coluna `YEAR` de 4 dígitos na *replica*. Consequentemente, as seguintes operações têm um resultado diferente na *source* e na *replica*, se você usar *statement-based replication*:

* Inserir `0` numérico. O valor resultante tem um valor interno de `2000` na *source*, mas `0000` na *replica*.

* Converter `YEAR(2)` para *string*. Esta operação usa o valor de exibição de `YEAR(2)` na *source*, mas `YEAR(4)` na *replica*.

Para evitar tais problemas, modifique todas as colunas `YEAR(2)` de 2 dígitos na *source* para colunas `YEAR` de 4 dígitos antes de fazer o *upgrade*. (Use `ALTER TABLE`, conforme descrito anteriormente.) Isso possibilita fazer o *upgrade* normalmente (*replica* primeiro, depois *source*) sem introduzir quaisquer diferenças de `YEAR(2)` para `YEAR(4)` entre a *source* e a *replica*.

Um método de migração deve ser evitado: Não despeje seus dados com **mysqldump** e recarregue o arquivo *dump* após o *upgrade*. Isso tem o potencial de alterar valores `YEAR(2)`, conforme descrito anteriormente.

Uma migração de colunas `YEAR(2)` de 2 dígitos para colunas `YEAR` de 4 dígitos também deve envolver a análise do código da aplicação para verificar a possibilidade de comportamento alterado em condições como estas:

* Código que espera que a seleção de uma coluna `YEAR` produza exatamente dois dígitos.

* Código que não leva em conta o tratamento diferente para inserções de `0` numérico: Inserir `0` em `YEAR(2)` ou `YEAR(4)` resulta em um valor interno de `2000` ou `0000`, respectivamente.
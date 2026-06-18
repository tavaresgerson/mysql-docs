#### 13.1.18.4 Instrução CREATE TABLE ... SELECT

Você pode criar uma tabela a partir de outra adicionando uma instrução `SELECT` no final da instrução `CREATE TABLE`:

```sql
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

O MySQL cria novas colunas para todos os elementos na `SELECT`. Por exemplo:

```sql
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

Isso cria uma tabela `InnoDB` com três colunas, `a`, `b` e `c`. A opção `ENGINE` faz parte da instrução `CREATE TABLE` e não deve ser usada após a `SELECT`; isso resultaria em um erro de sintaxe. O mesmo se aplica a outras opções de `CREATE TABLE`, como `CHARSET`.

Observe que as colunas da instrução `SELECT` são anexadas ao lado direito da tabela, e não sobrepostas a ela. Considere o seguinte exemplo:

```sql
mysql> SELECT * FROM foo;
+---+
| n |
+---+
| 1 |
+---+

mysql> CREATE TABLE bar (m INT) SELECT n FROM foo;
Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM bar;
+------+---+
| m    | n |
+------+---+
| NULL | 1 |
+------+---+
1 row in set (0.00 sec)
```

Para cada linha na tabela `foo`, uma linha é inserida em `bar` com os valores de `foo` e os valores `DEFAULT` para as novas colunas.

Em uma tabela resultante de `CREATE TABLE ... SELECT`, as colunas nomeadas apenas na parte `CREATE TABLE` vêm primeiro. As colunas nomeadas em ambas as partes ou apenas na parte `SELECT` vêm depois. O tipo de dado das colunas `SELECT` pode ser substituído especificando a coluna também na parte `CREATE TABLE`.

Se ocorrerem erros durante a cópia dos dados para a tabela, ela é automaticamente descartada (dropped) e não é criada.

Você pode preceder a `SELECT` com `IGNORE` ou `REPLACE` para indicar como lidar com linhas que duplicam valores de chave única (unique key values). Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave única são descartadas. Com `REPLACE`, as novas linhas substituem as linhas que têm o mesmo valor de chave única. Se nem `IGNORE` nem `REPLACE` for especificado, valores de chave única duplicados resultam em um erro. Para mais informações, consulte The Effect of IGNORE on Statement Execution.

Como a ordenação das linhas nas instruções `SELECT` subjacentes nem sempre pode ser determinada, as instruções `CREATE TABLE ... IGNORE SELECT` e `CREATE TABLE ... REPLACE SELECT` são sinalizadas como inseguras para replicação baseada em instrução (statement-based replication). Tais instruções produzem um aviso no error log ao usar o modo statement-based e são escritas no binary log usando o formato row-based quando no modo `MIXED`. Consulte também Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”.

`CREATE TABLE ... SELECT` não cria automaticamente nenhum Index para você. Isso é feito intencionalmente para tornar a instrução o mais flexível possível. Se você deseja ter Indexes na tabela criada, você deve especificá-los antes da instrução `SELECT`:

```sql
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas na tabela da qual se está selecionando são colunas geradas. A parte `SELECT` da instrução não pode atribuir valores a colunas geradas na tabela de destino.

Alguma conversão de tipos de dados pode ocorrer. Por exemplo, o atributo `AUTO_INCREMENT` não é preservado, e colunas `VARCHAR` podem se tornar colunas `CHAR`. Os atributos mantidos são `NULL` (ou `NOT NULL`) e, para aquelas colunas que os possuem, `CHARACTER SET`, `COLLATION`, `COMMENT` e a cláusula `DEFAULT`.

Ao criar uma tabela com `CREATE TABLE ... SELECT`, certifique-se de usar alias para quaisquer chamadas de função ou expressões na Query. Caso contrário, a instrução `CREATE` pode falhar ou resultar em nomes de coluna indesejáveis.

```sql
CREATE TABLE artists_and_works
  SELECT artist.name, COUNT(work.artist_id) AS number_of_works
  FROM artist LEFT JOIN work ON artist.id = work.artist_id
  GROUP BY artist.id;
```

Você também pode especificar explicitamente o tipo de dado para uma coluna na tabela criada:

```sql
CREATE TABLE foo (a TINYINT NOT NULL) SELECT b+1 AS a FROM bar;
```

Para `CREATE TABLE ... SELECT`, se `IF NOT EXISTS` for fornecido e a tabela de destino existir, nada é inserido na tabela de destino, e a instrução não é registrada (logged).

Para garantir que o binary log possa ser usado para recriar as tabelas originais, o MySQL não permite inserts concorrentes durante `CREATE TABLE ... SELECT`.

Você não pode usar `FOR UPDATE` como parte da `SELECT` em uma instrução como `CREATE TABLE new_table SELECT ... FROM old_table ...`. Se você tentar fazer isso, a instrução falhará.
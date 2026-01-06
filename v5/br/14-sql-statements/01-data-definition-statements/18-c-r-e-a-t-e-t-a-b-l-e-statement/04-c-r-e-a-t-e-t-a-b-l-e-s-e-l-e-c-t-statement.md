#### 13.1.18.4 Criar uma tabela com uma instrução SELECT

Você pode criar uma tabela a partir de outra adicionando uma instrução `SELECT` no final da instrução `CREATE TABLE`:

```sql
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

O MySQL cria novas colunas para todos os elementos na consulta `SELECT`. Por exemplo:

```sql
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

Isso cria uma tabela `InnoDB` com três colunas, `a`, `b` e `c`. A opção `ENGINE` faz parte da instrução `CREATE TABLE` e não deve ser usada após a instrução `SELECT`; isso resultaria em um erro de sintaxe. O mesmo vale para outras opções de `CREATE TABLE`, como `CHARSET`.

Observe que as colunas da instrução `SELECT` são anexadas ao lado direito da tabela, e não sobrepostas sobre ela. Veja o exemplo a seguir:

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

Para cada linha da tabela `foo`, uma linha é inserida na `bar` com os valores de `foo` e valores padrão para as novas colunas.

Em uma tabela resultante de `CREATE TABLE ... SELECT`, as colunas nomeadas apenas na parte `CREATE TABLE` aparecem primeiro. As colunas nomeadas nas duas partes ou apenas na parte `SELECT` aparecem depois. O tipo de dados das colunas de `SELECT` pode ser sobrescrito especificando também a coluna na parte `CREATE TABLE`.

Se ocorrerem erros durante a cópia dos dados para a tabela, eles serão automaticamente excluídos e não criados.

Você pode preceder o `SELECT` com `IGNORE` ou `REPLACE` para indicar como lidar com linhas que duplicam valores de chave única. Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave única são descartadas. Com `REPLACE`, novas linhas substituem linhas que têm o mesmo valor de chave única. Se nenhum `IGNORE` ou `REPLACE` for especificado, valores de chave única duplicados resultam em um erro. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

Como a ordem das linhas nas instruções subjacentes de `SELECT` não pode ser determinada sempre, as instruções `CREATE TABLE ... IGNORE SELECT` e `CREATE TABLE ... REPLACE SELECT` são marcadas como inseguras para a replicação baseada em instruções. Essas instruções produzem um aviso no log de erro ao usar o modo baseado em instruções e são escritas no log binário usando o formato baseado em linha quando usar o modo `MIXED`. Veja também Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Instruções e Baseada em Linhas”.

`CREATE TABLE ... SELECT` não cria automaticamente nenhum índice para você. Isso é feito intencionalmente para tornar a declaração o mais flexível possível. Se você quiser ter índices na tabela criada, você deve especificar esses índices antes da declaração `SELECT`:

```sql
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada são colunas geradas. A parte `SELECT` da instrução não pode atribuir valores às colunas geradas na tabela de destino.

Pode ocorrer alguma conversão de tipos de dados. Por exemplo, o atributo `AUTO_INCREMENT` não é preservado, e as colunas `VARCHAR` podem se tornar colunas `CHAR`. Os atributos retreinados são `NULL` (ou `NOT NULL`) e, para aquelas colunas que os possuem, `CHARACTER SET`, `COLLATION`, `COMMENT` e a cláusula `DEFAULT`.

Ao criar uma tabela com `CREATE TABLE ... SELECT`, certifique-se de dar um alias a quaisquer chamadas de função ou expressões na consulta. Caso contrário, a instrução `CREATE` pode falhar ou resultar em nomes de colunas indesejados.

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

Para `CREATE TABLE ... SELECT`, se `IF NOT EXISTS` for fornecido e a tabela de destino existir, nada é inserido na tabela de destino, e a instrução não é registrada.

Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes durante `CREATE TABLE ... SELECT`.

Você não pode usar `FOR UPDATE` como parte da instrução `SELECT` em uma declaração como `CREATE TABLE new_table SELECT ... FROM old_table ...`. Se você tentar fazer isso, a declaração falhará.

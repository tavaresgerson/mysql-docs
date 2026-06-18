### 15.2.12 Declaração REPLACE

```
REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    { {VALUES | VALUE} (value_list) [, (value_list)] ...
      |
      VALUES row_constructor_list
    }

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {SELECT ... | TABLE table_name}

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

`REPLACE` funciona exatamente como `INSERT`, exceto que, se uma linha antiga na tabela tiver o mesmo valor que uma nova linha para um índice `PRIMARY KEY` ou `UNIQUE`, a linha antiga é excluída antes que a nova linha seja inserida. Veja a Seção 15.2.7, “Instrução INSERT”.

`REPLACE` é uma extensão do MySQL ao padrão SQL. Ela insere, ou *deleta e insere*. Para outra extensão do MySQL ao SQL padrão — que pode inserir ou *atualizar* — consulte a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

Os operadores de inserção e substituição `DELAYED` foram descontinuados no MySQL 5.6. No MySQL 8.0, o operador `DELAYED` não é suportado. O servidor reconhece, mas ignora, a palavra-chave `DELAYED`, trata a substituição como uma substituição não atrasada e gera uma mensagem de aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`: A substituição atrasada não é mais suportada. A instrução foi convertida para REPLACE. A palavra-chave `DELAYED` está prevista para ser removida em uma futura versão.

Nota

`REPLACE` faz sentido apenas se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE`. Caso contrário, ele se torna equivalente a `INSERT`, porque não há índice para ser usado para determinar se uma nova linha duplica outra.

Os valores de todas as colunas são obtidos a partir dos valores especificados na declaração `REPLACE`. Quaisquer colunas ausentes são definidas com seus valores padrão, assim como acontece com `INSERT`. Você não pode referenciar valores da linha atual e usá-los na nova linha. Se você usar uma atribuição como `SET col_name = col_name + 1`, a referência ao nome da coluna no lado direito é tratada como `DEFAULT(col_name)`, portanto, a atribuição é equivalente a `SET col_name = DEFAULT(col_name) + 1`.

No MySQL 8.0.19 e versões posteriores, você pode especificar os valores das colunas que o `REPLACE` tenta inserir usando o `VALUES ROW()`.

Para usar `REPLACE`, você deve ter os privilégios `INSERT` e `DELETE` para a tabela.

Se uma coluna gerada for substituída explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

`REPLACE` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de nomes separados por vírgula de partições, subpartições ou ambas. Como com `INSERT`, se não for possível inserir a nova linha em nenhuma dessas partições ou subpartições, a instrução `REPLACE` falha com o erro Encontrado uma linha que não corresponde ao conjunto de partições fornecido. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

A declaração `REPLACE` retorna um contador para indicar o número de linhas afetadas. Esse é o total de linhas excluídas e inseridas. Se o contador for 1 para uma única linha `REPLACE`, uma linha foi inserida e nenhuma linha foi excluída. Se o contador for maior que 1, uma ou mais linhas antigas foram excluídas antes de a nova linha ser inserida. É possível que uma única linha substitua mais de uma linha antiga se a tabela contiver vários índices únicos e a nova linha duplicar valores para diferentes linhas antigas em diferentes índices únicos.

O número de linhas afetadas facilita a determinação de se o `REPLACE` adicionou apenas uma linha ou se também substituiu alguma linha: Verifique se o número é 1 (adicionado) ou maior (substituído).

Se você estiver usando a API C, o número de linhas afetadas pode ser obtido usando a função `mysql_affected_rows()`.

Você não pode substituir em uma tabela e selecionar da mesma tabela em uma subconsulta.

O MySQL utiliza o seguinte algoritmo para `REPLACE` (e `LOAD DATA ... REPLACE`):

1. Tente inserir a nova linha na tabela
2. Quando a inserção falha porque ocorre um erro de chave duplicada para uma chave primária ou índice único:

   1. Exclua da tabela a linha em conflito que tem o valor de chave duplicado

   2. Tente inserir novamente a nova linha na tabela

É possível que, no caso de um erro de chave duplicada, um mecanismo de armazenamento possa executar o `REPLACE` como uma atualização em vez de uma exclusão mais inserção, mas a semântica é a mesma. Não há efeitos visíveis para o usuário, exceto por uma possível diferença na forma como o mecanismo de armazenamento incrementa as variáveis de status `Handler_xxx`.

Como os resultados das declarações `REPLACE ... SELECT` dependem da ordem das linhas do `SELECT` e essa ordem nem sempre pode ser garantida, é possível que, ao registrar essas declarações para a fonte e a replica divergirem. Por essa razão, as declarações `REPLACE ... SELECT` são marcadas como inseguras para a replicação baseada em declarações. Essas declarações produzem um aviso no log de erros ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linhas ao usar o modo `MIXED`. Veja também a Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linhas”.

O MySQL 8.0.19 e versões posteriores suportam `TABLE` assim como `SELECT` com `REPLACE`, assim como com `INSERT`. Consulte a Seção 15.2.7.1, “Instrução INSERT ... SELECT”, para obter mais informações e exemplos.

Ao modificar uma tabela existente que não está particionada para acomodar a partição, ou ao modificar a partição de uma tabela já particionada, você pode considerar alterar a chave primária da tabela (consulte a Seção 26.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”). Você deve estar ciente de que, se você fizer isso, os resultados das instruções `REPLACE` podem ser afetados, assim como aconteceria se você modificasse a chave primária de uma tabela não particionada. Considere a tabela criada pela seguinte instrução `CREATE TABLE`:

```
CREATE TABLE test (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

Quando criamos esta tabela e executamos as instruções mostradas no cliente mysql, o resultado é o seguinte:

```
mysql> REPLACE INTO test VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.04 sec)

mysql> REPLACE INTO test VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 2 rows affected (0.04 sec)

mysql> SELECT * FROM test;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
1 row in set (0.00 sec)
```

Agora, criamos uma segunda tabela quase idêntica à primeira, exceto que a chave primária agora abrange 2 colunas, como mostrado aqui (texto destacado):

```
CREATE TABLE test2 (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id, ts)
);
```

Quando executamos no `test2` as mesmas duas instruções `REPLACE` que fizemos na tabela original `test`, obtemos um resultado diferente:

```
mysql> REPLACE INTO test2 VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.05 sec)

mysql> REPLACE INTO test2 VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 1 row affected (0.06 sec)

mysql> SELECT * FROM test2;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | Old  | 2014-08-20 18:47:00 |
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
2 rows in set (0.00 sec)
```

Isso ocorre porque, quando executado em `test2`, os valores das colunas `id` e `ts` devem corresponder aos de uma linha existente para que a linha seja substituída; caso contrário, uma nova linha é inserida.

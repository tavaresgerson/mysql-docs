### 15.2.12 Instrução `REPLACE`

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

A instrução `REPLACE` funciona exatamente como a instrução `INSERT`, exceto que, se uma linha antiga na tabela tiver o mesmo valor que uma nova linha para um índice `PRIMARY KEY` ou `UNIQUE`, a linha antiga é excluída antes que a nova linha seja inserida. Veja a Seção 15.2.7, “Instrução `INSERT`”.

`REPLACE` é uma extensão do MySQL ao padrão SQL. Ela ou insere, ou *exclui* e insere. Para outra extensão do MySQL ao padrão SQL que ou insere ou *atualiza*—veja a Seção 15.2.7.2, “Instrução `INSERT ... ON DUPLICATE KEY UPDATE`”.

`REPLACE` e `DELAYED` foram descontinuados no MySQL 5.6. No MySQL 9.5, `DELAYED` não é suportado. O servidor reconhece, mas ignora, a palavra-chave `DELAYED`, trata a substituição como uma substituição não retardada e gera uma mensagem de aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`: `REPLACE DELAYED` não é mais suportado. A instrução foi convertida para `REPLACE`. A palavra-chave `DELAYED` está programada para ser removida em uma futura versão.

Observação

`REPLACE` só faz sentido se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE`. Caso contrário, torna-se equivalente a `INSERT`, porque não há índice para ser usado para determinar se uma nova linha duplica outra.

Os valores de todas as colunas são tirados dos valores especificados na instrução `REPLACE`. Quaisquer colunas ausentes são definidas com seus valores padrão, assim como acontece com `INSERT`. Você não pode referenciar valores da linha atual e usá-los na nova linha. Se você usar uma atribuição como `SET col_name = col_name + 1`, a referência ao nome da coluna no lado direito é tratada como `DEFAULT(col_name)`, então a atribuição é equivalente a `SET col_name = DEFAULT(col_name) + 1`.

Você pode especificar os valores das colunas que `REPLACE` tenta inserir usando `VALUES ROW()`.

Para usar `REPLACE`, você deve ter os privilégios de `INSERT` e `DELETE` para a tabela.

Se uma coluna gerada for substituída explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”.

`REPLACE` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de nomes separados por vírgula de partições, subpartições ou ambos. Como com `INSERT`, se não for possível inserir a nova linha em nenhuma dessas partições ou subpartições, a instrução `REPLACE` falha com o erro Encontrou uma linha que não corresponde ao conjunto de partições fornecido. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

A instrução `REPLACE` retorna um contador para indicar o número de linhas afetadas. Esse é a soma das linhas excluídas e inseridas. Se o contador for 1 para uma `REPLACE` de uma única linha, uma linha foi inserida e nenhuma linha foi excluída. Se o contador for maior que 1, uma ou mais linhas antigas foram excluídas antes de a nova linha ser inserida. É possível que uma única linha substitua mais de uma linha antiga se a tabela contiver vários índices únicos e a nova linha duplicar valores para diferentes linhas antigas em diferentes índices únicos.

O contador de linhas afetadas facilita a determinação de se `REPLACE` apenas adicionou uma linha ou se também substituiu alguma linha: Verifique se o contador é 1 (adicionado) ou maior (substituído).

Se você estiver usando a API C, o contador de linhas afetadas pode ser obtido usando a função `mysql_affected_rows()`.

Você não pode substituir em uma tabela e selecionar da mesma tabela em uma subconsulta.

O MySQL usa o seguinte algoritmo para `REPLACE` (e `LOAD DATA ... REPLACE`):

1. Tente inserir a nova linha na tabela
2. Enquanto a inserção falha porque ocorre um erro de chave duplicada para uma chave primária ou índice único:

   1. Exclua da tabela a linha conflitante que tem o valor da chave duplicada
   2. Tente novamente inserir a nova linha na tabela

É possível que, no caso de um erro de chave duplicada, um mecanismo de armazenamento possa realizar a `REPLACE` como uma atualização em vez de uma exclusão mais inserção, mas a semântica é a mesma. Não há efeitos visíveis para o usuário, além de uma possível diferença em como o mecanismo de armazenamento incrementa as variáveis de status `Handler_xxx`.

Como os resultados das declarações `REPLACE ... SELECT` dependem da ordem das linhas do `SELECT` e essa ordem nem sempre pode ser garantida, é possível que, ao registrar essas declarações para a fonte e a replica, elas se divergirem. Por essa razão, as declarações `REPLACE ... SELECT` são marcadas como inseguras para a replicação baseada em declarações. Essas declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. Veja também a Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linhas”.

O MySQL 9.5 suporta `TABLE` assim como `SELECT` com `REPLACE`, assim como faz com `INSERT`. Veja a Seção 15.2.7.1, “Declaração INSERT ... SELECT”, para mais informações e exemplos.

Ao modificar uma tabela existente que não está particionada para acomodar a particionamento, ou ao modificar o particionamento de uma tabela já particionada, você pode considerar alterar a chave primária da tabela (veja a Seção 26.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”). Você deve estar ciente de que, se você fizer isso, os resultados das instruções `REPLACE` podem ser afetados, assim como aconteceria se você modificasse a chave primária de uma tabela não particionada. Considere a tabela criada pela seguinte instrução `CREATE TABLE`:

```
CREATE TABLE test (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

Quando criamos essa tabela e executamos as instruções mostradas no cliente mysql, o resultado é o seguinte:

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

Agora, criamos uma segunda tabela quase idêntica à primeira, exceto que a chave primária agora cobre 2 colunas, como mostrado aqui (texto em negrito):

```
CREATE TABLE test2 (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id, ts)
);
```

Quando executamos nas instruções `REPLACE` no `test2` as mesmas duas instruções que fizemos na tabela original `test`, obtemos um resultado diferente:

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

Isso ocorre porque, quando executado no `test2`, os valores das colunas `id` e `ts` devem corresponder aos de uma linha existente para que a linha seja substituída; caso contrário, uma nova linha é inserida.
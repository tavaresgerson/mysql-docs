#### 8.2.1.4 Otimização Engine Condition Pushdown

Esta otimização melhora a eficiência de comparações diretas entre uma coluna não indexada e uma constante. Nesses casos, a condição é "pushed down" (empurrada para baixo) para o storage engine para avaliação. Esta otimização pode ser usada apenas pelo storage engine `NDB`.

Para NDB Cluster, esta otimização pode eliminar a necessidade de enviar linhas não correspondentes pela rede entre os nós de dados do Cluster e o servidor MySQL que emitiu a Query, podendo acelerar Queries onde é utilizada por um fator de 5 a 10 vezes em comparação com casos onde o condition pushdown poderia ser usado, mas não é.

Suponha que uma tabela NDB Cluster esteja definida da seguinte forma:

```sql
CREATE TABLE t1 (
    a INT,
    b INT,
    KEY(a)
) ENGINE=NDB;
```

Engine condition pushdown pode ser usado com Queries como a mostrada aqui, que inclui uma comparação entre uma coluna não indexada e uma constante:

```sql
SELECT a, b FROM t1 WHERE b = 10;
```

O uso de engine condition pushdown pode ser visto na saída do `EXPLAIN`:

```sql
mysql> EXPLAIN SELECT a,b FROM t1 WHERE b = 10\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 10
        Extra: Using where with pushed condition
```

No entanto, engine condition pushdown *não pode* ser usado com nenhuma destas duas Queries:

```sql
SELECT a,b FROM t1 WHERE a = 10;
SELECT a,b FROM t1 WHERE b + 1 = 10;
```

Engine condition pushdown não é aplicável à primeira Query porque existe um Index na coluna `a`. (Um método de acesso por Index seria mais eficiente e, portanto, seria escolhido em preferência ao condition pushdown.) Engine condition pushdown não pode ser empregado para a segunda Query porque a comparação envolvendo a coluna não indexada `b` é indireta. (No entanto, engine condition pushdown poderia ser aplicado se você reduzisse `b + 1 = 10` para `b = 9` na cláusula `WHERE`.)

Engine condition pushdown também pode ser empregado quando uma coluna indexada é comparada com uma constante usando um operador `>` ou `<`:

```sql
mysql> EXPLAIN SELECT a, b FROM t1 WHERE a < 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: range
possible_keys: a
          key: a
      key_len: 5
          ref: NULL
         rows: 2
        Extra: Using where with pushed condition
```

Outras comparações suportadas para engine condition pushdown incluem as seguintes:

* `column [NOT] LIKE pattern`

  *`pattern`* deve ser um literal string contendo o padrão a ser correspondido; para sintaxe, veja a Seção 12.8.1, “String Comparison Functions and Operators”.

* `column IS [NOT] NULL`

* `column IN (value_list)`

  Cada item na *`value_list`* deve ser uma constante, valor literal.

* `column BETWEEN constant1 AND constant2`

  *`constant1`* e *`constant2`* devem ser constantes, valores literais.

Em todos os casos na lista anterior, é possível que a condição seja convertida na forma de uma ou mais comparações diretas entre uma coluna e uma constante.

Engine condition pushdown é habilitado por padrão. Para desabilitá-lo na inicialização do servidor, defina o flag `engine_condition_pushdown` da variável de sistema `optimizer_switch` como `off`. Por exemplo, em um arquivo `my.cnf`, use estas linhas:

```sql
[mysqld]
optimizer_switch=engine_condition_pushdown=off
```

Em tempo de execução (runtime), desabilite o condition pushdown desta forma:

```sql
SET optimizer_switch='engine_condition_pushdown=off';
```

**Limitações.** Engine condition pushdown está sujeito às seguintes limitações:

* Engine condition pushdown é suportado apenas pelo storage engine `NDB`.

* Colunas podem ser comparadas apenas com constantes; no entanto, isso inclui expressões que avaliam a valores constantes.

* Colunas usadas em comparações não podem ser de nenhum dos tipos `BLOB` ou `TEXT`. Esta exclusão se estende também às colunas `JSON`, `BIT` e `ENUM`.

* Um valor string a ser comparado com uma coluna deve usar a mesma collation que a coluna.

* Joins não são diretamente suportados; condições envolvendo múltiplas tabelas são "pushed" (empurradas) separadamente quando possível. Use a saída `EXPLAIN` estendida para determinar quais condições são realmente "pushed down". Veja a Seção 8.8.3, “Extended EXPLAIN Output Format”.
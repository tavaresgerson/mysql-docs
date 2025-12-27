#### 10.2.1.5 Otimização da Depressão da Condição do Motor

Essa otimização melhora a eficiência das comparações diretas entre uma coluna não indexada e uma constante. Nesses casos, a condição é "deslocada" para o motor de armazenamento para avaliação. Essa otimização pode ser usada apenas pelo motor de armazenamento  `NDB`.

Para o NDB Cluster, essa otimização pode eliminar a necessidade de enviar linhas não correspondentes pela rede entre os nós de dados do cluster e o servidor MySQL que emitiu a consulta, e pode acelerar as consultas onde é usada por um fator de 5 a 10 vezes em relação aos casos em que a depuração da condição poderia ser usada, mas não é.

Suponha que uma tabela do NDB Cluster seja definida da seguinte forma:

```
CREATE TABLE t1 (
    a INT,
    b INT,
    KEY(a)
) ENGINE=NDB;
```

A depuração da condição do motor pode ser usada em consultas como a mostrada aqui, que inclui uma comparação entre uma coluna não indexada e uma constante:

```
SELECT a, b FROM t1 WHERE b = 10;
```

O uso da depuração da condição do motor pode ser visto na saída do  `EXPLAIN`:

```
mysql> EXPLAIN SELECT a, b FROM t1 WHERE b = 10\G
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

No entanto, a depuração da condição do motor *não* pode ser usada com a seguinte consulta:

```
SELECT a,b FROM t1 WHERE a = 10;
```

A depuração da condição do motor não é aplicável aqui porque existe um índice na coluna `a`. (Um método de acesso a índice seria mais eficiente e, portanto, seria escolhido preferencialmente em vez da depuração da condição.)

A depuração da condição do motor também pode ser empregada quando uma coluna indexada é comparada com uma constante usando um operador `>` ou `<`:

```
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

Outras comparações suportadas para a depuração da condição do motor incluem as seguintes:

* `coluna [NÃO] LIKE padrão`

  *`padrão`* deve ser um literal de string contendo o padrão a ser correspondido; para sintaxe, consulte a Seção 14.8.1, “Funções e Operadores de Comparação de Strings”.
* `coluna IS [NÃO] NULL`
* `coluna IN (valor_lista)`

  Cada item na *`valor_lista`* deve ser um valor constante, literal.
* `coluna ENTRE constante1 E constante2`

  *`constante1`* e *`constante2`* devem ser cada um um valor constante, literal.

Em todos os casos da lista anterior, é possível converter a condição para a forma de uma ou mais comparações diretas entre uma coluna e uma constante.

O pushdown de condição de motor é ativado por padrão. Para desativá-lo no início do servidor, defina a bandeira `engine_condition_pushdown` da variável de sistema `optimizer_switch` para `off`. Por exemplo, em um arquivo `my.cnf`, use estas linhas:

```
[mysqld]
optimizer_switch=engine_condition_pushdown=off
```

Em tempo de execução, desative o pushdown de condição da seguinte forma:

```
SET optimizer_switch='engine_condition_pushdown=off';
```

**Limitações.** O pushdown de condição de motor está sujeito às seguintes limitações:

* O pushdown de condição de motor é suportado apenas pelo motor de armazenamento `NDB`.
* No NDB 8.4, as colunas podem ser comparadas entre si desde que sejam do mesmo tipo exato, incluindo a mesma sinalização, comprimento, conjunto de caracteres, precisão e escala, onde esses são aplicáveis.
* As colunas usadas em comparações não podem ser de nenhum dos tipos `BLOB` ou `TEXT`. Essa exclusão se estende também às colunas `JSON`, `BIT` e `ENUM`.
* Um valor de string a ser comparado com uma coluna deve usar a mesma collation que a coluna.
* As junções não são suportadas diretamente; condições envolvendo múltiplas tabelas são empurradas separadamente, quando possível. Use a saída de `EXPLAIN` estendida para determinar quais condições são realmente empurradas. Veja a Seção 10.8.3, “Formato de Saída de EXPLAIN Estendida”.
* Anteriormente, o pushdown de condição de motor estava limitado a termos que se referiam a valores de coluna da mesma tabela para a qual a condição estava sendo empurrada. No NDB 8.4, os valores de coluna de tabelas mais cedo no plano de consulta também podem ser referenciados a partir de condições empurradas. Isso reduz o número de linhas que devem ser manipuladas pelo nó SQL durante o processamento de junção. O filtro também pode ser realizado em paralelo nos threads LDM, em vez de em um único processo `mysqld`. Isso tem o potencial de melhorar significativamente o desempenho das consultas.

O `NDB` pode realizar uma junção externa usando um varredura se não houver condições que não possam ser empurradas em nenhuma tabela usada no mesmo nível de junção, ou em qualquer tabela em níveis de junção acima dela para a qual ela dependa. Isso também é válido para uma junção semijoin, desde que a estratégia de otimização empregada seja `firstMatch` (consulte Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Junção Semijoin).

Os algoritmos de junção não podem ser combinados com colunas referenciadas de tabelas anteriores nas seguintes duas situações:

1. Quando qualquer uma das tabelas anteriores referenciadas estiver em um buffer de junção. Nesse caso, cada linha recuperada da tabela filtrada por varredura é comparada com cada linha no buffer. Isso significa que não há uma única linha específica a partir da qual os valores das colunas podem ser recuperados ao gerar o filtro de varredura.
2. Quando a coluna é originada de uma operação descendente em uma junção empurrada. Isso ocorre porque as linhas referenciadas de operações ancestrais na junção ainda não foram recuperadas quando o filtro de varredura é gerado.

Colunas de tabelas ancestrais em uma junção podem ser empurradas para baixo, desde que atendam aos requisitos listados anteriormente. Um exemplo de tal consulta, usando a tabela `t1` criada anteriormente, é mostrado aqui:

```
mysql> EXPLAIN
    ->   SELECT * FROM t1 AS x
    ->   LEFT JOIN t1 AS y
    ->   ON x.a=0 AND y.b>=3\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: x
   partitions: p0,p1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
     filtered: 100.00
        Extra: NULL
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: y
   partitions: p0,p1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
     filtered: 100.00
        Extra: Using where; Using pushed condition (`test`.`y`.`b` >= 3); Using join buffer (hash join)
2 rows in set, 2 warnings (0.00 sec)
```
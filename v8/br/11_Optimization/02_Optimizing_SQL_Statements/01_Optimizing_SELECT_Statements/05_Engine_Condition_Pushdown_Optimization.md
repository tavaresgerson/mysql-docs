#### 10.2.1.5 Otimização da Depressão da Condição do Motor

Essa otimização melhora a eficiência das comparações diretas entre uma coluna não indexada e uma constante. Nesse caso, a condição é "empurrada" para o mecanismo de armazenamento para avaliação. Essa otimização só pode ser usada pelo mecanismo de armazenamento `NDB`.

Para o NDB Cluster, essa otimização pode eliminar a necessidade de enviar linhas não correspondentes pela rede entre os nós de dados do cluster e o servidor MySQL que emitiu a consulta, e pode acelerar as consultas onde é usada em um fator de 5 a 10 vezes em relação aos casos em que a projeção de condições poderia ser usada, mas não é.

Suponha que uma tabela de um cluster NDB seja definida da seguinte forma:

```
CREATE TABLE t1 (
    a INT,
    b INT,
    KEY(a)
) ENGINE=NDB;
```

O comando pushdown de condição do motor pode ser usado com consultas como a mostrada aqui, que inclui uma comparação entre uma coluna não indexada e uma constante:

```
SELECT a, b FROM t1 WHERE b = 10;
```

O uso do pushdown da condição do motor pode ser visto na saída do `EXPLAIN`:

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

No entanto, o comando de empurrar para baixo a condição do motor *não pode* ser usado com a seguinte consulta:

```
SELECT a,b FROM t1 WHERE a = 10;
```

A exclusão de condições de motor não é aplicável aqui porque existe um índice na coluna `a`. (Um método de acesso a índice seria mais eficiente e, portanto, seria escolhido preferencialmente em vez da exclusão de condições.)

A operação de empurrar para baixo da condição do motor também pode ser usada quando uma coluna indexada é comparada com uma constante usando um operador `>` ou `<`:

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

Outras comparações suportadas para a análise da condição do motor incluem as seguintes:

- `column [NOT] LIKE pattern`

  `pattern` deve ser uma literal de string contendo o padrão a ser correspondido; para sintaxe, consulte a Seção 14.8.1, “Funções e Operadores de Comparação de Strings”.

- `column IS [NOT] NULL`

- `column IN (value_list)`

  Cada item no `value_list` deve ser um valor constante e literal.

- `column BETWEEN constant1 AND constant2`

  `constant1` e `constant2` devem ser valores constantes e literais, cada um.

Em todos os casos da lista anterior, é possível converter a condição para a forma de uma ou mais comparações diretas entre uma coluna e uma constante.

A opção de empurrar a condição do motor é ativada por padrão. Para desativá-la na inicialização do servidor, defina a bandeira `engine_condition_pushdown` da variável de sistema `optimizer_switch` para `off`. Por exemplo, em um arquivo `my.cnf`, use essas linhas:

```
[mysqld]
optimizer_switch=engine_condition_pushdown=off
```

Em tempo de execução, desative a empilhamento de condições da seguinte forma:

```
SET optimizer_switch='engine_condition_pushdown=off';
```

**Limitações.** A empurrada da condição do motor está sujeita às seguintes limitações:

- O empurrão de condição do motor é suportado apenas pelo motor de armazenamento `NDB`.

- Antes da versão 8.0.18 do NDB, as colunas podiam ser comparadas com constantes ou expressões que avaliam a valores constantes apenas. Na versão 8.0.18 e em versões posteriores, as colunas podem ser comparadas entre si, desde que sejam exatamente do mesmo tipo, incluindo a mesma sinalização, comprimento, conjunto de caracteres, precisão e escala, quando aplicável.

- As colunas usadas em comparações não podem ser de nenhum dos tipos `BLOB` ou `TEXT`. Essa exclusão também se estende às colunas `JSON`, `BIT` e `ENUM`.

- Um valor de cadeia a ser comparado com uma coluna deve usar a mesma concordância que a coluna.

- As junções não são suportadas diretamente; as condições que envolvem múltiplas tabelas são empurradas separadamente, sempre que possível. Use a saída `EXPLAIN` estendida para determinar quais condições são realmente empurradas para baixo. Veja a Seção 10.8.3, “Formato de Saída EXPLAIN Estendida”.

Anteriormente, a exclusão de condições de motor era limitada a termos que se referiam a valores de coluna da mesma tabela para a qual a condição estava sendo excluída. A partir do NDB 8.0.16, os valores de coluna de tabelas mais antigas no plano de consulta também podem ser referenciados a partir de condições excluídas. Isso reduz o número de linhas que devem ser processadas pelo nó SQL durante o processamento de junção. O filtro também pode ser realizado em paralelo nos threads do LDM, em vez de em um único processo **mysqld**. Isso tem o potencial de melhorar significativamente o desempenho das consultas.

A partir do NDB 8.0.20, uma junção externa usando um varredura pode ser impulsionada se não houver condições não impulsionáveis em nenhuma tabela usada no mesmo ninho de junção ou em qualquer tabela em ninhos de junção acima dela, da qual depende. Isso também é válido para uma junção parcial, desde que a estratégia de otimização empregada seja `firstMatch` (consulte a Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Junção Parcial”).

Os algoritmos de associação não podem ser combinados com colunas de referência de tabelas anteriores nas seguintes duas situações:

1. Quando qualquer uma das tabelas referenciadas acima estiver em um buffer de junção. Nesse caso, cada linha recuperada da tabela filtrada por varredura é comparada com cada linha no buffer. Isso significa que não há uma única linha específica a partir da qual os valores das colunas podem ser recuperados ao gerar o filtro de varredura.

2. Quando a coluna é derivada de uma operação de filho em uma junção empurrada. Isso ocorre porque as linhas referenciadas a partir de operações ancestrais na junção ainda não foram recuperadas quando o filtro de varredura é gerado.

A partir da versão 8.0.27 do NDB, as colunas das tabelas ancestrais em uma junção podem ser empurradas para baixo, desde que cumpram os requisitos listados anteriormente. Um exemplo de uma consulta desse tipo, usando a tabela `t1` criada anteriormente, é mostrado aqui:

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

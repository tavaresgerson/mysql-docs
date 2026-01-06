### 8.3.11 Busca indexada em colunas TIMESTAMP

Os valores temporais são armazenados nas colunas `TIMESTAMP` como valores em UTC, e os valores inseridos e recuperados das colunas `TIMESTAMP` são convertidos entre o fuso horário da sessão e o UTC. (Esse é o mesmo tipo de conversão realizada pela função `CONVERT_TZ()`. Se o fuso horário da sessão for UTC, não há, efetivamente, conversão de fuso horário.)

Devido às convenções para mudanças de fuso horário local, como o horário de verão (DST), as conversões entre o fuso horário UTC e não-UTC não são um para um em ambas as direções. Valores UTC distintos podem não ser distintos em outro fuso horário. O exemplo a seguir mostra valores UTC distintos que se tornam idênticos em um fuso horário não-UTC:

```sql
mysql> CREATE TABLE tstable (ts TIMESTAMP);
mysql> SET time_zone = 'UTC'; -- insert UTC values
mysql> INSERT INTO tstable VALUES
       ('2018-10-28 00:30:00'),
       ('2018-10-28 01:30:00');
mysql> SELECT ts FROM tstable;
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 00:30:00 |
| 2018-10-28 01:30:00 |
+---------------------+
mysql> SET time_zone = 'MET'; -- retrieve non-UTC values
mysql> SELECT ts FROM tstable;
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 02:30:00 |
| 2018-10-28 02:30:00 |
+---------------------+
```

Nota

Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fusos horários devem ser configuradas corretamente. Para obter instruções, consulte a Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”.

Você pode ver que os dois valores distintos do UTC são os mesmos quando convertidos para o fuso horário `'MET'`. Esse fenômeno pode levar a resultados diferentes para uma consulta de coluna `TIMESTAMP` específica, dependendo se o otimizador usa um índice para executar a consulta.

Suponha que uma consulta selecione valores da tabela mostrada anteriormente usando uma cláusula `WHERE` para pesquisar a coluna `ts` por um único valor específico, como um literal de timestamp fornecido pelo usuário:

```sql
SELECT ts FROM tstable
WHERE ts = 'literal';
```

Suponha, ainda, que a consulta seja executada nessas condições:

- O fuso horário da sessão não é UTC e tem uma mudança de horário de verão. Por exemplo:

  ```sql
  SET time_zone = 'MET';
  ```

- Os valores únicos UTC armazenados na coluna `TIMESTAMP` não são únicos no fuso horário da sessão devido às mudanças de horário de verão (DST). (O exemplo mostrado anteriormente ilustra como isso pode ocorrer.)

- A consulta especifica um valor de pesquisa que está dentro da hora de entrada na DST no fuso horário da sessão.

Nestas condições, a comparação na cláusula `WHERE` ocorre de maneiras diferentes para consultas não indexadas e indexadas, resultando em resultados diferentes:

- Se não houver um índice ou se o otimizador não puder usá-lo, as comparações ocorrerão no fuso horário da sessão. O otimizador realiza uma varredura da tabela, na qual ele recupera cada valor da coluna `ts`, converte-o do UTC para o fuso horário da sessão e compara-o com o valor de pesquisa (também interpretado no fuso horário da sessão):

  ```sql
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

  Como os valores de `ts` armazenados são convertidos para o fuso horário da sessão, é possível que a consulta retorne dois valores de timestamp que são distintos como valores UTC, mas iguais no fuso horário da sessão: um valor que ocorre antes da mudança da DST quando os relógios são alterados e um valor que ocorre após a mudança da DST.

- Se houver um índice utilizável, as comparações ocorrem no UTC. O otimizador realiza uma varredura do índice, convertendo primeiro o valor de busca do fuso horário da sessão para o UTC, e então comparando o resultado com as entradas do índice no UTC:

  ```sql
  mysql> ALTER TABLE tstable ADD INDEX (ts);
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

  Nesse caso, o valor de busca (convertido) é correspondido apenas às entradas do índice, e, como as entradas do índice para os valores UTC armazenados distintos também são distintos, o valor de busca pode corresponder apenas a um deles.

Devido à operação de otimizador diferente para buscas não indexadas e indexadas, a consulta produz resultados diferentes em cada caso. O resultado da busca não indexada retorna todos os valores que correspondem ao fuso horário da sessão. A busca indexada não pode fazer isso:

- Ele é executado dentro do motor de armazenamento, que conhece apenas os valores UTC.

- Para os dois valores distintos do fuso horário da sessão que correspondem ao mesmo valor UTC, a pesquisa indexada corresponde apenas à entrada de índice UTC correspondente e retorna apenas uma única linha.

Na discussão anterior, o conjunto de dados armazenado em `tstable` por acaso consiste em valores UTC distintos. Nesses casos, todas as consultas que utilizam índices na forma mostrada correspondem, no máximo, a uma entrada de índice.

Se o índice não for `UNIQUE`, é possível que a tabela (e o índice) armazene múltiplas instâncias de um determinado valor UTC. Por exemplo, a coluna `ts` pode conter múltiplas instâncias do valor UTC `'2018-10-28 00:30:00'`. Nesse caso, a consulta que usa o índice retornaria cada uma delas (convertidas para o valor MET `'2018-10-28 02:30:00'` no conjunto de resultados). Resta claro que as consultas que usam o índice correspondem ao valor de pesquisa convertido a um único valor nas entradas do índice UTC, em vez de corresponder a múltiplos valores UTC que se convertem ao valor de pesquisa no fuso horário da sessão.

Se for importante retornar todos os valores `ts` que correspondem ao fuso horário da sessão, a solução é suprimir o uso do índice com uma dica `IGNORE INDEX`:

```sql
mysql> SELECT ts FROM tstable
       IGNORE INDEX (ts)
       WHERE ts = '2018-10-28 02:30:00';
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 02:30:00 |
| 2018-10-28 02:30:00 |
+---------------------+
```

A mesma falta de mapeamento um para um para conversões de fuso horário em ambas as direções ocorre também em outros contextos, como as conversões realizadas com as funções `FROM_UNIXTIME()` e `UNIX_TIMESTAMP()`. Veja a Seção 12.7, “Funções de Data e Hora”.

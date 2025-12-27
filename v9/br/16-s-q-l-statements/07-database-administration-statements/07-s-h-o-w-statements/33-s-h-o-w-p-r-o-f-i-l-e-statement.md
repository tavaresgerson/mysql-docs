#### 15.7.7.33 Declaração `SHOW PROFILE`

```
SHOW PROFILE [type [, type] ... ]
    [FOR QUERY n]
    [LIMIT row_count [OFFSET offset]]

type: {
    ALL
  | BLOCK IO
  | CONTEXT SWITCHES
  | CPU
  | IPC
  | MEMORY
  | PAGE FAULTS
  | SOURCE
  | SWAPS
}
```

As declarações `SHOW PROFILE` e `SHOW PROFILES` exibem informações de perfilagem que indicam o uso de recursos para declarações executadas durante o curso da sessão atual.

Nota

As declarações `SHOW PROFILE` e `SHOW PROFILES` estão desatualizadas; espera-se que sejam removidas em uma futura versão do MySQL. Use o Schema de Desempenho em vez disso; consulte a Seção 29.19.1, “Perfilagem de Consultas Usando o Schema de Desempenho”.

Para controlar a perfilagem, use a variável de sessão `profiling`, que tem um valor padrão de 0 (`OFF`). Ative a perfilagem definindo `profiling` para 1 ou `ON`:

```
mysql> SET profiling = 1;
```

`SHOW PROFILES` exibe uma lista das declarações mais recentes enviadas ao servidor. O tamanho da lista é controlado pela variável de sessão `profiling_history_size`, que tem um valor padrão de 15. O valor máximo é

100. Definir o valor para 0 tem o efeito prático de desativar a perfilagem.

Todas as declarações são perfiladas, exceto `SHOW PROFILE` e `SHOW PROFILES`, então nenhuma dessas declarações aparece na lista de perfilamento. Declarações malformadas são perfiladas. Por exemplo, `SHOW PROFILING` é uma declaração ilegal, e um erro sintático ocorre se você tentar executá-la, mas ela aparece na lista de perfilamento.

`SHOW PROFILE` exibe informações detalhadas sobre uma única declaração. Sem a cláusula `FOR QUERY n`, a saída diz respeito à declaração mais recentemente executada. Se `FOR QUERY n` for incluído, `SHOW PROFILE` exibe informações para a declaração *`n`*. Os valores de *`n`* correspondem aos valores de `Query_ID` exibidos por `SHOW PROFILES`.

A cláusula `LIMIT row_count` pode ser dada para limitar a saída a *`row_count`* linhas. Se `LIMIT` for dado, `OFFSET offset` pode ser adicionado para começar a saída *`offset`* linhas no conjunto completo de linhas.

Por padrão, `SHOW PROFILE` exibe as colunas `Status` e `Duração`. Os valores de `Status` são semelhantes aos valores de `State` exibidos por `SHOW PROCESSLIST`, embora possam haver algumas diferenças menores na interpretação para alguns valores de status (consulte a Seção 10.14, “Examinando Informações de Fuso (Processo”)”).

Valores opcionais de `type` podem ser especificados para exibir tipos específicos de informações adicionais:

* `ALL` exibe todas as informações
* `BLOCK IO` exibe contagens para operações de entrada e saída em bloco

* `CONTEXT SWITCHES` exibe contagens para comutações voluntárias e involuntárias de contexto

* `CPU` exibe tempos de uso do CPU do usuário e do sistema

* `IPC` exibe contagens de mensagens enviadas e recebidas

* `MEMORY` atualmente não é implementada
* `PAGE FAULTS` exibe contagens de falhas de página principais e secundárias

* `SOURCE` exibe os nomes das funções do código-fonte, juntamente com o nome e o número de linha do arquivo em que a função ocorre

* `SWAPS` exibe contagens de trocas

O perfilamento é habilitado por sessão. Quando uma sessão termina, suas informações de perfilamento são perdidas.

```
mysql> SELECT @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set (0.00 sec)

mysql> SET profiling = 1;
Query OK, 0 rows affected (0.00 sec)

mysql> DROP TABLE IF EXISTS t1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> CREATE TABLE T1 (id INT);
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROFILES;
+----------+----------+--------------------------+
| Query_ID | Duration | Query                    |
+----------+----------+--------------------------+
|        0 | 0.000088 | SET PROFILING = 1        |
|        1 | 0.000136 | DROP TABLE IF EXISTS t1  |
|        2 | 0.011947 | CREATE TABLE t1 (id INT) |
+----------+----------+--------------------------+
3 rows in set (0.00 sec)

mysql> SHOW PROFILE;
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| checking permissions | 0.000040 |
| creating table       | 0.000056 |
| After create         | 0.011363 |
| query end            | 0.000375 |
| freeing items        | 0.000089 |
| logging slow query   | 0.000019 |
| cleaning up          | 0.000005 |
+----------------------+----------+
7 rows in set (0.00 sec)

mysql> SHOW PROFILE FOR QUERY 1;
+--------------------+----------+
| Status             | Duration |
+--------------------+----------+
| query end          | 0.000107 |
| freeing items      | 0.000008 |
| logging slow query | 0.000015 |
| cleaning up        | 0.000006 |
+--------------------+----------+
4 rows in set (0.00 sec)

mysql> SHOW PROFILE CPU FOR QUERY 2;
+----------------------+----------+----------+------------+
| Status               | Duration | CPU_user | CPU_system |
+----------------------+----------+----------+------------+
| checking permissions | 0.000040 | 0.000038 |   0.000002 |
| creating table       | 0.000056 | 0.000028 |   0.000028 |
| After create         | 0.011363 | 0.000217 |   0.001571 |
| query end            | 0.000375 | 0.000013 |   0.000028 |
| freeing items        | 0.000089 | 0.000010 |   0.000014 |
| logging slow query   | 0.000019 | 0.000009 |   0.000010 |
| cleaning up          | 0.000005 | 0.000003 |   0.000002 |
+----------------------+----------+----------+------------+
7 rows in set (0.00 sec)
```

Nota

O perfilamento é parcialmente funcional em algumas arquiteturas. Para valores que dependem da chamada de sistema `getrusage()`, `NULL` é retornado em sistemas como o Windows que não suportam a chamada. Além disso, o perfilamento é por processo e não por thread. Isso significa que a atividade em threads dentro do servidor, além do seu próprio, pode afetar as informações de temporização que você vê.

As informações de perfilamento também estão disponíveis na tabela `INFORMATION_SCHEMA` `PROFILING`. Consulte a Seção 28.3.29, “A Tabela INFORMATION\_SCHEMA PROFILING”. Por exemplo, as seguintes consultas são equivalentes:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```
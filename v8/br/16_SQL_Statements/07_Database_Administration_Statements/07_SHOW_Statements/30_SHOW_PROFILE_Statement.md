#### 15.7.7.30 Mostrar perfil de declaração

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

As instruções `SHOW PROFILE` e `SHOW PROFILES` exibem informações de perfilamento que indicam o uso de recursos para instruções executadas durante o curso da sessão atual.

Nota

As instruções `SHOW PROFILE` e `SHOW PROFILES` estão desatualizadas; espere que sejam removidas em uma futura versão do MySQL. Use o Gerenciador de Desempenho em vez disso; veja a Seção 29.19.1, “Profilagem de Consulta Usando o Gerenciador de Desempenho”.

Para controlar o perfil, use a variável de sessão `profiling`, que tem um valor padrão de 0 (`OFF`). Ative o perfil configurando `profiling` para 1 ou `ON`:

```
mysql> SET profiling = 1;
```

`SHOW PROFILES` exibe uma lista das declarações mais recentes enviadas ao servidor. O tamanho da lista é controlado pela variável de sessão `profiling_history_size`, que tem um valor padrão de 15. O valor máximo é

100. Definir o valor para 0 tem o efeito prático de desativar o perfil.

Todas as declarações são analisadas, exceto `SHOW PROFILE` e `SHOW PROFILES`, portanto, nenhuma dessas declarações aparece na lista de análise. Declarações malformadas são analisadas. Por exemplo, `SHOW PROFILING` é uma declaração ilegal, e uma erro de sintaxe ocorre se você tentar executá-la, mas ela aparece na lista de análise.

`SHOW PROFILE` exibe informações detalhadas sobre uma única declaração. Sem a cláusula `FOR QUERY n`, a saída diz respeito à declaração mais recentemente executada. Se `FOR QUERY n` for incluído, `SHOW PROFILE` exibe informações para a declaração `n`. Os valores de `n` correspondem aos valores de `Query_ID` exibidos por `SHOW PROFILES`.

A cláusula `LIMIT row_count` pode ser usada para limitar a saída a `row_count` linhas. Se `LIMIT` for fornecido, `OFFSET offset` pode ser adicionado para começar a saída de `offset` linhas no conjunto completo de linhas.

Por padrão, as colunas `SHOW PROFILE` exibem `Status` e `Duration`. Os valores de `Status` são semelhantes aos valores de `State` exibidos por `SHOW PROCESSLIST`, embora possam haver algumas diferenças menores na interpretação das duas declarações para alguns valores de status (consulte a Seção 10.14, “Examinando Informações do Fuso de Servidor (Processo”) Informações”).

Valores opcionais `type` podem ser especificados para exibir tipos específicos de informações adicionais:

- `ALL` exibe todas as informações

- `BLOCK IO` exibe contagens para operações de entrada e saída de blocos

- `CONTEXT SWITCHES` exibe contagens para alternâncias voluntárias e involuntárias de contexto

- `CPU` exibe os tempos de uso da CPU do usuário e do sistema

- `IPC` exibe contagens de mensagens enviadas e recebidas

- `MEMORY` não está atualmente implementado

- `PAGE FAULTS` exibe contagens para falhas de página principais e secundárias

- `SOURCE` exibe os nomes das funções do código-fonte, juntamente com o nome e o número da linha do arquivo em que a função ocorre

- `SWAPS` exibe contagens de troca

O perfil é ativado por sessão. Quando uma sessão termina, suas informações de perfil são perdidas.

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

O perfilamento só funciona parcialmente em algumas arquiteturas. Para valores que dependem da chamada de sistema `getrusage()`, o `NULL` é retornado em sistemas como o Windows, que não suportam a chamada. Além disso, o perfilamento é por processo e não por thread. Isso significa que a atividade em threads dentro do servidor, além da sua, pode afetar as informações de temporização que você vê.

As informações de perfilamento também estão disponíveis na tabela `INFORMATION_SCHEMA` `PROFILING`. Veja a Seção 28.3.24, “A Tabela INFORMATION\_SCHEMA PROFILING”. Por exemplo, as seguintes consultas são equivalentes:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```

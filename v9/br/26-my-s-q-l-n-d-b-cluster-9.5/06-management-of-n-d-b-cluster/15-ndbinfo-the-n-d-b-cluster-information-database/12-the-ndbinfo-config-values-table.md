#### 25.6.15.12 A tabela ndbinfo config_values

A tabela `config_values` fornece informações sobre o estado atual dos valores dos parâmetros de configuração do nó. Cada linha da tabela corresponde ao valor atual de um parâmetro em um nó específico.

A tabela `config_values` contém as seguintes colunas:

* `node_id`

  ID do nó no cluster

* `config_param`

  Número de ID interno do parâmetro

* `config_value`

  Valor atual do parâmetro

##### Notas

A coluna `config_param` da tabela `config_values` e a coluna `param_number` da tabela `config_params` usam os mesmos identificadores de parâmetros. Ao juntar as duas tabelas nessas colunas, você pode obter informações detalhadas sobre os parâmetros de configuração de nó desejados. A consulta mostrada aqui fornece os valores atuais para todos os parâmetros em cada nó de dados no cluster, ordenados por ID de nó e nome do parâmetro:

```
SELECT    v.node_id AS 'Node Id',
          p.param_name AS 'Parameter',
          v.config_value AS 'Value'
FROM      config_values v
JOIN      config_params p
ON        v.config_param=p.param_number
WHERE     p.param_name NOT LIKE '\_\_%'
ORDER BY  v.node_id, p.param_name;
```

Saída parcial da consulta anterior quando executada em um pequeno exemplo de cluster usado para testes simples:

```
+---------+------------------------------------------+----------------+
| Node Id | Parameter                                | Value          |
+---------+------------------------------------------+----------------+
|       2 | Arbitration                              | 1              |
|       2 | ArbitrationTimeout                       | 7500           |
|       2 | BackupDataBufferSize                     | 16777216       |
|       2 | BackupDataDir                            | /home/jon/data |
|       2 | BackupDiskWriteSpeedPct                  | 50             |
|       2 | BackupLogBufferSize                      | 16777216       |

...

|       3 | TotalSendBufferMemory                    | 0              |
|       3 | TransactionBufferMemory                  | 1048576        |
|       3 | TransactionDeadlockDetectionTimeout      | 1200           |
|       3 | TransactionInactiveTimeout               | 4294967039     |
|       3 | TwoPassInitialNodeRestartCopy            | 0              |
|       3 | UndoDataBuffer                           | 16777216       |
|       3 | UndoIndexBuffer                          | 2097152        |
+---------+------------------------------------------+----------------+
248 rows in set (0.02 sec)
```

A cláusula `WHERE` filtra os parâmetros cujos nomes começam com uma dupla sublinha (__) Esses parâmetros são reservados para testes e outros usos internos pelos desenvolvedores do NDB Cluster e não são destinados ao uso em um NDB Cluster em produção.

Você pode obter uma saída mais específica, mais detalhada ou ambas emitindo as consultas adequadas. Este exemplo fornece todos os tipos de informações disponíveis sobre os parâmetros `NodeId`, `NoOfReplicas`, `HostName`, `DataMemory`, `IndexMemory` e `TotalSendBufferMemory` conforme configurados atualmente para todos os nós de dados no cluster:

```
SELECT  p.param_name AS Name,
        v.node_id AS Node,
        p.param_type AS Type,
        p.param_default AS 'Default',
        p.param_min AS Minimum,
        p.param_max AS Maximum,
        CASE p.param_mandatory WHEN 1 THEN 'Y' ELSE 'N' END AS 'Required',
        v.config_value AS Current
FROM    config_params p
JOIN    config_values v
ON      p.param_number = v.config_param
WHERE   p. param_name
  IN ('NodeId', 'NoOfReplicas', 'HostName',
      'DataMemory', 'IndexMemory', 'TotalSendBufferMemory')\G
```

A saída desta consulta quando executada em um pequeno NDB Cluster com 2 nós de dados usados para testes simples é mostrada aqui:

```
*************************** 1. row ***************************
    Name: NodeId
    Node: 2
    Type: unsigned
 Default:
 Minimum: 1
 Maximum: 144
Required: Y
 Current: 2
*************************** 2. row ***************************
    Name: HostName
    Node: 2
    Type: string
 Default: localhost
 Minimum:
 Maximum:
Required: N
 Current: 127.0.0.1
*************************** 3. row ***************************
    Name: TotalSendBufferMemory
    Node: 2
    Type: unsigned
 Default: 0
 Minimum: 262144
 Maximum: 4294967039
Required: N
 Current: 0
*************************** 4. row ***************************
    Name: NoOfReplicas
    Node: 2
    Type: unsigned
 Default: 2
 Minimum: 1
 Maximum: 4
Required: N
 Current: 2
*************************** 5. row ***************************
    Name: DataMemory
    Node: 2
    Type: unsigned
 Default: 102760448
 Minimum: 1048576
 Maximum: 1099511627776
Required: N
 Current: 524288000
*************************** 6. row ***************************
    Name: NodeId
    Node: 3
    Type: unsigned
 Default:
 Minimum: 1
 Maximum: 144
Required: Y
 Current: 3
*************************** 7. row ***************************
    Name: HostName
    Node: 3
    Type: string
 Default: localhost
 Minimum:
 Maximum:
Required: N
 Current: 127.0.0.1
*************************** 8. row ***************************
    Name: TotalSendBufferMemory
    Node: 3
    Type: unsigned
 Default: 0
 Minimum: 262144
 Maximum: 4294967039
Required: N
 Current: 0
*************************** 9. row ***************************
    Name: NoOfReplicas
    Node: 3
    Type: unsigned
 Default: 2
 Minimum: 1
 Maximum: 4
Required: N
 Current: 2
*************************** 10. row ***************************
    Name: DataMemory
    Node: 3
    Type: unsigned
 Default: 102760448
 Minimum: 1048576
 Maximum: 1099511627776
Required: N
 Current: 524288000
10 rows in set (0.01 sec)
```
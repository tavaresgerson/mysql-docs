#### 29.12.14.2 Tabela de variáveis persistentes `persisted_variables`

A tabela `persisted_variables` fornece uma interface SQL ao arquivo `mysqld-auto.cnf` que armazena configurações de variáveis globais do sistema persistentes, permitindo que o conteúdo do arquivo seja inspecionado em tempo de execução usando instruções `SELECT`. As variáveis são persistentes usando instruções `SET PERSIST` ou `PERSIST_ONLY`; consulte a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”. A tabela contém uma linha para cada variável do sistema persistente no arquivo. Variáveis não persistentes não aparecem na tabela.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` é necessário para visualizar os valores das variáveis de sistema sensíveis nesta tabela.

Para informações sobre variáveis de sistema persistentes, consulte a Seção 7.1.9.3, “Variáveis de sistema persistentes”.

Suponha que `mysqld-auto.cnf` tenha este formato (um pouco reformatado):

```
{
  "Version": 1,
  "mysql_server": {
    "max_connections": {
      "Value": "1000",
      "Metadata": {
        "Timestamp": 1.519921706e+15,
        "User": "root",
        "Host": "localhost"
      }
    },
    "autocommit": {
      "Value": "ON",
      "Metadata": {
        "Timestamp": 1.519921707e+15,
        "User": "root",
        "Host": "localhost"
      }
    }
  }
}
```

Então, `persisted_variables` tem este conteúdo:

```
mysql> SELECT * FROM performance_schema.persisted_variables;
+-----------------+----------------+
| VARIABLE_NAME   | VARIABLE_VALUE |
+-----------------+----------------+
| autocommit      | ON             |
| max_connections | 1000           |
+-----------------+----------------+
```

A tabela `persisted_variables` tem estas colunas:

* `VARIABLE_NAME`

  O nome da variável listado em `mysqld-auto.cnf`.

* `VARIABLE_VALUE`

  O valor listado para a variável em `mysqld-auto.cnf`.

`persisted_variables` tem estes índices:

* Chave primária em (`VARIABLE_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `persisted_variables`.
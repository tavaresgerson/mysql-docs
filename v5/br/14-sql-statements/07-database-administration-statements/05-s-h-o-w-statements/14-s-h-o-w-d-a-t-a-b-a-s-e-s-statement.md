#### 13.7.5.14 Instrução SHOW DATABASES

```sql
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

A instrução [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") lista os databases no host do server MySQL. [`SHOW SCHEMAS`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") é um sinônimo para [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de database devem ser correspondidos (matched). A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensões às Instruções SHOW”](extended-show.html "24.8 Extensions to SHOW Statements").

Você vê apenas os databases para os quais você possui algum tipo de privilege, a menos que você tenha o privilege global [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). Você também pode obter esta lista usando o comando [**mysqlshow**](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information").

Se o server foi iniciado com a option [`--skip-show-database`](server-options.html#option_mysqld_skip-show-database), você não pode usar esta instrução, a menos que possua o privilege [`SHOW DATABASES`](privileges-provided.html#priv_show-databases).

O MySQL implementa databases como diretórios no data directory, portanto, esta instrução simplesmente lista diretórios nessa localização. No entanto, a saída pode incluir nomes de diretórios que não correspondem a databases reais.

Informações do Database também estão disponíveis na tabela `SCHEMATA` do `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table"). Consulte a [Seção 24.3.22, “A Tabela INFORMATION_SCHEMA SCHEMATA”](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table").

Cuidado

Como um global privilege é considerado um privilege para todos os databases, *qualquer* global privilege permite que um usuário veja todos os nomes de database com [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") ou examinando a tabela `SCHEMATA` do `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table").
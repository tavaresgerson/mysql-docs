#### 13.7.5.14 Instrução SHOW DATABASES

```sql
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

A instrução `SHOW DATABASES` lista os databases no host do server MySQL. `SHOW SCHEMAS` é um sinônimo para `SHOW DATABASES`. A cláusula `LIKE`, se presente, indica quais nomes de database devem ser correspondidos (matched). A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões às Instruções SHOW”.

Você vê apenas os databases para os quais você possui algum tipo de privilege, a menos que você tenha o privilege global `SHOW DATABASES`. Você também pode obter esta lista usando o comando **mysqlshow**.

Se o server foi iniciado com a option `--skip-show-database`, você não pode usar esta instrução, a menos que possua o privilege `SHOW DATABASES`.

O MySQL implementa databases como diretórios no data directory, portanto, esta instrução simplesmente lista diretórios nessa localização. No entanto, a saída pode incluir nomes de diretórios que não correspondem a databases reais.

Informações do Database também estão disponíveis na tabela `SCHEMATA` do `INFORMATION_SCHEMA` `SCHEMATA`. Consulte a Seção 24.3.22, “A Tabela INFORMATION_SCHEMA SCHEMATA”.

Cuidado

Como um global privilege é considerado um privilege para todos os databases, *qualquer* global privilege permite que um usuário veja todos os nomes de database com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` do `INFORMATION_SCHEMA` `SCHEMATA`.
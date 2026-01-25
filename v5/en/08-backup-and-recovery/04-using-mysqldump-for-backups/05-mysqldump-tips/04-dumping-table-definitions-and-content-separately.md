#### 7.4.5.4 Despejando Definições e Conteúdo de Tabela Separadamente

A opção `--no-data` instrui o **mysqldump** a não despejar dados de tabela, resultando em um arquivo dump contendo apenas comandos para criar as tabelas. Inversamente, a opção `--no-create-info` instrui o **mysqldump** a suprimir as declarações `CREATE` da saída, de modo que o arquivo dump contenha apenas dados de tabela.

Por exemplo, para despejar as definições e os dados de tabela separadamente para o Database `test`, use estes comandos:

```sql
$> mysqldump --no-data test > dump-defs.sql
$> mysqldump --no-create-info test > dump-data.sql
```

Para um dump contendo apenas definições, adicione as opções `--routines` e `--events` para também incluir definições de stored routine e event:

```sql
$> mysqldump --no-data --routines --events test > dump-defs.sql
```
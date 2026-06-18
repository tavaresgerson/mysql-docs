#### 7.4.5.4 Definições e conteúdo da tabela de descarte separadamente

A opção `--no-data` informa ao **mysqldump** para não dumper os dados da tabela, resultando em um arquivo de dump que contém apenas instruções para criar as tabelas. Por outro lado, a opção `--no-create-info` informa ao **mysqldump** para suprimir as instruções `CREATE` do output, de modo que o arquivo de dump contenha apenas os dados das tabelas.

Por exemplo, para descartar as definições e os dados da tabela separadamente para o banco de dados `test`, use esses comandos:

```sh
$> mysqldump --no-data test > dump-defs.sql
$> mysqldump --no-create-info test > dump-data.sql
```

Para um dump que contenha apenas definições, adicione as opções `--routines` e `--events` para incluir também as definições de rotinas e eventos armazenados:

```sh
$> mysqldump --no-data --routines --events test > dump-defs.sql
```

### 24.4.18 A tabela INFORMATION_SCHEMA INNODB_SYS_DATAFILES

A tabela [`INNODB_SYS_DATAFILES`](https://pt.wikipedia.org/wiki/Tabela_SYS_DATAFILES) fornece informações sobre o caminho dos arquivos de dados para os espaços de tabela por arquivo `InnoDB` e espaços de tabela gerais, equivalentes às informações na tabela `SYS_DATAFILES` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.

Nota

A tabela `INFORMATION_SCHEMA` `FILES` relata metadados para todos os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, o espaço de tabela temporário e os espaços de tabela de rollback, se presentes.

A tabela [`INNODB_SYS_DATAFILES`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-sys-datafiles) tem as seguintes colunas:

- `ESPACO`

  O ID do espaço de tabelas.

- `PATH`

  Caminho do arquivo de dados do espaço de tabelas. Se um espaço de tabela file-per-table for criado em um local fora do diretório de dados do MySQL, o valor do caminho é um caminho de diretório totalmente qualificado. Caso contrário, o caminho é relativo ao diretório de dados.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57\G
*************************** 1. row ***************************
SPACE: 57
 PATH: ./test/t1.ibd
```

#### Notas

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

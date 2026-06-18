### 28.4.25 A tabela INFORMATION\_SCHEMA INNODB\_TABLESPACES\_BRIEF

A tabela `INNODB_TABLESPACES_BRIEF` fornece o ID do espaço, nome, caminho, sinalizador e tipo de espaço para espaços de tabelas por arquivo, gerais, desfazer e sistemas.

`INNODB_TABLESPACES` fornece os mesmos metadados, mas carrega mais lentamente porque outros metadados fornecidos pela tabela, como `FS_BLOCK_SIZE`, `FILE_SIZE` e `ALLOCATED_SIZE`, devem ser carregados dinamicamente.

Os metadados de espaço e caminho também são fornecidos pela tabela `INNODB_DATAFILES`.

A tabela `INNODB_TABLESPACES_BRIEF` tem essas colunas:

- `SPACE`

  O ID do espaço de tabelas.

- `NAME`

  O nome do espaço de tabelas. Para espaços de tabelas por arquivo, o nome é na forma de `schema/table_name`.

- `PATH`

  Caminho do arquivo de dados do espaço de tabelas. Se um espaço de tabela por arquivo for criado em um local fora do diretório de dados do MySQL, o valor do caminho é um caminho de diretório totalmente qualificado. Caso contrário, o caminho é relativo ao diretório de dados.

- `FLAG`

  Um valor numérico que representa informações de nível de bits sobre o formato do espaço de tabela e as características de armazenamento.

- `SPACE_TYPE`

  O tipo de espaço de tabela. Os valores possíveis incluem `General` para espaços de tabela gerais `InnoDB`, `Single` para espaços de tabela por arquivo `InnoDB` e `System` para o espaço de tabela do sistema `InnoDB`.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES_BRIEF WHERE SPACE = 7;
+-------+---------+---------------+-------+------------+
| SPACE | NAME    | PATH          | FLAG  | SPACE_TYPE |
+-------+---------+---------------+-------+------------+
| 7     | test/t1 | ./test/t1.ibd | 16417 | Single     |
+-------+---------+---------------+-------+------------+
```

#### Notas

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

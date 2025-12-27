### 28.4.25 A Tabela `INFORMATION_SCHEMA.INNODB_TABLESPACES_BRIEF`

A tabela `INNODB_TABLESPACES_BRIEF` fornece o ID do espaço, nome, caminho, sinalizador e tipo de espaço para espaços de tabelas por arquivo, gerais, de desfazer e de sistema.

A tabela `INNODB_TABLESPACES` fornece os mesmos metadados, mas carrega mais lentamente porque outros metadados fornecidos pela tabela, como `FS_BLOCK_SIZE`, `FILE_SIZE` e `ALLOCATED_SIZE`, devem ser carregados dinamicamente.

Os metadados de espaço e caminho também são fornecidos pela tabela `INNODB_DATAFILES`.

A tabela `INNODB_TABLESPACES_BRIEF` tem essas colunas:

* `SPACE`

  O ID do espaço de tabelas.

* `NAME`

  O nome do espaço de tabelas. Para espaços de tabelas por arquivo, o nome está na forma de *`schema/nome_tabela`*.

* `PATH`

  O caminho do arquivo de dados do espaço de tabelas. Se um espaço de tabelas por arquivo for criado em um local fora do diretório de dados do MySQL, o valor do caminho é um caminho de diretório totalmente qualificado. Caso contrário, o caminho é relativo ao diretório de dados.

* `FLAG`

  Um valor numérico que representa informações de nível de bit sobre o formato do espaço de tabelas e as características de armazenamento.

* `SPACE_TYPE`

  O tipo de espaço de tabelas. Os valores possíveis incluem `General` para espaços de tabelas `InnoDB` gerais, `Single` para espaços de tabelas `InnoDB` por arquivo e `System` para o espaço de tabelas `InnoDB` de sistema.

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

* Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
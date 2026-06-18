### 28.4.10 A tabela INFORMATION\_SCHEMA INNODB\_DATAFILES

A tabela `INNODB_DATAFILES` fornece informações sobre o caminho do arquivo de dados para os arquivos por tabela `InnoDB` e os espaços de tabela gerais.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Tabelas de Objetos do Schema InnoDB INFORMATION\_SCHEMA”.

Nota

A tabela `INFORMATION_SCHEMA` `FILES` relata metadados para os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, o espaço de tabela temporário global e os espaços de tabela de desfazer.

A tabela `INNODB_DATAFILES` tem essas colunas:

- `SPACE`

  O ID do espaço de tabelas.

- `PATH`

  Caminho do arquivo de dados do espaço de tabelas. Se um espaço de tabela por arquivo for criado em um local fora do diretório de dados do MySQL, o valor do caminho é um caminho de diretório totalmente qualificado. Caso contrário, o caminho é relativo ao diretório de dados.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_DATAFILES WHERE SPACE = 57\G
*************************** 1. row ***************************
SPACE: 57
 PATH: ./test/t1.ibd
```

#### Notas

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

### 28.4.10 A Tabela `INFORMATION_SCHEMA INNODB_DATAFILES`

A tabela `INNODB_DATAFILES` fornece informações sobre o caminho dos arquivos de dados para os espaços de dados `InnoDB` por tabela e espaços de dados gerais.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de esquema do `INFORMATION_SCHEMA` da InnoDB”.

Observação

A tabela `FILES` do `INFORMATION_SCHEMA` relata metadados para os tipos de espaço de dados `InnoDB`, incluindo espaços de dados por tabela, espaços de dados gerais, o espaço de dados do sistema, o espaço de dados temporários globais e os espaços de dados de undo.

A tabela `INNODB_DATAFILES` tem as seguintes colunas:

* `SPACE`

  O ID do espaço de dados.

* `PATH`

  O caminho do arquivo de dados do espaço de dados. Se um espaço de dados por tabela for criado em um local externo ao diretório de dados do MySQL, o valor do caminho é um caminho de diretório totalmente qualificado. Caso contrário, o caminho é relativo ao diretório de dados.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_DATAFILES WHERE SPACE = 57\G
*************************** 1. row ***************************
SPACE: 57
 PATH: ./test/t1.ibd
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
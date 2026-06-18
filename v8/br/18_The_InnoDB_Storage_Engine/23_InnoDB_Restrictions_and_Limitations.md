## 17.23 Restrições e Limitações do InnoDB

Esta seção descreve as restrições e limitações do motor de armazenamento `InnoDB`.

- Você não pode criar uma tabela com um nome de coluna que coincida com o nome de uma coluna interna `InnoDB` (incluindo `DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). Esta restrição se aplica ao uso dos nomes em qualquer caso de letra.

  ```
  mysql> CREATE TABLE t1 (c1 INT, db_row_id INT) ENGINE=INNODB;
  ERROR 1166 (42000): Incorrect column name 'db_row_id'
  ```

- `SHOW TABLE STATUS` não fornece estatísticas precisas para as tabelas `InnoDB` exceto pelo tamanho físico reservado pela tabela. O número de linhas é apenas uma estimativa aproximada usada na otimização do SQL.

- `InnoDB` não mantém uma contagem interna de linhas em uma tabela porque transações concorrentes podem "ver" números diferentes de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

  Para obter informações sobre como o `InnoDB` processa as declarações do `SELECT COUNT(*)`, consulte a descrição do `COUNT()` na Seção 14.19.1, “Descrição de Funções Agregadas”.

- `ROW_FORMAT=COMPRESSED` não é suportado para tamanhos de página maiores que 16 KB.

- Uma instância do MySQL que utiliza um tamanho de página específico `InnoDB` (`innodb_page_size`) não pode usar arquivos de dados ou arquivos de log de uma instância que utiliza um tamanho de página diferente.

- Para obter informações sobre as limitações associadas à importação de tabelas usando o recurso *Transportable Tablespaces*, consulte Limitações de Importação de Tabelas.

- Para as limitações associadas ao DDL online, consulte a Seção 17.12.8, “Limitações do DDL Online”.

- Para as limitações associadas aos espaços de tabela gerais, consulte Limitações de Espaço de Tabela Geral.

- Para as limitações associadas à criptografia de dados em repouso, consulte Limitações de criptografia.

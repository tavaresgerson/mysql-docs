## 14.24 Restrições e Limitações do InnoDB

Esta seção descreve as restrições e limitações do mecanismo de armazenamento `InnoDB`.

- Você não pode criar uma tabela com um nome de coluna que coincida com o nome de uma coluna interna do `InnoDB` (incluindo `DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). Esta restrição se aplica ao uso dos nomes em qualquer caso de letra.

  ```sql
  mysql> CREATE TABLE t1 (c1 INT, db_row_id INT) ENGINE=INNODB;
  ERROR 1166 (42000): Incorrect column name 'db_row_id'
  ```

- A opção `SHOW TABLE STATUS` não fornece estatísticas precisas para as tabelas `InnoDB`, exceto pelo tamanho físico reservado pela tabela. O número de linhas é apenas uma estimativa aproximada usada na otimização do SQL.

- O `InnoDB` não mantém um contagem interna de linhas em uma tabela porque transações concorrentes podem "ver" números diferentes de linhas ao mesmo tempo. Consequentemente, as instruções `SELECT COUNT(*)` contam apenas as linhas visíveis para a transação atual.

  Para obter informações sobre como o `InnoDB` processa as instruções `SELECT COUNT(*)`, consulte a descrição da função `COUNT()` na Seção 12.19.1, “Descrição de Funções Agregadas”.

- `ROW_FORMAT=COMPRESSED` não é suportado para tamanhos de página maiores que 16 KB.

- Uma instância do MySQL que utiliza um tamanho de página específico do `InnoDB` (`innodb_page_size`) não pode usar arquivos de dados ou arquivos de log de uma instância que utiliza um tamanho de página diferente.

- Para obter informações sobre as limitações associadas à importação de tabelas usando o recurso *Transportable Tablespaces*, consulte Limitações de Importação de Tabelas.

- Para as limitações associadas ao DDL online, consulte a Seção 14.13.6, “Limitações do DDL Online”.

- Para as limitações associadas aos espaços de tabela gerais, consulte Limitações de Espaço de Tabela Geral.

- Para as limitações associadas à criptografia de dados em repouso, consulte Limitações de criptografia.

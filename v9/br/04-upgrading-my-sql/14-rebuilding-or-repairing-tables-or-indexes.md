## 3.14 Reestruturação ou reparo de tabelas ou índices

Esta seção descreve como reestruturar ou reparar tabelas ou índices, o que pode ser necessário devido a:

* Alterações no modo como o MySQL lida com tipos de dados ou conjuntos de caracteres. Por exemplo, um erro em uma colagem pode ter sido corrigido, exigindo uma reestruturação da tabela para atualizar os índices para colunas de caracteres que usam a colagem.

* Reparos ou atualizações de tabela exigidas pelo `CHECK TABLE` ou **mysqlcheck**.

Os métodos para reestruturar uma tabela incluem:

* Método de Dump e Recarga
* Método ALTER TABLE
* Método REPAIR TABLE

### Método de Dump e Recarga

Se você estiver reestruturando tabelas porque uma versão diferente do MySQL não consegue lidar com elas após uma atualização ou downgrade binário (em local), você deve usar o método de dump-and-reload. Faça o dump das tabelas *antes* de atualizar ou desatualizar usando sua versão original do MySQL. Em seguida, recarregue as tabelas *depois* de atualizar ou desatualizar.

Se você usar o método de dump-and-reload de reestruturação de tabelas apenas para o propósito de reestruturar índices, você pode fazer o dump antes ou depois de atualizar ou desatualizar. A recarga ainda deve ser feita depois.

Se você precisar reestruturar uma tabela `InnoDB` porque uma operação `CHECK TABLE` indica que uma atualização da tabela é necessária, use **mysqldump** para criar um arquivo de dump e **mysql** para recarregar o arquivo. Se a operação `CHECK TABLE` indicar que há uma corrupção ou faz com que o `InnoDB` falhe, consulte a Seção 17.20.3, “Forçando a recuperação do InnoDB” para informações sobre o uso da opção `innodb_force_recovery` para reiniciar o `InnoDB`. Para entender o tipo de problema que a `CHECK TABLE` pode estar enfrentando, consulte as notas do `InnoDB` na Seção 15.7.3.2, “Instrução CHECK TABLE”.

Para reconstruir uma tabela descartando e recarregando ela, use **mysqldump** para criar um arquivo de dump e **mysql** para recarregar o arquivo:

```
mysqldump db_name t1 > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tabelas em um único banco de dados, especifique o nome do banco de dados sem nenhum nome de tabela subsequente:

```
mysqldump db_name > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tabelas em todos os bancos de dados, use a opção `--all-databases`:

```
mysqldump --all-databases > dump.sql
mysql < dump.sql
```

### Método ALTER TABLE

Para reconstruir uma tabela com `ALTER TABLE`, use uma alteração “nulo”; ou seja, uma instrução `ALTER TABLE` que “altera” a tabela para usar o mecanismo de armazenamento que ela já possui. Por exemplo, se `t1` é uma tabela `InnoDB`, use esta instrução:

```
ALTER TABLE t1 ENGINE = InnoDB;
```

Se você não tiver certeza de qual mecanismo de armazenamento especificar na instrução `ALTER TABLE`, use `SHOW CREATE TABLE` para exibir a definição da tabela.

### Método REPAIR TABLE

O método `REPAIR TABLE` é aplicável apenas a tabelas `MyISAM`, `ARCHIVE` e `CSV`.

Você pode usar `REPAIR TABLE` se a operação de verificação da tabela indicar que há uma corrupção ou que é necessário um upgrade. Por exemplo, para reparar uma tabela `MyISAM`, use esta instrução:

```
REPAIR TABLE t1;
```

**mysqlcheck --repair** fornece acesso à linha de comando à instrução `REPAIR TABLE`. Isso pode ser um meio mais conveniente de reparar tabelas porque você pode usar a opção `--databases` ou `--all-databases` para reparar todas as tabelas em bancos de dados específicos ou todos os bancos de dados, respectivamente:

```
mysqlcheck --repair --databases db_name ...
mysqlcheck --repair --all-databases
```
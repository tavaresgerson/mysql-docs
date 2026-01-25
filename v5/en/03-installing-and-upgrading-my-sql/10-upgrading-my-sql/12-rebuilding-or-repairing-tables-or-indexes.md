### 2.10.12 Reconstruindo ou Reparando Tables ou Indexes

Esta seção descreve como reconstruir ou reparar tables ou indexes, o que pode ser necessário devido a:

* Alterações na forma como o MySQL lida com *data types* (tipos de dados) ou *character sets* (conjuntos de caracteres). Por exemplo, um erro em uma *collation* (agrupamento) pode ter sido corrigido, exigindo uma reconstrução da table para atualizar os indexes para colunas de caracteres que usam essa *collation*.

* Reparos ou *upgrades* de table exigidos e relatados por `CHECK TABLE`, **mysqlcheck** ou **mysql_upgrade**.

Os métodos para reconstruir uma table incluem:

* Método Dump e Reload
* Método ALTER TABLE
* Método REPAIR TABLE

#### Método Dump e Reload

Se você estiver reconstruindo tables porque uma versão diferente do MySQL não consegue lidar com elas após um *upgrade* ou *downgrade* binário (*in-place*), você deve usar o método *dump*-e-*reload*. Faça o *dump* das tables *antes* de realizar o *upgrade* ou *downgrade*, usando sua versão original do MySQL. Em seguida, faça o *reload* das tables *após* o *upgrade* ou *downgrade*.

Se você usar o método *dump*-e-*reload* para reconstruir tables apenas com o objetivo de reconstruir indexes, você pode realizar o *dump* antes ou depois do *upgrade* ou *downgrade*. O *reloading* (recarregamento) ainda deve ser feito posteriormente.

Se você precisar reconstruir uma table `InnoDB` porque uma operação `CHECK TABLE` indica que um *upgrade* da table é necessário, use **mysqldump** para criar um arquivo de *dump* e **mysql** para recarregar o arquivo (*reload*). Se a operação `CHECK TABLE` indicar que há uma *corruption* (corrupção) ou fizer com que o `InnoDB` falhe, consulte a Seção 14.22.2, “Forçando a Recuperação do InnoDB” para obter informações sobre o uso da opção `innodb_force_recovery` para reiniciar o `InnoDB`. Para entender o tipo de problema que `CHECK TABLE` pode estar encontrando, consulte as notas do `InnoDB` na Seção 13.7.2.2, “CHECK TABLE Statement”.

Para reconstruir uma table fazendo seu *dump* e *reload*, use **mysqldump** para criar um arquivo de *dump* e **mysql** para recarregar o arquivo:

```sql
mysqldump db_name t1 > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tables em um único Database, especifique o nome do Database sem nenhum nome de table subsequente:

```sql
mysqldump db_name > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tables em todos os Databases, use a opção `--all-databases`:

```sql
mysqldump --all-databases > dump.sql
mysql < dump.sql
```

#### Método ALTER TABLE

Para reconstruir uma table com `ALTER TABLE`, use uma alteração “nula”; ou seja, uma instrução `ALTER TABLE` que “muda” a table para usar o *storage engine* que ela já possui. Por exemplo, se `t1` for uma table `InnoDB`, use esta instrução:

```sql
ALTER TABLE t1 ENGINE = InnoDB;
```

Se você não tiver certeza de qual *storage engine* especificar na instrução `ALTER TABLE`, use `SHOW CREATE TABLE` para exibir a definição da table.

#### Método REPAIR TABLE

O método `REPAIR TABLE` é aplicável apenas a tables `MyISAM`, `ARCHIVE` e `CSV`.

Você pode usar `REPAIR TABLE` se a operação de checagem da table indicar que há uma *corruption* (corrupção) ou que um *upgrade* é necessário. Por exemplo, para reparar uma table `MyISAM`, use esta instrução:

```sql
REPAIR TABLE t1;
```

**mysqlcheck --repair** fornece acesso via linha de comando à instrução `REPAIR TABLE`. Este pode ser um meio mais conveniente de reparar tables, pois você pode usar a opção `--databases` ou `--all-databases` para reparar todas as tables em Databases específicos ou em todos os Databases, respectivamente:

```sql
mysqlcheck --repair --databases db_name ...
mysqlcheck --repair --all-databases
```

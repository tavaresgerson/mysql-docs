## 3.14 Refazendo ou reparando tabelas ou índices

Esta seção descreve como reconstruir ou reparar tabelas ou índices, o que pode ser necessário por:

* Alterações sobre como o MySQL lida com tipos de dados ou conjuntos de caracteres. Por exemplo, um erro em uma codificação pode ter sido corrigido, o que exige a reconstrução de uma tabela para atualizar os índices para colunas de caracteres que utilizam a codificação.

* Reparos ou atualizações de tabela necessárias relatadas por `CHECK TABLE`, **mysqlcheck** ou **mysql_upgrade**.

Os métodos para reconstruir uma tabela incluem:

* Método de descarte e recarga
* Método ALTER TABLE
* Método REPAIR TABLE

### Método de descarte e recarga

Se você está reconstruindo tabelas porque uma versão diferente do MySQL não as pode manipular após uma atualização ou downgrade binário (em local), você deve usar o método de dump e recarregar. Faça o dump das tabelas *antes* de fazer a atualização ou downgrade usando sua versão original do MySQL. Em seguida, recarregue as tabelas *depois* da atualização ou downgrade.

Se você usar o método de descarte e recarga para reconstruir tabelas apenas para a finalidade de reconstruir índices, você pode realizar o descarte antes ou depois da atualização ou redução. A recarga ainda deve ser feita posteriormente.

Se você precisar reconstruir uma tabela `InnoDB` porque uma operação `CHECK TABLE` indica que uma atualização da tabela é necessária, use **mysqldump** para criar um arquivo de dump e **mysql** para recarregar o arquivo. Se a operação `CHECK TABLE` indicar que há uma corrupção ou causa o `InnoDB` a falhar, consulte a Seção 17.21.3, “Forçando a Recuperação do InnoDB”, para obter informações sobre o uso da opção `innodb_force_recovery` para reiniciar o `InnoDB`. Para entender o tipo de problema que o `CHECK TABLE` pode estar enfrentando, consulte as notas do `InnoDB` na Seção 15.7.3.2, “Declaração CHECK TABLE”.

Para reconstruir uma tabela, descartando e recarregando-a, use **mysqldump** para criar um arquivo de dump e **mysql** para recarregar o arquivo:

```
mysqldump db_name t1 > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tabelas em um único banco de dados, especifique o nome do banco de dados sem qualquer nome de tabela subsequente:

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

Para reconstruir uma tabela com `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), use uma alteração “nulo”; ou seja, uma declaração `ALTER TABLE` que “altera” a tabela para usar o mecanismo de armazenamento que ela já tem. Por exemplo, se `t1` é uma tabela `InnoDB`, use esta declaração:

```
ALTER TABLE t1 ENGINE = InnoDB;
```

Se você não tiver certeza de qual motor de armazenamento especificar na declaração `ALTER TABLE`, use `SHOW CREATE TABLE` para exibir a definição da tabela.

### MÉTODO DE REPARAÇÃO DE TABELA

O método `REPAIR TABLE` só é aplicável às tabelas `MyISAM`, `ARCHIVE` e `CSV`.

Você pode usar `REPAIR TABLE` se a operação de verificação de tabela indicar que há uma corrupção ou que é necessário fazer uma atualização. Por exemplo, para reparar uma tabela `MyISAM`, use esta declaração:

```
REPAIR TABLE t1;
```

O **mysqlcheck --repair** oferece acesso à linha de comando à declaração `REPAIR TABLE`. Isso pode ser uma maneira mais conveniente de reparar tabelas, pois você pode usar a opção `--databases` ou `--all-databases` para reparar todas as tabelas em bancos de dados específicos ou todos os bancos de dados, respectivamente:

```
mysqlcheck --repair --databases db_name ...
mysqlcheck --repair --all-databases
```
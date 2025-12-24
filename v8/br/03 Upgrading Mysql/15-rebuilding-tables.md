## 3.14 Reconstrução ou reparação de tabelas ou índices

Esta secção descreve como reconstruir ou reparar tabelas ou índices, o que pode ser necessário por:

- Alterações na forma como o MySQL lida com tipos de dados ou conjuntos de caracteres. Por exemplo, um erro em uma coleta pode ter sido corrigido, necessitando de uma reconstrução de tabela para atualizar os índices para colunas de caracteres que usam a coleta.
- Reparações ou atualizações de tabelas necessárias relatadas por `CHECK TABLE` ou `mysqlcheck`.

Os métodos para reconstruir uma tabela incluem:

- Método de descarga e recarga
- Método ALTER TABLE
- Método

### Método de descarga e recarga

Se você estiver reconstruindo tabelas porque uma versão diferente do MySQL não pode lidar com elas após uma atualização ou degradação binária (in-place), você deve usar o método `dump-and-reload`. Descarregue as tabelas *before* upgrade ou downgrade usando sua versão original do MySQL. Em seguida, recarregue as tabelas *after* upgrade ou downgrade.

Se você usar o método `dump-and-reload` de reconstrução de tabelas apenas para fins de reconstrução de índices, você pode executar o dump antes ou depois de atualizar ou rebaixar. O recarregamento ainda deve ser feito depois.

Se você precisar reconstruir uma tabela `InnoDB` porque uma operação `CHECK TABLE` indica que uma atualização de tabela é necessária, use o `mysqldump` para criar um arquivo de despejo e o `mysql` para recarregar o arquivo. Se a operação `CHECK TABLE` indicar que há uma corrupção ou faz com que o `InnoDB` falhe, consulte a Seção 17.20.3, Forçando a Recuperação do InnoDB para obter informações sobre o uso da opção `innodb_force_recovery` para reiniciar o `InnoDB`.

Para reconstruir uma tabela por despejo e recarregar, use `mysqldump` para criar um arquivo de despejo e `mysql` para recarregar o arquivo:

```
mysqldump db_name t1 > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tabelas numa única base de dados, especifique o nome da base de dados sem qualquer dos seguintes nomes de tabela:

```
mysqldump db_name > dump.sql
mysql db_name < dump.sql
```

Para reconstruir todas as tabelas em todos os bancos de dados, use a opção `--all-databases`:

```
mysqldump --all-databases > dump.sql
mysql < dump.sql
```

### \[`ALTER TABLE`] Método

Para reconstruir uma tabela com `ALTER TABLE`, use uma alteração `null`; isto é, uma instrução `ALTER TABLE` que mude a tabela para usar o mecanismo de armazenamento que já tem. Por exemplo, se `t1` é uma tabela `InnoDB`, use esta instrução:

```
ALTER TABLE t1 ENGINE = InnoDB;
```

Se você não tiver certeza de qual motor de armazenamento especificar na instrução `ALTER TABLE`, use `SHOW CREATE TABLE` para exibir a definição da tabela.

### \[`REPAIR TABLE`] Método

O método `REPAIR TABLE` só é aplicável às tabelas `MyISAM`, `ARCHIVE`, e `CSV`.

Você pode usar `REPAIR TABLE` se a operação de verificação de tabela indicar que há uma corrupção ou que uma atualização é necessária. Por exemplo, para reparar uma tabela `MyISAM`, use esta instrução:

```
REPAIR TABLE t1;
```

`mysqlcheck --repair` fornece acesso de linha de comando para a instrução `REPAIR TABLE`. Isso pode ser um meio mais conveniente de reparar tabelas porque você pode usar a opção `--databases` ou `--all-databases` para reparar todas as tabelas em bancos de dados específicos ou todos os bancos de dados, respectivamente:

```
mysqlcheck --repair --databases db_name ...
mysqlcheck --repair --all-databases
```

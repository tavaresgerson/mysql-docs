### 14.22.2 Forçando a Recuperação do InnoDB

Para investigar a corrupção de páginas do Database, você pode despejar suas tabelas do Database com `SELECT ... INTO OUTFILE`. Geralmente, a maior parte dos dados obtidos dessa forma está intacta. Corrupções sérias podem fazer com que instruções `SELECT * FROM tbl_name` ou operações de fundo do `InnoDB` sejam encerradas ou asserções ocorram inesperadamente, ou até mesmo causem o *crash* da recuperação *roll-forward* do `InnoDB`. Nesses casos, você pode usar a opção `innodb_force_recovery` para forçar o *storage engine* `InnoDB` a iniciar, impedindo a execução de operações em segundo plano, para que você possa despejar suas tabelas. Por exemplo, você pode adicionar a seguinte linha à seção `[mysqld]` do seu arquivo de opções antes de reiniciar o servidor:

```sql
[mysqld]
innodb_force_recovery = 1
```

Para obter informações sobre como usar arquivos de opções, consulte a Seção 4.2.2.2, “Usando Arquivos de Opções”.

Aviso

Defina `innodb_force_recovery` para um valor maior que 0 apenas em uma situação de emergência, para que você possa iniciar o `InnoDB` e despejar suas tabelas. Antes de fazer isso, certifique-se de ter uma cópia de backup do seu Database, caso precise recriá-lo. Valores de 4 ou mais podem corromper permanentemente os arquivos de dados. Use uma configuração `innodb_force_recovery` de 4 ou mais em uma instância de servidor de produção somente após testar a configuração com sucesso em uma cópia física separada do seu Database. Ao forçar a recuperação do `InnoDB`, você deve sempre começar com `innodb_force_recovery=1` e aumentar o valor somente de forma incremental, conforme necessário.

`innodb_force_recovery` é 0 por padrão (inicialização normal sem recuperação forçada). Os valores não nulos permitidos para `innodb_force_recovery` são de 1 a 6. Um valor maior inclui a funcionalidade de valores menores. Por exemplo, um valor de 3 inclui toda a funcionalidade dos valores 1 e 2.

Se você conseguir despejar suas tabelas com um valor `innodb_force_recovery` de 3 ou menos, é relativamente seguro que apenas alguns dados em páginas individuais corrompidas serão perdidos. Um valor de 4 ou mais é considerado perigoso porque os arquivos de dados podem ser permanentemente corrompidos. Um valor de 6 é considerado drástico porque as páginas do Database são deixadas em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção em B-trees e outras estruturas do Database.

Como medida de segurança, o `InnoDB` impede operações `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Uma configuração `innodb_force_recovery` de 4 ou mais coloca o `InnoDB` em modo *read-only*.

*   `1` (`SRV_FORCE_IGNORE_CORRUPT`)

    Permite que o servidor seja executado mesmo que detecte uma página corrompida. Tenta fazer com que `SELECT * FROM tbl_name` salte sobre Index records e páginas corrompidas, o que ajuda a despejar tabelas.

*   `2` (`SRV_FORCE_NO_BACKGROUND`)

    Impede a execução do *master thread* e de quaisquer *purge threads*. Se uma saída inesperada pudesse ocorrer durante a operação de *purge*, este valor de recuperação a impede.

*   `3` (`SRV_FORCE_NO_TRX_UNDO`)

    Não executa *transaction rollbacks* (reversões de transação) após a recuperação de *crash*.

*   `4` (`SRV_FORCE_NO_IBUF_MERGE`)

    Impede operações de *insert buffer merge*. Se elas pudessem causar um *crash*, não as executa. Não calcula estatísticas da tabela. Este valor pode corromper permanentemente os arquivos de dados. Após usar este valor, esteja preparado para dar `DROP` e recriar todos os *secondary indexes*. Define o `InnoDB` como *read-only*.

*   `5` (`SRV_FORCE_NO_UNDO_LOG_SCAN`)

    Não procura por *undo logs* ao iniciar o Database: o `InnoDB` trata até mesmo transações incompletas como commitadas. Este valor pode corromper permanentemente os arquivos de dados. Define o `InnoDB` como *read-only*.

*   `6` (`SRV_FORCE_NO_LOG_REDO`)

    Não realiza o *redo log roll-forward* em conexão com a recuperação. Este valor pode corromper permanentemente os arquivos de dados. Deixa as páginas do Database em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção em B-trees e outras estruturas do Database. Define o `InnoDB` como *read-only*.

Você pode executar `SELECT` em tabelas para despejá-las. Com um valor `innodb_force_recovery` de 3 ou menos, você pode executar `DROP` ou `CREATE` em tabelas. `DROP TABLE` também é suportado com um valor `innodb_force_recovery` maior que 3, até o MySQL 5.7.17. A partir do MySQL 5.7.18, `DROP TABLE` não é permitido com um valor `innodb_force_recovery` maior que 4.

Se você souber que uma determinada tabela está causando uma saída inesperada durante o *rollback*, você pode dar `DROP` nela. Se você encontrar um *rollback* descontrolado causado por uma falha de importação em massa ou `ALTER TABLE`, você pode encerrar (*kill*) o processo **mysqld** e definir `innodb_force_recovery` para `3` para iniciar o Database sem o *rollback*, e então executar `DROP` na tabela que está causando o *rollback* descontrolado.

Se a corrupção dentro dos dados da tabela impedir você de despejar todo o conteúdo da tabela, uma *Query* com uma cláusula `ORDER BY primary_key DESC` pode ser capaz de despejar a porção da tabela após a parte corrompida.

Se um valor alto de `innodb_force_recovery` for necessário para iniciar o `InnoDB`, pode haver estruturas de dados corrompidas que podem fazer com que *Queries* complexas (*Queries* contendo `WHERE`, `ORDER BY` ou outras cláusulas) falhem. Nesse caso, você pode conseguir executar apenas *Queries* básicas `SELECT * FROM t`.
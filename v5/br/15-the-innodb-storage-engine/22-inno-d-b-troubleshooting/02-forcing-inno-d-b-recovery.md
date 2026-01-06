### 14.22.2 Forçar a recuperação do InnoDB

Para investigar a corrupção de páginas de banco de dados, você pode dumper suas tabelas do banco de dados com `SELECT ... INTO OUTFILE`. Geralmente, a maioria dos dados obtidos dessa maneira permanece intacta. A corrupção grave pode fazer com que as instruções `SELECT * FROM tbl_name` ou as operações de fundo do `InnoDB` saiam inesperadamente ou afirmem, ou até mesmo fazer com que a recuperação de avanço do `InnoDB` quebre. Nesses casos, você pode usar a opção `innodb_force_recovery` para forçar o motor de armazenamento `InnoDB` a ser iniciado, impedindo que as operações de fundo sejam executadas, para que você possa dumper suas tabelas. Por exemplo, você pode adicionar a seguinte linha à seção `[mysqld]` do seu arquivo de opções antes de reiniciar o servidor:

```sql
[mysqld]
innodb_force_recovery = 1
```

Para obter informações sobre o uso de arquivos de opção, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

Aviso

Apenas defina `innodb_force_recovery` para um valor maior que 0 em uma situação de emergência, para que você possa iniciar o `InnoDB` e fazer o dump de suas tabelas. Antes de fazer isso, certifique-se de ter uma cópia de backup do seu banco de dados, caso precise recriá-lo. Valores de 4 ou maiores podem corromper permanentemente os arquivos de dados. Use apenas um ajuste de `innodb_force_recovery` de 4 ou maior em uma instância do servidor de produção após ter testado com sucesso o ajuste em uma cópia física separada do seu banco de dados. Ao forçar a recuperação do `InnoDB`, você deve sempre começar com `innodb_force_recovery=1` e aumentar o valor apenas incrementalmente, conforme necessário.

`innodb_force_recovery` é 0 por padrão (inicialização normal sem recuperação forçada). Os valores não nulos permitidos para `innodb_force_recovery` são de 1 a 6. Um valor maior inclui a funcionalidade de valores menores. Por exemplo, um valor de 3 inclui toda a funcionalidade dos valores 1 e 2.

Se você conseguir descartar suas tabelas com um valor de `innodb_force_recovery` de 3 ou menos, então você está relativamente seguro de que apenas alguns dados em páginas individuais corrompidas estão perdidos. Um valor de 4 ou maior é considerado perigoso porque os arquivos de dados podem ser permanentemente corrompidos. Um valor de 6 é considerado drástico porque as páginas do banco de dados são deixadas em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção nas árvores B e em outras estruturas do banco de dados.

Como medida de segurança, o `InnoDB` impede as operações `INSERT`, `UPDATE` ou `DELETE` quando o `innodb_force_recovery` é maior que 0. Um valor de `innodb_force_recovery` de 4 ou superior coloca o `InnoDB` no modo de leitura somente.

- `1` (`SRV_FORCE_IGNORE_CORRUPT`)

  Permite que o servidor continue funcionando mesmo quando detecta uma página corrompida. Tenta fazer com que `SELECT * FROM tbl_name` ignore registros e páginas de índice corrompidos, o que ajuda no descarte de tabelas.

- `2` (`SRV_FORCE_NO_BACKGROUND`)

  Previne que o fio mestre e quaisquer fios de purga sejam executados. Se uma saída inesperada ocorrer durante a operação de purga, esse valor de recuperação a impede.

- `3` (`SRV_FORCE_NO_TRX_UNDO`)

  Não executa recuos de transações após a recuperação de falhas.

- `4` (`SRV_FORCE_NO_IBUF_MERGE`)

  Previne operações de junção do buffer de inserção. Se elas causarem um crash, não as executa. Não calcula estatísticas de tabela. Esse valor pode corromper permanentemente os arquivos de dados. Após usar esse valor, esteja preparado para excluir e recriar todos os índices secundários. Define `InnoDB` como somente leitura.

- `5` (`SRV_FORCE_NO_UNDO_LOG_SCAN`)

  Não verifica os registros de desfazer ao iniciar o banco de dados: o `InnoDB` trata até mesmo as transações incompletas como confirmadas. Esse valor pode corromper permanentemente os arquivos de dados. Defina o `InnoDB` como somente leitura.

- `6` (`SRV_FORCE_NO_LOG_REDO`)

  Não faz o registro de revisão avançar na recuperação. Esse valor pode corromper permanentemente os arquivos de dados. Deixa as páginas do banco de dados em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção nas árvores B e em outras estruturas do banco de dados. Define o `InnoDB` como somente leitura.

Você pode `SELECT` de tabelas para excluí-las. Com um valor de `innodb_force_recovery` de 3 ou menos, você pode `DROP` ou `CREATE` tabelas. `DROP TABLE` também é suportado com um valor de `innodb_force_recovery` maior que 3, até o MySQL 5.7.17. A partir do MySQL 5.7.18, `DROP TABLE` não é permitido com um valor de `innodb_force_recovery` maior que 4.

Se você sabe que uma determinada tabela está causando uma saída inesperada durante o rollback, você pode excluí-la. Se você encontrar um rollback descontrolado causado por uma importação em massa falhando ou por uma alteração na tabela, você pode matar o processo **mysqld** e definir o `innodb_force_recovery` para `3` para restaurar o banco de dados sem o rollback, e depois excluir a tabela que está causando o rollback descontrolado.

Se a corrupção nos dados da tabela impedir que você descarte todo o conteúdo da tabela, uma consulta com a cláusula `ORDER BY primary_key DESC` pode ser capaz de descarregar a parte da tabela após a parte corrompida.

Se for necessário um valor alto de `innodb_force_recovery` para iniciar o `InnoDB`, podem haver estruturas de dados corrompidas que podem causar falhas em consultas complexas (consultas que contêm `WHERE`, `ORDER BY` ou outras cláusulas). Nesse caso, você pode apenas ser capaz de executar consultas básicas `SELECT * FROM t`.

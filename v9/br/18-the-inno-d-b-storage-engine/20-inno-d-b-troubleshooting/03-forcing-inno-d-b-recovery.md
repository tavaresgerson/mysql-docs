### 17.20.3 Forçar a Recuperação do InnoDB

Para investigar a corrupção de páginas do banco de dados, você pode fazer o dump de suas tabelas do banco de dados com `SELECT ... INTO OUTFILE`. Normalmente, a maioria dos dados obtidos dessa maneira permanece intacta. A corrupção grave pode fazer com que as instruções `SELECT * FROM tbl_name` ou as operações de fundo do `InnoDB` saiam inesperadamente ou afirmem, ou até mesmo fazer com que a recuperação de avanço do `InnoDB` quebre. Nesses casos, você pode usar a opção `innodb_force_recovery` para forçar o motor de armazenamento do `InnoDB` a ser iniciado enquanto impede que as operações de fundo sejam executadas, para que você possa fazer o dump de suas tabelas. Por exemplo, você pode adicionar a seguinte linha na seção `[mysqld]` do seu arquivo de opções antes de reiniciar o servidor:

```
[mysqld]
innodb_force_recovery = 1
```

Para obter informações sobre o uso de arquivos de opções, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

Aviso

Defina `innodb_force_recovery` apenas para um valor maior que 0 em situações de emergência, para que você possa iniciar o `InnoDB` e fazer o dump de suas tabelas. Antes de fazer isso, certifique-se de ter uma cópia de backup do seu banco de dados, caso você precise recriá-lo. Valores de 4 ou maiores podem corromper permanentemente os arquivos de dados. Use apenas um ajuste de `innodb_force_recovery` de 4 ou maior em uma instância do servidor de produção após ter testado com sucesso o ajuste em uma cópia física separada do seu banco de dados. Ao forçar a recuperação do `InnoDB`, você deve sempre começar com `innodb_force_recovery=1` e aumentar o valor apenas incrementalmente, conforme necessário.

`innodb_force_recovery` é 0 por padrão (início normal sem recuperação forçada). Os valores não nulos permitidos para `innodb_force_recovery` são 1 a 6. Um valor maior inclui a funcionalidade de valores menores. Por exemplo, um valor de 3 inclui toda a funcionalidade dos valores 1 e 2.

Se você conseguir descartar suas tabelas com um valor de `innodb_force_recovery` de 3 ou menos, então você está relativamente seguro de que apenas alguns dados em páginas individuais corrompidas estão perdidos. Um valor de 4 ou maior é considerado perigoso porque os arquivos de dados podem ser corrompidos permanentemente. Um valor de 6 é considerado drástico porque as páginas do banco de dados são deixadas em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção nas árvores B e outras estruturas do banco de dados.

Como medida de segurança, o `InnoDB` impede operações de `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Um valor de `innodb_force_recovery` de 4 ou maior coloca o `InnoDB` no modo de leitura apenas.

* `1` (`SRV_FORCE_IGNORE_CORRUPT`)

  Permite que o servidor seja executado mesmo se ele detectar uma página corrompida. Tenta fazer com que o `SELECT * FROM tbl_name` pule registros e páginas de índice corrompidas, o que ajuda no descarte de tabelas.

* `2` (`SRV_FORCE_NO_BACKGROUND`)

  Previne o thread mestre e quaisquer threads de purga de serem executados. Se uma saída inesperada ocorrer durante a operação de purga, esse valor de recuperação a impede.

* `3` (`SRV_FORCE_NO_TRX_UNDO`)

  Não executa recuos de transações após a recuperação de falha.

* `4` (`SRV_FORCE_NO_IBUF_MERGE`)

  Previne operações de fusão do buffer de inserção. Se elas causarem uma falha, não as executa. Não calcula estatísticas de tabela. Esse valor pode corromper permanentemente os arquivos de dados. Após usar esse valor, esteja preparado para descartar e recriar todos os índices secundários. Define o `InnoDB` no modo de leitura apenas.

* `5` (`SRV_FORCE_NO_UNDO_LOG_SCAN`)

  Não consulta os logs de undo ao iniciar o banco de dados: o `InnoDB` trata até mesmo transações incompletas como comprometidas. Esse valor pode corromper permanentemente os arquivos de dados. Define o `InnoDB` no modo de leitura apenas.

* `6` (`SRV_FORCE_NO_LOG_REDO`)

Não realiza o avanço do log de refazer em conexão com a recuperação. Esse valor pode corromper permanentemente os arquivos de dados. Deixa as páginas do banco de dados em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção nas árvores B e em outras estruturas do banco de dados. Define `InnoDB` como somente leitura.

Você pode `SELECT` de tabelas para fazer um dump delas. Com um valor de `innodb_force_recovery` de 3 ou menos, você pode `DROP` ou `CREATE` tabelas. `DROP TABLE` também é suportado com um valor de `innodb_force_recovery` maior que 3. `DROP TABLE` não é permitido com um valor de `innodb_force_recovery` maior que 4.

Se você sabe que uma determinada tabela está causando uma saída inesperada no rollback, você pode eliminá-la. Se você encontrar um rollback descontrolado causado por uma importação em massa falhando ou por `ALTER TABLE`, você pode matar o processo **mysqld** e definir `innodb_force_recovery` para `3` para fazer o banco de dados funcionar sem o rollback, e depois `DROP` a tabela que está causando o rollback descontrolado.

Se a corrupção nos dados da tabela impedir que você faça um dump do conteúdo inteiro da tabela, uma consulta com uma cláusula `ORDER BY primary_key DESC` pode ser capaz de fazer o dump da parte da tabela após a parte corrompida.

Se um valor alto de `innodb_force_recovery` é necessário para iniciar o `InnoDB`, pode haver estruturas de dados corrompidas que poderiam causar consultas complexas (consultas que contêm `WHERE`, `ORDER BY` ou outras cláusulas) falharem. Nesse caso, você pode apenas ser capaz de executar consultas básicas `SELECT * FROM t`.
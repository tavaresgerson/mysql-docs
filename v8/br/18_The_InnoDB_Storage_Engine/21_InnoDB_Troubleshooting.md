## 17.21 Solução de problemas do InnoDB

As seguintes diretrizes gerais se aplicam ao solução de problemas de `InnoDB`:

* Quando uma operação falha ou você suspeita de um erro, consulte o log de erro do servidor MySQL (consulte a Seção 7.4.2, "O Log de Erro"). A Referência de Mensagem de Erro do Servidor fornece informações de solução de problemas para alguns dos erros específicos do `InnoDB` que você pode encontrar.

* Se a falha estiver relacionada a um bloqueio, execute com a opção `innodb_print_all_deadlocks` habilitada para que detalhes sobre cada bloqueio sejam impressos no log de erro do servidor MySQL. Para informações sobre bloqueios, consulte a Seção 17.7.5, “Bloqueios no InnoDB”.

* Se o problema estiver relacionado ao dicionário de dados `InnoDB`, consulte a Seção 17.21.4, “Solucionando operações de dicionário de dados InnoDB”.

* Ao resolver problemas, geralmente é melhor executar o servidor MySQL a partir do prompt de comando, em vez de através do **mysqld_safe** ou como um serviço do Windows. Você pode então ver o que o **mysqld** imprime no console e, assim, ter uma melhor compreensão do que está acontecendo. No Windows, inicie o **mysqld** com a opção `--console` para direcionar a saída para a janela do console.

* Ative os monitores `InnoDB` para obter informações sobre um problema (consulte a Seção 17.17, “Monitores InnoDB”). Se o problema estiver relacionado ao desempenho ou se o servidor parecer estar parado, você deve ativar o monitor padrão para imprimir informações sobre o estado interno do `InnoDB`. Se o problema estiver relacionado a bloqueios, ative o Monitor de Bloqueio. Se o problema estiver relacionado à criação de tabelas, aos espaços de armazenamento ou às operações do dicionário de dados, consulte as tabelas do esquema de informações do InnoDB [InnoDB Information Schema][(innodb-information-schema-system-tables.html "17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables")] para examinar o conteúdo do dicionário de dados interno `InnoDB`.

`InnoDB` habilita temporariamente a saída padrão do Monitor `InnoDB` nas seguintes condições:

+ Uma longa espera de semaforo
  + `InnoDB` não consegue encontrar blocos livres no pool de buffer

+ Mais de 67% do pool de tampão é ocupado por pilhas de bloqueio ou o índice de hash adaptativo

* Se você suspeitar que uma tabela está corrompida, execute `CHECK TABLE` nessa tabela.

### 17.21.1 Solução de problemas de I/O do InnoDB

Os passos para solucionar problemas de entrada/saída do `InnoDB` dependem de quando o problema ocorre: durante o início do servidor MySQL ou durante operações normais, quando uma declaração DML ou DDL falha devido a problemas no nível do sistema de arquivos.

#### Problemas de Inicialização

Se algo der errado quando o `InnoDB` tenta inicializar seu espaço de tabela ou seus arquivos de log, exclua todos os arquivos criados pelo `InnoDB`: todos os arquivos `ibdata` e todos os arquivos de log de refazer (arquivos `#ib_redoN` no MySQL 8.0.30 e versões posteriores ou arquivos `ib_logfile` em versões anteriores). Se você criou quaisquer `InnoDB` tabelas, também exclua todos os arquivos `.ibd` dos diretórios do banco de dados MySQL. Em seguida, tente inicializar novamente o `InnoDB`. Para uma solução mais fácil, inicie o servidor MySQL a partir de um prompt de comando para que você veja o que está acontecendo.

#### Problemas de execução

Se o `InnoDB` imprimir um erro de sistema operacional durante uma operação de arquivo, geralmente o problema tem uma das seguintes soluções:

* Certifique-se de que o diretório do arquivo de dados `InnoDB` e o diretório de registro `InnoDB` existam.

* Certifique-se de que o **mysqld** tenha direitos de acesso para criar arquivos nesses diretórios.

* Certifique-se de que o **mysqld** possa ler o arquivo de opção apropriado `my.cnf` ou `my.ini`, para que ele comece com as opções que você especificou.

* Certifique-se de que o disco não está cheio e que você não está excedendo qualquer cota de disco.

* Certifique-se de que os nomes que você especificar para subdiretórios e arquivos de dados não entrem em conflito.

* Verifique novamente a sintaxe dos valores `innodb_data_home_dir` e `innodb_data_file_path`. Em particular, qualquer valor `MAX` na opção `innodb_data_file_path` é um limite rígido, e exceder esse limite causa um erro fatal.

### 17.21.2 Solução de problemas em falhas de recuperação

A partir do MySQL 8.0.26, os pontos de verificação e o avanço do LSN (Localizador de Registro de Revisão) não são permitidos até que a recuperação do log de revisão esteja completa e os metadados dinâmicos do dicionário de dados (`srv_dict_metadata`) sejam transferidos para os objetos da tabela do dicionário de dados (`dict_table_t`). Se o log de revisão ficar sem espaço durante a recuperação ou após a recuperação (mas antes de os metadados dinâmicos do dicionário de dados serem transferidos para os objetos da tabela do dicionário de dados) como resultado dessa mudança, pode ser necessário um reinício do `innodb_force_recovery`, começando com pelo menos a configuração do `SRV_FORCE_NO_IBUF_MERGE` ou, no caso de falha, a configuração do `SRV_FORCE_NO_LOG_REDO`. Se um reinício do `innodb_force_recovery` falhar nesse cenário, a recuperação a partir do backup pode ser necessária. (Bug #32200595)

### 17.21.3 Forçando a recuperação do InnoDB

Para investigar a corrupção de páginas de banco de dados, você pode descartar suas tabelas do banco de dados com `SELECT ... INTO OUTFILE` (select-into.html "15.2.13.1 SELECT ... INTO Statement"). Geralmente, a maioria dos dados obtidos dessa maneira permanece intacta. A corrupção grave pode causar `SELECT * FROM tbl_name` declarações ou operações de `InnoDB` de fundo a sair ou afirmar inesperadamente, ou até mesmo causar o `InnoDB` recuperação de rolagem para falhar. Nesses casos, você pode usar a opção `innodb_force_recovery` para forçar o motor de armazenamento `InnoDB` a iniciar enquanto impede que as operações de fundo sejam executadas, para que você possa descartar suas tabelas. Por exemplo, você pode adicionar a seguinte linha à seção `[mysqld]` do seu arquivo de opção antes de reiniciar o servidor:

```
[mysqld]
innodb_force_recovery = 1
```

Para obter informações sobre o uso de arquivos de opção, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

Aviso

Apenas defina `innodb_force_recovery` para um valor maior que 0 em uma situação de emergência, para que você possa iniciar `InnoDB` e descartar suas tabelas. Antes de fazer isso, garanta que você tenha uma cópia de segurança do seu banco de dados, caso precise recriá-lo. Valores de 4 ou maiores podem corromper permanentemente os arquivos de dados. Use apenas um `innodb_force_recovery` com configuração de 4 ou maior em uma instância do servidor de produção após ter testado com sucesso a configuração em uma cópia física separada do seu banco de dados. Ao forçar a recuperação de `InnoDB`, você deve sempre começar com `innodb_force_recovery=1` e aumentar o valor apenas incrementalmente, conforme necessário.

`innodb_force_recovery` é 0 por padrão (inicialização normal sem recuperação forçada). Os valores não nulos permitidos para `innodb_force_recovery` são de 1 a 6. Um valor maior inclui a funcionalidade de valores menores. Por exemplo, um valor de 3 inclui toda a funcionalidade dos valores 1 e 2.

Se você conseguir descartar suas tabelas com um valor de `innodb_force_recovery` de 3 ou menos, então você está relativamente seguro de que apenas alguns dados em páginas individuais corrompidas estão perdidos. Um valor de 4 ou maior é considerado perigoso, pois os arquivos de dados podem ser permanentemente corrompidos. Um valor de 6 é considerado drástico, pois as páginas do banco de dados são deixadas em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção em B-trees e outras estruturas de banco de dados.

Como medida de segurança, `InnoDB` impede operações de `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Uma configuração de `innodb_force_recovery` de 4 ou superior coloca `InnoDB` em modo de leitura somente.

* `1` (`SRV_FORCE_IGNORE_CORRUPT`)

Permite que o servidor funcione mesmo se detectar uma página corrupta. Tenta fazer com que `SELECT * FROM tbl_name` ignore registros e páginas de índice corruptos, o que ajuda a drenar tabelas.

* `2` (`SRV_FORCE_NO_BACKGROUND`)

Previne o [thread mestre][(glossary.html#glos_master_thread "master thread")] e qualquer [purga de threads][(glossary.html#glos_purge_thread "purge thread")] de serem executados. Se uma saída inesperada ocorrer durante a operação de purga, este valor de recuperação a impede.

* `3` (`SRV_FORCE_NO_TRX_UNDO`)

Não executa rollback de transações após a recuperação após o crash.

* `4` (`SRV_FORCE_NO_IBUF_MERGE`)

Previne operações de junção [inserir tampão][(glossary.html#glos_insert_buffer "insert buffer")]. Se elas causarem um crash, não as realiza. Não calcula estatísticas de tabela. Este valor pode corromper permanentemente os arquivos de dados. Após usar este valor, esteja preparado para descartar e recriar todos os índices secundários. Define `InnoDB` para leitura somente.

* `5` (`SRV_FORCE_NO_UNDO_LOG_SCAN`)

Não verifica os registros de [undo][(glossary.html#glos_undo_log "undo log")] ao iniciar o banco de dados: `InnoDB` trata até mesmo as transações incompletas como comprometidas. Esse valor pode corromper permanentemente os arquivos de dados. Defina `InnoDB` como somente leitura.

* `6` (`SRV_FORCE_NO_LOG_REDO`)

Não faz o registro de refazer retroceder em relação à recuperação. Esse valor pode corromper permanentemente os arquivos de dados. Deixa as páginas do banco de dados em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção nas árvores B e outras estruturas do banco de dados. Define `InnoDB` como somente leitura.

Você pode `SELECT` de tabelas para descartá-las. Com um valor `innodb_force_recovery` de 3 ou menos, você pode `DROP` ou `CREATE` tabelas. [`DROP TABLE`(drop-table.html "15.1.32 DROP TABLE Statement") também é suportado com um valor `innodb_force_recovery` maior que 3. `DROP TABLE` não é permitido com um valor `innodb_force_recovery` maior que 4.

Se você sabe que uma determinada tabela está causando uma saída inesperada no rollback, você pode descartá-la. Se você encontrar um rollback descontrolado causado por uma importação em massa falhando ou `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), você pode matar o processo **mysqld** e definir `innodb_force_recovery` para `3` para fazer o banco de dados funcionar sem o rollback, e depois `DROP` a tabela que está causando o rollback descontrolado.

Se a corrupção nos dados da tabela impedir que você descarte todo o conteúdo da tabela, uma consulta com uma cláusula `ORDER BY primary_key DESC` pode ser capaz de descarregar a parte da tabela após a parte corrupta.

Se for necessário um valor elevado de `innodb_force_recovery` para iniciar `InnoDB`, pode haver estruturas de dados corrompidas que poderiam causar falhas em consultas complexas (consultas que contêm `WHERE`, `ORDER BY` ou outras cláusulas). Nesse caso, você pode apenas ser capaz de executar consultas básicas de `SELECT * FROM t`.

### 17.21.4 Solução de problemas nas operações do dicionário de dados InnoDB

As informações sobre as definições da tabela são armazenadas no dicionário de dados InnoDB. Se você mover os arquivos de dados, os dados do dicionário podem se tornar inconsistentes.

Se uma corrupção ou problema de consistência no dicionário de dados impedir que você comece o `InnoDB`, consulte a Seção 17.21.3, “Forçando a recuperação do InnoDB”, para obter informações sobre recuperação manual.

#### Não é possível abrir o arquivo de dados

Com `innodb_file_per_table` habilitado (padrão), as seguintes mensagens podem aparecer na inicialização se um arquivo de espaço de tabela por tabela (arquivo `.ibd`) estiver faltando:

```
[ERROR] InnoDB: Operating system error number 2 in a file operation.
[ERROR] InnoDB: The error means the system cannot find the path specified.
[ERROR] InnoDB: Cannot open datafile for read-only: './test/t1.ibd' OS error: 71
[Warning] InnoDB: Ignoring tablespace `test/t1` because it could not be opened.
```

Para tratar dessas mensagens, emita a declaração `DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") para remover dados sobre a tabela ausente do dicionário de dados.

#### Restauração de arquivos órfãos - Arquivos ibd por tabela

Este procedimento descreve como restaurar arquivos órfãos por tabela `.ibd` para outra instância do MySQL. Você pode usar este procedimento se o espaço de tabela do sistema for perdido ou irrecuperável e você queira restaurar backups de arquivos `.ibd` em uma nova instância do MySQL.

O procedimento não é suportado para arquivos de [tabela geral][(glossary.html#glos_general_tablespace "general tablespace")][`.ibd`].

O procedimento pressupõe que você só tenha backups de arquivos `.ibd` e que esteja recuperando para a mesma versão do MySQL que inicialmente criou os arquivos órfãos `.ibd`, e que os backups de arquivos `.ibd` estejam limpos. Consulte a Seção 17.6.1.4, “Movendo ou Copiando Tabelas InnoDB”, para obter informações sobre a criação de backups limpos.

As limitações de importação de tabela descritas na Seção 17.6.1.3, “Impor tabelas InnoDB”, são aplicáveis a este procedimento.

1. Na nova instância do MySQL, recree a tabela em um banco de dados com o mesmo nome.

   ```
   mysql> CREATE DATABASE sakila;

   mysql> USE sakila;

   mysql> CREATE TABLE actor (
            actor_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(45) NOT NULL,
            last_name VARCHAR(45) NOT NULL,
            last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (actor_id),
            KEY idx_actor_last_name (last_name)
          )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Descarte o tablespace da tabela recém-criada.

   ```
   mysql> ALTER TABLE sakila.actor DISCARD TABLESPACE;
   ```

3. Copie o arquivo `.ibd` órfão do seu diretório de backup para o novo diretório do banco de dados.

   ```
   $> cp /backup_directory/actor.ibd path/to/mysql-5.7/data/sakila/
   ```

4. Certifique-se de que o arquivo `.ibd` tenha as permissões de arquivo necessárias.

5. Importe o arquivo órfão `.ibd`. Um aviso é emitido indicando que `InnoDB` está tentando importar o arquivo sem verificação de esquema.

   ```
   mysql> ALTER TABLE sakila.actor IMPORT TABLESPACE; SHOW WARNINGS;
   Query OK, 0 rows affected, 1 warning (0.15 sec)

   Warning | 1810 | InnoDB: IO Read error: (2, No such file or directory)
   Error opening './sakila/actor.cfg', will attempt to import
   without schema verification
   ```

6. Verifique a tabela para confirmar se o arquivo `.ibd` foi restaurado com sucesso.

   ```
   mysql> SELECT COUNT(*) FROM sakila.actor;
   +----------+
   | count(*) |
   +----------+
   |      200 |
   +----------+
   ```

### 17.21.5 Tratamento de Erros do InnoDB

Os itens a seguir descrevem como o `InnoDB` realiza o tratamento de erros. O `InnoDB` às vezes desfaz apenas a declaração que falhou, outras vezes desfaz toda a transação.

* Se você ficar sem espaço em disco em um espaço de tabelas, ocorre um erro `Table is full` do MySQL e o `InnoDB` desfaz a instrução SQL.

* Um impasse de transação faz com que `InnoDB` desconsidere toda a transação. Tente a transação inteira quando isso acontecer.

Um timeout de espera de bloqueio faz com que `InnoDB` desconsidere a declaração atual (a declaração que estava esperando pelo bloqueio e encontrou o timeout). Para fazer com que toda a transação seja descartada, inicie o servidor com `--innodb-rollback-on-timeout` habilitado. Refaça a declaração se estiver usando o comportamento padrão, ou toda a transação se `--innodb-rollback-on-timeout` estiver habilitado.

Ambos os deadlocks e os timeouts de espera de bloqueio são normais em servidores ocupados e é necessário que as aplicações estejam cientes de que isso pode acontecer e lidem com isso, tentando novamente. Você pode torná-los menos prováveis fazendo o menor trabalho possível entre a primeira alteração de dados durante uma transação e o commit, para que os bloqueios sejam mantidos pelo menor tempo possível e pelo menor número possível de linhas. Às vezes, dividir o trabalho entre diferentes transações pode ser prático e útil.

* Um erro de chave duplicada retorna a declaração SQL, se você não tiver especificado a opção `IGNORE` em sua declaração.

* Um `row too long error` desfaz a declaração SQL.

* Outros erros são detectados principalmente pela camada de código MySQL (acima do nível do mecanismo de armazenamento `InnoDB`), e eles retornam o estado anterior à declaração SQL correspondente. As chaves de acesso não são liberadas em um rollback de uma única declaração SQL.

Durante rollback implícito, bem como durante a execução de uma declaração SQL explícita `ROLLBACK`, `SHOW PROCESSLIST` exibe `Rolling back` na coluna `State` para a conexão relevante.
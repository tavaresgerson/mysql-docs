## 14.22 Solução de problemas do InnoDB

As seguintes diretrizes gerais se aplicam ao solução de problemas do `InnoDB`:

* Quando uma operação falha ou você suspeita de um erro, consulte o log de erro do servidor MySQL (consulte a Seção 5.4.2, "O Log de Erro"). A Referência de Mensagem de Erro do Servidor fornece informações de solução de problemas para alguns dos erros específicos do `InnoDB` que você pode encontrar.

* Se a falha estiver relacionada a um bloqueio, execute com a opção `innodb_print_all_deadlocks` habilitada para que detalhes sobre cada bloqueio sejam impressos no log de erro do servidor MySQL. Para informações sobre bloqueios, consulte a Seção 14.7.5, “Bloqueios no InnoDB”.

* Os problemas relacionados ao dicionário de dados `InnoDB` incluem declarações falhas de `CREATE TABLE` (arquivos de tabela órfã), incapacidade de abrir arquivos de `InnoDB` e o sistema não encontra o caminho especificado. Para informações sobre esse tipo de problema e erros, consulte a Seção 14.22.3, “Solucionando Problemas nas Operações do Dicionário de Dados InnoDB”.

* Ao resolver problemas, geralmente é melhor executar o servidor MySQL a partir do prompt de comando, em vez de através do `mysqld_safe` ou como um serviço do Windows. Você pode então ver o que o `mysqld` imprime no console, e assim ter uma melhor compreensão do que está acontecendo. No Windows, inicie o `mysqld` com a opção `--console` para direcionar a saída para a janela do console.

* Ative os monitores `InnoDB` para obter informações sobre um problema (consulte a Seção 14.18, “Monitores InnoDB”). Se o problema estiver relacionado ao desempenho ou se o servidor parecer estar parado, você deve ativar o monitor padrão para imprimir informações sobre o estado interno do `InnoDB`. Se o problema estiver relacionado a trancas, ative o Monitor de trancas. Se o problema estiver relacionado à criação de tabelas, espaços de tabelas ou operações do dicionário de dados, consulte as tabelas do esquema de informações InnoDB para examinar o conteúdo do dicionário de dados interno do `InnoDB`.

`InnoDB` habilita temporariamente a saída padrão do Monitor `InnoDB` nas seguintes condições:

+ Uma longa espera de semaforo
  + `InnoDB` não consegue encontrar blocos livres no pool de buffer

+ Mais de 67% do pool de buffer é ocupado por pilhas de bloqueio ou o índice de hash adaptativo

* Se você suspeitar que uma tabela está corrompida, execute `CHECK TABLE` nessa tabela.

### 14.22.1 Solução de problemas de I/O do InnoDB

Os passos para solucionar problemas de entrada/saída do `InnoDB` dependem de quando o problema ocorre: durante o início do servidor MySQL ou durante operações normais, quando uma declaração DML ou DDL falha devido a problemas no nível do sistema de arquivos.

#### Problemas de Inicialização

Se algo der errado quando o `InnoDB` tenta inicializar seu espaço de tabela ou seus arquivos de registro, exclua todos os arquivos criados pelo `InnoDB`: todos os arquivos `ibdata` e todos os arquivos `ib_logfile`. Se você já criou algumas tabelas `InnoDB`, também exclua os arquivos `.frm` correspondentes para essas tabelas e quaisquer arquivos `.ibd` se você estiver usando vários espaços de tabela, nos diretórios do banco de dados MySQL. Em seguida, tente a criação do banco de dados `InnoDB` novamente. Para uma solução mais fácil, inicie o servidor MySQL a partir de um prompt de comando para que você veja o que está acontecendo.

#### Problemas de execução

Se o `InnoDB` imprimir um erro de sistema operacional durante uma operação de arquivo, geralmente o problema tem uma das seguintes soluções:

* Certifique-se de que o diretório do arquivo de dados `InnoDB` e o diretório de registro `InnoDB` existam.

* Certifique-se de que `mysqld` tenha direitos de acesso para criar arquivos nesses diretórios.

* Certifique-se de que o `mysqld` possa ler o arquivo de opção adequado `my.cnf` ou `my.ini`, para que ele comece com as opções que você especificou.

* Certifique-se de que o disco não está cheio e que você não está excedendo qualquer cota de disco.

* Certifique-se de que os nomes que você especificar para subdiretórios e arquivos de dados não entrem em conflito.

* Verifique novamente a sintaxe dos valores `innodb_data_home_dir` e `innodb_data_file_path`. Em particular, qualquer valor `MAX` na opção `innodb_data_file_path` é um limite rígido, e exceder esse limite causa um erro fatal.

### 14.22.2 Forçando a recuperação do InnoDB

Para investigar a corrupção de páginas de banco de dados, você pode descartar suas tabelas do banco de dados com `SELECT ... INTO OUTFILE`. Geralmente, a maioria dos dados obtidos dessa maneira permanece intacta. A corrupção grave pode fazer com que as declarações `SELECT * FROM tbl_name` ou as operações de fundo `InnoDB` saiam inesperadamente ou afirmem, ou até mesmo fazer com que a recuperação por avanço `InnoDB` falhe. Nesses casos, você pode usar a opção `innodb_force_recovery` para forçar o motor de armazenamento `InnoDB` a iniciar enquanto impede que as operações de fundo sejam executadas, para que você possa descartar suas tabelas. Por exemplo, você pode adicionar a seguinte string à seção `[mysqld]` do seu arquivo de opção antes de reiniciar o servidor:

```sql
[mysqld]
innodb_force_recovery = 1
```

Para obter informações sobre o uso de arquivos de opção, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

Aviso

Apenas defina `innodb_force_recovery` para um valor maior que 0 em uma situação de emergência, para que você possa iniciar `InnoDB` e descartar suas tabelas. Antes de fazer isso, garanta que você tenha uma cópia de segurança do seu banco de dados, caso precise recriá-lo. Valores de 4 ou maiores podem corromper permanentemente os arquivos de dados. Use apenas um ajuste de `innodb_force_recovery` de 4 ou maior em uma instância do servidor de produção após ter testado com sucesso o ajuste em uma cópia física separada do seu banco de dados. Ao forçar a recuperação de `InnoDB`, você deve sempre começar com `innodb_force_recovery=1` e aumentar o valor apenas incrementalmente, conforme necessário.

`innodb_force_recovery` é 0 por padrão (inicialização normal sem recuperação forçada). Os valores não nulos permitidos para `innodb_force_recovery` são de 1 a 6. Um valor maior inclui a funcionalidade de valores menores. Por exemplo, um valor de 3 inclui toda a funcionalidade dos valores 1 e 2.

Se você conseguir descartar suas tabelas com um valor de `innodb_force_recovery` de 3 ou menos, então você está relativamente seguro de que apenas alguns dados em páginas individuais corrompidas estão perdidos. Um valor de 4 ou maior é considerado perigoso, pois os arquivos de dados podem ser permanentemente corrompidos. Um valor de 6 é considerado drástico, pois as páginas do banco de dados são deixadas em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção em B-trees e outras estruturas de banco de dados.

Como medida de segurança, `InnoDB` impede operações de `INSERT`, `UPDATE` ou `DELETE` quando `innodb_force_recovery` é maior que 0. Uma configuração de `innodb_force_recovery` de 4 ou superior coloca `InnoDB` em modo de leitura somente.

* `1` (`SRV_FORCE_IGNORE_CORRUPT`)

Permite que o servidor funcione mesmo se detectar uma página corrupta. Tenta fazer com que `SELECT * FROM tbl_name` ignore registros e páginas de índice corruptos, o que ajuda a drenar tabelas.

* `2` (`SRV_FORCE_NO_BACKGROUND`)

Previne que o thread mestre e quaisquer threads de purga sejam executados. Se uma saída inesperada ocorrer durante a operação de purga, esse valor de recuperação a impede.

* `3` (`SRV_FORCE_NO_TRX_UNDO`)

Não executa rollback de transações após a recuperação após o crash.

* `4` (`SRV_FORCE_NO_IBUF_MERGE`)

Previne operações de junção de buffers de inserção. Se elas causarem um crash, não as executa. Não calcula estatísticas de tabela. Esse valor pode corromper permanentemente os arquivos de dados. Após usar esse valor, esteja preparado para descartar e recriar todos os índices secundários. Define `InnoDB` como somente leitura.

* `5` (`SRV_FORCE_NO_UNDO_LOG_SCAN`)

Não verifica os registros de desfazer ao iniciar o banco de dados: `InnoDB` trata até mesmo as transações incompletas como comprometidas. Esse valor pode corromper permanentemente os arquivos de dados. Defina `InnoDB` como somente leitura.

* `6` (`SRV_FORCE_NO_LOG_REDO`)

Não faz o registro de refazer retroceder em relação à recuperação. Esse valor pode corromper permanentemente os arquivos de dados. Deixa as páginas do banco de dados em um estado obsoleto, o que, por sua vez, pode introduzir mais corrupção nas árvores B e outras estruturas do banco de dados. Define `InnoDB` como somente leitura.

Você pode `SELECT` a partir de tabelas para descartá-las. Com um valor `innodb_force_recovery` de 3 ou menos, você pode `DROP` ou `CREATE` tabelas. `DROP TABLE` também é suportado com um valor `innodb_force_recovery` maior que 3, até MySQL 5.7.17. A partir do MySQL 5.7.18, `DROP TABLE` não é permitido com um valor `innodb_force_recovery` maior que 4.

Se você sabe que uma determinada tabela está causando uma saída inesperada durante o rollback, pode descartá-la. Se você encontrar um rollback descontrolado causado por uma importação em massa falhando ou `ALTER TABLE`, pode matar o processo `mysqld` e definir `innodb_force_recovery` para `3` para fazer o banco de dados funcionar sem o rollback, e depois `DROP` a tabela que está causando o rollback descontrolado.

Se a corrupção nos dados da tabela impedir que você descarte todo o conteúdo da tabela, uma consulta com uma cláusula `ORDER BY primary_key DESC` pode ser capaz de descarregar a porção da tabela após a parte corrupta.

Se for necessário um valor elevado de `innodb_force_recovery` para iniciar `InnoDB`, pode haver estruturas de dados corrompidas que poderiam causar consultas complexas (consultas que contêm `WHERE`, `ORDER BY` ou outras cláusulas) que falhem. Neste caso, você pode apenas ser capaz de executar consultas básicas de `SELECT * FROM t`.

### 14.22.3 Solução de problemas nas operações do dicionário de dados InnoDB

As informações sobre as definições da tabela são armazenadas tanto nos arquivos `.frm` quanto no dicionário de dados do InnoDB. Se você mover os arquivos `.frm` ou se o servidor falhar em meio a uma operação do dicionário de dados, essas fontes de informações podem se tornar inconsistentes.

Se uma corrupção ou problema de consistência no dicionário de dados impedir que você comece o `InnoDB`, consulte a Seção 14.22.2, “Forçando a recuperação do InnoDB”, para obter informações sobre recuperação manual.

#### CREATE TABLE Falha devido à tabela órfã

Um sintoma de um dicionário de dados desequilibrado é que uma declaração `CREATE TABLE` falha. Se isso ocorrer, verifique o log de erro do servidor. Se o log indicar que a tabela já existe dentro do dicionário de dados interno `InnoDB`, você tem uma tabela órfã dentro dos arquivos do espaço de tabelas `InnoDB` que não tem o arquivo correspondente `.frm`. A mensagem de erro parece assim:

```sql
InnoDB: Error: table test/parent already exists in InnoDB internal
InnoDB: data dictionary. Have you deleted the .frm file
InnoDB: and not used DROP TABLE? Have you used DROP DATABASE
InnoDB: for InnoDB tables in MySQL version <= 3.23.43?
InnoDB: See the Restrictions section of the InnoDB manual.
InnoDB: You can drop the orphaned table inside InnoDB by
InnoDB: creating an InnoDB table with the same name in another
InnoDB: database and moving the .frm file to the current database.
InnoDB: Then MySQL thinks the table exists, and DROP TABLE will
InnoDB: succeed.
```

Você pode descartar a tabela órfã seguindo as instruções fornecidas na mensagem de erro. Se ainda não conseguir usar `DROP TABLE` com sucesso, o problema pode estar relacionado à conclusão de nomes no cliente **mysql**. Para contornar esse problema, inicie o cliente **mysql** com a opção `--skip-auto-rehash` e tente `DROP TABLE` novamente. (Com a conclusão de nomes ativada, o **mysql** tenta construir uma lista de nomes de tabela, o que falha quando existe um problema como o descrito.)

#### Não é possível abrir o arquivo de dados

Com `innodb_file_per_table` habilitado (padrão), as seguintes mensagens podem aparecer na inicialização se um arquivo de espaço de tabela por tabela (arquivo `.ibd`) estiver faltando:

```sql
[ERROR] InnoDB: Operating system error number 2 in a file operation.
[ERROR] InnoDB: The error means the system cannot find the path specified.
[ERROR] InnoDB: Cannot open datafile for read-only: './test/t1.ibd' OS error: 71
[Warning] InnoDB: Ignoring tablespace `test/t1` because it could not be opened.
```

Para tratar dessas mensagens, emita a declaração `DROP TABLE` para remover dados sobre a tabela ausente do dicionário de dados.

#### Erro de não é possível abrir o arquivo

Outro sintoma de um dicionário de dados desequilibrado é que o MySQL exibe um erro indicando que não pode abrir um arquivo `InnoDB`:

```sql
ERROR 1016: Can't open file: 'child2.ibd'. (errno: 1)
```

No log de erro, você pode encontrar uma mensagem como esta:

```sql
InnoDB: Cannot find table test/child2 from the internal data dictionary
InnoDB: of InnoDB though the .frm file for the table exists. Maybe you
InnoDB: have deleted and recreated InnoDB data files but have forgotten
InnoDB: to delete the corresponding .frm files of InnoDB tables?
```

Isso significa que há um arquivo `.frm` órfão sem uma tabela correspondente dentro de `InnoDB`. Você pode descartar o arquivo `.frm` órfão, excluindo-o manualmente.

#### Tabelas intermediárias de órfãos

Se o MySQL sair em meio a uma operação de `ALTER TABLE` em local (`ALGORITHM=INPLACE`), você pode ficar com uma tabela intermediária órfã que ocupa espaço no seu sistema. Além disso, uma tabela intermediária órfã em um espaço de tabelas geral, que está vazio em outras situações, impede que você elimine o espaço de tabelas geral. Esta seção descreve como identificar e remover tabelas intermediárias órfãs.

Os nomes das tabelas intermediárias começam com o prefixo `#sql-ib` (por exemplo, `#sql-ib87-856498050`). O arquivo acompanhante `.frm` tem o prefixo `#sql-*` e é nomeado de maneira diferente (por exemplo, `#sql-36ab_2.frm`).

Para identificar as tabelas intermediárias órfãs no seu sistema, você pode consultar a tabela do esquema de informações `INNODB_SYS_TABLES`. Procure por nomes de tabelas que comecem com `#sql`. Se a tabela original estiver em um espaço de tabelas por arquivo, o arquivo do espaço de tabelas (o arquivo `#sql-*.ibd`) para a tabela intermediária órfã deve ser visível no diretório do banco de dados.

```sql
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE '%#sql%';
```

Para remover uma tabela intermediária órfã, realize as etapas a seguir:

1. No diretório do banco de dados, renomeie o arquivo `#sql-*.frm` para corresponder ao nome base da tabela intermediária órfã:

   ```sql
   $> mv #sql-36ab_2.frm #sql-ib87-856498050.frm
   ```

Nota

Se não houver um arquivo `.frm`, você pode recriá-lo. O arquivo `.frm` deve ter o mesmo esquema de tabela que a tabela intermediária órfã (deve ter as mesmas colunas e índices) e deve ser colocado no diretório do banco de dados da tabela intermediária órfã.

2. Descarte a tabela intermediária órfã emitindo uma declaração `DROP TABLE`, precedendo o nome da tabela com `#mysql50#` e envolvendo o nome da tabela em aspas duplas. Por exemplo:

   ```sql
   mysql> DROP TABLE `#mysql50##sql-ib87-856498050`;
   ```

O prefixo `#mysql50#` indica ao MySQL que ignore o `file name safe encoding` introduzido no MySQL 5.1. É necessário encerrar o nome da tabela em backticks para realizar instruções SQL em nomes de tabela com caracteres especiais, como “#”.

Nota

Se ocorrer uma saída inesperada durante uma operação `ALTER TABLE` in-place que estava movendo uma tabela para um espaço de tabelas diferente, o processo de recuperação restaura a tabela ao seu local original, mas deixa uma tabela intermediária órfã no espaço de tabelas de destino.

Nota

Se o MySQL sair no meio de uma operação `ALTER TABLE` em massa em uma tabela particionada, você pode ficar com várias tabelas intermediárias órfãs, uma por partição. Neste caso, use o procedimento a seguir para remover as tabelas intermediárias órfãs:

1. Em uma instância separada da mesma versão do MySQL, crie uma tabela não particionada com o mesmo nome do esquema e colunas que a tabela particionada.

2. Copie o arquivo `.frm` da tabela não particionada para o diretório do banco de dados com as tabelas intermediárias órfãs.

3. Faça uma cópia do arquivo `.frm` para cada tabela e renomeie os arquivos `.frm` para corresponder aos nomes das tabelas intermediárias órfãs (como descrito acima).

4. Realize uma operação `DROP TABLE` (como descrito acima) para cada tabela.

#### Tabelas Temporárias Órfãs

Se o MySQL sair em meio a uma operação de cópia de tabela `ALTER TABLE` (`ALGORITHM=COPY`), você pode ficar com uma tabela temporária órfã que ocupa espaço no seu sistema. Além disso, uma tabela temporária órfã em um espaço de tabela geral, que de outra forma está vazio, impede que você elimine o espaço de tabela geral. Esta seção descreve como identificar e remover tabelas temporárias órfãs.

Os nomes de tabelas temporárias órfãs começam com o prefixo `#sql-` (por exemplo, `#sql-540_3`). O arquivo acompanhante `.frm` tem o mesmo nome de base que a tabela temporária órfã.

Nota

Se não houver um arquivo `.frm`, você pode recriá-lo. O arquivo `.frm` deve ter o mesmo esquema de tabela que a tabela temporária órfã (deve ter as mesmas colunas e índices) e deve ser colocado no diretório do banco de dados da tabela temporária órfã.

Para identificar as tabelas temporárias órfãs no seu sistema, você pode consultar a tabela do esquema de informações `INNODB_SYS_TABLES`. Procure por nomes de tabelas que comecem com `#sql`. Se a tabela original estiver em um espaço de tabelas por arquivo, o arquivo do espaço de tabelas (o arquivo `#sql-*.ibd`) da tabela temporária órfã deve ser visível no diretório do banco de dados.

```sql
SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE '%#sql%';
```

Para remover uma tabela temporária órfã, elimine a tabela emitindo uma declaração `DROP TABLE`, precedendo o nome da tabela com `#mysql50#` e envolvendo o nome da tabela em aspas duplas. Por exemplo:

```sql
mysql> DROP TABLE `#mysql50##sql-540_3`;
```

O prefixo `#mysql50#` indica ao MySQL que ignore o `file name safe encoding` introduzido no MySQL 5.1. É necessário encerrar o nome da tabela em backticks para realizar instruções SQL em nomes de tabela com caracteres especiais, como “#”.

Nota

Se o MySQL sair em meio a uma operação de cópia de tabela `ALTER TABLE` em uma tabela particionada, você pode ficar com várias tabelas temporárias órfãs, uma por partição. Nesse caso, use o procedimento a seguir para remover as tabelas temporárias órfãs:

1. Em uma instância separada da mesma versão do MySQL, crie uma tabela não particionada com o mesmo nome do esquema e colunas que a tabela particionada.

2. Copie o arquivo `.frm` da tabela não particionada para o diretório do banco de dados com as tabelas temporárias órfãs.

3. Faça uma cópia do arquivo `.frm` para cada tabela e renomeie os arquivos `.frm` para corresponder aos nomes das tabelas temporárias órfãs (como descrito acima).

4. Realize uma operação `DROP TABLE` (como descrito acima) para cada tabela.

#### Espaço de Tabela Não Existe

Com `innodb_file_per_table` habilitado, a seguinte mensagem pode ocorrer se os arquivos `.frm` ou `.ibd` (ou ambos) estiverem ausentes:

```sql
InnoDB: in InnoDB data dictionary has tablespace id N,
InnoDB: but tablespace with that id or name does not exist. Have
InnoDB: you deleted or moved .ibd files?
InnoDB: This may also be a table created with CREATE TEMPORARY TABLE
InnoDB: whose .ibd and .frm files MySQL automatically removed, but the
InnoDB: table still exists in the InnoDB internal data dictionary.
```

Se isso ocorrer, tente o procedimento a seguir para resolver o problema:

1. Crie um arquivo correspondente ao `.frm` em algum outro diretório do banco de dados e copie-o para o diretório do banco de dados onde a tabela órfã está localizada.

2. Emite `DROP TABLE` para a tabela original. Isso deve descartar com sucesso a tabela e `InnoDB` deve imprimir um aviso no log de erro de que o arquivo `.ibd` estava faltando.

#### Restauração de arquivos órfãos - Arquivos ibd por tabela

Este procedimento descreve como restaurar arquivos órfãos por tabela `.ibd` para outra instância do MySQL. Você pode usar este procedimento se o espaço de tabela do sistema for perdido ou irrecuperável e você queira restaurar backups de arquivos `.ibd` em uma nova instância do MySQL.

O procedimento não é suportado para arquivos de espaço de tabela geral `.ibd`.

O procedimento pressupõe que você só tenha backups de arquivos `.ibd`, que você esteja recuperando para a mesma versão do MySQL que inicialmente criou os arquivos órfãos `.ibd`, e que os backups de arquivos `.ibd` estejam limpos. Consulte a Seção 14.6.1.4, “Movendo ou Copiando Tabelas InnoDB”, para obter informações sobre a criação de backups limpos.

As limitações de importação de tabela descritas na Seção 14.6.1.3, “Impor tabelas InnoDB”, são aplicáveis a este procedimento.

1. Na nova instância do MySQL, recree a tabela em um banco de dados com o mesmo nome.

   ```sql
   mysql> CREATE DATABASE sakila;

   mysql> USE sakila;

   mysql> CREATE TABLE actor (
            actor_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(45) NOT NULL,
            last_name VARCHAR(45) NOT NULL,
            last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY  (actor_id),
            KEY idx_actor_last_name (last_name)
          )ENGINE=InnoDB DEFAULT CHARSET=utf8;
   ```

2. Descarte o tablespace da tabela recém-criada.

   ```sql
   mysql> ALTER TABLE sakila.actor DISCARD TABLESPACE;
   ```

3. Copie o arquivo órfão `.ibd` do seu diretório de backup para o novo diretório do banco de dados.

   ```sql
   $> cp /backup_directory/actor.ibd path/to/mysql-5.7/data/sakila/
   ```

4. Certifique-se de que o arquivo `.ibd` tenha as permissões de arquivo necessárias.

5. Importe o arquivo órfão `.ibd`. Um aviso é emitido indicando que `InnoDB` tenta importar o arquivo sem verificação de esquema.

   ```sql
   mysql> ALTER TABLE sakila.actor IMPORT TABLESPACE; SHOW WARNINGS;
   Query OK, 0 rows affected, 1 warning (0.15 sec)

   Warning | 1810 | InnoDB: IO Read error: (2, No such file or directory)
   Error opening './sakila/actor.cfg', will attempt to import
   without schema verification
   ```

6. Verifique a tabela para confirmar se o arquivo `.ibd` foi restaurado com sucesso.

   ```sql
   mysql> SELECT COUNT(*) FROM sakila.actor;
   +----------+
   | count(*) |
   +----------+
   |      200 |
   +----------+
   ```

### 14.22.4 Tratamento de Erros do InnoDB

Os itens a seguir descrevem como o `InnoDB` realiza o tratamento de erros. O `InnoDB` às vezes desfaz apenas a declaração que falhou, outras vezes desfaz toda a transação.

* Se você ficar sem espaço em disco em um espaço de tabelas, ocorre um erro `Table is full` do MySQL e o `InnoDB` desfaz a instrução SQL.

* Um impasse de transação faz com que `InnoDB` desconsidere toda a transação. Tente a transação inteira quando isso acontecer.

Um timeout de espera de bloqueio faz com que `InnoDB` desconsidere a declaração atual (a declaração que estava esperando pelo bloqueio e encontrou o timeout). Para fazer com que toda a transação seja descartada, inicie o servidor com `--innodb-rollback-on-timeout` habilitado. Refaça a declaração se estiver usando o comportamento padrão, ou toda a transação se `--innodb-rollback-on-timeout` estiver habilitado.

Ambos os deadlocks e os timeouts de espera de bloqueio são normais em servidores ocupados e é necessário que as aplicações estejam cientes de que isso pode acontecer e lidem com isso, tentando novamente. Você pode torná-los menos prováveis fazendo o menor trabalho possível entre a primeira alteração de dados durante uma transação e o commit, para que os bloqueios sejam mantidos pelo menor tempo possível e pelo menor número possível de strings. Às vezes, dividir o trabalho entre diferentes transações pode ser prático e útil.

* Um erro de chave duplicada retorna a declaração SQL, se você não tiver especificado a opção `IGNORE` em sua declaração.

* Um `row too long error` desfaz a declaração SQL.

* Outros erros são detectados principalmente pela camada de código MySQL (acima do nível do mecanismo de armazenamento `InnoDB`), e eles retornam o estado anterior à declaração SQL correspondente. As chaves de acesso não são liberadas em um rollback de uma única declaração SQL.

Durante rollback implícito, bem como durante a execução de uma declaração SQL explícita `ROLLBACK`, `SHOW PROCESSLIST` exibe `Rolling back` na coluna `State` para a conexão relevante.
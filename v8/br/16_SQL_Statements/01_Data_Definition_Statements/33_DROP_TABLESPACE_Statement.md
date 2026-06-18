### 15.1.33 Declaração DROP TABLESPACE

```
DROP [UNDO] TABLESPACE tablespace_name
    [ENGINE [=] engine_name]
```

Essa declaração exclui um espaço de tabela que foi criado anteriormente usando `CREATE TABLESPACE`. É suportado pelos motores de armazenamento `NDB` e `InnoDB`.

A palavra-chave `UNDO`, introduzida no MySQL 8.0.14, deve ser especificada para descartar um espaço de recuperação. Apenas espaços de recuperação criados usando a sintaxe `CREATE UNDO TABLESPACE` podem ser descartados. Um espaço de recuperação deve estar em um estado `empty` antes de poder ser descartado. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Recuperação”.

`ENGINE` define o mecanismo de armazenamento que utiliza o tablespace, onde `engine_name` é o nome do mecanismo de armazenamento. Atualmente, os valores `InnoDB` e `NDB` são suportados. Se não for definido, o valor de `default_storage_engine` é usado. Se não for o mesmo que o mecanismo de armazenamento usado para criar o tablespace, a instrução `DROP TABLESPACE` falha.

`tablespace_name` é um identificador sensível a maiúsculas e minúsculas no MySQL.

Para um espaço de tabela geral `InnoDB`, todas as tabelas devem ser excluídas do espaço de tabela antes de uma operação `DROP TABLESPACE`. Se o espaço de tabela não estiver vazio, `DROP TABLESPACE` retorna um erro.

Um espaço de tabela `NDB` a ser excluído não deve conter nenhum arquivo de dados; em outras palavras, antes de poder excluir um espaço de tabela `NDB`, você deve primeiro excluir cada um de seus arquivos de dados usando `ALTER TABLESPACE ... DROP DATAFILE`.

#### Notas

- Um espaço de tabela geral `InnoDB` não é excluído automaticamente quando a última tabela do espaço de tabela é excluída. O espaço de tabela deve ser excluído explicitamente usando `DROP TABLESPACE tablespace_name`.

- Uma operação `DROP DATABASE` pode excluir tabelas que pertencem a um espaço de tabelas geral, mas não pode excluir o espaço de tabelas, mesmo que a operação exclua todas as tabelas que pertencem ao espaço de tabelas. O espaço de tabelas deve ser excluído explicitamente usando `DROP TABLESPACE tablespace_name`.

- Assim como as tabelas de sistema, o truncar ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados .ibd do espaço de tabelas geral, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

#### Exemplos de InnoDB

Este exemplo demonstra como excluir um espaço de tabela geral `InnoDB`. O espaço de tabela geral `ts1` é criado com uma única tabela. Antes de excluir o espaço de tabela, a tabela deve ser excluída.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

Este exemplo demonstra a remoção de um espaço de recuperação de transações. Um espaço de recuperação de transações deve estar no estado `empty` antes de poder ser removido. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Recuperação de Transações”.

```
mysql> DROP UNDO TABLESPACE undo_003;
```

#### Exemplo do NDB

Este exemplo mostra como excluir um espaço de tabelas `NDB` `myts` com um arquivo de dados chamado `mydata-1.dat`, após a criação inicial do espaço de tabelas, e assume a existência de um grupo de arquivos de log chamado `mylg` (consulte a Seção 15.1.16, “Instrução CREATE LOGFILE GROUP”).

```
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

Você deve remover todos os arquivos de dados dos tablespaces usando `ALTER TABLESPACE`, conforme mostrado aqui, antes que possa ser excluído:

```
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat'
    ->     ENGINE=NDB;

mysql> DROP TABLESPACE myts;
```

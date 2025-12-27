### 15.1.38 Declaração `DROP TABLESPACE`

```
DROP [UNDO] TABLESPACE tablespace_name
```

Esta declaração exclui um tablespace que foi criado anteriormente usando `CREATE TABLESPACE`. É suportada pelos motores de armazenamento `NDB` e `InnoDB`.

A palavra-chave `UNDO` deve ser especificada para excluir um tablespace de recuperação. Somente os tablespace de recuperação criados usando a sintaxe `CREATE UNDO TABLESPACE` podem ser excluídos. Um tablespace de recuperação deve estar em um estado `vazio` antes de poder ser excluído. Para mais informações, consulte a Seção 17.6.3.4, “Tablespace de Recuperação”.

`tablespace_name` é um identificador sensível a maiúsculas e minúsculas no MySQL.

Para um tablespace geral `InnoDB`, todas as tabelas devem ser excluídas do tablespace antes de uma operação `DROP TABLESPACE`. Se o tablespace não estiver vazio, `DROP TABLESPACE` retorna um erro.

Um tablespace `NDB` a ser excluído não deve conter nenhum arquivo de dados; em outras palavras, antes de poder excluir um tablespace `NDB`, você deve primeiro excluir cada um de seus arquivos de dados usando `ALTER TABLESPACE ... DROP DATAFILE`.

#### Notas

* Um tablespace geral `InnoDB` não é excluído automaticamente quando a última tabela no tablespace é excluída. O tablespace deve ser excluído explicitamente usando `DROP TABLESPACE tablespace_name`.

* Uma operação `DROP DATABASE` pode excluir tabelas que pertencem a um tablespace geral, mas não pode excluir o tablespace, mesmo que a operação exclua todas as tabelas que pertencem ao tablespace. O tablespace deve ser excluído explicitamente usando `DROP TABLESPACE tablespace_name`.

* De forma semelhante ao tablespace do sistema, a exclusão ou o corte de tabelas armazenadas em um tablespace geral cria espaço livre internamente no arquivo de dados `ibd` do tablespace geral. Esse espaço só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os tablespace de arquivo por tabela.

#### Exemplos de InnoDB

Este exemplo demonstra como excluir um espaço de tabelas geral `InnoDB`. O espaço de tabelas geral `ts1` é criado com uma única tabela. Antes de excluir o espaço de tabelas, a tabela deve ser excluída.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

Este exemplo demonstra a exclusão de um espaço de tabelas de recuperação. Um espaço de tabelas de recuperação deve estar em um estado `vazio` antes de poder ser excluído. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de tabelas de recuperação”.

```
mysql> DROP UNDO TABLESPACE undo_003;
```

#### Exemplo NDB

Este exemplo mostra como excluir um espaço de tabelas `NDB` `myts` com um arquivo de dados chamado `mydata-1.dat`, após a criação do espaço de tabelas, e assume a existência de um grupo de arquivos de log chamado `mylg` (consulte a Seção 15.1.20, “Instrução CREATE LOGFILE GROUP”).

```
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

Você deve remover todos os arquivos de dados do espaço de tabelas usando `ALTER TABLESPACE`, como mostrado aqui, antes de poder ser excluído:

```
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat';

mysql> DROP TABLESPACE myts;
```
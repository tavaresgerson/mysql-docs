### 13.1.30 Declaração DROP TABLESPACE

```sql
DROP TABLESPACE tablespace_name
    [ENGINE [=] engine_name]
```

Essa declaração exclui um espaço de tabelas que foi criado anteriormente usando `CREATE TABLESPACE`. É suportado com todas as versões do MySQL NDB Cluster 7.5 e também com o `InnoDB` no MySQL Server padrão.

`ENGINE` define o motor de armazenamento que utiliza o tablespace, onde *`engine_name`* é o nome do motor de armazenamento. Atualmente, os valores `InnoDB` e `NDB` são suportados. Se não for definido, o valor de `default_storage_engine` é usado. Se não for o mesmo motor de armazenamento usado para criar o tablespace, a instrução `DROP TABLESPACE` falhará.

Para um espaço de tabelas `InnoDB`, todas as tabelas devem ser excluídas do espaço de tabelas antes de uma operação `DROP TABLESPACE`. Se o espaço de tabelas não estiver vazio, o `DROP TABLESPACE` retornará um erro.

Assim como acontece com o espaço de tabela do sistema `InnoDB`, o truncamento ou a remoção de tabelas `InnoDB` armazenadas em um espaço de tabela geral cria espaço livre no arquivo de dados do `.ibd` (glossary.html#glos_ibd_file), que só pode ser usado para novos dados `InnoDB`. Espaço não é liberado de volta ao sistema operacional por operações como as que são feitas em espaços de tabela por arquivo.

Um espaço de tabela `NDB` que será excluído não deve conter nenhum arquivo de dados; em outras palavras, antes de poder excluir um espaço de tabela `NDB`, você deve primeiro excluir cada um de seus arquivos de dados usando `ALTER TABLESPACE ... DROP DATAFILE`.

#### Notas

- Os espaços de tabelas não são excluídos automaticamente. Um espaço de tabela deve ser excluído explicitamente usando `DROP TABLESPACE`. `DROP DATABASE` não tem efeito nesse sentido, mesmo que a operação exclua todas as tabelas pertencentes ao espaço de tabela.

- Uma operação `DROP DATABASE` pode excluir tabelas que pertencem a um espaço de tabelas geral, mas não pode excluir o espaço de tabelas, mesmo que a operação exclua todas as tabelas que pertencem ao espaço de tabelas. O espaço de tabelas deve ser excluído explicitamente usando `DROP TABLESPACE nome_do_espaço_de_tabelas`.

- Assim como as tabelas de sistema, o truncar ou a remoção de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados geral do IBД .ibd, que só pode ser usado para novos dados do `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

#### Exemplo de InnoDB

Este exemplo demonstra como excluir um espaço de tabelas geral `InnoDB`. O espaço de tabelas geral `ts1` é criado com uma única tabela. Antes de excluir o espaço de tabelas, a tabela deve ser excluída.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

#### Exemplo do NDB

Este exemplo mostra como excluir um espaço de tabelas `NDB` chamado `myts`, com um arquivo de dados chamado `mydata-1.dat`, após a criação inicial do espaço de tabelas, e assume a existência de um grupo de arquivos de log chamado `mylg` (consulte Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”).

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

Você deve remover todos os arquivos de dados do tablespace usando `ALTER TABLESPACE`, conforme mostrado aqui, antes que ele possa ser excluído:

```sql
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat'
    ->     ENGINE=NDB;

mysql> DROP TABLESPACE myts;
```

### 15.1.12 Declaração `ALTER TABLESPACE`

```
ALTER [UNDO] TABLESPACE tablespace_name
  NDB only:
    {ADD | DROP} DATAFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
  InnoDB and NDB:
    [RENAME TO tablespace_name]
  InnoDB only:
    [AUTOEXTEND_SIZE [=] 'value']
    [SET {ACTIVE | INACTIVE}]
    [ENCRYPTION [=] {'Y' | 'N'}]
  InnoDB and NDB:
    [ENGINE [=] engine_name]
  Reserved for future use:
    [ENGINE_ATTRIBUTE [=] 'string']
```

Esta declaração é usada com os espaços de tabelas `NDB` e `InnoDB`. Pode ser usada para adicionar um novo arquivo de dados a um espaço de tabela `NDB` ou para excluir um arquivo de dados de um espaço de tabela `NDB`. Também pode ser usada para renomear um espaço de dados de disco de um cluster NDB, renomear um espaço de tabelas geral `InnoDB`, criptografar um espaço de tabelas geral `InnoDB` ou marcar um espaço de tabelas de desfazer `InnoDB` como ativo ou inativo.

A palavra-chave `UNDO` é usada com a cláusula `SET {ACTIVE | INACTIVE}` para marcar um espaço de tabelas de desfazer `InnoDB` como ativo ou inativo. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Tabelas de Desfazer”.

A variante `ADD DATAFILE` permite que você especifique um tamanho inicial para um espaço de dados de disco `NDB` usando uma cláusula `INITIAL_SIZE`, onde *`size`* é medido em bytes; o valor padrão é 134217728 (128 MB). Você pode, opcionalmente, seguir *`size`* com uma abreviação de uma letra para uma ordem de grandeza, semelhante às usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes).

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

`INITIAL_SIZE` é arredondada, explicitamente, como para `CREATE TABLESPACE`.

Uma vez que um arquivo de dados é criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados a um espaço de tabela `NDB` usando declarações adicionais `ALTER TABLESPACE ... ADD DATAFILE`.

Quando `ALTER TABLESPACE ... ADD DATAFILE` é usado com `ENGINE = NDB`, um arquivo de dados é criado em cada nó de dados do cluster, mas apenas uma linha é gerada na tabela do esquema de informações `FILES`. Consulte a descrição desta tabela, bem como a Seção 25.6.11.1, “Objetos de Disco de Cluster NDB”, para mais informações. `ADD DATAFILE` não é suportado com espaços de tabelas `InnoDB`.

O uso de `DROP DATAFILE` com `ALTER TABLESPACE` exclui o arquivo de dados '*`file_name`*' de um espaço de tabelas `NDB`. Não é possível excluir um arquivo de dados de um espaço de tabelas que esteja sendo usado por qualquer tabela; em outras palavras, o arquivo de dados deve estar vazio (sem extensões usadas). Veja a Seção 25.6.11.1, “Objetos de disco de clúster NDB”. Além disso, qualquer arquivo de dados a ser excluído deve ter sido previamente adicionado ao espaço de tabelas com `CREATE TABLESPACE` ou `ALTER TABLESPACE`. O `DROP DATAFILE` não é suportado com espaços de tabelas `InnoDB`.

A cláusula `WAIT` é analisada, mas ignorada. Ela é destinada para expansão futura.

A cláusula `ENGINE`, que especifica o motor de armazenamento usado pelo espaço de tabelas, é desaconselhada, uma vez que o motor de armazenamento do espaço de tabelas é conhecido pelo dicionário de dados, tornando a cláusula `ENGINE` obsoleta. No MySQL 9.5, ela é suportada nos seguintes dois casos apenas:

* ``` ALTER TABLESPACE tablespace_name ADD DATAFILE 'file_name' ENGINE={NDB|NDBCLUSTER}
  ```
* ```
  ALTER UNDO TABLESPACE tablespace_name SET {ACTIVE|INACTIVE}
      ENGINE=INNODB
  ```

Você deve esperar a eventual remoção da cláusula `ENGINE` dessas declarações também, em uma versão futura do MySQL.

As operações `RENAME TO` são realizadas implicitamente no modo de commit automático, independentemente do valor de `autocommit`.

Uma operação `RENAME TO` não pode ser realizada enquanto `LOCK TABLES` ou `FLUSH TABLES WITH READ LOCK` estiverem em vigor para tabelas que residem no espaço de tabelas.

Blocos de metadados exclusivos são tomados em tabelas que residem em um espaço de tabelas geral enquanto o espaço de tabelas está sendo renomeado, o que impede DDL concorrente. DML concorrente é suportado.

O privilégio `CREATE TABLESPACE` é necessário para renomear um espaço de tabelas `InnoDB` geral.

A opção `AUTOEXTEND_SIZE` define a quantidade pela qual o `InnoDB` estende o tamanho de um espaço de tabelas quando ele fica cheio. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o espaço de tabelas seja estendido de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND_SIZE de Espaço de Tabelas”.

A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para um espaço de tabelas geral `InnoDB` ou o espaço de tabelas do sistema `mysql`.

Um plugin de chaveira deve ser instalado e configurado antes que a criptografia possa ser habilitada.

Se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para alterar um espaço de tabelas geral com um ajuste da cláusula `ENCRYPTION` que difere do ajuste `default_table_encryption`.

Habilitar a criptografia para um espaço de tabelas geral falha se qualquer tabela no espaço de tabelas pertencer a um esquema definido com `DEFAULT ENCRYPTION='N'`. Da mesma forma, desabilitar a criptografia falha se qualquer tabela no espaço de tabelas geral pertencer a um esquema definido com `DEFAULT ENCRYPTION='Y'`.

Se uma declaração `ALTER TABLESPACE` executada em um espaço de tabelas geral não incluir uma cláusula `ENCRYPTION`, o espaço de tabelas retém seu status de criptografia atual, independentemente do ajuste `default_table_encryption`.

Quando um espaço de tabelas geral ou o espaço de tabelas do sistema `mysql` é criptografado, todas as tabelas que residem no espaço de tabelas são criptografadas. Da mesma forma, uma tabela criada em um espaço de tabelas criptografado é criptografada.

O algoritmo `INPLACE` é usado ao alterar o atributo `ENCRYPTION` de um espaço de tabelas geral ou do espaço de tabelas do sistema `mysql`. O algoritmo `INPLACE` permite DML concorrente em tabelas que residem no espaço de tabelas. O DDL concorrente é bloqueado.

Para obter mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

A opção `ENGINE_ATTRIBUTE` é usada para especificar atributos do tablespace para os motores de armazenamento primário. A opção está reservada para uso futuro.

O valor atribuído a essa opção é uma literal de string que contém um documento JSON válido ou uma string vazia (''). O JSON inválido é rejeitado.

```
ALTER TABLESPACE ts1 ENGINE_ATTRIBUTE='{"key":"value"}';
```

Os valores da opção `ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Neste caso, o último valor especificado é usado.

Os valores da opção `ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o motor de armazenamento da tabela é alterado.

Não é permitido alterar um elemento individual de um valor de atributo JSON. Você só pode adicionar ou substituir um atributo.
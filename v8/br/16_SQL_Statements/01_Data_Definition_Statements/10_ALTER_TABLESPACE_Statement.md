### 15.1.10 Declaração ALTER TABLESPACE

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

Esta declaração é usada com os espaços de tabelas `NDB` e `InnoDB`. Pode ser usada para adicionar um novo arquivo de dados a um espaço de tabela `NDB` ou para excluir um arquivo de dados de um espaço de tabela `NDB`. Também pode ser usada para renomear um espaço de dados de disco de NDB Cluster, renomear um espaço de tabelas gerais `InnoDB`, criptografar um espaço de tabelas gerais `InnoDB` ou marcar um espaço de tabelas de desfazer `InnoDB` como ativo ou inativo.

A palavra-chave `UNDO`, introduzida no MySQL 8.0.14, é usada com a cláusula `SET {ACTIVE | INACTIVE}` para marcar um espaço de tabelas de desfazer `InnoDB` como ativo ou inativo. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Tabelas de Desfazer”.

A variante `ADD DATAFILE` permite que você especifique um tamanho inicial para um espaço de dados de disco `NDB` usando uma cláusula `INITIAL_SIZE`, onde `size` é medido em bytes; o valor padrão é 134217728 (128 MB). Você pode opcionalmente seguir `size` com uma abreviação de uma letra para uma ordem de grandeza, semelhante às usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes).

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

`INITIAL_SIZE` é arredondado, explicitamente, como para `CREATE TABLESPACE`.

Uma vez que um arquivo de dados tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados a um espaço de tabelas NDB usando instruções adicionais `ALTER TABLESPACE ... ADD DATAFILE`.

Quando `ALTER TABLESPACE ... ADD DATAFILE` é usado com `ENGINE = NDB`, um arquivo de dados é criado em cada nó de dados do cluster, mas apenas uma linha é gerada na tabela do esquema de informações `FILES`. Veja a descrição desta tabela, bem como a Seção 25.6.11.1, “Objetos de dados de disco do cluster NDB”, para obter mais informações. `ADD DATAFILE` não é suportado com espaços de tabelas `InnoDB`.

Usando `DROP DATAFILE` com `ALTER TABLESPACE`, o arquivo de dados '`file_name`' é excluído de um espaço de tabelas NDB. Não é possível excluir um arquivo de dados de um espaço de tabelas que esteja sendo usado por qualquer tabela; em outras palavras, o arquivo de dados deve estar vazio (sem extensões usadas). Veja a Seção 25.6.11.1, “Objetos de dados de disco de cluster NDB”. Além disso, qualquer arquivo de dados a ser excluído deve ter sido previamente adicionado ao espaço de tabelas com `CREATE TABLESPACE` ou `ALTER TABLESPACE`. `DROP DATAFILE` não é suportado com espaços de tabelas `InnoDB`.

`WAIT` é analisado, mas ignorado. Ele é destinado para expansão futura.

A cláusula `ENGINE`, que especifica o mecanismo de armazenamento usado pelo tablespace, está desatualizada; espere-se que seja removida em uma futura versão. O mecanismo de armazenamento do tablespace é conhecido pelo dicionário de dados, tornando a cláusula `ENGINE` obsoleta. Se o mecanismo de armazenamento for especificado, ele deve corresponder ao mecanismo de armazenamento do tablespace definido no dicionário de dados. Os únicos valores para `engine_name` compatíveis com os tablespaces `NDB` são `NDB` e `NDBCLUSTER`.

As operações `RENAME TO` são realizadas implicitamente no modo `autocommit`, independentemente da configuração `autocommit`.

Uma operação `RENAME TO` não pode ser realizada enquanto `LOCK TABLES` ou `FLUSH TABLES WITH READ LOCK` estiver em vigor para tabelas que residem no espaço de tabelas.

Bloqueios exclusivos de metadados são aplicados às tabelas que residem em um espaço de tabelas geral enquanto o espaço de tabelas é renomeado, o que impede a DDL concorrente. A DML concorrente é suportada.

O privilégio `CREATE TABLESPACE` é necessário para renomear um espaço de tabela geral `InnoDB`.

A opção `AUTOEXTEND_SIZE` define a quantidade pela qual `InnoDB` amplia o tamanho de um espaço de tabela quando ele fica cheio. Introduzido no MySQL 8.0.23. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o espaço de tabela seja ampliado de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND\_SIZE do Espaço de Tabela”.

A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para um `InnoDB` espaço de tabelas geral ou o espaço de tabelas do sistema `mysql`. O suporte à criptografia para espaços de tabelas gerais foi introduzido no MySQL 8.0.13. O suporte à criptografia para o espaço de tabelas do sistema `mysql` foi introduzido no MySQL 8.0.16.

Um plugin de chave de fenda deve ser instalado e configurado antes que a criptografia possa ser habilitada.

A partir do MySQL 8.0.16, se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para alterar um espaço de tabela geral com uma definição da cláusula `ENCRYPTION` que difere da definição de `default_table_encryption`.

A habilitação da criptografia para um espaço de tabelas geral falha se qualquer tabela no espaço de tabelas pertencer a um esquema definido com `DEFAULT ENCRYPTION='N'`. Da mesma forma, a desativação da criptografia falha se qualquer tabela no espaço de tabelas geral pertencer a um esquema definido com `DEFAULT ENCRYPTION='Y'`. A opção de esquema `DEFAULT ENCRYPTION` foi introduzida no MySQL 8.0.16.

Se uma declaração `ALTER TABLESPACE` executada em um espaço de tabelas geral não incluir uma cláusula `ENCRYPTION`, o espaço de tabelas mantém seu status de criptografia atual, independentemente da configuração `default_table_encryption`.

Quando um espaço de tabelas geral ou o espaço de tabelas do sistema `mysql` é criptografado, todas as tabelas que residem no espaço de tabelas são criptografadas. Da mesma forma, uma tabela criada em um espaço de tabelas criptografado também é criptografada.

O algoritmo `INPLACE` é usado ao alterar o atributo `ENCRYPTION` de um espaço de tabela geral ou do espaço de tabela do sistema `mysql`. O algoritmo `INPLACE` permite operações DML concorrentes em tabelas que residem no espaço de tabela. As operações DDL concorrentes são bloqueadas.

Para obter mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

A opção `ENGINE_ATTRIBUTE` (disponível a partir do MySQL 8.0.21) é usada para especificar atributos do espaço de tabela para os motores de armazenamento primário. A opção é reservada para uso futuro.

Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

```
ALTER TABLESPACE ts1 ENGINE_ATTRIBUTE='{"key":"value"}';
```

Os valores `ENGINE_ATTRIBUTE` podem ser repetidos sem erros. Nesse caso, o último valor especificado é usado.

Os valores de `ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o mecanismo de armazenamento da tabela é alterado.

Não é permitido alterar um elemento individual de um valor de atributo JSON. Você só pode adicionar ou substituir um atributo.

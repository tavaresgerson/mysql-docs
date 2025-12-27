### 26.6.2 Limitações de Partição Relacionadas aos Motores de Armazenamento

No MySQL 9.5, o suporte à partição não é fornecido pelo próprio Servidor MySQL, mas sim pelo próprio manipulador de partição do motor de armazenamento da tabela. No MySQL 9.5, apenas os motores de armazenamento `InnoDB` e `NDB` fornecem manipuladores de partição nativos. Isso significa que tabelas particionadas não podem ser criadas usando qualquer outro motor de armazenamento além desses. (Você deve estar usando o MySQL NDB Cluster com o motor de armazenamento `NDB` para criar tabelas `NDB`.)

**Motor de Armazenamento InnoDB.** Chaves estrangeiras `InnoDB` e partição do MySQL não são compatíveis. Tabelas `InnoDB` particionadas não podem ter referências de chave estrangeira, nem podem ter colunas referenciadas por chaves estrangeiras. Tabelas `InnoDB` que têm ou são referenciadas por chaves estrangeiras não podem ser particionadas.

`ALTER TABLE ... OPTIMIZE PARTITION` não funciona corretamente com tabelas particionadas que usam `InnoDB`. Use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION`, em vez disso, para tais tabelas. Para mais informações, consulte a Seção 15.1.11.1, “Operações de Partição ALTER TABLE”.

**Partição definida pelo usuário e o motor de armazenamento NDB (NDB Cluster).** A partição por `KEY` (incluindo `LINEAR KEY`) é o único tipo de partição suportado para o motor de armazenamento `NDB`. Não é possível, sob circunstâncias normais no NDB Cluster, criar uma tabela NDB Cluster usando qualquer tipo de partição diferente de `LINEAR` `KEY`, e tentar fazê-lo falha com um erro.

O número máximo de partições que podem ser definidas para uma tabela `NDB` depende do número de nós de dados e grupos de nós no cluster, da versão do software NDB Cluster em uso e de outros fatores. Consulte NDB e partição definida pelo usuário, para mais informações.

O valor máximo de dados de tamanho fixo que podem ser armazenados por partição em uma tabela `NDB` é de 128 TB. Anteriormente, esse valor era de 16 GB.

As instruções `CREATE TABLE` e `ALTER TABLE` que causariam uma tabela `NDB` particionada por usuário a não atender a um ou ambos dos seguintes requisitos não são permitidas e falham com um erro:

1. A tabela deve ter uma chave primária explícita.
2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela `NDB` particionada por usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY KEY()` ou `PARTITION BY LINEAR KEY()`), então não é necessária uma chave primária explícita.

**Seleção de partições.** A seleção de partições não é suportada para tabelas `NDB`. Consulte a Seção 26.5, “Seleção de Partições”, para obter mais informações.

**Atualização de tabelas particionadas.** Ao realizar uma atualização, as tabelas que são particionadas por `KEY` devem ser exportadas e recarregadas.

Para obter informações sobre a conversão de tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, “Conversão de Tabelas de MyISAM para InnoDB”.
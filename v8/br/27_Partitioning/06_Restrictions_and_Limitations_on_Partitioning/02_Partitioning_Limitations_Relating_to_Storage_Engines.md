### 26.6.2 Limitações de Partição Relacionadas a Motores de Armazenamento

No MySQL 8.0, o suporte à partição não é fornecido pelo próprio servidor MySQL, mas sim pelo próprio manipulador de partição ou manipulador nativo do motor de armazenamento da tabela. No MySQL 8.0, apenas os motores de armazenamento `InnoDB` e `NDB` fornecem manipuladores de partição nativos. Isso significa que tabelas particionadas não podem ser criadas usando qualquer outro motor de armazenamento além desses. (Você deve estar usando o MySQL NDB Cluster com o motor de armazenamento `NDB` para criar tabelas `NDB`.)

Motor de armazenamento InnoDB. Chaves estrangeiras `InnoDB` e particionamento do MySQL não são compatíveis. Tabelas particionadas `InnoDB` não podem ter referências de chave estrangeira, nem podem ter colunas referenciadas por chaves estrangeiras. Tabelas `InnoDB` que têm ou são referenciadas por chaves estrangeiras não podem ser particionadas.

`ALTER TABLE ... OPTIMIZE PARTITION` não funciona corretamente com tabelas particionadas que usam `InnoDB`. Use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION`, em vez disso, para tais tabelas. Para mais informações, consulte a Seção 15.1.9.1, “Operações de Partição de Tabela”.

**Partição definida pelo usuário e o motor de armazenamento NDB (NDB Cluster).** A partição por `KEY` (incluindo `LINEAR KEY`) é o único tipo de partição suportado para o motor de armazenamento `NDB`. Não é possível, sob circunstâncias normais, criar uma tabela NDB Cluster no NDB Cluster usando qualquer tipo de partição diferente de \[`LINEAR` `KEY`, e tentar fazê-lo falha com um erro.

*Exceção (não para produção)*: É possível ignorar essa restrição definindo a variável de sistema `new` nos nós do NDB Cluster SQL para `ON`. Se você optar por fazer isso, deve estar ciente de que tabelas que utilizam tipos de particionamento diferentes de `[LINEAR] KEY` não são suportadas em produção. *Nesses casos, você pode criar e usar tabelas com tipos de particionamento diferentes de `KEY` ou `LINEAR KEY`, mas você faz isso totalmente por sua própria conta e risco*. Você também deve estar ciente de que essa funcionalidade já está desatualizada e está sujeita à remoção sem aviso prévio em uma futura versão do NDB Cluster.

O número máximo de partições que podem ser definidas para uma tabela `NDB` depende do número de nós de dados e grupos de nós no cluster, da versão do software NDB Cluster em uso e de outros fatores. Consulte NDB e partição definida pelo usuário para obter mais informações.

O valor máximo de dados de tamanho fixo que podem ser armazenados por partição em uma tabela `NDB` é de 128 TB. Anteriormente, esse valor era de 16 GB.

As declarações `CREATE TABLE` e `ALTER TABLE` que causariam uma tabela `NDB` particionada pelo usuário a não atender a um ou ambos dos dois requisitos a seguir não são permitidas e falharão com um erro:

1. A tabela deve ter uma chave primária explícita.
2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela `NDB` com partição de usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY KEY()` ou `PARTITION BY LINEAR KEY()`), então não é necessário uma chave primária explícita.

**Seleção de partição.** A seleção de partição não é suportada para tabelas `NDB`. Consulte a Seção 26.5, “Seleção de Partição”, para obter mais informações.

**Atualização de tabelas particionadas.** Ao realizar uma atualização, as tabelas que são particionadas por `KEY` devem ser descarregadas e recarregadas. Tabelas particionadas usando motores de armazenamento diferentes de `InnoDB` não podem ser atualizadas do MySQL 5.7 ou versões anteriores para o MySQL 8.0 ou versões posteriores; você deve ou descartar a partição dessas tabelas com `ALTER TABLE ... REMOVE PARTITIONING` ou convertê-las para `InnoDB` usando `ALTER TABLE ... ENGINE=INNODB` antes da atualização.

Para obter informações sobre a conversão de tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”.

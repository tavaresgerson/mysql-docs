### 22.6.2 Limitações de Partição Relacionadas a Motores de Armazenamento

As seguintes limitações se aplicam ao uso de motores de armazenamento com particionamento definido pelo usuário das tabelas.

**Motor de armazenamento MERGE.** A partição definida pelo usuário e o motor de armazenamento `MERGE` não são compatíveis. Tabelas que utilizam o motor de armazenamento `MERGE` não podem ser particionadas. Tabelas particionadas não podem ser unidas.

Motor de armazenamento **FEDERATED**. A partição de tabelas `FEDERATED` não é suportada; não é possível criar tabelas `FEDERATED` particionadas.

**Motor de armazenamento CSV.** As tabelas particionadas usando o motor de armazenamento `CSV` não são suportadas; não é possível criar tabelas `CSV` particionadas.

**Motor de armazenamento InnoDB.** As chaves estrangeiras e a partição do MySQL no motor de armazenamento `InnoDB` não são compatíveis. As tabelas `InnoDB` particionadas não podem ter referências de chave estrangeira, nem podem ter colunas referenciadas por chaves estrangeiras. As tabelas `InnoDB` que têm ou são referenciadas por chaves estrangeiras não podem ser particionadas.

O `InnoDB` não suporta o uso de múltiplos discos para subpartições. (Atualmente, isso é suportado apenas pelo `MyISAM`.)

Além disso, `ALTER TABLE ... OPTIMIZE PARTITION` não funciona corretamente com tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB`. Em vez disso, use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` para essas tabelas. Para mais informações, consulte Seção 13.1.8.1, “Operações de Partição ALTER TABLE”.

**Partição definida pelo usuário e o motor de armazenamento NDB (NDB Cluster).** A partição por `KEY` (incluindo `LINEAR KEY`) é o único tipo de partição suportado pelo motor de armazenamento `NDB`. Não é possível, sob circunstâncias normais, criar uma tabela NDB Cluster no NDB Cluster usando qualquer tipo de partição diferente de `KEY` `LINEAR`, e tentar fazê-lo falhará com um erro.

*Exceção (não para produção)*: É possível ignorar essa restrição configurando a variável de sistema `new` nos nós do NDB Cluster SQL para `ON`. Se optar por fazer isso, deve estar ciente de que tabelas que utilizam tipos de particionamento diferentes de `[LINEAR] KEY` não são suportados em produção. *Nesses casos, você pode criar e usar tabelas com tipos de particionamento diferentes de `KEY` ou `LINEAR KEY`, mas você faz isso totalmente por sua própria conta e risco*. Deve também estar ciente de que essa funcionalidade já está desatualizada e está sujeita à remoção sem aviso prévio em uma futura versão do NDB Cluster.

O número máximo de partições que podem ser definidas para uma tabela `NDB` depende do número de nós de dados e grupos de nós no cluster, da versão do software NDB Cluster em uso e de outros fatores. Consulte NDB e partição definida pelo usuário para obter mais informações.

A partir do MySQL NDB Cluster 7.5.2, o valor máximo de dados de tamanho fixo que podem ser armazenados por partição em uma tabela `NDB` é de 128 TB. Anteriormente, esse valor era de 16 GB.

As instruções `CREATE TABLE` e `ALTER TABLE` que causariam uma tabela de `NDB` com partição de usuário a não atender a um ou ambos dos seguintes requisitos não são permitidas e falharão com um erro:

1. A tabela deve ter uma chave primária explícita.
2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela com partição de usuário `NDB` for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY KEY()` ou `PARTITION BY LINEAR KEY()`), então não é necessário uma chave primária explícita.

**Seleção de partições.** A seleção de partições não é suportada para tabelas de `NDB`. Consulte Seção 22.5, “Seleção de Partições” para obter mais informações.

**Atualização de tabelas particionadas.** Ao realizar uma atualização, as tabelas que são particionadas por `KEY` e que utilizam qualquer mecanismo de armazenamento diferente de `NDB` devem ser descarregadas e recarregadas.

**O mesmo mecanismo de armazenamento para todas as partições.** Todas as partições de uma tabela particionada devem usar o mesmo mecanismo de armazenamento e deve ser o mesmo mecanismo de armazenamento usado pela tabela como um todo. Além disso, se não especificar um mecanismo no nível da tabela, então deve fazer uma das seguintes ações ao criar ou alterar uma tabela particionada:

- Não especifique nenhum motor para nenhuma partição ou subpartição

- Especifique o motor para *todas* as partições ou subpartições

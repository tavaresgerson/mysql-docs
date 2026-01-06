### 21.2.6 MySQL Server Usando InnoDB Comparado com NDB Cluster

21.2.6.1 Diferenças entre os motores de armazenamento NDB e InnoDB

21.2.6.2 Cargas de trabalho NDB e InnoDB

Resumo do uso de recursos de NDB e InnoDB

O MySQL Server oferece várias opções de motores de armazenamento. Como tanto o `NDB` quanto o `InnoDB` podem servir como motores de armazenamento transacionais do MySQL, os usuários do MySQL Server às vezes ficam interessados no NDB Cluster. Eles veem o `NDB` como uma possível alternativa ou atualização para o motor de armazenamento padrão `InnoDB` no MySQL 5.7. Embora o `NDB` e o `InnoDB` compartilhem características comuns, existem diferenças na arquitetura e implementação, de modo que algumas aplicações e cenários de uso existentes do MySQL Server podem ser adequados para o NDB Cluster, mas nem todas.

Nesta seção, discutimos e comparamos algumas características do mecanismo de armazenamento `NDB` utilizado pelo NDB 7.5 com o `InnoDB` utilizado no MySQL 5.7. As próximas seções fornecem uma comparação técnica. Em muitos casos, as decisões sobre quando e onde usar o NDB Cluster devem ser tomadas caso a caso, levando em consideração todos os fatores. Embora esteja além do escopo desta documentação fornecer detalhes para cada cenário de uso concebível, também tentamos oferecer alguma orientação muito geral sobre a adequação relativa de alguns tipos comuns de aplicações para o `NDB` em oposição aos backends `InnoDB`.

O NDB Cluster 7.5 utiliza um **mysqld** baseado no MySQL 5.7, incluindo suporte para as tabelas `**InnoDB** 1.1. Embora seja possível usar tabelas `InnoDB\` com o NDB Cluster, essas tabelas não são agrupadas. Também não é possível usar programas ou bibliotecas de uma distribuição do NDB Cluster 7.5 com o MySQL Server 5.7, ou vice-versa.

Embora também seja verdade que alguns tipos de aplicações empresariais comuns podem ser executados tanto no NDB Cluster quanto no MySQL Server (com maior probabilidade usando o mecanismo de armazenamento `InnoDB`), existem algumas diferenças importantes em termos de arquitetura e implementação. Seção 21.2.6.1, “Diferenças entre os mecanismos de armazenamento NDB e InnoDB” fornece um resumo dessas diferenças. Devido às diferenças, alguns cenários de uso são claramente mais adequados para um motor ou outro; veja Seção 21.2.6.2, “Carga de trabalho NDB e InnoDB”. Isso, por sua vez, tem um impacto nos tipos de aplicações que são mais adequadas para uso com `NDB` ou `InnoDB`. Veja Seção 21.2.6.3, “Resumo do uso de recursos NDB e InnoDB” para uma comparação da adequação relativa de cada um para uso em tipos comuns de aplicações de banco de dados.

Para obter informações sobre as características relativas dos motores de armazenamento `NDB` e `MEMORY`, consulte Quando usar MEMORY ou NDB Cluster.

Consulte o \[Capítulo 15, *Motores de Armazenamento Alternativos*] (storage-engines.html) para obter informações adicionais sobre os motores de armazenamento do MySQL.

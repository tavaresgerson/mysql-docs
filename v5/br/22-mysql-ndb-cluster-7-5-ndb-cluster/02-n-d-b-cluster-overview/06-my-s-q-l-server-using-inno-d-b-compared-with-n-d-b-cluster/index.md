### 21.2.6 MySQL Server Usando InnoDB Comparado com NDB Cluster

21.2.6.1 Diferenças entre as Storage Engines NDB e InnoDB

21.2.6.2 Workloads de NDB e InnoDB

21.2.6.3 Resumo de Uso de Recursos do NDB e InnoDB

O MySQL Server oferece várias opções de storage engines. Como tanto o `NDB` quanto o `InnoDB` podem servir como storage engines transacionais do MySQL, os usuários do MySQL Server às vezes se interessam pelo NDB Cluster. Eles veem o `NDB` como uma possível alternativa ou upgrade para a storage engine `InnoDB` padrão no MySQL 5.7. Embora `NDB` e `InnoDB` compartilhem características comuns, existem diferenças na arquitetura e na implementação, o que significa que alguns aplicativos existentes do MySQL Server e cenários de uso podem ser adequados para o NDB Cluster, mas não todos eles.

Nesta seção, discutimos e comparamos algumas características da storage engine `NDB` usada pelo NDB 7.5 com o `InnoDB` usado no MySQL 5.7. As próximas seções fornecem uma comparação técnica. Em muitos casos, as decisões sobre quando e onde usar o NDB Cluster devem ser tomadas caso a caso, considerando todos os fatores. Embora esteja além do escopo desta documentação fornecer detalhes para cada cenário de uso concebível, também tentamos oferecer algumas orientações muito gerais sobre a adequação relativa de alguns tipos comuns de aplicações para back ends `NDB` em oposição aos back ends `InnoDB`.

O NDB Cluster 7.5 usa um **mysqld** baseado no MySQL 5.7, incluindo suporte para `InnoDB` 1.1. Embora seja possível usar tabelas `InnoDB` com o NDB Cluster, essas tabelas não são clustered. Também não é possível usar programas ou bibliotecas de uma distribuição NDB Cluster 7.5 com o MySQL Server 5.7, ou o inverso.

Embora também seja verdade que alguns tipos de aplicações de negócios comuns podem ser executadas tanto no NDB Cluster quanto no MySQL Server (muito provavelmente usando a storage engine `InnoDB`), existem algumas diferenças arquitetônicas e de implementação importantes. Seção 21.2.6.1, “Diferenças entre as Storage Engines NDB e InnoDB”, fornece um resumo dessas diferenças. Devido a essas diferenças, alguns cenários de uso são claramente mais adequados para uma engine ou para a outra; veja Seção 21.2.6.2, “Workloads de NDB e InnoDB”. Isso, por sua vez, impacta os tipos de aplicações mais adequadas para uso com `NDB` ou `InnoDB`. Consulte Seção 21.2.6.3, “Resumo de Uso de Recursos do NDB e InnoDB”, para uma comparação da adequação relativa de cada um para uso em tipos comuns de aplicações de Database.

Para obter informações sobre as características relativas das storage engines `NDB` e `MEMORY`, consulte Quando Usar MEMORY ou NDB Cluster.

Consulte Capítulo 15, *Storage Engines Alternativas*, para informações adicionais sobre as storage engines do MySQL.
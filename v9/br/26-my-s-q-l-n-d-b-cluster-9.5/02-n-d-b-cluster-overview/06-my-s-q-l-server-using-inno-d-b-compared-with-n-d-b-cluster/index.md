### 25.2.6 MySQL Server Usando o InnoDB Comparado com o NDB Cluster

25.2.6.1 Diferenças entre os Motores de Armazenamento NDB e InnoDB

25.2.6.2 Cargas de Trabalho NDB e InnoDB

25.2.6.3 Resumo do Uso de Recursos NDB e InnoDB

O MySQL Server oferece várias opções de motores de armazenamento. Como tanto o `NDB` quanto o `InnoDB` podem servir como motores de armazenamento transacionais do MySQL, os usuários do MySQL Server às vezes ficam interessados no NDB Cluster. Eles veem o `NDB` como uma possível alternativa ou atualização para o motor de armazenamento padrão `InnoDB` no MySQL. Embora `NDB` e `InnoDB` compartilhem características comuns, há diferenças na arquitetura e implementação, de modo que algumas aplicações e cenários de uso existentes do MySQL Server podem ser adequados para o NDB Cluster, mas nem todas.

Nesta seção, discutimos e comparamos algumas características do motor de armazenamento `NDB` usado pelo NDB 9.5 com o `InnoDB` usado no MySQL 9.5. As próximas seções fornecem uma comparação técnica. Em muitas instâncias, as decisões sobre quando e onde usar o NDB Cluster devem ser tomadas caso a caso, levando em consideração todos os fatores. Embora esteja além do escopo desta documentação fornecer detalhes para todos os cenários de uso concebíveis, também tentamos oferecer alguma orientação muito geral sobre a adequação relativa de alguns tipos comuns de aplicações para backends `NDB` em oposição a `InnoDB`.

O NDB Cluster 9.5 usa um `mysqld` baseado no MySQL 9.5, incluindo suporte para o `InnoDB` 1.1. Embora seja possível usar tabelas `InnoDB` com o NDB Cluster, tais tabelas não são agrupadas. Também não é possível usar programas ou bibliotecas de uma distribuição do NDB Cluster 9.5 com o MySQL Server 9.5, ou vice-versa.

Embora também seja verdade que alguns tipos de aplicações empresariais comuns podem ser executados no NDB Cluster ou no MySQL Server (com maior probabilidade usando o mecanismo de armazenamento `InnoDB`), existem algumas diferenças importantes de arquitetura e implementação. A Seção 25.2.6.1, “Diferenças entre os mecanismos de armazenamento NDB e InnoDB”, fornece um resumo dessas diferenças. Devido às diferenças, alguns cenários de uso são claramente mais adequados para um motor ou outro; veja a Seção 25.2.6.2, “Carga de trabalho NDB e InnoDB”. Isso, por sua vez, tem um impacto nos tipos de aplicações que são mais adequadas para uso com `NDB` ou `InnoDB`. Consulte a Seção 25.2.6.3, “Resumo do uso de recursos NDB e InnoDB”, para uma comparação da adequação relativa de cada um para uso em tipos comuns de aplicações de banco de dados.

Para informações sobre as características relativas dos mecanismos de armazenamento `NDB` e `MEMORY`, consulte Quando usar MEMORY ou NDB Cluster.

Consulte o Capítulo 18, *Mecanismos de armazenamento alternativos*, para informações adicionais sobre os mecanismos de armazenamento MySQL.
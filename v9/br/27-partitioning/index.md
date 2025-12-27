# Capítulo 26 Partição

**Índice**

26.1 Visão geral da Partição no MySQL

26.2 Tipos de Partição:   26.2.1 Partição POR CAMPO

    26.2.2 Partição POR LISTA

    26.2.3 Partição POR COLUNAS

    26.2.4 Partição POR HASH

    26.2.5 Partição POR CHAVE

    26.2.6 Subpartição

    26.2.7 Como a Partição do MySQL lida com NULL

26.3 Gerenciamento de Partições:   26.3.1 Gerenciamento de Partições POR CAMPO e POR LISTA

    26.3.2 Gerenciamento de Partições POR HASH e POR CHAVE

    26.3.3 Troca de Partições e Subpartições com Tabelas

    26.3.4 Manutenção de Partições

    26.3.5 Obtenção de Informações sobre Partições

26.4 Remoção de Partições

26.5 Seleção de Partições

26.6 Restrições e Limitações sobre a Partição:   26.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas

    26.6.2 Limitações de Partição Relacionadas aos Motores de Armazenamento

    26.6.3 Limitações de Partição Relacionadas a Funções

Este capítulo discute a partição definida pelo usuário.

Nota

A partição de tabelas difere da partição usada por funções de janela. Para informações sobre funções de janela, consulte a Seção 14.20, “Funções de Janela”.

No MySQL 9.5, o suporte à partição é fornecido pelos motores de armazenamento `InnoDB` e `NDB`.

O MySQL 9.5 atualmente não suporta a partição de tabelas usando qualquer motor de armazenamento que não seja `InnoDB` ou `NDB`, como `MyISAM`. Uma tentativa de criar tabelas partidas usando um motor de armazenamento que não fornece suporte nativo à partição falha com `ER_CHECK_NOT_IMPLEMENTED`.

Os binários da Comunidade MySQL fornecidos pela Oracle incluem suporte à partição fornecido pelos motores de armazenamento `InnoDB` e `NDB`. Para informações sobre o suporte à partição oferecido nos binários da Edição Empresarial do MySQL, consulte o Capítulo 32, *MySQL Enterprise Edition*.

Se você estiver compilando o MySQL 9.5 a partir do código-fonte, configurar a compilação com suporte ao `InnoDB` é suficiente para produzir binários com suporte a partições para tabelas `InnoDB`. Para mais informações, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

Não é possível desativar o suporte a partições pelo motor de armazenamento `InnoDB`.

Consulte a Seção 26.1, “Visão geral da partição no MySQL”, para uma introdução às partições e aos conceitos de partição.

Vários tipos de partição são suportados, bem como a subpartição; consulte a Seção 26.2, “Tipos de partição”, e a Seção 26.2.6, “Subpartição”.

A Seção 26.3, “Gestão de partições”, aborda métodos para adicionar, remover e alterar partições em tabelas particionadas existentes.

A Seção 26.3.4, “Manutenção de partições”, discute comandos de manutenção de tabelas para uso com tabelas particionadas.

A tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA` fornece informações sobre partições e tabelas particionadas. Consulte a Seção 28.3.26, “A tabela INFORMATION\_SCHEMA PARTITIONS”, para mais informações; para alguns exemplos de consultas contra essa tabela, consulte a Seção 26.2.7, “Como o MySQL de Partição lida com NULL”.

Para problemas conhecidos com a partição no MySQL 9.5, consulte a Seção 26.6, “Restrições e limitações na partição”.

Você também pode achar os seguintes recursos úteis ao trabalhar com tabelas particionadas.

**Recursos adicionais.** Outras fontes de informações sobre partição definida pelo usuário no MySQL incluem o seguinte:

[Fórum de Partição do MySQL](https://forums.mysql.com/list.php?106)

Este é o fórum de discussão oficial para aqueles interessados ou que estejam experimentando com a tecnologia de Partição do MySQL. Ele apresenta anúncios e atualizações dos desenvolvedores do MySQL e outros. É monitorado por membros das equipes de Desenvolvimento e Documentação de Partição.

* PlanetMySQL

  Um site de notícias do MySQL que apresenta blogs relacionados ao MySQL, que devem ser de interesse para qualquer pessoa que use o meu MySQL. Incentivamos você a verificar aqui para links para blogs mantidos por aqueles que trabalham com Partição do MySQL, ou para que seu próprio blog seja adicionado aos que são cobertos.
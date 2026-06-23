# Capítulo 26 Partição

Este capítulo discute a partição definida pelo usuário.

Nota

A partição de tabela difere da partição utilizada por funções de janela. Para informações sobre funções de janela, consulte a Seção 14.20, “Funções de Janela”.

No MySQL 8.0, o suporte à partição é fornecido pelos motores de armazenamento `InnoDB` e `NDB`.

O MySQL 8.0 atualmente não suporta a partição de tabelas usando qualquer mecanismo de armazenamento que não seja `InnoDB` ou `NDB`, como `MyISAM`. Uma tentativa de criar tabelas partidas usando um mecanismo de armazenamento que não fornece suporte nativo para partição falha com `ER_CHECK_NOT_IMPLEMENTED`.

Os binários da Comunidade do MySQL 8.0 fornecidos pela Oracle incluem suporte para particionamento fornecido pelos motores de armazenamento `InnoDB` e `NDB`. Para informações sobre o suporte para particionamento oferecido nos binários da MySQL Enterprise Edition, consulte o Capítulo 32, *MySQL Enterprise Edition*.

Se você está compilando o MySQL 8.0 a partir de fonte, configurar a compilação com suporte ao `InnoDB` é suficiente para produzir binários com suporte a partições para tabelas do `InnoDB`. Para mais informações, consulte a Seção 2.8, “Instalando o MySQL a partir de fonte”.

Não é necessário fazer mais nada para habilitar o suporte à partição por `InnoDB` (por exemplo, não são necessárias entradas especiais no arquivo `my.cnf`).

Não é possível desabilitar o suporte de particionamento pelo motor de armazenamento `InnoDB`.

Veja a Seção 26.1, “Visão geral da partição no MySQL”, para uma introdução aos conceitos de partição e partição.

Vários tipos de particionamento são suportados, bem como subparticionamento; veja a Seção 26.2, “Tipos de particionamento”, e a Seção 26.2.6, “Subparticionamento”.

A Seção 26.3, “Gestão de Partições”, abrange métodos para adicionar, remover e alterar partições em tabelas particionadas existentes.

A Seção 26.3.4, “Manutenção de Partições”, discute comandos de manutenção de tabelas para uso com tabelas particionadas.

A tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA` fornece informações sobre partições e tabelas particionadas. Consulte a Seção 28.3.21, “A tabela INFORMATION_SCHEMA PARTITIONS”, para obter mais informações; para alguns exemplos de consultas contra esta tabela, consulte a Seção 26.2.7, “Como o MySQL de Partição lida com NULL”.

Para questões conhecidas sobre particionamento no MySQL 8.0, consulte a Seção 26.6, “Restrições e Limitações sobre Particionamento”.

Você também pode achar que os recursos a seguir são úteis ao trabalhar com tabelas particionadas.

**Recursos adicionais.** Outras fontes de informações sobre partição definida pelo usuário no MySQL incluem as seguintes:

* [Fórum de Partição MySQL][(https://forums.mysql.com/list.php?106)]

Este é o fórum de discussão oficial para aqueles interessados ou que estão experimentando a tecnologia de Partição MySQL. Ele apresenta anúncios e atualizações dos desenvolvedores do MySQL e outros. É monitorado por membros das equipes de Desenvolvimento e Documentação de Partição.

* PlanetMySQL

Um site de notícias do MySQL que apresenta blogs relacionados ao MySQL, que deve ser de interesse para qualquer pessoa que use o meu MySQL. Incentivamos você a verificar aqui os links para blogs mantidos por aqueles que trabalham com Partição do MySQL, ou para ter seu próprio blog adicionado aos que são cobertos.
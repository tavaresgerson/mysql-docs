# Capítulo 26 Partição

**Índice**

26.1 Visão geral da partição no MySQL

26.2 Tipos de Partição:   26.2.1 Partição RANGE

```
26.2.2 LIST Partitioning

26.2.3 COLUMNS Partitioning

26.2.4 HASH Partitioning

26.2.5 KEY Partitioning

26.2.6 Subpartitioning

26.2.7 How MySQL Partitioning Handles NULL
```

26.3 Gerenciamento de Partições:   26.3.1 Gerenciamento de Partições RANGE e LIST

```
26.3.2 Management of HASH and KEY Partitions

26.3.3 Exchanging Partitions and Subpartitions with Tables

26.3.4 Maintenance of Partitions

26.3.5 Obtaining Information About Partitions
```

26.4 Corte de Partição

26.5 Seleção de Partição

26.6 Restrições e Limitações sobre Partição:   26.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas

```
26.6.2 Partitioning Limitations Relating to Storage Engines

26.6.3 Partitioning Limitations Relating to Functions
```

Este capítulo discute a partição definida pelo usuário.

Nota

A partição de tabelas difere da partição usada por funções de janela. Para obter informações sobre funções de janela, consulte a Seção 14.20, “Funções de Janela”.

No MySQL 8.0, o suporte à partição é fornecido pelos mecanismos de armazenamento `InnoDB` e `NDB`.

O MySQL 8.0 atualmente não suporta a partição de tabelas usando qualquer mecanismo de armazenamento diferente de `InnoDB` ou `NDB`, como `MyISAM`. Uma tentativa de criar tabelas partidas usando um mecanismo de armazenamento que não oferece suporte nativo à partição falha com `ER_CHECK_NOT_IMPLEMENTED`.

Os binários da Comunidade do MySQL 8.0 fornecidos pela Oracle incluem suporte para particionamento fornecido pelos motores de armazenamento `InnoDB` e `NDB`. Para obter informações sobre o suporte para particionamento oferecido nos binários da MySQL Enterprise Edition, consulte o Capítulo 32, *MySQL Enterprise Edition*.

Se você estiver compilando o MySQL 8.0 a partir da fonte, configurar a compilação com suporte ao `InnoDB` é suficiente para produzir binários com suporte a partições para tabelas do `InnoDB`. Para mais informações, consulte a Seção 2.8, “Instalando o MySQL a partir da fonte”.

Não é necessário fazer mais nada para habilitar o suporte à partição por `InnoDB` (por exemplo, não são necessárias entradas especiais no arquivo `my.cnf`).

Não é possível desativar o suporte à partição pelo motor de armazenamento `InnoDB`.

Consulte a Seção 26.1, “Visão geral da partição no MySQL”, para uma introdução aos conceitos de partição e partição.

Vários tipos de particionamento são suportados, bem como a subparticionamento; veja a Seção 26.2, “Tipos de particionamento”, e a Seção 26.2.6, “Subparticionamento”.

A seção 26.3, "Gestão de Partições", abrange métodos para adicionar, remover e alterar partições em tabelas particionadas existentes.

A seção 26.3.4, "Manutenção de Partições", discute os comandos de manutenção de tabelas para uso com tabelas particionadas.

A tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA` fornece informações sobre partições e tabelas particionadas. Consulte a Seção 28.3.21, “A Tabela INFORMATION\_SCHEMA PARTITIONS”, para obter mais informações; para alguns exemplos de consultas contra esta tabela, consulte a Seção 26.2.7, “Como o MySQL lida com NULL em particionamento”.

Para informações sobre problemas conhecidos com a partição no MySQL 8.0, consulte a Seção 26.6, “Restrições e Limitações na Partição”.

Você também pode achar os seguintes recursos úteis ao trabalhar com tabelas particionadas.

**Recursos adicionais.** Outras fontes de informações sobre particionamento definido pelo usuário no MySQL incluem o seguinte:

- Fórum de Partição do MySQL

  Este é o fórum de discussão oficial para aqueles interessados ou que estão experimentando a tecnologia de Partição do MySQL. Ele apresenta anúncios e atualizações dos desenvolvedores do MySQL e outros. É monitorado por membros das equipes de Desenvolvimento e Documentação de Partição.

- PlanetMySQL

  Um site de notícias do MySQL que apresenta blogs relacionados ao MySQL, que deve ser de interesse para qualquer pessoa que use o meu MySQL. Incentivamos você a verificar aqui os links para blogs mantidos por aqueles que trabalham com Partição do MySQL, ou para que seu próprio blog seja adicionado aos que são cobertos.

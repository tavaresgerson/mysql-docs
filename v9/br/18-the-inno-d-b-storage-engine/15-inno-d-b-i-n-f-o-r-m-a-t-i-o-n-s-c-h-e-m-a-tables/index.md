## Tabelas do Schema de Informação InnoDB

17.15.1 Tabelas do Schema de Informação InnoDB sobre Compressão

17.15.2 Informações de Transações e Bloqueio do Schema de Informação InnoDB

17.15.3 Tabelas de Objetos do Schema de Informação InnoDB

17.15.4 Tabelas de Índices FULLTEXT do Schema de Informação InnoDB

17.15.5 Tabelas do Pool de Buffer do Schema de Informação InnoDB

17.15.6 Tabela de Métricas do Schema de Informação InnoDB

17.15.7 Tabela de Informações de Tabelas Temporárias do Schema de Informação InnoDB

17.15.8 Recuperação de Metadados do Espaço de Tabelas InnoDB a partir do FILES do Schema de Informação

Esta seção fornece informações e exemplos de uso para as tabelas do `Schema de Informação InnoDB`.

As tabelas do `Schema de Informação InnoDB` fornecem metadados, informações de status e estatísticas sobre vários aspectos do motor de armazenamento `InnoDB`. Você pode visualizar uma lista das tabelas do `Schema de Informação InnoDB` executando uma instrução `SHOW TABLES` no banco de dados `INFORMATION_SCHEMA`:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

Para definições de tabelas, consulte a Seção 28.4, “Tabelas InnoDB do Schema de Informação”. Para informações gerais sobre o banco de dados `INFORMATION_SCHEMA` do `MySQL`, consulte o Capítulo 28, *Tabelas do Schema de Informação*.
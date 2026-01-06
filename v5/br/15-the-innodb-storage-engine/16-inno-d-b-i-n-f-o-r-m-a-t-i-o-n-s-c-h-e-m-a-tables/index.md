## 14.16 Tabelas do esquema de informações InnoDB

14.16.1 Tabelas do esquema de informações InnoDB sobre compressão

14.16.2 Informações de transação e bloqueio do esquema de informações InnoDB

14.16.3 Tabelas do esquema de informações InnoDB

14.16.4 Tabelas de índices FULLTEXT do esquema de informações InnoDB

14.16.5 Tabelas do Banco de Armazenamento de Buffer do Schema de Informação InnoDB

14.16.6 Tabela de métricas do esquema de informações InnoDB

14.16.7 Tabela de informações da InnoDB do esquema de informações Tabela de informações temporárias

14.16.8 Recuperação dos metadados do espaço de tabela InnoDB a partir do INFORMATION\_SCHEMA.FILES

Esta seção fornece informações e exemplos de uso para as tabelas do `INFORMATION_SCHEMA` do `InnoDB`.

As tabelas do `INFORMATION_SCHEMA` do `InnoDB` fornecem metadados, informações de status e estatísticas sobre vários aspectos do motor de armazenamento `InnoDB`. Você pode visualizar uma lista das tabelas do `INFORMATION_SCHEMA` do `InnoDB` executando a instrução `SHOW TABLES` no banco de dados `INFORMATION_SCHEMA`:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

Para definições de tabelas, consulte a Seção 24.4, “TÁBUAS DO SCHEMA DE INFORMAÇÃO InnoDB”. Para informações gerais sobre o banco de dados `INFORMATION_SCHEMA` do MySQL, consulte o Capítulo 24, *TÁBUAS DO SCHEMA DE INFORMAÇÃO*.

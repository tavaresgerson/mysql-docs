## 14.16 Tabelas INFORMATION\_SCHEMA do InnoDB

14.16.1 Tabelas INFORMATION\_SCHEMA do InnoDB sobre Compressão

14.16.2 Informações de Transação e Locking nas INFORMATION\_SCHEMA do InnoDB

14.16.3 Tabelas de Sistema INFORMATION\_SCHEMA do InnoDB

14.16.4 Tabelas de Index FULLTEXT INFORMATION\_SCHEMA do InnoDB

14.16.5 Tabelas de Buffer Pool INFORMATION\_SCHEMA do InnoDB

14.16.6 Tabela de Métricas INFORMATION\_SCHEMA do InnoDB

14.16.7 Tabela de Informações sobre Tabelas Temporárias INFORMATION\_SCHEMA do InnoDB

14.16.8 Recuperando Metadados de Tablespace do InnoDB de INFORMATION\_SCHEMA.FILES

Esta seção fornece informações e exemplos de uso para as tabelas `INFORMATION_SCHEMA` do `InnoDB`.

As tabelas `INFORMATION_SCHEMA` do `InnoDB` fornecem metadados, informações de status e estatísticas sobre vários aspectos do storage engine `InnoDB`. Você pode visualizar uma lista das tabelas `INFORMATION_SCHEMA` do `InnoDB` executando uma instrução `SHOW TABLES` no database `INFORMATION_SCHEMA`:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

Para definições de tabela, consulte a Seção 24.4, “Tabelas InnoDB do INFORMATION\_SCHEMA”. Para informações gerais sobre o database `INFORMATION_SCHEMA` do `MySQL`, consulte o Capítulo 24, *Tabelas INFORMATION\_SCHEMA*.
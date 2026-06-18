## 17.15 Tabelas do esquema de informações InnoDB

17.15.1 Tabelas do esquema de informações InnoDB sobre compressão

17.15.2 Informações de transação e bloqueio do esquema de informações InnoDB

17.15.3 Objetos de esquema do esquema INFORMATION\_SCHEMA do InnoDB

17.15.4 Tabelas de índices FULLTEXT do esquema de informações InnoDB

17.15.5 Tabelas do Banco de Armazenamento de Buffer do Schema de Informação InnoDB

17.15.6 Tabela de métricas do esquema de informações InnoDB

17.15.7 InnoDB INFORMATION\_SCHEMA Tabela de informações da tabela temporária Info

17.15.8 Recuperação dos metadados do espaço de tabela InnoDB a partir do INFORMATION\_SCHEMA.FILES

Esta seção fornece informações e exemplos de uso para as tabelas `InnoDB` `INFORMATION_SCHEMA`.

As tabelas `InnoDB` e `INFORMATION_SCHEMA` fornecem metadados, informações de status e estatísticas sobre vários aspectos do motor de armazenamento `InnoDB`. Você pode visualizar uma lista de tabelas `InnoDB` `INFORMATION_SCHEMA` executando uma instrução `SHOW TABLES` no banco de dados `INFORMATION_SCHEMA`:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

Para definições de tabelas, consulte a Seção 28.4, “Tabelas do esquema de informações InnoDB”. Para informações gerais sobre os bancos de dados `MySQL` `INFORMATION_SCHEMA`, consulte o Capítulo 28, *Tabelas do esquema de informações*.

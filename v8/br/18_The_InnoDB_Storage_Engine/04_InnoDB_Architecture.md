## 17.4 Arquitetura InnoDB

O diagrama a seguir mostra as estruturas de memória e em disco que compõem a arquitetura do motor de armazenamento `InnoDB`. Para informações sobre cada estrutura, consulte a Seção 17.5, “Estruturas de Memória InnoDB”, e a Seção 17.6, “Estruturas de Disco InnoDB”.

**Figura 17.1 Arquitetura InnoDB**

![InnoDB architecture diagram showing in-memory and on-disk structures. In-memory structures include the buffer pool, adaptive hash index, change buffer, and log buffer. On-disk structures include tablespaces, redo logs, and doublewrite buffer files.](images/innodb-architecture-8-0.png)
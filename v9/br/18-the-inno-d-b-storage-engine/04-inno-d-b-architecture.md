## 17.4 Arquitetura do InnoDB

O diagrama a seguir mostra as estruturas de memória e de disco que compõem a arquitetura do mecanismo de armazenamento do `InnoDB`. Para obter informações sobre cada estrutura, consulte a Seção 17.5, “Estruturas de Memória do InnoDB”, e a Seção 17.6, “Estruturas de Disco do InnoDB”.

**Figura 17.1 Arquitetura do InnoDB**

![Diagrama da arquitetura do InnoDB mostrando estruturas de memória e de disco. As estruturas de memória incluem o pool de buffers, o índice de hash adaptável, o buffer de alterações e o buffer de log. As estruturas de disco incluem espaços de tabelas, logs de refazer e arquivos de buffer de escrita dupla.](images/innodb-architecture-8-0.png)
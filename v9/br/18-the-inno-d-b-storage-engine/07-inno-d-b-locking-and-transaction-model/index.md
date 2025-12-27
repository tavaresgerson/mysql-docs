## 17.7 Bloqueio e Modelo de Transação do InnoDB

17.7.1 Bloqueio do InnoDB

17.7.2 Modelo de Transação do InnoDB

17.7.3 Bloqueios Definidos por Diferentes Instruções SQL no InnoDB

17.7.4 Linhas Fantasmas

17.7.5 Deadlocks no InnoDB

17.7.6 Agendamento de Transações

Para implementar um aplicativo de banco de dados de grande escala, ocupado ou altamente confiável, para portar código substancial de um sistema de banco de dados diferente ou para ajustar o desempenho do MySQL, é importante entender o bloqueio do `InnoDB` e o modelo de transação do `InnoDB`.

Esta seção discute vários tópicos relacionados ao bloqueio do `InnoDB` e ao modelo de transação do `InnoDB` com os quais você deve estar familiarizado.

* Seção 17.7.1, “Bloqueio do InnoDB” descreve os tipos de bloqueio usados pelo `InnoDB`.

* Seção 17.7.2, “Modelo de Transação do InnoDB” descreve os níveis de isolamento de transação e as estratégias de bloqueio usadas por cada um. Também discute o uso de `autocommit`, leituras consistentes sem bloqueio e leituras com bloqueio.

* Seção 17.7.3, “Bloqueios Definidos por Diferentes Instruções SQL no InnoDB” discute tipos específicos de bloqueios definidos no `InnoDB` para várias instruções.

* Seção 17.7.4, “Linhas Fantasmas” descreve como o `InnoDB` usa o bloqueio de próxima chave para evitar linhas fantasmas.

* Seção 17.7.5, “Deadlocks no InnoDB” fornece um exemplo de deadlock, discute a detecção de deadlock e oferece dicas para minimizar e lidar com deadlocks no `InnoDB`.
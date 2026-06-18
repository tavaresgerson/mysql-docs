## 14.7 InnoDB Locking e Modelo de Transaction

14.7.1 InnoDB Locking

14.7.2 InnoDB Modelo de Transaction

14.7.3 Locks Definidos por Diferentes Statements SQL no InnoDB

14.7.4 Linhas Fantasma (Phantom Rows)

14.7.5 Deadlocks no InnoDB

Para implementar uma aplicação de Database em grande escala, ocupada ou altamente confiável, para portar código substancial de um sistema de Database diferente, ou para ajustar o desempenho do MySQL, é importante entender o InnoDB Locking e o modelo de Transaction do InnoDB.

Esta seção discute vários tópicos relacionados ao InnoDB Locking e ao modelo de Transaction do InnoDB, com os quais você deve estar familiarizado.

* Seção 14.7.1, “InnoDB Locking” descreve os tipos de Lock usados pelo InnoDB.

* Seção 14.7.2, “InnoDB Modelo de Transaction” descreve os níveis de isolamento de Transaction e as estratégias de Locking usadas por cada um. Também discute o uso de `autocommit`, consistent non-locking reads e locking reads.

* Seção 14.7.3, “Locks Definidos por Diferentes Statements SQL no InnoDB” discute tipos específicos de Locks definidos no InnoDB para vários statements.

* Seção 14.7.4, “Linhas Fantasma (Phantom Rows)” descreve como o InnoDB usa next-key locking para evitar linhas fantasma.

* Seção 14.7.5, “Deadlocks no InnoDB” fornece um exemplo de Deadlock, discute a detecção de Deadlock e oferece dicas para minimizar e lidar com Deadlocks no InnoDB.
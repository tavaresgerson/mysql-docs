## 14.7 Modelo de Transição e Bloqueio do InnoDB

14.7.1 Bloqueio do InnoDB

14.7.2 Modelo de Transação InnoDB

14.7.3 Lâminas definidas por diferentes instruções SQL no InnoDB

14.7.4 Linhas Fantoma

14.7.5 Bloqueios em InnoDB

Para implementar uma aplicação de banco de dados em grande escala, com alta atividade ou alta confiabilidade, para migrar código substancial de outro sistema de banco de dados ou para ajustar o desempenho do MySQL, é importante entender o bloqueio do `InnoDB` e o modelo de transação do `InnoDB`.

Esta seção discute vários tópicos relacionados ao bloqueio do `InnoDB` e ao modelo de transação do `InnoDB`, com os quais você deve estar familiarizado.

- A Seção 14.7.1, “Bloqueio InnoDB”, descreve os tipos de bloqueio usados pelo `InnoDB`.

- A Seção 14.7.2, “Modelo de Transação InnoDB”, descreve os níveis de isolamento de transação e as estratégias de bloqueio utilizadas por cada um. Ela também discute o uso de `autocommit`, leituras consistentes sem bloqueio e leituras com bloqueio.

- A seção 14.7.3, "Bloqueios Definidos por Diferentes Instruções SQL no InnoDB", discute tipos específicos de bloqueios definidos no `InnoDB` para várias instruções.

- A Seção 14.7.4, “Linhas Fantasma”, descreve como o `InnoDB` usa o bloqueio de próximo chave para evitar linhas fantasmas.

- A seção 14.7.5, "Bloqueios em InnoDB", fornece um exemplo de bloqueio, discute a detecção de bloqueios e oferece dicas para minimizar e lidar com bloqueios em `InnoDB`.

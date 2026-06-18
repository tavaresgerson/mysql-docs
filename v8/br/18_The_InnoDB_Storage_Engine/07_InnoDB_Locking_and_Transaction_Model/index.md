## 17.7 Modelo de Transição e Bloqueio do InnoDB

17.7.1 Bloqueio do InnoDB

17.7.2 Modelo de Transação InnoDB

17.7.3 Lâminas definidas por diferentes instruções SQL no InnoDB

17.7.4 Linhas Fantoches

17.7.5 Engastes em InnoDB

17.7.6 Agendamento de transações

Para implementar uma aplicação de banco de dados em grande escala, com alta atividade ou alta confiabilidade, para migrar um código substancial de outro sistema de banco de dados ou para ajustar o desempenho do MySQL, é importante entender o bloqueio `InnoDB` e o modelo de transação `InnoDB`.

Esta seção discute vários tópicos relacionados ao bloqueio `InnoDB` e ao modelo de transação `InnoDB`, com os quais você deve estar familiarizado.

- A seção 17.7.1, “Bloqueio InnoDB”, descreve os tipos de bloqueio usados pelo `InnoDB`.

- A Seção 17.7.2, “Modelo de Transação InnoDB”, descreve os níveis de isolamento de transação e as estratégias de bloqueio utilizadas por cada um. Ela também discute o uso de `autocommit`, leituras consistentes sem bloqueio e leituras com bloqueio.

- A seção 17.7.3, “Bloqueios Definidos por Diferentes Instruções SQL no InnoDB”, discute tipos específicos de bloqueios definidos em `InnoDB` para várias instruções.

- A seção 17.7.4, “Linhas Fantasma”, descreve como o `InnoDB` usa o bloqueio de próxima chave para evitar linhas fantasmas.

- A seção 17.7.5, "Bloqueios em InnoDB", fornece um exemplo de bloqueio, discute a detecção de bloqueios e oferece dicas para minimizar e lidar com bloqueios em `InnoDB`.

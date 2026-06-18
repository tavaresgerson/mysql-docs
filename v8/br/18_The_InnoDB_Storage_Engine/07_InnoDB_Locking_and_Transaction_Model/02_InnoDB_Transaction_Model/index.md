### 17.7.2 Modelo de Transação InnoDB

17.7.2.1 Níveis de Isolamento de Transações

17.7.2.2 autocommit, Commit e Rollback

17.7.2.3 Leitura consistente sem bloqueio

17.7.2.4 Leitura de bloqueio

O modelo de transação `InnoDB` visa combinar as melhores propriedades de um banco de dados de múltiplas versões com o bloqueio tradicional de duas fases. `InnoDB` realiza o bloqueio ao nível da linha e executa consultas como leituras consistentes sem bloqueio, por padrão, no estilo do Oracle. As informações de bloqueio em `InnoDB` são armazenadas de forma eficiente em termos de espaço, de modo que a escalada de bloqueio não seja necessária. Tipicamente, vários usuários são autorizados a bloquear cada linha nas tabelas de `InnoDB`, ou qualquer subconjunto aleatório das linhas, sem causar o esgotamento da memória de `InnoDB`.

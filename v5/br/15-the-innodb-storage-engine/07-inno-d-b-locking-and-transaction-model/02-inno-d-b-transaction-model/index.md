### 14.7.2 Modelo de Transação do InnoDB

14.7.2.1 Níveis de Isolamento de Transaction

14.7.2.2 autocommit, Commit, e Rollback

14.7.2.3 Consistent Nonlocking Reads

14.7.2.4 Locking Reads

O modelo de transação do `InnoDB` visa combinar as melhores propriedades de um Database de multi-versioning com o tradicional two-phase locking. O `InnoDB` executa o locking no row level e executa Queries como nonlocking consistent reads por padrão, no estilo Oracle. A informação de Lock no `InnoDB` é armazenada de forma eficiente em termos de espaço (space-efficiently) para que o lock escalation não seja necessário. Tipicamente, vários usuários podem ter permissão para aplicar Lock em cada row das tabelas `InnoDB`, ou em qualquer subconjunto aleatório das rows, sem causar exaustão da memória do `InnoDB`.
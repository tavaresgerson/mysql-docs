### 5.5.3 Thread Pool do MySQL Enterprise

[5.5.3.1 Elementos do Thread Pool](thread-pool-elements.html)

[5.5.3.2 Instalação do Thread Pool](thread-pool-installation.html)

[5.5.3.3 Operação do Thread Pool](thread-pool-operation.html)

[5.5.3.4 Ajuste (Tuning) do Thread Pool](thread-pool-tuning.html)

Nota

O Thread Pool do MySQL Enterprise é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, acesse <https://www.mysql.com/products/>.

O MySQL Enterprise Edition inclui o Thread Pool do MySQL Enterprise, implementado usando um server plugin. O thread-handling model padrão no MySQL Server executa statements usando um Thread por client connection. À medida que mais clients se conectam ao servidor e executam statements, o desempenho geral se degrada. O thread pool plugin oferece um thread-handling model alternativo projetado para reduzir overhead e melhorar o desempenho. O plugin implementa um thread pool que aumenta o desempenho do servidor gerenciando Threads de execução de statements de forma eficiente para um grande número de client connections.

O thread pool aborda vários problemas do modelo que usa um Thread por connection:

*   Stacks de Threads em excesso tornam os CPU Caches quase inúteis em workloads de execução altamente paralela. O thread pool promove a reutilização de thread stack para minimizar o footprint do CPU Cache.

*   Com Threads em excesso executando em paralelo, o overhead de Context Switching é alto. Isso também representa um desafio para o scheduler do sistema operacional. O thread pool controla o número de Threads ativos para manter o paralelismo dentro do MySQL Server em um nível que ele possa suportar e que seja apropriado para o host do servidor no qual o MySQL está sendo executado.

*   Transações em excesso executando em paralelo aumentam a resource contention. No [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), isso aumenta o tempo gasto mantendo Mutexes centrais. O thread pool controla quando as transactions começam para garantir que não haja muitas executando em paralelo.

#### Recursos Adicionais

[Seção A.15, “FAQ do MySQL 5.7: Thread Pool do MySQL Enterprise”](faqs-thread-pool.html "A.15 FAQ do MySQL 5.7: Thread Pool do MySQL Enterprise")
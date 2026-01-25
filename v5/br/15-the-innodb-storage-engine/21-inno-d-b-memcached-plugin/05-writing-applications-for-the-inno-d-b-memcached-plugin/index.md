### 14.21.5 Escrevendo Aplicações para o Plugin memcached do InnoDB

14.21.5.1 Adaptando um Schema MySQL Existente para o Plugin memcached do InnoDB

14.21.5.2 Adaptando uma Aplicação memcached para o Plugin memcached do InnoDB

14.21.5.3 Ajustando o Desempenho (Tuning) do Plugin memcached do InnoDB

14.21.5.4 Controlando o Comportamento Transacional do Plugin memcached do InnoDB

14.21.5.5 Adaptando Declarações DML para Operações memcached

14.21.5.6 Executando Declarações DML e DDL na Tabela InnoDB Subjacente

Tipicamente, escrever uma aplicação para o **plugin** **memcached** do `InnoDB` envolve um certo grau de reescrita ou adaptação de código existente que usa MySQL ou a **API** **memcached**.

* Com o **plugin** `daemon_memcached`, em vez de muitos servidores **memcached** tradicionais rodando em máquinas de baixo desempenho, você tem o mesmo número de servidores **memcached** que servidores MySQL, rodando em máquinas de alto desempenho com armazenamento em disco e memória consideráveis. Você pode reutilizar algum código existente que funciona com a **API** **memcached**, mas a adaptação é provavelmente necessária devido à diferente configuração do servidor.

* Os dados armazenados através do **plugin** `daemon_memcached` vão para colunas `VARCHAR`, `TEXT` ou `BLOB`, e devem ser convertidos para realizar operações numéricas. Você pode realizar a conversão no lado da aplicação, ou usando a função `CAST()` em **queries**.

* Vindo de um contexto de **Database**, você pode estar acostumado a tabelas SQL de propósito geral com muitas colunas. As tabelas acessadas pelo código **memcached** provavelmente têm apenas algumas ou até mesmo uma única coluna que contém valores de dados.

* Você pode adaptar partes da sua aplicação que executam **queries** de linha única, **inserts**, **updates** ou **deletes**, para melhorar o desempenho em seções críticas do código. Tanto as **queries** (leitura) quanto as operações DML (escrita) podem ser substancialmente mais rápidas quando executadas através da interface **memcached** do `InnoDB`. A melhoria de desempenho para escritas é tipicamente maior do que a melhoria de desempenho para leituras, então você pode se concentrar em adaptar o código que realiza *logging* ou registra escolhas interativas em um website.

As seções a seguir exploram esses pontos com mais detalhes.
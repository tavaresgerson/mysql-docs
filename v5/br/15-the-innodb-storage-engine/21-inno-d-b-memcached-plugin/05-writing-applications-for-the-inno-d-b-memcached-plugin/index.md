### 14.21.5 Escrever Aplicativos para o Plugin memcached do InnoDB

14.21.5.1 Adaptando um Schema Existente do MySQL para o Plugin memcached do InnoDB

14.21.5.2 Adaptando uma aplicação memcached para o plugin memcached do InnoDB

14.21.5.3 Ajuste do desempenho do plugin InnoDB memcached

14.21.5.4 Controle do comportamento transacional do plugin memcached do InnoDB

14.21.5.5 Adaptando declarações DML para operações memcached

14.21.5.6 Executando declarações DML e DDL na tabela subjacente InnoDB

Normalmente, escrever um aplicativo para o plugin \`InnoDB **memcached** envolve algum grau de reescrita ou adaptação de código existente que utiliza MySQL ou a API **memcached**.

- Com o plugin `daemon_memcached`, em vez de muitos servidores tradicionais **memcached** rodando em máquinas de baixo desempenho, você tem o mesmo número de servidores **memcached** que servidores MySQL, rodando em máquinas relativamente potentes com armazenamento de disco e memória substanciais. Você pode reutilizar algum código existente que funciona com a API **memcached**, mas é provável que seja necessária uma adaptação devido à configuração diferente do servidor.

- Os dados armazenados através do plugin `daemon_memcached` são armazenados em colunas `VARCHAR`, `TEXT` ou `BLOB` e precisam ser convertidos para realizar operações numéricas. Você pode realizar a conversão no lado do aplicativo ou usando a função `CAST()` nas consultas.

- Vindo de um ambiente de banco de dados, você pode estar acostumado com tabelas SQL de uso geral com muitas colunas. As tabelas acessadas pelo código do **memcached** provavelmente têm apenas algumas ou até uma única coluna que armazena valores de dados.

- Você pode adaptar partes de sua aplicação que realizam consultas de uma única linha, inserções, atualizações ou exclusões para melhorar o desempenho em seções críticas do código. Tanto as operações de consulta (leitura) quanto as DML (escrita) podem ser significativamente mais rápidas quando realizadas através da interface \`InnoDB **memcached**. A melhoria de desempenho para escritas é geralmente maior do que a melhoria de desempenho para leituras, então você pode focar em adaptar o código que realiza log de eventos ou registra escolhas interativas em um site.

As seções a seguir exploram esses pontos com mais detalhes.

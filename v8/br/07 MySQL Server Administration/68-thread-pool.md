### 7.6.3 MySQL Enterprise Thread Pool (Pool de tópicos do MySQL para empresas)

::: info Note

MySQL Enterprise Thread Pool é uma extensão incluída no MySQL Enterprise Edition, um produto comercial.

:::

O MySQL Enterprise Edition inclui o MySQL Enterprise Thread Pool, implementado usando um plugin de servidor. O modelo padrão de manuseio de threads no MySQL Server executa instruções usando um thread por conexão de cliente. À medida que mais clientes se conectam ao servidor e executam instruções, o desempenho geral degrada. O plugin de pool de threads fornece um modelo alternativo de manuseio de threads projetado para reduzir a sobrecarga e melhorar o desempenho. O plugin implementa um pool de threads que aumenta o desempenho do servidor gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes.

O pool de threads aborda vários problemas do modelo que usa um thread por conexão:

- Muitas pilhas de threads tornam os caches da CPU quase inúteis em cargas de trabalho de execução altamente paralelas.
- Com muitos threads executando em paralelo, a sobrecarga de comutação de contexto é alta. Isso também apresenta um desafio para o agendador do sistema operacional. O pool de threads controla o número de threads ativos para manter o paralelismo dentro do servidor MySQL em um nível que ele possa lidar e que seja apropriado para o host do servidor em que o MySQL está sendo executado.
- Muitas transações executadas em paralelo aumentam a contenção de recursos. Em `InnoDB`, isso aumenta o tempo gasto em manter mutexes centrais. O pool de threads controla quando as transações começam para garantir que não sejam executadas em paralelo.

#### Recursos adicionais

Secção A.15, MySQL 8.4 FAQ: MySQL Enterprise Thread Pool

### 7.6.3 Piscinão de Threads do MySQL Enterprise

::: info Nota

O Piscinão de Threads do MySQL Enterprise é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, acesse <https://www.mysql.com/products/>.

:::

A Edição Empresarial do MySQL inclui o Piscinão de Threads do MySQL Enterprise, implementado usando um plugin do servidor. O modelo padrão de manipulação de threads no MySQL Server executa instruções usando um thread por conexão de cliente. À medida que mais clientes se conectam ao servidor e executam instruções, o desempenho geral degrada. O plugin de piscinão de threads fornece um modelo alternativo de manipulação de threads projetado para reduzir o overhead e melhorar o desempenho. O plugin implementa um piscinão de threads que aumenta o desempenho do servidor gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes.

O piscinão de threads resolve vários problemas do modelo que usa um thread por conexão:

* Muitos pilhas de threads tornam os caches de CPU quase inúteis em cargas de trabalho de execução altamente paralelas. O piscinão de threads promove a reutilização de pilhas de threads para minimizar a pegada de cache de CPU.
* Com muitos threads executando em paralelo, o overhead da alternância de contexto é alto. Isso também apresenta um desafio para o agendamento do sistema operacional. O piscinão de threads controla o número de threads ativos para manter o paralelismo no servidor MySQL em um nível que ele pode lidar e que é apropriado para o host do servidor no qual o MySQL está sendo executado.
* Muitas transações executando em paralelo aumentam a concorrência por recursos. No `InnoDB`, isso aumenta o tempo gasto mantendo mutexes centrais. O piscinão de threads controla quando as transações começam para garantir que não sejam executadas em paralelo.

#### Recursos Adicionais

 Seção A.15, “MySQL 8.4 FAQ: Piscinão de Threads do MySQL Enterprise”
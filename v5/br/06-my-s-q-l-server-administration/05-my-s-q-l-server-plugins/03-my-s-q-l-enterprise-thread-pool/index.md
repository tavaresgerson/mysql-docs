### 5.5.3 Piscina de Fios da Empresa MySQL

5.5.3.1 Elementos do Pool de Fios

5.5.3.2 Instalação do Pool de Fios

5.5.3.3 Operação do Pool de Fios

5.5.3.4 Ajuste do Pool de Fios

Nota

O MySQL Enterprise Thread Pool é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Thread Pool, implementado usando um plugin do servidor. O modelo padrão de gerenciamento de threads no MySQL Server executa instruções usando um thread por conexão de cliente. À medida que mais clientes se conectam ao servidor e executam instruções, o desempenho geral diminui. O plugin de pool de threads oferece um modelo alternativo de gerenciamento de threads projetado para reduzir o overhead e melhorar o desempenho. O plugin implementa um pool de threads que aumenta o desempenho do servidor gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes.

O pool de threads resolve vários problemas do modelo que usa uma thread por conexão:

- Muitos pilhas de threads tornam os caches da CPU quase inúteis em cargas de trabalho de execução altamente paralelas. O pool de threads promove a reutilização da pilha de threads para minimizar a pegada do cache da CPU.

- Com muitos fios executando em paralelo, o overhead da alternância de contexto é alto. Isso também apresenta um desafio para o planejador do sistema operacional. O pool de threads controla o número de threads ativas para manter o paralelismo no servidor MySQL em um nível que ele possa lidar e que seja apropriado para o host do servidor no qual o MySQL está sendo executado.

- Muitas transações executando em paralelo aumentam a disputa por recursos. No `InnoDB`, isso aumenta o tempo gasto mantendo mutantes centrais. O pool de threads controla quando as transações começam para garantir que não sejam executadas em paralelo demasiadas.

#### Recursos adicionais

Seção A.15, “Perguntas frequentes sobre o MySQL 5.7: Pool de threads do MySQL Enterprise”

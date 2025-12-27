### 7.6.3 Piscina de Fios do MySQL Enterprise

7.6.3.1 Elementos da Piscina de Fios

7.6.3.2 Instalação da Piscina de Fios

7.6.3.3 Operação da Piscina de Fios

7.6.3.4 Ajuste da Piscina de Fios

Nota

A Piscina de Fios do MySQL Enterprise é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui a Piscina de Fios do MySQL Enterprise, implementada usando um plugin do servidor. O modelo padrão de manipulação de fios no MySQL Server executa instruções usando um fio por conexão de cliente. À medida que mais clientes se conectam ao servidor e executam instruções, o desempenho geral degrada. O plugin de piscina de fios fornece um modelo alternativo de manipulação de fios projetado para reduzir o overhead e melhorar o desempenho. O plugin implementa uma piscina de fios que aumenta o desempenho do servidor gerenciando eficientemente os fios de execução de instruções para um grande número de conexões de clientes.

A piscina de fios resolve vários problemas do modelo que usa um fio por conexão:

* Muitos pilhas de fios tornam os caches de CPU quase inúteis em cargas de trabalho de execução altamente paralelas. A piscina de fios promove a reutilização de pilhas de fios para minimizar a pegada de cache da CPU.

* Com muitos fios executando em paralelo, o overhead da alternância de contexto é alto. Isso também apresenta um desafio para o agendamento do sistema operacional. A piscina de fios controla o número de fios ativos para manter o paralelismo no servidor MySQL em um nível que ele pode lidar e que é apropriado para o host do servidor no qual o MySQL está sendo executado.

* Muitas transações sendo executadas em paralelo aumentam a disputa por recursos. No `InnoDB`, isso aumenta o tempo gasto mantendo mutantes centrais. O pool de threads controla quando as transações começam para garantir que não sejam executadas em paralelo demasiadas.

**Recursos Adicionais**

Seção A.15, “Perguntas Frequentes do MySQL 9.5: Pool de Threads do MySQL Enterprise”
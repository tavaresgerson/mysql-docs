## 28.6 Visão geral do Pool de Fios do MySQL Enterprise

A Edição Empresarial do MySQL inclui o MySQL Enterprise Thread Pool, implementado usando um plugin do servidor. O modelo padrão de gerenciamento de threads no MySQL Server executa instruções usando um thread por conexão de cliente. À medida que mais clientes se conectam ao servidor e executam instruções, o desempenho geral diminui. Na Edição Empresarial do MySQL, um plugin de pool de threads oferece um modelo alternativo de gerenciamento de threads projetado para reduzir o overhead e melhorar o desempenho. O plugin implementa um pool de threads que aumenta o desempenho do servidor gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes.

Para obter mais informações, consulte a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

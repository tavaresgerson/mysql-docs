### 8.5.10 Otimizando o InnoDB para sistemas com muitas tabelas

- Se você configurou estatísticas de otimizador não persistentes (uma configuração não padrão), o `InnoDB` calcula os valores de cardinalidade do índice da tabela pela primeira vez que a tabela é acessada após a inicialização, em vez de armazenar esses valores na tabela. Esse passo pode levar tempo significativo em sistemas que particionam os dados em muitas tabelas. Como esse overhead só se aplica à operação inicial de abertura da tabela, para “aquecer” uma tabela para uso posterior, acesse-a imediatamente após a inicialização, executando uma instrução como `SELECT 1 FROM tbl_name LIMIT 1`.

  As estatísticas do otimizador são persistidas no disco por padrão, habilitadas pela opção de configuração `innodb_stats_persistent`. Para obter informações sobre estatísticas de otimizador persistidas, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistidas”.

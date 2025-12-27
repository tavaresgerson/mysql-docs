## 10.9 Controlando o Otimizador de Consultas

10.9.1 Controlando a Avaliação do Plano de Consulta

10.9.2 Otimizações Alternativas

10.9.3 Dicas do Otimizador

10.9.4 Dicas de Índices

10.9.5 O Modelo de Custo do Otimizador

10.9.6 Estatísticas do Otimizador

O MySQL fornece controle sobre o otimizador por meio de variáveis de sistema que afetam a forma como os planos de consulta são avaliados, otimizações alternáveis, dicas do otimizador e dicas de índices, além do modelo de custo do otimizador.

O servidor mantém estatísticas de histograma sobre os valores das colunas na tabela `column_statistics` do dicionário de dados (veja a Seção 10.9.6, “Estatísticas do Otimizador”). Como outras tabelas do dicionário de dados, essa tabela não é diretamente acessível pelos usuários. Em vez disso, você pode obter informações de histograma realizando consultas na `INFORMATION_SCHEMA.COLUMN_STATISTICS`, que é implementada como uma visão na tabela do dicionário de dados. Você também pode realizar a gestão de histograma usando a instrução `ANALYZE TABLE`.
## 10.9 Controlar o otimizador de consultas

10.9.1 Controle da Avaliação do Plano de Consulta

10.9.2 Otimizações comutadas

10.9.3 Dicas de otimizador

10.9.4 Dicas de índice

10.9.5 Modelo de Custo do Otimizador

10.9.6 Estatísticas do otimizador

O MySQL oferece controle de otimizador por meio de variáveis do sistema que afetam a forma como os planos de consulta são avaliados, otimizações comutadas, dicas de otimizador e índice, e o modelo de custo do otimizador.

O servidor mantém estatísticas de histograma sobre os valores das colunas na tabela do dicionário de dados `column_statistics` (consulte a Seção 10.9.6, “Estatísticas do otimizador”). Como outras tabelas do dicionário de dados, essa tabela não é diretamente acessível pelos usuários. Em vez disso, você pode obter informações de histograma realizando uma consulta ao `INFORMATION_SCHEMA.COLUMN_STATISTICS`, que é implementado como uma visão na tabela do dicionário de dados. Você também pode realizar a gestão do histograma usando a instrução `ANALYZE TABLE`.

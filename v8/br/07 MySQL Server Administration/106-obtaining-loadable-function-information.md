### 7.7.2 Obter Informações sobre Funções Carregáveis

A tabela do Schema de Desempenho `user_defined_functions` contém informações sobre as funções carregáveis atualmente instaladas:

```
SELECT * FROM performance_schema.user_defined_functions;
```

A tabela do sistema `mysql.func` também lista as funções carregáveis instaladas, mas apenas aquelas instaladas usando `CREATE FUNCTION`. A tabela `user_defined_functions` lista as funções carregáveis instaladas usando `CREATE FUNCTION`, bem como as funções carregáveis instaladas automaticamente por componentes ou plugins. Essa diferença torna a tabela `user_defined_functions` preferível à tabela `mysql.func` para verificar quais funções carregáveis estão instaladas. Veja a Seção 29.12.22.10, “A Tabela `user_defined_functions`”.
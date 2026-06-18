### 7.7.2 Obter informações sobre funções carregáveis

A tabela Schema de Desempenho `user_defined_functions` contém informações sobre as funções carregáveis atualmente instaladas:

```
SELECT * FROM performance_schema.user_defined_functions;
```

A tabela do sistema `mysql.func` também lista as funções carregáveis instaladas, mas apenas aquelas instaladas usando `CREATE FUNCTION`. A tabela `user_defined_functions` lista as funções carregáveis instaladas usando `CREATE FUNCTION`, bem como as funções carregáveis instaladas automaticamente por componentes ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas. Veja a Seção 29.12.21.10, “A tabela user\_defined\_functions”.

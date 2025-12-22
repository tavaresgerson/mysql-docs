### 7.7.2 Obtenção de informações sobre funções carregáveis

A tabela do Esquema de Desempenho `user_defined_functions` contém informações sobre as funções carregáveis atualmente instaladas:

```
SELECT * FROM performance_schema.user_defined_functions;
```

A tabela de sistema `mysql.func` também lista as funções carregáveis instaladas, mas apenas aquelas instaladas usando `CREATE FUNCTION`. A tabela `user_defined_functions` lista as funções carregáveis instaladas usando `CREATE FUNCTION` bem como as funções carregáveis instaladas automaticamente por componentes ou plugins. Esta diferença faz com que `user_defined_functions` seja preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas.

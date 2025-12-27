#### 15.7.7.10 Declaração SHOW CREATE LIBRARY

```
SHOW CREATE LIBRARY [database_name.]library_name
```

Retorna o texto que pode ser usado para recriar a biblioteca JavaScript ou WebAssembly nomeada no banco de dados nomeado; o banco de dados tem como padrão o banco de dados atual, se um não for especificado. Consulte a Seção 15.1.19, “Declaração CREATE LIBRARY”, para obter mais informações.

Para uma conta diferente da conta que criou a biblioteca, o acesso às propriedades rotineiras depende dos privilégios concedidos à conta, conforme descrito aqui:

* Com o privilégio `SHOW_ROUTINE` ou o privilégio global `SELECT`, a conta pode ver todas as propriedades da biblioteca, incluindo sua definição. Isso significa que `SHOW CREATE LIBRARY` imprime o código-fonte da biblioteca, e todas as bibliotecas na tabela do Esquema de Informações `libraries` são visíveis para essa conta.

* Com o privilégio `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedido em um escopo que inclui a biblioteca, a conta pode ver todas as propriedades rotineiras, exceto sua definição. Isso significa que a linha associada em `INFORMATION_SCHEMA.LIBRARIES` é visível, mas `SHOW CREATE LIBRARY` não imprime o código-fonte da biblioteca.

O código da biblioteca pode conter instruções SQL (conhecidas como chamada de SQL JavaScript). As instruções são restritas, com base nos contextos de segurança `INVOKER` e `DEFINER` do programa armazenado que usa essa biblioteca. Tais instruções SQL seguem as restrições usuais aplicáveis a funções armazenadas e procedimentos armazenados (consulte a Seção 27.10, “Restrições em Programas Armazenados”).

```
mysql> SHOW CREATE LIBRARY jslib.lib1\G
*************************** 1. row ***************************
       Library: lib1
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib1`
    LANGUAGE JAVASCRIPT COMMENT "This is lib1"
AS $$
      export function f(n) {
        return n
      }
    $$
1 row in set (0.00 sec)

mysql> SHOW CREATE LIBRARY jslib.lib2\G
*************************** 1. row ***************************
       Library: lib2
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib2`
    LANGUAGE JAVASCRIPT COMMENT "This is lib2"
AS $$
      export function g(n) {
        return n * 2
      }
    $$
1 row in set (0.00 sec)

mysql> SHOW CREATE LIBRARY wasmlib.lib1\G
*************************** 1. row ***************************
       Library: lib1
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib1`
    LANGUAGE WASM
AS $$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$$
1 row in set (0.0002 sec)

mysql> SHOW CREATE LIBRARY wasmlib.lib2\G
*************************** 1. row ***************************
       Library: lib2
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib2`
    LANGUAGE WASM
AS 0x
1 row in set (0.000 sec)
```

Para obter mais informações e exemplos, consulte a Seção 27.3.8, “Usando Bibliotecas JavaScript”.
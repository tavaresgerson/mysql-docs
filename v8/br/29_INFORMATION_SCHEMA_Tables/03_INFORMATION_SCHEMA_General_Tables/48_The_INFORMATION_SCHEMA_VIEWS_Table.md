### 28.3.48 A tabela INFORMATION\_SCHEMA VIEWS

A tabela `VIEWS` fornece informações sobre visualizações em bancos de dados. Você deve ter o privilégio `SHOW VIEW` para acessar essa tabela.

A tabela `VIEWS` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a visualização pertence.

- `TABLE_NAME`

  O nome da vista.

- `VIEW_DEFINITION`

  A declaração `SELECT` que fornece a definição da vista. Essa coluna tem a maioria do que você vê na coluna `Create Table` que o `SHOW CREATE VIEW` produz. Ignorar as palavras antes de `SELECT` e ignorar as palavras `WITH CHECK OPTION`. Suponha que a declaração original fosse:

  ```
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

  Então, a definição de visualização parece assim:

  ```
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

- `CHECK_OPTION`

  O valor do atributo `CHECK_OPTION`. O valor é um dos `NONE`, `CASCADE` ou `LOCAL`.

- `IS_UPDATABLE`

  O MySQL define uma bandeira, chamada de bandeira de atualização de visualização, no momento `CREATE VIEW`. A bandeira é definida como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) forem legais para a visualização. Caso contrário, a bandeira é definida como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` exibe o status dessa bandeira. Isso significa que o servidor sempre sabe se uma visualização pode ser atualizada.

  Se uma vista não for atualizável, declarações como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma vista seja atualizável, pode não ser possível inseri-la nela; para detalhes, consulte a Seção 27.5.3, “Vistas Atualizáveis e Inseríveis”.)

- `DEFINER`

  A conta do usuário que criou a visualização, no formato `'user_name'@'host_name'`.

- `SECURITY_TYPE`

  A vista `SQL SECURITY` característica. O valor é um dos `DEFINER` ou `INVOKER`.

- `CHARACTER_SET_CLIENT`

  O valor da sessão da variável de sistema `character_set_client` quando a visualização foi criada.

- `COLLATION_CONNECTION`

  O valor da sessão da variável de sistema `collation_connection` quando a visualização foi criada.

#### Notas

O MySQL permite diferentes configurações de `sql_mode` para indicar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL `ANSI` para garantir que o MySQL interprete corretamente o operador de concatenação SQL padrão, a barra dupla (`||`), nas suas consultas. Se você criar então uma vista que concatena itens, você pode se preocupar que alterar a configuração `sql_mode` para um valor diferente de `ANSI` possa fazer com que a vista se torne inválida. Mas isso não é o caso. Independentemente de como você escreva a definição de uma vista, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função `CONCAT()`:

```
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT VIEW_DEFINITION FROM INFORMATION_SCHEMA.VIEWS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v';
+----------------------------------+
| VIEW_DEFINITION                  |
+----------------------------------+
| select concat('a','b') AS `col1` |
+----------------------------------+
1 row in set (0.00 sec)
```

A vantagem de armazenar uma definição de visualização em forma canônica é que alterações feitas posteriormente no valor de `sql_mode` não afetam os resultados da visualização. No entanto, uma consequência adicional é que os comentários anteriores a `SELECT` são removidos da definição pelo servidor.

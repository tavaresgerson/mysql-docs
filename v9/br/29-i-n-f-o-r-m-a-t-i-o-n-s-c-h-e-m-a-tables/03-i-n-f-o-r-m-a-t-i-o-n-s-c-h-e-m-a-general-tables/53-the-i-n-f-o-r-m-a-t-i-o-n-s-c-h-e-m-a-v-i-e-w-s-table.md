### 28.3.53 A Tabela `VIEWS` do esquema `INFORMATION_SCHEMA`

A tabela `VIEWS` fornece informações sobre os pontos de vista em bancos de dados. Você deve ter o privilégio `SHOW VIEW` para acessar essa tabela.

A tabela `VIEWS` tem as seguintes colunas:

* `TABLE_CATALOG`

  O nome do catálogo ao qual o ponto de vista pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual o ponto de vista pertence.

* `TABLE_NAME`

  O nome do ponto de vista.

* `VIEW_DEFINITION`

  A instrução `SELECT` que fornece a definição do ponto de vista. Essa coluna contém a maioria do que você vê na coluna `Create Table` que o comando `SHOW CREATE VIEW` produz. Ignorar as palavras antes de `SELECT` e ignorar as palavras `WITH CHECK OPTION`. Suponha que a instrução original fosse:

  ```
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

  Então, a definição do ponto de vista parece assim:

  ```
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

* `CHECK_OPTION`

  O valor do atributo `CHECK_OPTION`. O valor é um dos valores `NONE`, `CASCADE` ou `LOCAL`.

* `IS_UPDATABLE`

  MySQL define um sinalizador, chamado sinalizador de atualizabilidade do ponto de vista, no momento da criação do ponto de vista. O sinalizador é definido como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) forem legais para o ponto de vista. Caso contrário, o sinalizador é definido como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` exibe o status desse sinalizador. Isso significa que o servidor sempre sabe se um ponto de vista é atualizável.

  Se um ponto de vista não for atualizável, instruções como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que um ponto de vista seja atualizável, pode não ser possível inseri-lo nele; para detalhes, consulte a Seção 27.6.3, “Pontos de Vista Atualizáveis e Inseríveis”.)

* `DEFINER`

  A conta do usuário que criou o ponto de vista, no formato `'user_name'@'host_name'`.

* `SECURITY_TYPE`

  A característica de segurança do ponto de vista `SQL SECURITY`. O valor é um dos valores `DEFINER` ou `INVOKER`.

* `CHARACTER_SET_CLIENT`

  O valor da sessão da variável de sistema `character_set_client` quando a visualização foi criada.

* `COLLATION_CONNECTION`

  O valor da sessão da variável de sistema `collation_connection` quando a visualização foi criada.

#### Notas

O MySQL permite diferentes configurações do modo `sql_mode` para indicar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL ANSI para garantir que o MySQL interprete corretamente o operador de concatenação SQL padrão, a barra dupla (`||`), nas suas consultas. Se você criar uma visualização que concatene itens, pode se preocupar que alterar a configuração do `sql_mode` para um valor diferente de `ANSI` possa fazer com que a visualização se torne inválida. Mas isso não é o caso. Independentemente de como você escreve a definição de uma visualização, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação com barra dupla para uma função `CONCAT()`:

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

A vantagem de armazenar a definição de uma visualização em forma canônica é que alterações feitas posteriormente no valor de `sql_mode` não afetam os resultados da visualização. No entanto, uma consequência adicional é que os comentários anteriores ao `SELECT` são removidos da definição pelo servidor.
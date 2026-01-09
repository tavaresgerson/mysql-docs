### 24.3.31 A tabela INFORMATION_SCHEMA VIEWS

A tabela `VIEWS` fornece informações sobre as visualizações nos bancos de dados. Você deve ter o privilégio `SHOW VIEW` para acessar essa tabela.

A tabela `VIEWS` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a visualização pertence.

- `NOME_TABELA`

  O nome da vista.

- `DEFINIÇÃO_DE_VISUALIZAÇÃO`

  A instrução `SELECT` que fornece a definição da visualização. Esta coluna contém a maioria do que você vê na coluna `Criar Tabela` que a instrução `SHOW CREATE VIEW` produz. Ignorar as palavras antes de `SELECT` e ignorar as palavras `COM OPÇÃO DE VERIFICAÇÃO`. Suponha que a declaração original fosse:

  ```sql
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

  Então, a definição de visualização parece assim:

  ```sql
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

- `CHECK_OPTION`

  O valor do atributo `CHECK_OPTION`. O valor é `NONE`, `CASCADE` ou `LOCAL`.

- `IS_UPDATABLE`

  O MySQL define uma bandeira, chamada de bandeira de atualizabilidade da visualização, no momento da criação da visualização (`CREATE VIEW`). A bandeira é definida como `YES` (verdadeiro) se as operações de atualização (`UPDATE`) e exclusão (`DELETE`) (e operações semelhantes) forem legais para a visualização. Caso contrário, a bandeira é definida como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` (information-schema-views-table.html) exibe o status dessa bandeira.

  Se uma visualização não for atualizável, declarações como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma visualização seja atualizável, pode não ser possível inseri-la nela; para detalhes, consulte Seção 23.5.3, “Visualizações Atualizáveis e Inseríveis”.)

  A bandeira `IS_UPDATABLE` pode não ser confiável se uma visualização depender de uma ou mais outras visualizações e uma dessas visualizações subjacentes for atualizada. Independentemente do valor `IS_UPDATABLE`, o servidor mantém o controle da atualizabilidade de uma visualização e rejeita corretamente as operações de alteração de dados para visualizações que não são atualizáveis. Se o valor `IS_UPDATABLE` para uma visualização se tornar impreciso devido a alterações em visualizações subjacentes, o valor pode ser atualizado excluindo e recriando a visualização.

- `DEFINIR`

  A conta do usuário que criou a visualização, no formato `'user_name'@'host_name'`.

- `TIPO_DE_SEGURANÇA`

  A característica de visualização `SQL SECURITY`. O valor é `DEFINER` ou `INVOKER`.

- `CHARACTER_SET_CLIENT`

  O valor da sessão da variável de sistema `character_set_client` quando a visualização foi criada.

- `COLLATION_CONNECTION`

  O valor da sessão da variável de sistema `collation_connection` quando a visualização foi criada.

#### Notas

O MySQL permite diferentes configurações de `sql_mode` para indicar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL `ANSI` para garantir que o MySQL interprete corretamente o operador de concatenação SQL padrão, a barra dupla (`||`), em suas consultas. Se você criar uma visualização que concatena itens, você pode se preocupar que alterar a configuração de `sql_mode` para um valor diferente de `ANSI` possa fazer com que a visualização se torne inválida. Mas isso não é o caso. Independentemente de como você escreve a definição de uma visualização, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função `CONCAT()`:

```sql
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

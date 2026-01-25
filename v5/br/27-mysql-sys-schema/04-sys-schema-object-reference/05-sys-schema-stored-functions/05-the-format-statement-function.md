#### 26.4.5.5 A Função format_statement()

Dada uma `string` (normalmente representando um `SQL statement`), a função a reduz ao comprimento definido pela `configuration option` `statement_truncate_len` e retorna o resultado. Nenhuma truncagem ocorre se a `string` for mais curta que `statement_truncate_len`. Caso contrário, a parte central da `string` é substituída por uma elipse (`...`).

Esta função é útil para formatar `statements` possivelmente longos, recuperados de tabelas do Performance Schema, para um comprimento máximo fixo conhecido.

##### Parâmetros

* `statement LONGTEXT`: O `statement` a ser formatado.

##### Opções de Configuração

A operação da Função `format_statement()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, “A Tabela sys_config”):

* `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo dos `statements` retornados pela função `format_statement()`. `Statements` mais longos são truncados para este comprimento. O padrão é 64.

##### Valor de Retorno

Um valor `LONGTEXT`.

##### Exemplo

Por padrão, `format_statement()` trunca `statements` para não terem mais que 64 caracteres. Definir `@sys.statement_truncate_len` altera o comprimento de truncagem para a `session` atual:

```sql
mysql> SET @stmt = 'SELECT variable, value, set_time, set_by FROM sys_config';
mysql> SELECT sys.format_statement(@stmt);
+----------------------------------------------------------+
| sys.format_statement(@stmt)                              |
+----------------------------------------------------------+
| SELECT variable, value, set_time, set_by FROM sys_config |
+----------------------------------------------------------+
mysql> SET @sys.statement_truncate_len = 32;
mysql> SELECT sys.format_statement(@stmt);
+-----------------------------------+
| sys.format_statement(@stmt)       |
+-----------------------------------+
| SELECT variabl ... ROM sys_config |
+-----------------------------------+
```

#### 30.4.5.5 A função format\_statement()

Dado uma string (normalmente representando uma instrução SQL), reduz-a ao comprimento especificado pela opção de configuração `statement_truncate_len` e retorna o resultado. Não ocorre truncação se a string for mais curta que `statement_truncate_len`. Caso contrário, a parte central da string é substituída por um ponto de elipse (`...`).

Essa função é útil para formatar declarações possivelmente longas recuperadas das tabelas do Gerenciamento de Desempenho para um comprimento máximo fixo conhecido.

##### Parâmetros

- `statement LONGTEXT`: A declaração para formatar.

##### Opções de configuração

A operação `format_statement()` Function") pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 30.4.2.1, "A Tabela sys\_config"):

- `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo das declarações retornadas pela função `format_statement()`") é este comprimento. Declarações mais longas são truncadas para este comprimento. O padrão é 64.

##### Valor de retorno

Um valor `LONGTEXT`.

##### Exemplo

Por padrão, a função `format_statement()` ("Função de truncação") corta as declarações para não ultrapassar 64 caracteres. A configuração de `@sys.statement_truncate_len` altera o comprimento de truncação para a sessão atual:

```
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

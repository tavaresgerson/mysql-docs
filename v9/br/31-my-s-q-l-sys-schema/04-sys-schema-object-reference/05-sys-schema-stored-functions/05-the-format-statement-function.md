#### 30.4.5.5 A função format_statement()

Dado uma string (normalmente representando uma instrução SQL), reduz-a ao comprimento especificado pela opção de configuração `statement_truncate_len` e retorna o resultado. Não ocorre nenhuma redução se a string for mais curta que `statement_truncate_len`. Caso contrário, a parte central da string é substituída por um ponto e vírgula (`...`).

Esta função é útil para formatar instruções possivelmente longas recuperadas de tabelas do Schema de Desempenho para um comprimento fixo conhecido.

##### Parâmetros

* `statement LONGTEXT`: A instrução a ser formatada.

##### Opções de configuração

A operação `format_statement()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 30.4.2.1, “A tabela sys_config”):

* `statement_truncate_len`, `@sys.statement_truncate_len`

  O comprimento máximo das instruções retornadas pela função `format_statement()`). Instruções mais longas são reduzidas a este comprimento. O valor padrão é 64.

##### Valor de retorno

Um valor `LONGTEXT`.

##### Exemplo

Por padrão, a função `format_statement()` reduz as instruções a não mais de 64 caracteres. Definir `@sys.statement_truncate_len` altera o comprimento de redução para a sessão atual:

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
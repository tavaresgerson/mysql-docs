#### 26.4.5.19 A Função sys_get_config()

Dado o nome de uma opção de configuração, retorna o valor da opção da tabela `sys_config`, ou o valor padrão fornecido (que pode ser `NULL`) se a opção não existir na tabela.

Se a função `sys_get_config()` retornar o valor padrão e esse valor for `NULL`, espera-se que o chamador seja capaz de lidar com `NULL` para a opção de configuração fornecida.

Por convenção, as rotinas que chamam a função `sys_get_config()` primeiro verificam se a variável definida pelo usuário correspondente existe e não é `NULL`. Se sim, a rotina usa o valor da variável sem ler a tabela `sys_config`. Se a variável não existir ou for `NULL`, a rotina lê o valor da opção da tabela e define a variável definida pelo usuário com esse valor. Para obter mais informações sobre a relação entre as opções de configuração e suas variáveis definidas pelo usuário correspondentes, consulte a Seção 26.4.2.1, “A Tabela sys_config”.

Se você deseja verificar se a opção de configuração já foi definida e, caso contrário, usar o valor de retorno de `sys_get_config()`, você pode usar `IFNULL(...)` (veja o exemplo adiante). No entanto, isso não deve ser feito dentro de um *loop* (por exemplo, para cada linha em um *result set*) porque, para chamadas repetidas onde a atribuição é necessária apenas na primeira iteração, espera-se que o uso de `IFNULL(...)` seja significativamente mais lento do que usar um bloco `IF (...) THEN ... END IF;` (veja o exemplo adiante).

##### Parâmetros

* `in_variable_name VARCHAR(128)`: O nome da opção de configuração para a qual retornar o valor.

* `in_default_value VARCHAR(128)`: O valor padrão a ser retornado se a opção de configuração não for encontrada na tabela `sys_config`.

##### Valor de Retorno

Um valor `VARCHAR(128)`.

##### Exemplo

Obtenha um valor de configuração da tabela `sys_config`, usando 128 como padrão se a opção não estiver presente na tabela:

```sql
mysql> SELECT sys.sys_get_config('statement_truncate_len', 128) AS Value;
+-------+
| Value |
+-------+
| 64    |
+-------+
```

Exemplo em linha única (*One-liner*): Verifique se a opção já está definida; caso contrário, atribua o resultado `IFNULL(...)` (usando o valor da tabela `sys_config`):

```sql
mysql> SET @sys.statement_truncate_len =
       IFNULL(@sys.statement_truncate_len,
              sys.sys_get_config('statement_truncate_len', 64));
```

Exemplo de bloco `IF (...) THEN ... END IF;`: Verifique se a opção já está definida; caso contrário, atribua o valor da tabela `sys_config`:

```sql
IF (@sys.statement_truncate_len IS NULL) THEN
  SET @sys.statement_truncate_len = sys.sys_get_config('statement_truncate_len', 64);
END IF;
```
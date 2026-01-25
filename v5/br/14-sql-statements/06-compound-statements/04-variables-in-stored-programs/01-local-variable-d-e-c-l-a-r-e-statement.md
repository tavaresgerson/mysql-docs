#### 13.6.4.1 Instrução DECLARE de Variável Local

```sql
DECLARE var_name [, var_name] ... type [DEFAULT value]
```

Esta instrução declara variáveis locais dentro de stored programs. Para fornecer um valor DEFAULT para uma variável, inclua uma cláusula `DEFAULT`. O valor pode ser especificado como uma expression; ele não precisa ser uma constante. Se a cláusula `DEFAULT` estiver faltando, o valor inicial é `NULL`.

Variáveis locais são tratadas como parâmetros de stored routine no que diz respeito ao tipo de dado e à verificação de overflow. Consulte [Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").

Declarações de variável devem aparecer antes das declarações de cursor ou handler.

Nomes de variáveis locais não diferenciam maiúsculas de minúsculas (não são case-sensitive). Caracteres permitidos e regras de citação são as mesmas que para outros identifiers, conforme descrito em [Seção 9.2, “Nomes de Objetos de Schema”](identifiers.html "9.2 Schema Object Names").

O scope de uma variável local é o bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") dentro do qual ela é declarada. A variável pode ser referenciada em blocos aninhados dentro do bloco declarante, exceto aqueles blocos que declarem uma variável com o mesmo nome.

Para exemplos de declarações de variável, consulte [Seção 13.6.4.2, “Scope e Resolução de Variável Local”](local-variable-scope.html "13.6.4.2 Local Variable Scope and Resolution").
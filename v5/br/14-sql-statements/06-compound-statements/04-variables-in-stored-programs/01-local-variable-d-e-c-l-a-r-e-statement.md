#### 13.6.4.1 Declaração de variável local DECLARE

```sql
DECLARE var_name [, var_name] ... type [DEFAULT value]
```

Esta declaração declara variáveis locais dentro de programas armazenados. Para fornecer um valor padrão para uma variável, inclua uma cláusula `DEFAULT`. O valor pode ser especificado como uma expressão; ele não precisa ser uma constante. Se a cláusula `DEFAULT` estiver ausente, o valor inicial é `NULL`.

As variáveis locais são tratadas como parâmetros de rotina armazenados, no que diz respeito ao tipo de dados e à verificação de estouro. Consulte Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.

As declarações de variáveis devem aparecer antes das declarações de cursor ou manipulador.

Os nomes de variáveis locais não são sensíveis ao maiúsculas e minúsculas. Os caracteres permitidos e as regras de citação são os mesmos que para outros identificadores, conforme descrito na Seção 9.2, “Nomes de Objetos de Esquema”.

O escopo de uma variável local é o bloco `BEGIN ... END` dentro do qual ela é declarada. A variável pode ser referenciada em blocos aninhados dentro do bloco declarador, exceto aqueles blocos que declaram uma variável com o mesmo nome.

Para exemplos de declarações de variáveis, consulte Seção 13.6.4.2, "Âmbito e Resolução de Variáveis Locais".

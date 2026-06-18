### 13.5.2 Instrução EXECUTE

```sql
EXECUTE stmt_name
    [USING @var_name [, @var_name] ...]
```

Após preparar uma instrução com `PREPARE`, você a executa usando uma instrução `EXECUTE` que se refere ao nome da instrução preparada. Se a instrução preparada contiver quaisquer *parameter markers*, você deve fornecer uma `USING clause` que lista *user variables* contendo os valores a serem vinculados aos parâmetros. Os valores dos parâmetros podem ser fornecidos apenas por *user variables*, e a `USING clause` deve nomear exatamente o mesmo número de variáveis que o número de *parameter markers* na instrução.

Você pode executar uma determinada instrução preparada múltiplas vezes, passando diferentes variáveis para ela ou definindo as variáveis para diferentes valores antes de cada execução.

Para exemplos, consulte Seção 13.5, “Prepared Statements”.
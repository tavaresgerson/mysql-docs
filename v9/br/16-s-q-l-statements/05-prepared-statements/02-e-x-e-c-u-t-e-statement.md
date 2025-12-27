### 15.5.2 Declaração `EXECUTE`

```
EXECUTE stmt_name
    [USING @var_name [, @var_name] ...]
```

Após preparar uma declaração com `PREPARE`, você a executa com uma declaração `EXECUTE` que faz referência ao nome da declaração preparada. Se a declaração preparada contiver marcadores de parâmetros, você deve fornecer uma cláusula `USING` que lista variáveis do usuário que contêm os valores a serem vinculados aos parâmetros. Os valores dos parâmetros podem ser fornecidos apenas por variáveis do usuário, e a cláusula `USING` deve nomear exatamente tantas variáveis quanto o número de marcadores de parâmetros na declaração.

Você pode executar uma declaração preparada dada várias vezes, passando diferentes variáveis para ela ou definindo as variáveis para diferentes valores antes de cada execução.

Para exemplos, consulte a Seção 15.5, “Declarações Preparadas”.
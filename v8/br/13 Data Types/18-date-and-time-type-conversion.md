### 13.2.8 Conversão entre tipos de data e hora

Até certo ponto, você pode converter um valor de um tipo temporal para outro. No entanto, pode haver alguma alteração no valor ou perda de informações. Em todos os casos, a conversão entre tipos temporais está sujeita à faixa de valores válidos para o tipo resultante. Por exemplo, embora os valores `DATE`, `DATETIME` e `TIMESTAMP` possam ser especificados usando o mesmo conjunto de formatos, os tipos não têm todos a mesma faixa de valores. Os valores `TIMESTAMP` não podem ser anteriores a `1970` UTC ou posteriores a `'2038-01-19 03:14:07'` UTC. Isso significa que uma data como `'1968-01-01'`, embora válida como um valor `DATE` ou `DATETIME`, não é válida como um valor `TIMESTAMP` e é convertida para `0`.

Conversão de valores `DATE`:

* A conversão para um valor `DATETIME` ou `TIMESTAMP` adiciona uma parte de `'00:00:00'` porque o valor `DATE` não contém informações de hora.
* A conversão para um valor `TIME` não é útil; o resultado é `'00:00:00'`.

Conversão de valores `DATETIME` e `TIMESTAMP`:

* A conversão para um valor `DATE` leva em conta frações de segundos e arredonda a parte de hora. Por exemplo, `'1999-12-31 23:59:59.499'` se torna `'1999-12-31'`, enquanto `'1999-12-31 23:59:59.500'` se torna `'2000-01-01'`.
* A conversão para um valor `TIME` descarta a parte de data porque o tipo `TIME` não contém informações de data.

Para a conversão de valores `TIME` para outros tipos temporais, o valor de `CURRENT_DATE()` é usado para a parte de data. O `TIME` é interpretado como tempo decorrido (não hora do dia) e adicionado à data. Isso significa que a parte de data do resultado difere da data atual se o valor de tempo estiver fora da faixa de `'00:00:00'` a `'23:59:59'`.

Suponha que a data atual seja `'2012-01-01'`. Os valores `TIME` de `'12:00:00'`, `'24:00:00'` e `'-12:00:00'`, quando convertidos para valores `DATETIME` ou `TIMESTAMP`, resultam em `'2012-01-01 12:00:00'`, `'2012-01-02 00:00:00'` e `'2011-12-31 12:00:00'`, respectivamente.

A conversão de `TIME` para `DATE` é semelhante, mas descarta a parte do horário do resultado: `'2012-01-01'`, `'2012-01-02'` e `'2011-12-31`, respectivamente.

A conversão explícita pode ser usada para substituir a conversão implícita. Por exemplo, na comparação de valores `DATE` e `DATETIME`, o valor `DATE` é coercido para o tipo `DATETIME` adicionando uma parte de hora de `'00:00:00'`. Para realizar a comparação ignorando a parte de hora do valor `DATETIME`, use a função `CAST()` da seguinte maneira:

```
date_col = CAST(datetime_col AS DATE)
```

A conversão de valores `TIME` e `DATETIME` para forma numérica (por exemplo, adicionando `+0`) depende se o valor contém uma parte de segundos fracionários. `TIME(N)` ou `DATETIME(N)` é convertido para inteiro quando *`N`* é 0 (ou omitido) e para um valor `DECIMAL` com *`N`* dígitos decimais quando *`N`* é maior que 0:

```ayfGRW08fA
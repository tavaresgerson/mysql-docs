### 11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC

Os tipos `DECIMAL` e `NUMERIC` armazenam valores de dados numéricos exatos. Esses tipos são usados quando é importante preservar a precisão exata, como, por exemplo, em dados monetários. No MySQL, `NUMERIC` é implementado como `DECIMAL`, portanto, as seguintes observações sobre `DECIMAL` se aplicam igualmente a `NUMERIC`.

O MySQL armazena valores `DECIMAL` em formato binário. Consulte a Seção 12.21, “Precision Math”.

Em uma declaração de coluna `DECIMAL`, a precision e a scale podem ser (e geralmente são) especificadas. Por exemplo:

```sql
salary DECIMAL(5,2)
```

Neste exemplo, `5` é a precision e `2` é a scale. A precision representa o número de dígitos significativos que são armazenados para os valores, e a scale representa o número de dígitos que podem ser armazenados após o ponto decimal.

O SQL padrão exige que `DECIMAL(5,2)` seja capaz de armazenar qualquer valor com cinco dígitos e duas casas decimais, de modo que os valores que podem ser armazenados na coluna `salary` variam de `-999.99` a `999.99`.

No SQL padrão, a sintaxe `DECIMAL(M)` é equivalente a `DECIMAL(M,0)`. Da mesma forma, a sintaxe `DECIMAL` é equivalente a `DECIMAL(M,0)`, onde a implementação tem permissão para decidir o valor de *`M`*. O MySQL suporta ambas as formas variantes da sintaxe `DECIMAL`. O valor padrão de *`M`* é 10.

Se a scale for 0, os valores `DECIMAL` não contêm ponto decimal ou parte fracionária.

O número máximo de dígitos para `DECIMAL` é 65, mas o range real para uma determinada coluna `DECIMAL` pode ser restringido pela precision ou scale para aquela coluna. Quando a uma coluna é atribuído um valor com mais dígitos após o ponto decimal do que o permitido pela scale especificada, o valor é convertido para essa scale. (O comportamento exato é específico do sistema operacional, mas geralmente o efeito é o truncation para o número de dígitos permitido.)
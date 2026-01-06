### 11.1.3 Tipos de Ponto Fixo (Valor Exato) - DECIMAL, NUMERIC

Os tipos `DECIMAL` e `NUMERIC` armazenam valores exatos de dados numéricos. Estes tipos são usados quando é importante preservar a precisão exata, por exemplo, com dados monetários. No MySQL, `NUMERIC` é implementado como `DECIMAL`, então as seguintes observações sobre `DECIMAL` se aplicam igualmente a `NUMERIC`.

O MySQL armazena valores `DECIMAL` no formato binário. Veja a Seção 12.21, “Matemática de Precisão”.

Em uma declaração de coluna `DECIMAL`, a precisão e a escala podem ser especificadas (e geralmente são). Por exemplo:

```sql
salary DECIMAL(5,2)
```

Neste exemplo, `5` é a precisão e `2` é a escala. A precisão representa o número de dígitos significativos armazenados para os valores, e a escala representa o número de dígitos que podem ser armazenados após o ponto decimal.

O SQL padrão exige que o `DECIMAL(5,2)` possa armazenar qualquer valor com cinco dígitos e dois decimais, portanto, os valores que podem ser armazenados na coluna `salary` variam de `-999.99` a `999.99`.

No SQL padrão, a sintaxe `DECIMAL(M)` é equivalente a `DECIMAL(M,0)`. Da mesma forma, a sintaxe `DECIMAL` é equivalente a `DECIMAL(M,0)`, onde a implementação pode decidir o valor de *`M`*. O MySQL suporta ambas as formas variantes da sintaxe `DECIMAL`. O valor padrão de *`M`* é 10.

Se a escala for 0, os valores `DECIMAL` não contêm ponto decimal ou parte fracionária.

O número máximo de dígitos para `DECIMAL` é 65, mas a faixa real para uma coluna `DECIMAL` específica pode ser limitada pela precisão ou escala para uma coluna específica. Quando uma coluna recebe um valor com mais dígitos após o ponto decimal do que o permitido pela escala especificada, o valor é convertido para essa escala. (O comportamento preciso é específico do sistema operacional, mas, geralmente, o efeito é a troncamento para o número de dígitos permitido.)

#### 16.4.1.13 Suporte à replicação e segundos fracionários

O MySQL 5.7 permite frações de segundo para os valores de `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microsegundos (6 dígitos). Veja Seção 11.2.7, “Frações de Segundo em Valores de Hora”.

Pode haver problemas de replicação de um servidor fonte que entende segundos fracionários para uma replica mais antiga (MySQL 5.6.3 e versões anteriores) que não o faz:

- Para as instruções `CREATE TABLE` que contêm colunas com um valor de *`fsp`* (precisão de frações de segundo) maior que 0, a replicação falha devido a erros do analisador.

- As declarações que utilizam tipos de dados temporais com um valor de `fsp` de 0 funcionam com o registro baseado em declarações, mas não com o registro baseado em linhas. No último caso, os tipos de dados têm formatos binários e códigos de tipo na fonte que diferem daqueles na replica.

- Alguns resultados de expressões diferem entre a fonte e a réplica. Exemplos: Na fonte, a variável de sistema `timestamp` retorna um valor que inclui uma parte fracionária em microsegundos; na réplica, ela retorna um inteiro. Na fonte, funções que retornam um resultado que inclui a hora atual (como `CURTIME()`, `SYSDATE()` ou `UTC_TIMESTAMP()`) interpretam um argumento como um valor de *`fsp`* e o valor de retorno inclui uma parte de segundos fracionários dessa quantidade de dígitos. Na réplica, essas funções permitem um argumento, mas ignoram-no.

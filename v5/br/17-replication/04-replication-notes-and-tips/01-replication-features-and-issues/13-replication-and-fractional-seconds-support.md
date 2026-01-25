#### 16.4.1.13 Suporte à Replicação e Segundos Fracionários

O MySQL 5.7 permite segundos fracionários para valores de [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), com precisão de até microssegundos (6 dígitos). Consulte [Seção 11.2.7, “Segundos Fracionários em Valores de Tempo”](fractional-seconds.html "11.2.7 Fractional Seconds in Time Values").

Pode haver problemas ao replicar de um servidor Source que entende segundos fracionários para uma Replica mais antiga (MySQL 5.6.3 e anterior) que não os suporta:

* Para [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements que contêm colunas com um valor *`fsp`* (precisão de segundos fracionários) maior que 0, a Replication falha devido a erros do Parser.

* Statements que usam tipos de dados temporais com um valor *`fsp`* igual a 0 funcionam com Statement-based logging, mas não com Row-based logging. Neste último caso, os tipos de dados têm formatos binários e códigos de tipo no Source que diferem daqueles na Replica.

* Alguns resultados de expressão diferem no Source e na Replica. Exemplos: No Source, a variável de sistema `timestamp` retorna um valor que inclui uma parte fracionária em microssegundos; na Replica, ela retorna um inteiro. No Source, funções que retornam um resultado que inclui o tempo atual (como [`CURTIME()`](date-and-time-functions.html#function_curtime), [`SYSDATE()`](date-and-time-functions.html#function_sysdate), ou [`UTC_TIMESTAMP()`](date-and-time-functions.html#function_utc-timestamp)) interpretam um argumento como um valor *`fsp`* e o valor de retorno inclui uma parte de segundos fracionários com esse número de dígitos. Na Replica, essas funções permitem um argumento, mas o ignoram.
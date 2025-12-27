#### 27.3.6.12 Funções do MySQL

As seguintes funções integradas do SQL podem ser chamadas diretamente do namespace `mysql`. Elas são descritas na lista a seguir, juntamente com suas funções SQL análogas:

* `rand()` (MySQL `RAND()`): Retorna um valor aleatório de ponto flutuante *`v`* no intervalo 0 <= *`v`* < 1,0.

* `sleep(seconds)` (MySQL `SLEEP()`): Pausa por *`seconds`* segundos, depois retorna 0.

* `uuid()` (MySQL `UUID()`): Retorna um identificador único universal (UUID).

* `isUUID(argument)` (MySQL `IS_UUID()`): Retorna 1 se o *`argument`* for um UUID válido no formato de string, 0 se não for um UUID válido e `NULL` se o argumento for `NULL`.
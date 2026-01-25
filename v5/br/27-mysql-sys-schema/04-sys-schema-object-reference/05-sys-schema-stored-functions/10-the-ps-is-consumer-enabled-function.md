#### 26.4.5.10 A Função ps_is_consumer_enabled()

Retorna `YES` ou `NO` para indicar se um determinado *Consumer* do *Performance Schema* está habilitado, ou `NULL` se o argumento for `NULL`. Se o argumento não for um nome de *Consumer* válido, ocorre um *error*. (Antes do MySQL 5.7.28, a *function* retorna `NULL` se o argumento não for um nome de *Consumer* válido.)

Esta *function* leva em consideração a hierarquia de *Consumers*, de modo que um *Consumer* não é considerado habilitado a menos que todos os *Consumers* dos quais ele depende também estejam habilitados. Para obter informações sobre a hierarquia de *Consumers*, consulte a Seção 25.4.7, “Pre-Filtering by Consumer”.

##### Parâmetros

* `in_consumer VARCHAR(64)`: O nome do *Consumer* a ser verificado.

##### Valor de Retorno

Um valor `ENUM('YES','NO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_consumer_enabled('thread_instrumentation');
+------------------------------------------------------+
| sys.ps_is_consumer_enabled('thread_instrumentation') |
+------------------------------------------------------+
| YES                                                  |
+------------------------------------------------------+
```
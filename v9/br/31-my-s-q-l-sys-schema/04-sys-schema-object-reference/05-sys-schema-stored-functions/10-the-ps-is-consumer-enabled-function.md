#### 30.4.5.10 A função ps_is_consumer_enabled()

Retorna `YES` ou `NO` para indicar se um consumidor do Schema de Desempenho é habilitado, ou `NULL` se o argumento for `NULL`. Se o argumento não for um nome de consumidor válido, ocorrerá um erro.

Esta função leva em consideração a hierarquia do consumidor, portanto, um consumidor não é considerado habilitado a menos que todos os consumidores nos quais ele depende também estejam habilitados. Para obter informações sobre a hierarquia do consumidor, consulte a Seção 29.4.7, “Pre-Filtragem por Consumidor”.

##### Parâmetros

* `in_consumer VARCHAR(64)`: O nome do consumidor a ser verificado.

##### Valor de retorno

Um valor `ENUM('YES','NO')`.

##### Exemplo

```
mysql> SELECT sys.ps_is_consumer_enabled('thread_instrumentation');
+------------------------------------------------------+
| sys.ps_is_consumer_enabled('thread_instrumentation') |
+------------------------------------------------------+
| YES                                                  |
+------------------------------------------------------+
```
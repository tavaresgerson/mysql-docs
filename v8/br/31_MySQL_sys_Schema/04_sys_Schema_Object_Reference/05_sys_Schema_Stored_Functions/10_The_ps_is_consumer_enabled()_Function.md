#### 30.4.5.10 A função ps\_is\_consumer\_enabled()

Retorna `YES` ou `NO` para indicar se um consumidor do Schema de Desempenho está habilitado, ou `NULL` se o argumento for `NULL`. Se o argumento não for um nome de consumidor válido, ocorrerá um erro. (Antes do MySQL 8.0.18, a função retorna `NULL` se o argumento não for um nome de consumidor válido.)

Essa função leva em consideração a hierarquia do consumidor, portanto, um consumidor não é considerado habilitado a menos que todos os consumidores dos quais ele depende também estejam habilitados. Para obter informações sobre a hierarquia do consumidor, consulte a Seção 29.4.7, “Pré-filtragem por Consumidor”.

##### Parâmetros

- `in_consumer VARCHAR(64)`: O nome do consumidor a ser verificado.

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

### 8.15.3 Instruções Rastreáveis

As instruções que podem ser rastreadas estão listadas aqui:

* `SELECT`
* `INSERT`
* `REPLACE`
* `UPDATE`
* `DELETE`
* `EXPLAIN` com qualquer uma das instruções precedentes

* `SET`
* `DO`
* `DECLARE`, `CASE`, `IF` e `RETURN` conforme usadas em rotinas armazenadas

* `CALL`

O rastreamento (Tracing) é suportado para as instruções `INSERT` e `REPLACE` que utilizam `VALUES`, `VALUES ROW` ou `SELECT`.

Rastros (Traces) de instruções `UPDATE` e `DELETE` de múltiplas tabelas são suportados.

O rastreamento de `SET optimizer_trace` não é suportado.

Para instruções que são preparadas e executadas em etapas separadas, a preparação e a execução são rastreadas separadamente.
### 8.15.3 Declarações rastreáveis

As declarações que são rastreáveis estão listadas aqui:

* `SELECT`
* `INSERT`
* `REPLACE`
* `UPDATE`
* `DELETE`
* `EXPLAIN` com qualquer uma das declarações anteriores
* `SET`
* `DO`
* `DECLARE`, `CASE`, `IF` e `RETURN` como usados em rotinas armazenadas
- `CALL`

O rastreamento é suportado tanto para as instruções `INSERT` quanto `REPLACE` usando `VALUES`, `VALUES ROW` ou `SELECT`.

São suportadas traças de instruções `UPDATE` e `DELETE` de várias tabelas.

O rastreamento do `SET optimizer_trace` não é suportado.

Para declarações que são preparadas e executadas em etapas separadas, a preparação e execução são rastreadas separadamente.

#### 27.7.2.4 Limitações nas operações de Múltiplas Linhas de Dados (DML)

As seguintes limitações ou restrições se aplicam a todas as operações de modificação de dados (`INSERT`, `UPDATE` e `DELETE` instruções) em visualizações de dualidade JSON:

* Não é suportada a execução de múltiplas operações `INSERT`, `UPDATE` e `DELETE` em um documento JSON.

* A projeção de coluna de autoincremento é suportada, mas o preenchimento de valores gerados não é suportado.

* A instrução `EXPLAIN` não é suportada.

* A instrução `REPLACE` não é suportada.

* `LOAD DATA` e `LOAD XML` não são suportadas.

* `INSERT ... FROM SELECT` não é suportada.
* Instruções `UPDATE` e `DELETE` em múltiplas tabelas não são permitidas.

* `INSERT ... ON DUPLICATE KEY UPDATE` não é permitida.

* As cláusulas `LOW_PRIORITY` e `IGNORE` não são suportadas.

* Operações de modificação de dados em uma visualização SQL definida sobre uma visualização de dualidade JSON não são suportadas.

* Não é suportada a atualização de múltiplos objetos. As atualizações requerem uma cláusula `WHERE` que identifique uma única linha.
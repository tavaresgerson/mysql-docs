#### B.3.4.6 Excluindo Linhas de Tabelas Relacionadas

Se o comprimento total da declaração `DELETE` para `related_table` for maior que o valor padrão da variável de sistema `max_allowed_packet`, você deve dividi-la em partes menores e executar múltiplas declarações `DELETE`. Você provavelmente obterá o `DELETE` mais rápido especificando apenas 100 a 1.000 `related_column` valores por declaração, se o `related_column` estiver indexado. Se o `related_column` não estiver indexado, a velocidade é independente do número de argumentos na cláusula `IN`.

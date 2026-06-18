#### B.3.2.12 Comandos fora de sincronia

Se você receber `Commands out of sync; you can't run this command now` no seu código do cliente, você está chamando funções do cliente na ordem errada.

Isso pode acontecer, por exemplo, se você estiver usando `mysql_use_result()` e tentar executar uma nova consulta antes de ter chamado `mysql_free_result()`. Isso também pode acontecer se você tentar executar duas consultas que retornam dados sem chamar `mysql_use_result()` ou `mysql_store_result()` entre elas.

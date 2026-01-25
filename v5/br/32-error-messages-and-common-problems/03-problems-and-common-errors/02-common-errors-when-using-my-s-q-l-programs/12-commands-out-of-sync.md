#### B.3.2.12 Commands out of sync

Se você receber `Commands out of sync; you can't run this command now` em seu código cliente, significa que você está chamando funções cliente na ordem errada.

Isso pode acontecer, por exemplo, se você estiver usando [`mysql_use_result()`](/doc/c-api/5.7/en/mysql-use-result.html) e tentar executar uma nova Query antes de ter chamado [`mysql_free_result()`](/doc/c-api/5.7/en/mysql-free-result.html). Também pode ocorrer se você tentar executar duas Queries que retornam dados sem chamar [`mysql_use_result()`](/doc/c-api/5.7/en/mysql-use-result.html) ou [`mysql_store_result()`](/doc/c-api/5.7/en/mysql-store-result.html) no intervalo.
#### B.3.2.12 Comandos fora de sincronia

Se você receber `Comandos fora de sincronia; você não pode executar este comando agora` no seu código do cliente, você está chamando funções do cliente na ordem errada.

Isso pode acontecer, por exemplo, se você estiver usando [`mysql_use_result()`](/doc/c-api/5.7/pt-BR/mysql-use-result.html) e tentar executar uma nova consulta antes de chamar [`mysql_free_result()`](/doc/c-api/5.7/pt-BR/mysql-free-result.html). Isso também pode acontecer se você tentar executar duas consultas que retornam dados sem chamar [`mysql_use_result()`](/doc/c-api/5.7/pt-BR/mysql-use-result.html) ou [`mysql_store_result()`](/doc/c-api/5.7/pt-BR/mysql-store-result.html) entre elas.

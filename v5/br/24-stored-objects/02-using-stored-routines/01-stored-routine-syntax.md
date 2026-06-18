### 23.2.1 Sintaxe de Stored Routine

Uma stored routine é um Procedure ou um Function. Stored routines são criadas com as instruções `CREATE PROCEDURE` e `CREATE FUNCTION` (consulte a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”). Um Procedure é invocado usando uma instrução `CALL` (consulte a Seção 13.2.1, “Instrução CALL”) e só pode retornar valores usando variáveis de output. Um Function pode ser chamado de dentro de uma instrução, assim como qualquer outro Function (ou seja, invocando o nome do Function), e pode retornar um valor escalar. O corpo de uma stored routine pode usar compound statements (consulte a Seção 13.6, “Compound Statements”).

Stored routines podem ser descartadas (dropped) com as instruções `DROP PROCEDURE` e `DROP FUNCTION` (consulte a Seção 13.1.27, “Instruções DROP PROCEDURE e DROP FUNCTION”), e alteradas com as instruções `ALTER PROCEDURE` e `ALTER FUNCTION` (consulte a Seção 13.1.6, “Instrução ALTER PROCEDURE”).

Um stored procedure ou function está associado a um Database específico. Isso tem várias implicações:

* Quando a routine é invocada, um `USE db_name` implícito é executado (e desfeito quando a routine termina). Instruções `USE` dentro de stored routines não são permitidas.

* Você pode qualificar nomes de routines com o nome do Database. Isso pode ser usado para se referir a uma routine que não está no Database atual. Por exemplo, para invocar um stored procedure `p` ou function `f` que está associado ao Database `test`, você pode usar `CALL test.p()` ou `test.f()`.

* Quando um Database é descartado, todas as stored routines associadas a ele também são descartadas.

Stored functions não podem ser recursivos.

Recursão em stored procedures é permitida, mas desabilitada por padrão. Para habilitar a recursão, defina a variável de sistema do servidor `max_sp_recursion_depth` para um valor maior que zero. A recursão de stored procedure aumenta a demanda por espaço na stack do Thread. Se você aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da stack do Thread, elevando o valor de `thread_stack` na inicialização do servidor. Consulte a Seção 5.1.7, “Server System Variables”, para mais informações.

O MySQL suporta uma extensão muito útil que permite o uso de instruções `SELECT` regulares (ou seja, sem usar Cursors ou variáveis locais) dentro de um stored procedure. O result set de tal Query é simplesmente enviado diretamente para o cliente. Múltiplas instruções `SELECT` geram múltiplos result sets, então o cliente deve usar uma biblioteca cliente MySQL que suporte múltiplos result sets. Isso significa que o cliente deve usar uma biblioteca cliente de uma versão do MySQL pelo menos tão recente quanto a 4.1. O cliente também deve especificar a opção `CLIENT_MULTI_RESULTS` ao se conectar. Para programas C, isso pode ser feito com o Function C API `mysql_real_connect()`. Consulte mysql_real_connect() e Suporte à Execução de Múltiplas Statements.
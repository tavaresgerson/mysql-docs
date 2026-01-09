### 27.2.1 Sintaxe de Rotinas Armazenadas

Uma rotina armazenada é um procedimento ou uma função. Rotinas armazenadas são criadas com as instruções `CREATE PROCEDURE` e `CREATE FUNCTION` (veja Seção 15.1.21, “Instruções CREATE PROCEDURE e CREATE FUNCTION”). Um procedimento é invocado usando uma instrução `CALL` (veja Seção 15.2.1, “Instrução CALL”), e só pode retornar valores usando variáveis de saída. Uma função pode ser chamada dentro de uma instrução assim como qualquer outra função (ou seja, invocando o nome da função), e pode retornar um valor escalar. O corpo de uma rotina armazenada pode usar instruções compostas (veja Seção 15.6, “Sintaxe de Instrução Composta”).

Rotinas armazenadas podem ser excluídas com as instruções `DROP PROCEDURE` e `DROP FUNCTION` (veja Seção 15.1.34, “Instruções DROP PROCEDURE e DROP FUNCTION”), e alteradas com as instruções `ALTER PROCEDURE` e `ALTER FUNCTION` (veja Seção 15.1.9, “Instrução ALTER PROCEDURE”).

Uma rotina armazenada ou função está associada a um banco de dados particular. Isso tem várias implicações:

* Quando a rotina é invocada, uma `USE db_name` implícita é realizada (e desfeita quando a rotina termina). As instruções `USE` dentro de rotinas armazenadas não são permitidas.

* Você pode qualificar os nomes das rotinas com o nome do banco de dados. Isso pode ser usado para referenciar uma rotina que não está no banco de dados atual. Por exemplo, para invocar uma rotina armazenada `p` ou função `f` que está associada ao banco de dados `test`, você pode dizer `CALL test.p()` ou `test.f()`.

* Quando um banco de dados é excluído, todas as rotinas armazenadas associadas a ele também são excluídas.

Funções armazenadas não podem ser recursivas.

A recursão em procedimentos armazenados é permitida, mas desabilitada por padrão. Para habilitar a recursão, defina a variável de sistema do servidor `max_sp_recursion_depth` para um valor maior que zero. A recursão em procedimentos armazenados aumenta a demanda por espaço na pilha de threads. Se aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da pilha de threads ao aumentar o valor de `thread_stack` no início do servidor. Consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”, para obter mais informações.

O MySQL suporta uma extensão muito útil que permite o uso de instruções `SELECT` regulares (ou seja, sem usar cursors ou variáveis locais) dentro de um procedimento armazenado. O conjunto de resultados dessa consulta é simplesmente enviado diretamente ao cliente. Múltiplas instruções `SELECT` geram múltiplos conjuntos de resultados, então o cliente deve usar uma biblioteca de cliente do MySQL que suporte múltiplos conjuntos de resultados. Isso significa que o cliente deve usar uma biblioteca de cliente de uma versão do MySQL pelo menos tão recente quanto 4.1. O cliente também deve especificar a opção `CLIENT_MULTI_RESULTS` ao se conectar. Para programas em C, isso pode ser feito com a função `mysql_real_connect()` da API C. Consulte mysql_real_connect() e Suporte à Execução de Instruções Múltiplas.

Uma variável de usuário referenciada por uma instrução em um procedimento armazenado tem seu tipo determinado pela primeira vez quando o procedimento é invocado e retém esse tipo cada vez que o procedimento é invocado posteriormente.
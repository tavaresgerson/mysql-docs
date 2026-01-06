### 23.2.1 Sintaxe de Rotina Armazenada

Uma rotina armazenada é um procedimento ou uma função. Rotinas armazenadas são criadas com as instruções `CREATE PROCEDURE` e `CREATE FUNCTION` (consulte a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”). Um procedimento é invocado usando uma instrução `CALL` (consulte a Seção 13.2.1, “Instrução CALL”), e só pode retornar valores usando variáveis de saída. Uma função pode ser chamada dentro de uma instrução, assim como qualquer outra função (ou seja, invocando o nome da função), e pode retornar um valor escalar. O corpo de uma rotina armazenada pode usar instruções compostas (consulte a Seção 13.6, “Instruções Compostas”).

As rotinas armazenadas podem ser excluídas com as instruções `DROP PROCEDURE` e `DROP FUNCTION` (consulte a Seção 13.1.27, “Instruções DROP PROCEDURE e DROP FUNCTION”) e alteradas com as instruções `ALTER PROCEDURE` e `ALTER FUNCTION` (consulte a Seção 13.1.6, “Instrução ALTER PROCEDURE”).

Um procedimento armazenado ou função está associado a um banco de dados específico. Isso tem várias implicações:

- Quando a rotina é invocada, uma `USE db_name` implícita é realizada (e desfeita quando a rotina termina). As instruções `USE` dentro de rotinas armazenadas não são permitidas.

- Você pode qualificar nomes de rotinas com o nome do banco de dados. Isso pode ser usado para se referir a uma rotina que não está no banco de dados atual. Por exemplo, para invocar um procedimento armazenado `p` ou função `f` que está associado ao banco de dados `test`, você pode dizer `CALL test.p()` ou `test.f()`.

- Quando um banco de dados é excluído, todas as rotinas armazenadas associadas a ele também são excluídas.

As funções armazenadas não podem ser recursivas.

A recursão em procedimentos armazenados é permitida, mas desabilitada por padrão. Para habilitar a recursão, defina a variável de sistema do servidor `max_sp_recursion_depth` para um valor maior que zero. A recursão em procedimentos armazenados aumenta a demanda por espaço na pilha de threads. Se você aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da pilha de threads ao aumentar o valor de `thread_stack` durante o inicialização do servidor. Consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”, para obter mais informações.

O MySQL suporta uma extensão muito útil que permite o uso de instruções `SELECT` regulares (ou seja, sem o uso de cursors ou variáveis locais) dentro de um procedimento armazenado. O conjunto de resultados dessa consulta é simplesmente enviado diretamente ao cliente. Múltiplas instruções `SELECT` geram múltiplos conjuntos de resultados, então o cliente deve usar uma biblioteca de cliente do MySQL que suporte múltiplos conjuntos de resultados. Isso significa que o cliente deve usar uma biblioteca de cliente de uma versão do MySQL pelo menos tão recente quanto 4.1. O cliente também deve especificar a opção `CLIENT_MULTI_RESULTS` ao se conectar. Para programas em C, isso pode ser feito com a função `mysql_real_connect()` da API C. Veja mysql\_real\_connect() e Suporte à Execução de Instruções Múltiplas.

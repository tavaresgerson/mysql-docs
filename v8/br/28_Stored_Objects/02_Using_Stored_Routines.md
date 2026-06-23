## 27.2 Usando Rotinas Armazenadas

O MySQL suporta rotinas armazenadas (procedimentos e funções). Uma rotina armazenada é um conjunto de instruções SQL que podem ser armazenadas no servidor. Uma vez que isso tenha sido feito, os clientes não precisam refazer as declarações individuais, mas podem se referir à rotina armazenada.

As rotinas armazenadas podem ser particularmente úteis em certas situações:

* Quando várias aplicações de clientes são escritas em diferentes idiomas ou funcionam em diferentes plataformas, mas precisam realizar as mesmas operações de banco de dados.

* Quando a segurança é primordial. Os bancos, por exemplo, utilizam procedimentos e funções armazenadas para todas as operações comuns. Isso oferece um ambiente consistente e seguro, e as rotinas podem garantir que cada operação seja registrada corretamente. Nesse tipo de configuração, aplicativos e usuários não teriam acesso direto às tabelas do banco de dados, mas apenas poderiam executar rotinas armazenadas específicas.

As rotinas armazenadas podem proporcionar um desempenho melhor, pois menos informações precisam ser enviadas entre o servidor e o cliente. O preço a pagar é que isso aumenta a carga no servidor de banco de dados, pois mais do trabalho é feito no lado do servidor e menos é feito no lado do cliente (aplicativo). Considere isso se muitas máquinas do cliente (como servidores Web) são atendidas por apenas um ou alguns servidores de banco de dados.

As rotinas armazenadas também permitem que você tenha bibliotecas de funções no servidor de banco de dados. Essa é uma característica compartilhada por linguagens de aplicativos modernas que permitem tal projeto internamente (por exemplo, usando classes). Usar essas características de linguagens de aplicativos cliente é benéfico para o programador mesmo fora do escopo do uso do banco de dados.

O MySQL segue a sintaxe SQL:2003 para rotinas armazenadas, que também é usada pelo DB2 da IBM. Todas as sintaxes descritas aqui são suportadas e quaisquer limitações e extensões são documentadas quando apropriado.

### Recursos adicionais

* Você pode encontrar o [Fórum de Usuários de Procedimentos Armazenados][(https://forums.mysql.com/list.php?98)] útil ao trabalhar com procedimentos e funções armazenadas.

* Para respostas a algumas perguntas comumente feitas sobre rotinas armazenadas no MySQL, consulte a Seção A.4, “Perguntas Frequentes do MySQL 8.0: Procedimentos e Funções Armazenadas”.

* Existem algumas restrições sobre o uso de rotinas armazenadas. Veja a Seção 27.8, “Restrições sobre programas armazenados”.

* O registro binário para rotinas armazenadas ocorre conforme descrito na Seção 27.7, “Registro binário de programas armazenados”.

### 27.2.1 Sintaxe de rotina armazenada

Uma rotina armazenada é um procedimento ou uma função. Rotinas armazenadas são criadas com as declarações `CREATE PROCEDURE`(create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements") e `CREATE FUNCTION`(create-function.html "15.1.14 CREATE FUNCTION Statement") (ver Seção 15.1.17, “Declarações CREATE PROCEDURE e CREATE FUNCTION”). Um procedimento é invocado usando uma declaração `CALL` (ver Seção 15.2.1, “Declaração CALL”), e só pode retornar valores usando variáveis de saída. Uma função pode ser chamada dentro de uma declaração, assim como qualquer outra função (ou seja, invocando o nome da função), e pode retornar um valor escalar. O corpo de uma rotina armazenada pode usar declarações compostas (ver Seção 15.6, “Sintaxe de Declaração Composta”).

As rotinas armazenadas podem ser descartadas com as declarações `DROP PROCEDURE` (drop-procedure.html "15.1.29 DROP PROCEDURE and DROP FUNCTION Statements") e `DROP FUNCTION` (drop-function.html "15.1.26 DROP FUNCTION Statement") (ver Seção 15.1.29, “Declarações DROP PROCEDURE e DROP FUNCTION”), e alteradas com as declarações `ALTER PROCEDURE` e `ALTER FUNCTION` (ver Seção 15.1.7, “Declaração ALTER PROCEDURE”).

Um procedimento ou função armazenada está associado a um banco de dados específico. Isso tem várias implicações:

* Quando a rotina é invocada, uma `USE db_name` implícita é realizada (e desfazer quando a rotina termina). As declarações `USE` dentro de rotinas armazenadas não são permitidas.

* Você pode qualificar nomes de rotina com o nome do banco de dados. Isso pode ser usado para se referir a uma rotina que não está no banco de dados atual. Por exemplo, para invocar um procedimento armazenado `p` ou função `f` que está associada ao banco de dados `test`, você pode dizer `CALL test.p()` ou `test.f()`.

* Quando um banco de dados é excluído, todas as rotinas armazenadas associadas a ele também são excluídas.

As funções armazenadas não podem ser recursivas.

A recursão em procedimentos armazenados é permitida, mas desabilitada por padrão. Para habilitar a recursão, defina a variável de sistema do servidor `max_sp_recursion_depth` para um valor maior que zero. A recursão de procedimentos armazenados aumenta a demanda pelo espaço de pilha de thread. Se aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da pilha de thread, aumentando o valor de `thread_stack` na inicialização do servidor. Consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”, para obter mais informações.

O MySQL suporta uma extensão muito útil que permite o uso de declarações regulares `SELECT` (ou seja, sem o uso de cursor ou variáveis locais) dentro de um procedimento armazenado. O conjunto de resultados de uma consulta desse tipo é simplesmente enviado diretamente ao cliente. Múltiplas declarações `SELECT` geram múltiplos conjuntos de resultados, então o cliente deve usar uma biblioteca de cliente do MySQL que suporte múltiplos conjuntos de resultados. Isso significa que o cliente deve usar uma biblioteca de cliente de uma versão do MySQL pelo menos tão recente quanto 4.1. O cliente também deve especificar a opção `CLIENT_MULTI_RESULTS` quando se conecta. Para programas em C, isso pode ser feito com a função `mysql_real_connect()` da API C. Veja mysql_real_connect() e Suporte à Execução de Declarações Múltiplas.

No MySQL 8.0.22 e versões posteriores, uma variável de usuário referenciada por uma declaração em um procedimento armazenado tem seu tipo determinado pela primeira vez quando o procedimento é invocado, e retém esse tipo cada vez que o procedimento é invocado posteriormente.

### 27.2.2 Rotinas Armazenadas e Privilegios do MySQL

O sistema de concessão do MySQL leva em consideração as rotinas armazenadas da seguinte forma:

* O privilégio `CREATE ROUTINE` é necessário para criar rotinas armazenadas.

* O privilégio `ALTER ROUTINE` é necessário para alterar ou descartar rotinas armazenadas. Esse privilégio é concedido automaticamente ao criador de uma rotina, se necessário, e descartado pelo criador quando a rotina é descartada.

* O privilégio `EXECUTE` é necessário para executar rotinas armazenadas. No entanto, este privilégio é concedido automaticamente ao criador de uma rotina, se necessário (e é descartado do criador quando a rotina é descartada). Além disso, a característica padrão `SQL SECURITY` para uma rotina é `DEFINER`, que permite que os usuários que têm acesso ao banco de dados com o qual a rotina está associada execute a rotina.

* Se a variável de sistema `automatic_sp_privileges` for 0, os privilégios `EXECUTE` e `ALTER ROUTINE` não são concedidos automaticamente ao criador da rotina e removidos dela.

* O criador de uma rotina é a conta usada para executar a declaração `CREATE` para ela. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

* A conta denominada como rotina `DEFINER` pode ver todas as propriedades de rotina, incluindo sua definição. Assim, a conta tem acesso total à saída de rotina conforme produzida por:

+ O conteúdo da tabela do esquema de informações `ROUTINES`.

+ As declarações `SHOW CREATE FUNCTION` e `SHOW CREATE PROCEDURE`.

+ As declarações `SHOW FUNCTION CODE` e `SHOW PROCEDURE CODE`.

+ As declarações `SHOW FUNCTION STATUS` e `SHOW PROCEDURE STATUS`.

* Para uma conta que não seja a conta designada como a rotina `DEFINER`, o acesso às propriedades de rotina depende dos privilégios concedidos à conta:

+ Com o privilégio `SHOW_ROUTINE` ou o privilégio global `SELECT`, a conta pode ver todas as propriedades rotineiras, incluindo sua definição.

+ Com o privilégio `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedido em um escopo que inclui a rotina, a conta pode ver todas as propriedades da rotina, exceto sua definição.

### 27.2.3 Metadados de rotina armazenados

Para obter metadados sobre as rotinas armazenadas:

* Consulte a tabela `ROUTINES` do banco de dados `INFORMATION_SCHEMA`. Veja a Seção 28.3.30, “A tabela de ROUTINES do INFORMATION_SCHEMA”.

* Use as declarações `SHOW CREATE PROCEDURE` e `SHOW CREATE FUNCTION` para ver as definições rotineiras. Veja a Seção 15.7.7.9, “Declaração SHOW CREATE PROCEDURE”.

* Use as declarações `SHOW PROCEDURE STATUS` e `SHOW FUNCTION STATUS` para ver as características rotineiras. Veja a Seção 15.7.7.28, “Declaração SHOW PROCEDURE STATUS”.

* Use as declarações `SHOW PROCEDURE CODE` e `SHOW FUNCTION CODE` para ver uma representação da implementação interna da rotina. Veja a Seção 15.7.7.27, “Declaração SHOW PROCEDURE CODE”.

### 27.2.4 Procedimentos Armazenados, Funções, Gatilhos e LAST_INSERT_ID()

Dentro do corpo de uma rotina armazenada (procedimento ou função) ou de um gatilho, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para as declarações executadas fora do corpo desses tipos de objetos (ver Seção 14.15, “Funções de Informação”). O efeito de uma rotina armazenada ou de um gatilho sobre o valor de `LAST_INSERT_ID()` que é visto ao seguir declarações depende do tipo de rotina:

* Se um procedimento armazenado executar instruções que alterem o valor de `LAST_INSERT_ID()`, o valor alterado será visto por instruções que seguem a chamada do procedimento.

* Para funções e gatilhos armazenados que alteram o valor, o valor é restaurado quando a função ou o gatilho termina, então as instruções seguintes não veem um valor alterado.
## 23.2 Usando Stored Routines

23.2.1 Sintaxe de Stored Routine

23.2.2 Stored Routines e Privilégios MySQL

23.2.3 Metadata de Stored Routine

23.2.4 Stored Procedures, Functions, Triggers e LAST_INSERT_ID()

O MySQL suporta *stored routines* (procedures e functions). Uma *stored routine* é um conjunto de instruções SQL que podem ser armazenadas no *server*. Feito isso, os *clients* não precisam reemitir as instruções individuais, mas podem se referir à *stored routine* em seu lugar.

As *stored routines* exigem a *table* `proc` no *database* `mysql`. Esta *table* é criada durante o procedimento de instalação do MySQL. Se você estiver atualizando para o MySQL 5.7 a partir de uma versão anterior, certifique-se de atualizar suas *grant tables* para garantir que a *table* `proc` exista. Consulte a Seção 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables”.

As *stored routines* podem ser particularmente úteis em certas situações:

* Quando múltiplos *client applications* são escritos em linguagens diferentes ou funcionam em plataformas distintas, mas precisam executar as mesmas operações de *database*.

* Quando a segurança é fundamental. Bancos, por exemplo, usam *stored procedures* e *functions* para todas as operações comuns. Isso oferece um ambiente consistente e seguro, e as *routines* podem garantir que cada operação seja devidamente registrada (*logged*). Em tal configuração, *applications* e usuários não teriam acesso direto às *database tables*, mas só poderiam executar *stored routines* específicas.

As *stored routines* podem proporcionar um melhor desempenho porque menos informações precisam ser enviadas entre o *server* e o *client*. A desvantagem (*tradeoff*) é que isso aumenta a carga no *database server*, pois uma parte maior do trabalho é feita no lado do *server* e menos no lado do *client* (*application*). Considere isso se muitas máquinas *client* (como *Web servers*) forem atendidas por apenas um ou poucos *database servers*.

As *stored routines* também permitem ter *libraries* de *functions* no *database server*. Este é um recurso compartilhado por linguagens de *application* modernas que permitem tal design internamente (por exemplo, usando *classes*). Usar esses recursos de linguagem de *application client* é benéfico para o programador, mesmo fora do escopo do uso do *database*.

O MySQL segue a sintaxe SQL:2003 para *stored routines*, que também é usada pelo DB2 da IBM. Toda a sintaxe descrita aqui é suportada, e quaisquer limitações e extensões são documentadas quando apropriado.

### Recursos Adicionais

* Você pode achar útil o [Stored Procedures User Forum](https://forums.mysql.com/list.php?98) ao trabalhar com *stored procedures* e *functions*.

* Para respostas a algumas perguntas comuns sobre *stored routines* no MySQL, consulte a Seção A.4, “MySQL 5.7 FAQ: Stored Procedures and Functions”.

* Existem algumas restrições sobre o uso de *stored routines*. Consulte a Seção 23.8, “Restrictions on Stored Programs”.

* O *Binary logging* para *stored routines* ocorre conforme descrito na Seção 23.7, “Stored Program Binary Logging”.
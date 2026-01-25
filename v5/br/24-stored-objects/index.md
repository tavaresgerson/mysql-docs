# Capítulo 23 Objetos Armazenados

**Sumário**

23.1 Definição de Programas Armazenados

23.2 Uso de Rotinas Armazenadas : 23.2.1 Sintaxe de Rotina Armazenada

    23.2.2 Rotinas Armazenadas e Privilégios do MySQL

    23.2.3 Metadata de Rotina Armazenada

    23.2.4 Stored Procedures, Functions, Triggers e LAST_INSERT_ID()

23.3 Uso de Triggers : 23.3.1 Sintaxe e Exemplos de Trigger

    23.3.2 Metadata de Trigger

23.4 Uso do Event Scheduler : 23.4.1 Visão Geral do Event Scheduler

    23.4.2 Configuração do Event Scheduler

    23.4.3 Sintaxe de Event

    23.4.4 Metadata de Event

    23.4.5 Status do Event Scheduler

    23.4.6 O Event Scheduler e os Privilégios do MySQL

23.5 Uso de Views : 23.5.1 Sintaxe de View

    23.5.2 Algoritmos de Processamento de View

    23.5.3 Views Atualizáveis e Inseríveis

    23.5.4 A Cláusula WITH CHECK OPTION de View

    23.5.5 Metadata de View

23.6 Controle de Acesso a Objetos Armazenados

23.7 Binary Logging de Programas Armazenados

23.8 Restrições em Programas Armazenados

23.9 Restrições em Views

Este capítulo discute objetos de Database armazenados que são definidos em termos de código SQL, o qual é armazenado no server para execução posterior.

Objetos armazenados incluem estes tipos de objetos:

* Stored procedure: Um objeto criado com `CREATE PROCEDURE` e invocado usando o statement `CALL`. Uma procedure não possui um valor de retorno, mas pode modificar seus parameters para inspeção posterior pelo chamador. Também pode gerar result sets a serem retornados ao programa cliente.

* Stored function: Um objeto criado com `CREATE FUNCTION` e usado de forma muito semelhante a uma função embutida. Você a invoca em uma expressão, e ela retorna um valor durante a avaliação da expressão.

* Trigger: Um objeto criado com `CREATE TRIGGER` que está associado a uma table. Um trigger é ativado quando um evento específico ocorre para a table, como um insert ou update.

* Event: Um objeto criado com `CREATE EVENT` e invocado pelo server de acordo com um schedule (agendamento).

* View: Um objeto criado com `CREATE VIEW` que, quando referenciado, produz um result set. Uma view atua como uma table virtual.

A terminologia usada neste documento reflete a hierarquia de objetos armazenados:

* Stored routines incluem stored procedures e functions.
* Stored programs incluem stored routines, triggers e events.
* Stored objects incluem stored programs e views.

Este capítulo descreve como usar objetos armazenados. As seções a seguir fornecem informações adicionais sobre a sintaxe SQL para statements relacionados a esses objetos e sobre o processamento de objetos:

* Para cada tipo de objeto, existem statements `CREATE`, `ALTER` e `DROP` que controlam quais objetos existem e como são definidos. Consulte a Seção 13.1, “Data Definition Statements”.

* O statement `CALL` é usado para invocar stored procedures. Consulte a Seção 13.2.1, “CALL Statement”.

* As definições de stored program incluem um body que pode usar compound statements, loops, condicionais e variáveis declaradas. Consulte a Seção 13.6, “Compound Statements”.

* Alterações de Metadata em objetos referenciados por stored programs são detectadas e causam o reparsing automático dos statements afetados na próxima execução do programa. Para mais informações, consulte a Seção 8.10.4, “Caching of Prepared Statements and Stored Programs”.
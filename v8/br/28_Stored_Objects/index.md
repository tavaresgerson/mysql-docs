# Capítulo 27 Objetos Armazenados

Este capítulo discute objetos de banco de dados armazenados que são definidos em termos de código SQL armazenado no servidor para execução posterior.

Os objetos armazenados incluem esses tipos de objetos:

* Procedimento armazenado: Um objeto criado com `CREATE PROCEDURE` e invocado usando a declaração `CALL`. Um procedimento não tem um valor de retorno, mas pode modificar seus parâmetros para inspeção posterior pelo chamador. Também pode gerar conjuntos de resultados a serem retornados ao programa cliente.

* Função armazenada: Um objeto criado com `CREATE FUNCTION` e usado de forma muito semelhante a uma função embutida. Você o invoca em uma expressão e ele retorna um valor durante a avaliação da expressão.

* Trigger: Um objeto criado com `CREATE TRIGGER`[(create-trigger.html "15.1.22 CREATE TRIGGER Statement")], que está associado a uma tabela. O gatilho é ativado quando um evento específico ocorre para a tabela, como uma inserção ou atualização.

* Evento: Um objeto criado com `CREATE EVENT` e invocado pelo servidor de acordo com o cronograma.

* Visualização: Um objeto criado com `CREATE VIEW` que, quando referenciado, produz um conjunto de resultados. Uma visualização atua como uma tabela virtual.

A terminologia utilizada neste documento reflete a hierarquia do objeto armazenado:

* Rotinas armazenadas incluem procedimentos e funções armazenadas.
* Programas armazenados incluem rotinas armazenadas, gatilhos e eventos.
* Objetos armazenados incluem programas e visualizações armazenados.

Este capítulo descreve como usar objetos armazenados. As seções seguintes fornecem informações adicionais sobre a sintaxe SQL para declarações relacionadas a esses objetos e sobre o processamento de objetos.

* Para cada tipo de objeto, existem as declarações `CREATE`, `ALTER` e `DROP` que controlam quais objetos existem e como são definidos. Veja a Seção 15.1, “Declarações de Definição de Dados”.

* A declaração `CALL` é usada para invocar procedimentos armazenados. Veja a Seção 15.2.1, “Declaração CALL”.

* As definições de programas armazenados incluem um corpo que pode usar instruções compostas, laços, condicionais e variáveis declaradas. Veja a Seção 15.6, “Sintaxe de Instrução Composta”.

* Alterações de metadados em objetos referenciados por programas armazenados são detectadas e causam a reparsa automática das declarações afetadas quando o programa é executado novamente. Para mais informações, consulte a Seção 10.10.3, “Cache de Declarações Preparadas e Programas Armazenados”.
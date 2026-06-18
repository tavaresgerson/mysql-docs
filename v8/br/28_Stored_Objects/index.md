# Capítulo 27 Objetos Armazenados

**Índice**

27.1 Definindo Programas Armazenados

27.2 Uso de Rotinas Armazenadas:   27.2.1 Sintaxe da Rotina Armazenada

```
27.2.2 Stored Routines and MySQL Privileges

27.2.3 Stored Routine Metadata

27.2.4 Stored Procedures, Functions, Triggers, and LAST_INSERT_ID()
```

27.3 Uso de gatilhos:   27.3.1 Sintaxe e exemplos de gatilhos

```
27.3.2 Trigger Metadata
```

27.4 Usando o Agendamento de Eventos:   27.4.1 Visão geral do Agendamento de Eventos

```
27.4.2 Event Scheduler Configuration

27.4.3 Event Syntax

27.4.4 Event Metadata

27.4.5 Event Scheduler Status

27.4.6 The Event Scheduler and MySQL Privileges
```

27.5 Uso de Visualizações:   27.5.1 Sintaxe de Visualizações

```
27.5.2 View Processing Algorithms

27.5.3 Updatable and Insertable Views

27.5.4 The View WITH CHECK OPTION Clause

27.5.5 View Metadata
```

27.6 Controle de acesso a objetos armazenados

27.7 Registro binário de programas armazenados

27.8 Restrições aos Programas Armazenados

27.9 Restrições sobre visualizações

Este capítulo discute os objetos de banco de dados armazenados que são definidos em termos de código SQL armazenado no servidor para execução posterior.

Os objetos armazenados incluem esses tipos de objetos:

- Procedência armazenada: Um objeto criado com `CREATE PROCEDURE` e invocado usando a instrução `CALL`. Uma procedência não tem um valor de retorno, mas pode modificar seus parâmetros para posterior inspeção pelo chamador. Também pode gerar conjuntos de resultados para serem retornados ao programa cliente.

- Função armazenada: Um objeto criado com `CREATE FUNCTION` e usado de forma semelhante a uma função embutida. Você o invoca em uma expressão e ele retorna um valor durante a avaliação da expressão.

- Trigger: Um objeto criado com `CREATE TRIGGER` que está associado a uma tabela. Um trigger é ativado quando um evento específico ocorre na tabela, como uma inserção ou atualização.

- Evento: Um objeto criado com `CREATE EVENT` e invocado pelo servidor de acordo com o cronograma.

- Exibição: Um objeto criado com `CREATE VIEW` que, quando referenciado, produz um conjunto de resultados. Uma exibição funciona como uma tabela virtual.

A terminologia utilizada neste documento reflete a hierarquia do objeto armazenado:

- As rotinas armazenadas incluem procedimentos e funções armazenadas.
- Os programas armazenados incluem rotinas armazenadas, gatilhos e eventos.
- Os objetos armazenados incluem programas e visualizações armazenados.

Este capítulo descreve como usar objetos armazenados. As seções a seguir fornecem informações adicionais sobre a sintaxe SQL para instruções relacionadas a esses objetos e sobre o processamento de objetos:

- Para cada tipo de objeto, existem as declarações `CREATE`, `ALTER` e `DROP` que controlam quais objetos existem e como são definidos. Veja a Seção 15.1, “Declarações de Definição de Dados”.

- A declaração `CALL` é usada para invocar procedimentos armazenados. Veja a Seção 15.2.1, “Instrução CALL”.

- As definições de programas armazenados incluem um corpo que pode usar instruções compostas, laços, condicionais e variáveis declaradas. Veja a Seção 15.6, “Sintaxe de Instrução Composta”.

- Alterações nos metadados dos objetos referenciados por programas armazenados são detectadas e causam a reinterpretação automática das declarações afetadas quando o programa é executado novamente. Para obter mais informações, consulte a Seção 10.10.3, “Cache de Declarações Preparadas e Programas Armazenados”.

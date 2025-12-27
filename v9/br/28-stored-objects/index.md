# Capítulo 27 Objetos Armazenados

**Índice**

27.1 Definindo Programas Armazenados

27.2 Usando Rotinas Armazenadas:   27.2.1 Sintaxe de Rotinas Armazenadas

    27.2.2 Rotinas Armazenadas e Privilegios do MySQL

    27.2.3 Metadados das Rotinas Armazenadas

    27.2.4 Procedimentos Armazenados, Funções, Gatilros e LAST_INSERT_ID()

27.3 Programas Armazenados em JavaScript:   27.3.1 Criação e Gerenciamento de Programas Armazenados em JavaScript

    27.3.2 Obtenção de Informações sobre Programas Armazenados em JavaScript

    27.3.3 Suporte à Linguagem de Programas Armazenados em JavaScript

    27.3.4 Tipos de Dados e Manipulação de Argumentos em Programas Armazenados em JavaScript

    27.3.5 Programas Armazenados em JavaScript—Informações e Opções de Sessão

    27.3.6 API SQL em JavaScript

    27.3.7 Uso da API SQL em JavaScript

    27.3.8 Uso de Bibliotecas em JavaScript

    27.3.9 Uso de Bibliotecas WebAssembly

    27.3.10 API GenAI em JavaScript

    27.3.11 Limitações e Restrições de Programas Armazenados em JavaScript

    27.3.12 Exemplos de Programas Armazenados em JavaScript

27.4 Usando Gatilros:   27.4.1 Sintaxe e Exemplos de Gatilros

    27.4.2 Metadados dos Gatilros

27.5 Usando o Agendamento de Eventos:   27.5.1 Visão Geral do Agendamento de Eventos

    27.5.2 Configuração do Agendamento de Eventos

    27.5.3 Sintaxe de Eventos

    27.5.4 Metadados dos Eventos

    27.5.5 Status do Agendamento de Eventos

    27.5.6 O Agendamento de Eventos e os Privilegios do MySQL

27.6 Usando Visualizações:   27.6.1 Sintaxe de Visualizações

    27.6.2 Algoritmos de Processamento de Visualizações

    27.6.3 Visualizações Atualizáveis e Inseríveis

    27.6.4 A Cláusula de Opção WITH CHECK em Visualizações

    27.6.5 Metadados das Visualizações

27.7 Visualizações de Dualidade JSON:   27.7.1 Criação de Visualizações de Dualidade JSON

    27.7.2 Operações de Múltiplo Acesso (DML) em Visualizações de Dualidade JSON (Edição Empresarial do MySQL)

    27.7.3 Metadados das Visualizações de Dualidade JSON

27.8 Controle de Acesso a Objetos Armazenados

27.9 Registro Binário de Programas Armazenados

27.10 Restrições em Programas Armazenados

27.11 Restrições para Visualizações

Este capítulo discute objetos de banco de dados armazenados que são definidos em termos de código SQL armazenado no servidor para execução posterior.

Os objetos armazenados incluem esses tipos de objetos:

* Procedimento armazenado: Um objeto criado com `CREATE PROCEDURE` e invocado usando a instrução `CALL`. Um procedimento não tem um valor de retorno, mas pode modificar seus parâmetros para posterior inspeção pelo invocante. Também pode gerar conjuntos de resultados a serem retornados ao programa cliente.

* Função armazenada: Um objeto criado com `CREATE FUNCTION` e usado de forma semelhante a uma função embutida. Você o invoca em uma expressão e ele retorna um valor durante a avaliação da expressão.

* Gatilho: Um objeto criado com `CREATE TRIGGER` que está associado a uma tabela. Um gatilho é ativado quando um evento específico ocorre para a tabela, como uma inserção ou atualização.

* Evento: Um objeto criado com `CREATE EVENT` e invocado pelo servidor de acordo com o cronograma.

* Visualização: Um objeto criado com `CREATE VIEW` que, ao ser referenciado, produz um conjunto de resultados. Uma visualização age como uma tabela virtual.

* Visualização de Dualidade Relacional JSON: Um objeto criado com `CREATE JSON DUALITY VIEW` que expõe colunas selecionadas de uma ou mais tabelas como um documento JSON. Também referido como uma visualização de dualidade JSON, esse objeto age como um documento JSON virtual.

A terminologia usada neste documento reflete a hierarquia do objeto armazenado:

* Rotinas armazenadas incluem procedimentos e funções armazenados.
* Programas armazenados incluem rotinas armazenadas, gatilhos e eventos.
* Objetos armazenados incluem programas e visualizações armazenadas.

Este capítulo descreve como usar objetos armazenados. As seções seguintes fornecem informações adicionais sobre a sintaxe SQL para instruções relacionadas a esses objetos e sobre o processamento de objetos:

* Para cada tipo de objeto, existem as instruções `CREATE`, `ALTER` e `DROP` que controlam quais objetos existem e como são definidos. Veja a Seção 15.1, “Instruções de Definição de Dados”.

* A instrução `CALL` é usada para invocar procedimentos armazenados. Veja a Seção 15.2.1, “Instrução CALL”.

* As definições de programas armazenados incluem um corpo que pode usar instruções compostas, laços, condicionais e variáveis declaradas. Veja a Seção 15.6, “Sintaxe de Instruções Compostas”.

* Alterações de metadados em objetos referenciados por programas armazenados são detectadas e causam a reparsa automática das instruções afetadas quando o programa é executado novamente. Para mais informações, veja a Seção 10.10.3, “Cache de Instruções Preparadas e Programas Armazenados”.
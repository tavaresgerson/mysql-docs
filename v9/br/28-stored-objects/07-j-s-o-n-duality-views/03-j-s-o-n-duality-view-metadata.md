### 27.7.3 Visão de Metadados da Dualidade JSON

Você pode obter informações sobre as visões de dualidade JSON existentes nas seguintes tabelas do Schema de Informações que foram implementadas nesta versão:

* `JSON_DUALITY_VIEWS`: Fornece informações por visão sobre as visões de dualidade JSON.

* `JSON_DUALITY_VIEW_COLUMNS`: Fornece informações sobre as colunas definidas nas visões de dualidade JSON.

* `JSON_DUALITY_VIEW_LINKS`: Descreve as relações pai-filho entre as visões de dualidade JSON e suas tabelas base.

* `JSON_DUALITY_VIEW_TABLES`: Fornece informações sobre as tabelas referenciadas pelas visões de dualidade JSON.

Veja as descrições das tabelas individuais para obter mais informações.

As visões de dualidade JSON também são suportadas como uma funcionalidade pelo componente Option Tracker, que expõe uma variável de status `option_tracker_usage:JSON Duality View`; essa variável armazena o número de vezes que quaisquer visões de dualidade JSON foram abertas pelo servidor.
#### 29.12.14.1 Tabela de atributos de variáveis globais global\_variable\_attributes

A tabela `global_variable_attributes` fornece informações sobre os atributos e seus valores que foram definidos pelo servidor para variáveis globais, como `offline_mode` ou `read_only`.

Mais de um par de atributo-valor pode ser atribuído a uma determinada variável global. Tais pares de atributo-valor podem ser atribuídos a variáveis globais, mas não a variáveis de sessão.

Os atributos e seus valores não podem ser definidos por usuários, nem podem ser lidos por usuários que não façam consultas a esta tabela. Os atributos e seus valores podem ser definidos, modificados ou removidos apenas pelo servidor.

A tabela `global_variable_attributes` contém as colunas listadas aqui:

* `VARIABLE_NAME`

  Nome da variável global.

* `ATTR_NAME`

  Nome de um atributo atribuído à variável nomeada em `VARIABLE_NAME`.

* `ATTR_VALUE`

  Valor do atributo nomeado em `ATTR_NAME`.

A tabela `global_variable_attributes` é de leitura somente, e nem a tabela nem quaisquer linhas que ela contenha podem ser modificadas por usuários. Para um exemplo de como o servidor usa atributos de variáveis de sistema, consulte a descrição da variável `offline_mode`.
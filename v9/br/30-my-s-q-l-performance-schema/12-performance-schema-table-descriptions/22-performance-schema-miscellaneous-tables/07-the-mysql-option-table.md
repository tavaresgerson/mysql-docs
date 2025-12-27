#### 29.12.22.7 A tabela `mysql_option`

A tabela `mysql_option` fornece informações sobre as opções disponíveis no Servidor MySQL, ou em componentes e plugins que estão atualmente ou foram previamente instalados:

```
mysql> TABLE mysql_option;
+---------------------------+----------------+------------------+
| OPTION_NAME               | OPTION_ENABLED | OPTION_CONTAINER |
+---------------------------+----------------+------------------+
| Binary Log                | TRUE           | mysql_server     |
| Hypergraph Optimizer      | FALSE          | mysql_server     |
| JavaScript Library        | TRUE           | component:mle    |
| JavaScript Stored Program | TRUE           | component:mle    |
| MySQL Server              | TRUE           | mysql_server     |
| Replication Replica       | FALSE          | mysql_server     |
| Traditional Optimizer     | TRUE           | mysql_server     |
| Vector                    | TRUE           | component_vector |
+---------------------------+----------------+------------------+
```

(Uma “opção” neste contexto refere-se a uma funcionalidade do servidor, componente ou plugin, e não a uma opção de linha de comando, como as usadas com o **mysqld** ou outros programas MySQL.)

Esta tabela é instalada pelo componente Option Tracker, disponível com a Edição Empresarial do MySQL; para mais informações sobre o componente, consulte a Seção 7.5.8, “Componente Option Tracker”.

Para ser exibida nesta tabela, um componente ou plugin deve ser escrito e compilado com suporte para o componente Option Tracker. Nem todos os componentes e plugins MySQL atualmente disponíveis oferecem tal suporte. Consulte a Seção 7.5.8.2, “Componentes Compatíveis com Option Tracker”, para uma lista dos que suportam o Option Tracker.

A tabela `mysql_option` tem as seguintes colunas:

* `OPTION_NAME`

  O nome da opção ou funcionalidade, ou `MySQL Server`, conforme apropriado.

* `OPTION_ENABLED`

  Se a opção ou funcionalidade está atualmente habilitada. Este valor é sempre `TRUE` ou `FALSE`.

* `OPTION_CONTAINER`

  O nome da opção ou funcionalidade. Para o servidor MySQL, este é `mysql_server`.

Esta tabela é de leitura somente e não pode ser truncada, embora seja atualizada pelas funções descritas na Seção 7.5.8.5, “Funções Option Tracker”.

Os dados de uso para opções e funcionalidades listadas na `mysql_option` podem ser encontrados na tabela `mysql_option.option_usage`, que é descrita na Seção 7.5.8.1, “Tabelas Option Tracker”.
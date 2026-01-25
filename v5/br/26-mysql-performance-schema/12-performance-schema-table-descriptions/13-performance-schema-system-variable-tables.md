### 25.12.13 Tabelas de Variáveis de Sistema do Performance Schema

Nota

O valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) afeta as informações disponíveis nas tabelas aqui descritas. Para detalhes, consulte a descrição dessa variável na [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

O servidor MySQL mantém muitas variáveis de sistema que indicam como ele está configurado (consulte a [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables")). As informações das variáveis de sistema estão disponíveis nestas tabelas do Performance Schema:

* [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): Variáveis de sistema globais. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

* [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): Variáveis de sistema para a session atual. Uma aplicação que deseja todos os valores de variáveis de sistema para sua própria session deve usar esta tabela. Ela inclui as session variables de sua session, bem como os valores de global variables que não possuem uma contraparte de session.

* [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): Variáveis de sistema de session para cada session ativa. Uma aplicação que deseja saber os valores das session variables para sessions específicas deve usar esta tabela. Ela inclui apenas session variables, identificadas pelo Thread ID.

As tabelas de session variable ([`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables")) contêm informações apenas para sessions ativas, e não para sessions encerradas.

As tabelas [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") e [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") possuem estas colunas:

* `VARIABLE_NAME`

  O nome da variável de sistema.

* `VARIABLE_VALUE`

  O valor da variável de sistema. Para [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), esta coluna contém o valor global. Para [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), esta coluna contém o valor da variável em vigor para a session atual.

A tabela [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") possui estas colunas:

* `THREAD_ID`

  O identificador (ID) do Thread da session na qual a variável de sistema está definida.

* `VARIABLE_NAME`

  O nome da variável de sistema.

* `VARIABLE_VALUE`

  O valor da session variable para a session nomeada pela coluna `THREAD_ID`.

A tabela [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") contém informações de variáveis de sistema apenas sobre foreground threads. Se nem todos os Threads forem instrumentados pelo Performance Schema, esta tabela pode omitir algumas linhas. Neste caso, a variável de status [`Performance_schema_thread_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_thread_instances_lost) será maior que zero.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é suportado para tabelas de variáveis de sistema do Performance Schema.
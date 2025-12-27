### 29.12.14 Tabelas de Variáveis do Sistema do Schema de Desempenho

29.12.14.1 Tabela `global\_variable\_attributes` do Schema de Desempenho

29.12.14.2 Tabela `persisted\_variables` do Schema de Desempenho

29.12.14.3 Tabela `variables\_info` do Schema de Desempenho

29.12.14.4 Tabela `variables\_metadata` do Schema de Desempenho

O servidor MySQL mantém muitas variáveis de sistema que indicam como ele está configurado (veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”). As informações das variáveis de sistema estão disponíveis nessas tabelas do Schema de Desempenho:

* `global_variables`: Variáveis de sistema globais. Uma aplicação que deseja apenas valores globais deve usar essa tabela.

* `session\_variables`: Variáveis de sistema para a sessão atual. Uma aplicação que deseja todos os valores das variáveis de sistema para sua própria sessão deve usar essa tabela. Ela inclui as variáveis de sessão para sua sessão, bem como os valores das variáveis de sistema que não têm uma contraparte de sessão.

* `variables\_by\_thread`: Variáveis de sistema de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar essa tabela. Ela inclui apenas variáveis de sessão, identificadas pelo ID do thread.

* `persisted\_variables`: Fornece uma interface SQL para o arquivo `mysqld-auto.cnf` que armazena as configurações persistentes das variáveis de sistema globais. Veja a Seção 29.12.14.2, “Tabela `persisted\_variables` do Schema de Desempenho”.

* `variables\_info`: Mostra, para cada variável de sistema, a fonte de onde ela foi definida mais recentemente e sua faixa de valores. Veja a Seção 29.12.14.3, “Tabela `variables\_info` do Schema de Desempenho”.

O privilégio `SENSITIVE\_VARIABLES\_OBSERVER` é necessário para visualizar os valores das variáveis de sistema sensíveis nessas tabelas.

As tabelas de variáveis de sessão (`session_variables`, `variables_by_thread`) contêm informações apenas para sessões ativas, não para sessões encerradas.

As tabelas `global_variables` e `session_variables` têm essas colunas:

* `VARIABLE_NAME`

  O nome da variável do sistema.

* `VARIABLE_VALUE`

  O valor da variável do sistema. Para `global_variables`, esta coluna contém o valor global. Para `session_variables`, esta coluna contém o valor da variável em vigor para a sessão atual.

As tabelas `global_variables` e `session_variables` têm esses índices:

* Chave primária em (`VARIABLE_NAME`)

A tabela `variables_by_thread` tem essas colunas:

* `THREAD_ID`

  O identificador do thread da sessão em que a variável do sistema é definida.

* `VARIABLE_NAME`

  O nome da variável do sistema.

* `VARIABLE_VALUE`

  O valor da variável de sessão para a sessão nomeada pelo colunã `THREAD_ID`.

A tabela `variables_by_thread` tem esses índices:

* Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

A tabela `variables_by_thread` contém informações sobre variáveis do sistema apenas sobre threads em primeiro plano. Se nem todos os threads forem instrumentados pelo Schema de Desempenho, esta tabela perde algumas linhas. Neste caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

O `TRUNCATE TABLE` não é suportado para tabelas de variáveis do sistema do Schema de Desempenho.
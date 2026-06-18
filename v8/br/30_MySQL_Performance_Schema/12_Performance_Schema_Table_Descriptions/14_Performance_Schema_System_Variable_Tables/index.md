### 29.12.14 Tabelas de variáveis do sistema do esquema de desempenho

29.12.14.1 Schema de desempenho da tabela persisted\_variables

29.12.14.2 Tabela de variáveis do esquema de desempenho \_info

O servidor MySQL mantém muitas variáveis de sistema que indicam como ele está configurado (veja a Seção 7.1.8, “Variáveis de sistema do servidor”). As informações das variáveis de sistema estão disponíveis nessas tabelas do Schema de desempenho:

- `global_variables`: Variáveis do sistema global. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

- `session_variables`: Variáveis do sistema para a sessão atual. Uma aplicação que deseja obter todos os valores das variáveis do sistema para sua própria sessão deve usar esta tabela. Ela inclui as variáveis da sessão para sua sessão, bem como os valores das variáveis globais que não têm contraparte na sessão.

- `variables_by_thread`: Variáveis do sistema de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas as variáveis de sessão, identificadas pelo ID do thread.

- `persisted_variables`: Fornece uma interface SQL para o arquivo `mysqld-auto.cnf` que armazena configurações persistentes de variáveis de sistema global. Veja a Seção 29.12.14.1, “Tabela persistentes\_variáveis do Performance Schema”.

- `variables_info`: Mostra, para cada variável do sistema, a origem da última vez em que foi definida e sua faixa de valores. Consulte a Seção 29.12.14.2, “Tabela variáveis\_info do Schema de Desempenho”.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` é necessário para visualizar os valores das variáveis de sistema sensíveis nessas tabelas.

As tabelas de variáveis de sessão (`session_variables`, `variables_by_thread`) contêm informações apenas para sessões ativas, não para sessões encerradas.

As tabelas `global_variables` e `session_variables` têm essas colunas:

- `VARIABLE_NAME`

  O nome da variável do sistema.

- `VARIABLE_VALUE`

  O valor da variável do sistema. Para `global_variables`, esta coluna contém o valor global. Para `session_variables`, esta coluna contém o valor da variável em vigor para a sessão atual.

As tabelas `global_variables` e `session_variables` possuem esses índices:

- Chave primária em (`VARIABLE_NAME`)

A tabela `variables_by_thread` tem essas colunas:

- `THREAD_ID`

  O identificador de fio da sessão na qual a variável de sistema é definida.

- `VARIABLE_NAME`

  O nome da variável do sistema.

- `VARIABLE_VALUE`

  O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela `variables_by_thread` tem esses índices:

- Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

A tabela `variables_by_thread` contém informações de variáveis de sistema apenas sobre os threads em primeiro plano. Se nem todos os threads estiverem instrumentados pelo Schema de Desempenho, essa tabela perderá algumas linhas. Nesse caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

`TRUNCATE TABLE` não é suportado para as tabelas de variáveis do sistema do Schema de Desempenho.

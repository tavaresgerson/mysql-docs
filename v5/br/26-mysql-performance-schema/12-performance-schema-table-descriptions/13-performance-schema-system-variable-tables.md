### 25.12.13 Tabelas de variáveis do sistema do esquema de desempenho

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para obter detalhes, consulte a descrição dessa variável em Seção 5.1.7, "Variáveis de Sistema do Servidor".

O servidor MySQL mantém muitas variáveis de sistema que indicam como ele está configurado (veja Seção 5.1.7, “Variáveis de Sistema do Servidor”). As informações das variáveis de sistema estão disponíveis nessas tabelas do Schema de Desempenho:

- `variáveis globais`: Variáveis globais do sistema. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

- `session_variables`: Variáveis do sistema para a sessão atual. Uma aplicação que deseja obter todos os valores das variáveis do sistema para sua própria sessão deve usar essa tabela. Ela inclui as variáveis da sessão para sua sessão, bem como os valores das variáveis globais que não têm correspondência na sessão.

- `variables_by_thread`: Variáveis do sistema de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas as variáveis de sessão, identificadas pelo ID do thread.

As tabelas de variáveis de sessão (`session_variables`, `variables_by_thread`) contêm informações apenas para sessões ativas, não para sessões encerradas.

As tabelas `global_variables` e `session_variables` possuem as seguintes colunas:

- `VARIAVEL_NOME`

  O nome da variável do sistema.

- `VARIABLE_VALUE`

  O valor da variável do sistema. Para `global_variables`, esta coluna contém o valor global. Para `session_variables`, esta coluna contém o valor da variável em vigor para a sessão atual.

A tabela `variables_by_thread` tem as seguintes colunas:

- `THREAD_ID`

  O identificador de thread da sessão na qual a variável de sistema é definida.

- `VARIAVEL_NOME`

  O nome da variável do sistema.

- `VARIABLE_VALUE`

  O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela `variables_by_thread` contém informações sobre variáveis de sistema apenas sobre os threads em primeiro plano. Se nem todos os threads estiverem instrumentados pelo Schema de Desempenho, essa tabela pode perder algumas linhas. Nesse caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

A opção `TRUNCATE TABLE` não é suportada para as tabelas da variável de sistema do Schema de Desempenho.

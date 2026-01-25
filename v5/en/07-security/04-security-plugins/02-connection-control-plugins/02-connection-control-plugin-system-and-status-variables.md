#### 6.4.2.2 Variáveis de Sistema e de Status do Plugin de Controle de Conexão

Esta seção descreve as variáveis de sistema e de Status que o plugin `CONNECTION_CONTROL` fornece para permitir que sua operação seja configurada e monitorada.

* [Variáveis de Sistema do Plugin de Controle de Conexão](connection-control-plugin-variables.html#connection-control-plugin-system-variables "Connection Control Plugin System Variables")
* [Variáveis de Status do Plugin de Controle de Conexão](connection-control-plugin-variables.html#connection-control-plugin-status-variables "Connection Control Plugin Status Variables")

##### Variáveis de Sistema do Plugin de Controle de Conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele expõe estas System Variables:

* [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold)

  <table frame="box" rules="all" summary="Propriedades para connection_control_failed_connections_threshold"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connection-control-failed-connections-threshold=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>connection_control_failed_connections_threshold</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>3</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483647</code></td> </tr> </tbody></table>

  O número de tentativas de conexão consecutivas e falhas permitidas para contas antes que o server adicione um Delay para as tentativas de conexão subsequentes:

  + Se a variável tiver um valor não zero *`N`*, o server adiciona um Delay começando com a tentativa falha consecutiva *`N`*+1. Se uma conta atingiu o ponto em que as respostas de conexão são atrasadas, um Delay também ocorre para a próxima conexão bem-sucedida subsequente.

  + Definir esta variável como zero desabilita a contagem de conexões falhas. Neste caso, o server nunca adiciona Delays.

  Para obter informações sobre como [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) interage com outras System Variables e variáveis de Status de controle de conexão, consulte [Seção 6.4.2.1, “Instalação do Plugin de Controle de Conexão”](connection-control-plugin-installation.html "6.4.2.1 Connection Control Plugin Installation").

* [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay)

  <table frame="box" rules="all" summary="Propriedades para connection_control_max_connection_delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connection-control-max-connection-delay=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>connection_control_max_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>2147483647</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

  O Delay máximo em milissegundos para a resposta do server a tentativas de conexão falhas, se [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) for maior que zero.

  Para obter informações sobre como [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) interage com outras System Variables e variáveis de Status de controle de conexão, consulte [Seção 6.4.2.1, “Instalação do Plugin de Controle de Conexão”](connection-control-plugin-installation.html "6.4.2.1 Connection Control Plugin Installation").

* [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay)

  <table frame="box" rules="all" summary="Propriedades para connection_control_min_connection_delay"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connection-control-min-connection-delay=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>connection_control_min_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Default</th> <td><code>1000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

  O Delay mínimo em milissegundos para a resposta do server a tentativas de conexão falhas, se [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) for maior que zero.

  Para obter informações sobre como [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) interage com outras System Variables e variáveis de Status de controle de conexão, consulte [Seção 6.4.2.1, “Instalação do Plugin de Controle de Conexão”](connection-control-plugin-installation.html "6.4.2.1 Connection Control Plugin Installation").

##### Variáveis de Status do Plugin de Controle de Conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele expõe esta variável de Status:

* [`Connection_control_delay_generated`](connection-control-plugin-variables.html#statvar_Connection_control_delay_generated)

  O número de vezes que o server adicionou um Delay à sua resposta a uma tentativa de conexão falha. Isso não contabiliza as tentativas que ocorrem antes de atingir o Threshold definido pela System Variable [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold).

  Esta variável fornece um contador simples. Para obter informações mais detalhadas de monitoramento de controle de conexão, examine a tabela `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` do `INFORMATION_SCHEMA`; consulte [Seção 24.6.2, “A Tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS”](information-schema-connection-control-failed-login-attempts-table.html "24.6.2 The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table").

  Atribuir um valor a [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) em runtime reseta [`Connection_control_delay_generated`](connection-control-plugin-variables.html#statvar_Connection_control_delay_generated) para zero.

  Esta variável foi adicionada no MySQL 5.7.17.
#### 8.4.3.2 Sistema de Plugin de Controle de Conexão e Variáveis de Status

Esta seção descreve as variáveis de sistema e de status que o plugin `CONNECTION_CONTROL` fornece para permitir que sua operação seja configurada e monitorada.

* Variáveis de Sistema do Plugin de Controle de Conexão
* Variáveis de Status do Plugin de Controle de Conexão

##### Variáveis de Sistema do Plugin de Controle de Conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele expõe essas variáveis de sistema:

* `connection_control_failed_connections_threshold`

  <table frame="box" rules="all" summary="Propriedades para connection_control_failed_connections_threshold"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connection-control-failed-connections-threshold=#</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>connection_control_failed_connections_threshold</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>3</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483647</code></td> </tr></tbody></table>

O número de tentativas de conexão falhadas consecutivas permitidas para contas antes que o servidor adicione um atraso para tentativas de conexão subsequentes:

+ Se a variável tiver um valor não nulo *`N`*, o servidor adiciona um atraso começando com a tentativa falha consecutiva *`N`*+1. Se uma conta tiver atingido o ponto em que as respostas de conexão são atrasadas, um atraso também ocorre para a próxima conexão subsequente bem-sucedida.

+ Definindo essa variável para zero desativa o contagem de conexões falhas. Nesse caso, o servidor nunca adiciona atrasos.

+ Para informações sobre como `connection_control_failed_connections_threshold` interage com outras variáveis de controle de conexão e status, consulte a Seção 8.4.3.1, “Instalação do Plugin de Controle de Conexão”.

* `connection_control_max_connection_delay`

  <table frame="box" rules="all" summary="Propriedades para connection_control_max_connection_delay"><tr><th>Formato de Linha de Comando</th> <td><code>--connection-control-max-connection-delay=#</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr><tr><th>Variável do Sistema</th> <td><code>connection_control_max_connection_delay</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>2147483647</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></table>

O atraso máximo em milissegundos para a resposta do servidor a tentativas de conexão falhas, se `connection_control_failed_connections_threshold` for maior que zero.

Para informações sobre como `connection_control_max_connection_delay` interage com outras variáveis de controle de conexão e status, consulte a Seção 8.4.3.1, “Instalação do Plugin de Controle de Conexão”.

* `connection_control_min_connection_delay`

  <table frame="box" rules="all" summary="Propriedades para connection_control_min_connection_delay"><tr><th>Formato de Linha de Comando</th> <td><code>--connection-control-min-connection-delay=#</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr><tr><th>Variável do Sistema</th> <td><code>connection_control_min_connection_delay</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></table>

O atraso mínimo em milissegundos para a resposta do servidor a tentativas de conexão falhas, se `connection_control_failed_connections_threshold` for maior que zero.

Para obter informações sobre como o `connection_control_min_connection_delay` interage com outras variáveis de controle de conexão e status, consulte a Seção 8.4.3.1, “Instalação do Plugin de Controle de Conexão”.

##### Variáveis de Status do Plugin de Controle de Conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele expõe esta variável de status:

* `Connection_control_delay_generated`

  O número de vezes que o servidor adicionou um atraso à sua resposta a uma tentativa de conexão falha. Este valor não conta tentativas que ocorrem antes de atingir o limite definido pela variável de sistema `connection_control_failed_connections_threshold`.

  Esta variável fornece um contador simples. Para obter informações mais detalhadas sobre o monitoramento do controle de conexão, examine a tabela `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`; consulte a Seção 28.6.2, “A Tabela `INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`”.

  Atribuir um valor à `connection_control_failed_connections_threshold` em tempo de execução reinicia `Connection_control_delay_generated` para zero.
#### 6.4.2.2 Sistema de Plugin de Controle de Conexão e Variáveis de Status

Esta seção descreve as variáveis de sistema e status que o plugin `CONNECTION_CONTROL` fornece para permitir que sua operação seja configurada e monitorada.

- Variáveis do Sistema de Plugin de Controle de Conexão
- Variáveis de status do plugin de controle de conexão

##### Sistema de variáveis de plugins de controle de conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele expõe essas variáveis de sistema:

- `conexão_controle_conexões_falhas_limite`

  <table frame="box" rules="all" summary="Propriedades para connection_control_failed_connections_threshold"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connection-control-failed-connections-threshold=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>connection_control_failed_connections_threshold</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>3</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483647</code></td> </tr></tbody></table>

  Número de tentativas de conexão consecutivas falhas permitidas para contas antes que o servidor adicione um atraso para tentativas de conexão subsequentes:

  - Se a variável tiver um valor não nulo *`N`*, o servidor adiciona um atraso começando com a tentativa falha consecutiva *`N`*+1. Se uma conta tiver atingido o ponto em que as respostas de conexão são atrasadas, um atraso também ocorre para a próxima conexão bem-sucedida subsequente.

  - Definir essa variável para zero desabilita o contagem de conexões falhas. Nesse caso, o servidor nunca adiciona atrasos.

  Para obter informações sobre como o `connection_control_failed_connections_threshold` interage com outras variáveis do sistema de controle de conexão e status, consulte Seção 6.4.2.1, “Instalação do Plugin de Controle de Conexão”.

- `conexão_controle_max_delay_de_conexão`

  <table frame="box" rules="all" summary="Propriedades para connection_control_max_connection_delay"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connection-control-max-connection-delay=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>connection_control_max_connection_delay</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2147483647</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1000</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

  O atraso máximo em milissegundos para a resposta do servidor a tentativas de conexão falhas, se `connection_control_failed_connections_threshold` for maior que zero.

  Para obter informações sobre como o `connection_control_max_connection_delay` interage com outras variáveis de controle de conexão e status, consulte Seção 6.4.2.1, “Instalação do Plugin de Controle de Conexão”.

- `conexão_controle_min_delay_de_conexão`

  <table frame="box" rules="all" summary="Propriedades para connection_control_min_connection_delay"><tbody><tr><th>Formato de linha de comando</th> <td><code>--connection-control-min-connection-delay=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td><code>connection_control_min_connection_delay</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1000</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483647</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

  O atraso mínimo em milissegundos para a resposta do servidor a tentativas de conexão falhas, se `connection_control_failed_connections_threshold` for maior que zero.

  Para obter informações sobre como o `connection_control_min_connection_delay` interage com outras variáveis de controle de conexão e status do sistema, consulte Seção 6.4.2.1, “Instalação do Plugin de Controle de Conexão”.

##### Variáveis de status do plugin de controle de conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele exibe essa variável de status:

- `delay_generated_connection_control`

  O número de vezes que o servidor adicionou um atraso à sua resposta para uma tentativa de conexão falha. Isso não conta tentativas que ocorrem antes de atingir o limite definido pela variável de sistema `connection_control_failed_connections_threshold`.

  Essa variável fornece um contador simples. Para obter informações mais detalhadas sobre o controle de conexão, consulte a tabela `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`; veja Seção 24.6.2, “A Tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS”.

  Ao atribuir um valor a `connection_control_failed_connections_threshold` no momento da execução, o valor de `Connection_control_delay_generated` é zerado.

  Essa variável foi adicionada no MySQL 5.7.17.

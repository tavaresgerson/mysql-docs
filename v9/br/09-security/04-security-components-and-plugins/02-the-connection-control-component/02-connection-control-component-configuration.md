#### 8.4.2.2 Configuração do Componente de Controle de Conexão

O componente de Controle de Conexão expõe as seguintes variáveis de sistema:

* `component_connection_control.failed_connections_threshold`: Este é o número de tentativas consecutivas de conexão falhas por uma conta específica que são permitidas antes que o servidor adicione um atraso para tentativas subsequentes de conexão por este usuário. Para desabilitar o contagem de conexões falhas, defina essa variável para zero.

* `component_connection_control.max_connection_delay`: O atraso máximo em milissegundos para falhas de conexão acima do limite.

* `component_connection_control.min_connection_delay`: O atraso mínimo em milissegundos para falhas de conexão acima do limite.

* `component_connection_control.exempt_unknown_users`: Se os hosts que geram conexões TCP falhas devem ser penalizados. Isso melhora a capacidade do componente de lidar com tentativas legítimas de conexão de balanceadores de carga, garantindo melhor disponibilidade do servidor enquanto mantém a eficácia na prevenção de ataques de força bruta.

Se `component_connection_control.failed_connections_threshold` for maior que zero, o contagem de conexões falhas e, portanto, o controle de conexão são habilitados e aplicam-se da seguinte forma para cada conta de usuário:

* As primeiras `component_connection_control.failed_connections_threshold` tentativas consecutivas em que essa conta falha em se conectar, nenhuma ação é tomada.

* Para cada tentativa subsequente desse usuário de se conectar, o servidor adiciona um atraso crescente, até que uma conexão bem-sucedida ocorra. Os atrasos não ajustados começam em 1000 milissegundos (1 segundo) e aumentam em 1000 milissegundos por tentativa. Ou seja, uma vez que um atraso tenha sido imposto para uma conta específica, os atrasos não ajustados para tentativas falhadas subsequentes são de 1000 milissegundos, 2000 milissegundos, 3000 milissegundos e assim por diante.

* O atraso real experimentado por um cliente é o atraso não ajustado, ajustado para ficar dentro dos valores das variáveis de sistema `component_connection_control.min_connection_delay` e `component_connection_control.max_connection_delay`, inclusive.

Por exemplo, assumindo que `component_connection_control.failed_connections_threshold` é o padrão (3): Se `component_connection_control.min_connection_delay` for 3000 e `component_connection_control.max_connection_delay` for 6000, então o atraso para cada tentativa falhada de conexão é conforme mostrado na tabela a seguir:

<table><col width="30%"/><col width="35%"/><col width="35%"/><thead><tr> <th>Tentativa #</th> <th>Atraso Não Ajustado (milissegundos)</th> <th>Atraso Real (milissegundos)</th> </tr></thead><tbody><tr> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <td>2</td> <td>0</td> <td>0</td> </tr><tr> <td>3</td> <td>0</td> <td>0</td> </tr><tr> <td>4</td> <td>1000</td> <td>3000</td> </tr><tr> <td>5</td> <td>2000</td> <td>3000</td> </tr><tr> <td>6</td> <td>3000</td> <td>3000</td> </tr><tr> <td>7</td> <td>4000</td> <td>4000</td> </tr><tr> <td>8</td> <td>5000</td> <td>5000</td> </tr><tr> <td>9</td> <td>6000</td> <td>6000</td> </tr><tr> <td>10</td> <td>7000</td> <td>6000</td> </tr><tr> <td>11</td> <td>8000</td> <td>6000</td> </tr><tr> <td>12</td> <td>8000</td> <td>6000</td> </tr></tbody></table>

* Uma vez que os atrasos tenham sido instituídos para uma conta, a primeira conexão bem-sucedida subsequente por essa conta também experimenta um atraso, mas o número de falhas é zerado para as conexões subsequentes por essa conta.

O componente Controle de Conexão também expõe as seguintes variáveis de status:

* `Component_connection_control_delay_generated` é o número de vezes que o servidor adicionou um atraso à sua resposta a uma tentativa de conexão falha. Esse valor não conta tentativas que ocorrem antes de atingir o limite definido pela variável de sistema `component_connection_control.failed_connections_threshold`, uma vez que nenhum atraso foi imposto para essas tentativas.

Esta variável fornece um contador simples. Você pode obter informações mais detalhadas sobre o monitoramento do controle de conexão a partir da tabela `connection_control_failed_login_attempts` do Schema de Desempenho.

Atribuir um valor a `component_connection_control.failed_connections_threshold` em tempo de execução reinicia `Component_connection_control_delay_generated` para zero.

* `Component_connection_control_exempted_unknown_users` lista o número de conexões isentas por `component_connection_control.exempt_unknown_users`.

Quando o componente `component_connection_control` é instalado, ele verifica as tentativas de conexão e rastreia se elas falham ou são bem-sucedidas. Para esse propósito, uma tentativa de conexão falha é aquela para a qual o usuário e o host do cliente correspondem a uma conta MySQL conhecida, mas as credenciais fornecidas são incorretas ou não correspondem a nenhuma conta conhecida.

**Proxies.** O contagem de tentativas de conexão falhas é baseada na combinação de nome de usuário e nome de host (`user@host`) usada para cada tentativa de conexão. A determinação do nome de usuário e do nome de host aplicáveis leva em conta a proxy, conforme segue:

* Se o usuário cliente proxy outro usuário, a conta para contagem de conexões falhadas é do usuário que faz o proxy, e não do usuário proxyado. Por exemplo, se `external_user@example.com` proxy `proxy_user@example.com`, a contagem de conexões usa o usuário que faz o proxy, `external_user@example.com`, e não o usuário proxyado, `proxy_user@example.com`. Tanto `external_user@example.com` quanto `proxy_user@example.com` devem ter entradas válidas na tabela de sistema `mysql.user` e uma relação de proxy entre eles deve ser definida na tabela de sistema `mysql.proxies_priv` (veja a Seção 8.2.19, “Usuários Proxy”).

* Se o usuário cliente não proxy outro usuário, mas corresponder a uma entrada de `mysql.user`, a contagem usa o valor `CURRENT_USER()` correspondente a essa entrada. Por exemplo, se um usuário `user1` se conectando de um host `host1.example.com` corresponde a uma entrada `user1@host1.example.com`, a contagem usa `user1@host1.example.com`. Se o usuário corresponder a uma entrada `user1@%.example.com`, `user1@%.com`, ou `user1@%`, a contagem usa `user1@%.example.com`, `user1@%.com`, ou `user1@%`, respectivamente.

Para os casos descritos acima, a tentativa de conexão corresponde a alguma entrada de `mysql.user`, e se a solicitação é bem-sucedida ou falha depende se o cliente fornece as credenciais de autenticação corretas. Por exemplo, se o cliente apresentar uma senha incorreta, a tentativa de conexão falha.

Se a tentativa de conexão não corresponder a nenhuma entrada no `mysql.user`, a tentativa falha. Nesse caso, não há valor disponível para `CURRENT_USER()` e o contagem de falhas de conexão usa o nome do usuário fornecido pelo cliente e o host do cliente, conforme determinado pelo servidor MySQL. Por exemplo, se um cliente tenta se conectar como usuário `user2` a partir do host `host2.example.com`, a parte do nome do usuário está disponível na solicitação do cliente e o servidor determina as informações do host. A combinação de usuário/host usada para a contagem é `user2@host2.example.com`.

Nota

O servidor MySQL mantém informações sobre quais hosts de clientes podem se conectar ao servidor (essencialmente a união dos valores de host para entradas no `mysql.user`). Se um cliente tentar se conectar de qualquer outro host, o servidor rejeita a tentativa em uma fase inicial da configuração da conexão:

```
ERROR 1130 (HY000): Host 'host_name' is not
allowed to connect to this MySQL server
```

Esse tipo de rejeição ocorre antes que a autenticação por senha seja tentada; assim, o componente de Controle de Conexão não o vê e não é incluído na contagem exibida por `Component_connection_control_delay_generated` ou na tabela `performance_schema.connection_control_failed_login_attempts`.

**Monitoramento de falhas.** Você pode usar as seguintes fontes de informações para monitorar conexões falhas:

* `Component_connection_control_delay_generated`: Esta variável de status do servidor indica o número de vezes que o servidor adicionou um atraso à sua resposta a uma tentativa de conexão falha, não contando tentativas que ocorrem antes de atingir o limite determinado por `component_connection_control.failed_connections_threshold`.

* `connection_control_failed_login_attempts`: Esta tabela do Schema de Desempenho fornece o número atual de tentativas de conexão falhas consecutivas por conta de usuário do MySQL (ou seja, para cada combinação de usuário e host). Esse contagem inclui todas as tentativas falhas, independentemente de elas terem sido atrasadas.

Atribuir um valor a `component_connection_control.failed_connections_threshold` no momento da execução tem os efeitos listados aqui:

* Todos os contadores acumulados de tentativas de conexão falhas são zerados.

* `Component_connection_control_delay_generated` é zerado.

* A tabela `performance_schema.connection_control_failed_login_attempts` fica vazia.
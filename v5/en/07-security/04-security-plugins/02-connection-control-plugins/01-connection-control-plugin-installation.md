#### 6.4.2.1 Instalação do Plugin de Controle de Conexão

Esta seção descreve como instalar os Plugins de controle de conexão, `CONNECTION_CONTROL` e `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`. Para informações gerais sobre a instalação de Plugins, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins").

Para ser utilizável pelo Server, o arquivo da biblioteca do Plugin deve estar localizado no diretório de Plugins do MySQL (o diretório nomeado pela System Variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de Plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) durante o Server startup.

O nome base do arquivo da biblioteca do Plugin é `connection_control`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e semelhantes ao Unix, `.dll` para Windows).

Para carregar os Plugins no Server startup, use a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear o arquivo de biblioteca que os contém. Com este método de carregamento de Plugins, a opção deve ser fornecida toda vez que o Server iniciar. Por exemplo, insira estas linhas no arquivo `my.cnf` do Server, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
[mysqld]
plugin-load-add=connection_control.so
```

Após modificar `my.cnf`, reinicie o Server para que as novas configurações entrem em vigor.

Alternativamente, para carregar os Plugins em runtime, use estas declarações, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
INSTALL PLUGIN CONNECTION_CONTROL
  SONAME 'connection_control.so';
INSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS
  SONAME 'connection_control.so';
```

O [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o Plugin imediatamente e também o registra na tabela do sistema `mysql.plugins` para fazer com que o Server o carregue em cada Server startup normal subsequente, sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Para verificar a instalação do Plugin, examine a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema ou use a declaração [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Seção 5.5.2, “Obtendo Informações do Plugin do Servidor”](obtaining-plugin-information.html "5.5.2 Obtendo Informações do Plugin do Servidor")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'connection%';
+------------------------------------------+---------------+
| PLUGIN_NAME                              | PLUGIN_STATUS |
+------------------------------------------+---------------+
| CONNECTION_CONTROL                       | ACTIVE        |
| CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS | ACTIVE        |
+------------------------------------------+---------------+
```

Se um Plugin falhar ao inicializar, verifique o log de erros do Server em busca de mensagens de diagnóstico.

Se os Plugins foram previamente registrados com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") ou foram carregados com [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), você pode usar as opções `--connection-control` e `--connection-control-failed-login-attempts` no Server startup para controlar a ativação dos Plugins. Por exemplo, para carregar os Plugins na inicialização e evitar que sejam removidos em runtime, use estas opções:

```sql
[mysqld]
plugin-load-add=connection_control.so
connection-control=FORCE_PLUS_PERMANENT
connection-control-failed-login-attempts=FORCE_PLUS_PERMANENT
```

Se for desejado impedir que o Server seja executado sem um determinado Plugin de controle de conexão, use um valor de opção `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar a falha do Server startup caso o Plugin não inicialize com sucesso.

Nota

É possível instalar um Plugin sem o outro, mas ambos devem ser instalados para capacidade total de controle de conexão. Em particular, instalar apenas o Plugin `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` é de pouca utilidade, pois, sem o Plugin `CONNECTION_CONTROL` para fornecer os dados que preenchem a tabela [`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`](information-schema-connection-control-failed-login-attempts-table.html "24.6.2 The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table"), a tabela estará sempre vazia.

* [Configuração de Delay de Conexão](connection-control-plugin-installation.html#connection-control-plugin-delay-configuration "Configuração de Delay de Conexão")
* [Avaliação de Falha de Conexão](connection-control-plugin-installation.html#connection-control-plugin-failure-assessment "Avaliação de Falha de Conexão")
* [Monitoramento de Falha de Conexão](connection-control-plugin-installation.html#connection-control-plugin-failure-monitoring "Monitoramento de Falha de Conexão")

##### Configuração de Delay de Conexão

Para permitir a configuração de sua operação, o Plugin `CONNECTION_CONTROL` expõe estas System Variables:

* [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold): O número de tentativas de conexão consecutivas falhas permitidas para contas antes que o Server adicione um delay (atraso) para tentativas de conexão subsequentes. Para desabilitar a contagem de conexões falhas, defina [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) como zero.

* [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay): O delay mínimo em milissegundos para falhas de conexão acima do limite (threshold).

* [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay): O delay máximo em milissegundos para falhas de conexão acima do limite (threshold).

Se [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) for diferente de zero, a contagem de conexões falhas é habilitada e possui estas propriedades:

* O delay é zero até e incluindo [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) tentativas de conexão consecutivas falhas.

* Depois disso, o Server adiciona um delay crescente para as tentativas consecutivas subsequentes, até que ocorra uma conexão bem-sucedida. Os delays iniciais não ajustados começam em 1000 milissegundos (1 segundo) e aumentam em 1000 milissegundos por tentativa. Ou seja, uma vez que o delay é ativado para uma conta, os delays não ajustados para as tentativas falhas subsequentes são 1000 milissegundos, 2000 milissegundos, 3000 milissegundos e assim por diante.

* O delay real experimentado por um Client é o delay não ajustado, ajustado para se situar dentro dos valores das System Variables [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) e [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay), inclusive.

* Uma vez que o delay foi ativado para uma conta, a primeira conexão bem-sucedida subsequente dessa conta também experimenta um delay, mas a contagem de falhas é redefinida para conexões subsequentes.

Por exemplo, com o valor padrão de [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) sendo 3, não há delay para as três primeiras tentativas consecutivas de conexão falhas por uma conta. Os delays ajustados reais experimentados pela conta na quarta e nas tentativas de conexão falhas subsequentes dependem dos valores de [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) e [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay):

* Se [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) e [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) forem 1000 e 20000, os delays ajustados são os mesmos que os delays não ajustados, até um máximo de 20000 milissegundos. A quarta e as conexões falhas subsequentes são atrasadas em 1000 milissegundos, 2000 milissegundos, 3000 milissegundos e assim por diante.

* Se [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) e [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) forem 1500 e 20000, os delays ajustados para a quarta e as conexões falhas subsequentes são 1500 milissegundos, 2000 milissegundos, 3000 milissegundos e assim por diante, até um máximo de 20000 milissegundos.

* Se [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) e [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) forem 2000 e 3000, os delays ajustados para a quarta e as conexões falhas subsequentes são 2000 milissegundos, 2000 milissegundos e 3000 milissegundos, com todas as conexões falhas subsequentes também atrasadas em 3000 milissegundos.

Você pode definir as System Variables do `CONNECTION_CONTROL` no Server startup ou em runtime. Suponha que você queira permitir quatro tentativas consecutivas de conexão falhas antes que o Server comece a atrasar suas respostas, com um delay mínimo de 2000 milissegundos. Para definir as variáveis relevantes no Server startup, insira estas linhas no arquivo `my.cnf` do Server:

```sql
[mysqld]
plugin-load-add=connection_control.so
connection-control-failed-connections-threshold=4
connection-control-min-connection-delay=2000
```

Para definir as variáveis em runtime, use estas declarações:

```sql
SET GLOBAL connection_control_failed_connections_threshold = 4;
SET GLOBAL connection_control_min_connection_delay = 1500;
```

[`SET GLOBAL`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") define o valor para a instância MySQL em execução. Para tornar a alteração permanente, adicione uma linha no seu arquivo `my.cnf`, conforme mostrado anteriormente.

As System Variables [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) e [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) possuem valores mínimos e máximos de 1000 e 2147483647. Além disso, o intervalo permitido de valores de cada variável também depende do valor atual da outra:

* [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) não pode ser definido com um valor maior do que o valor atual de [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay).

* [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) não pode ser definido com um valor menor do que o valor atual de [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay).

Assim, para fazer as alterações exigidas para algumas configurações, pode ser necessário definir as variáveis em uma ordem específica. Suponha que os delays mínimo e máximo atuais sejam 1000 e 2000, e você deseja defini-los como 3000 e 5000. Você não pode definir primeiro [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) como 3000 porque isso é maior do que o valor atual de [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) de 2000. Em vez disso, defina [`connection_control_max_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay) como 5000 e, em seguida, defina [`connection_control_min_connection_delay`](connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay) como 3000.

##### Avaliação de Falha de Conexão

Quando o Plugin `CONNECTION_CONTROL` é instalado, ele verifica as tentativas de conexão e rastreia se elas falham ou são bem-sucedidas. Para este fim, uma tentativa de conexão falha é aquela em que o usuário Client e o host correspondem a uma conta MySQL conhecida, mas as credenciais fornecidas estão incorretas, ou não correspondem a nenhuma conta conhecida.

A contagem de conexões falhas baseia-se na combinação usuário/host para cada tentativa de conexão. A determinação do user name e host name aplicáveis leva em consideração o proxying (uso de proxy) e ocorre da seguinte forma:

* Se o usuário Client atua como proxy para outro usuário, a conta para a contagem de conexões falhas é o usuário proxying, não o usuário proxied. Por exemplo, se `external_user@example.com` atua como proxy para `proxy_user@example.com`, a contagem de conexões usa o usuário proxying, `external_user@example.com`, em vez do usuário proxied, `proxy_user@example.com`. Ambas as contas `external_user@example.com` e `proxy_user@example.com` devem ter entradas válidas na tabela do sistema `mysql.user` e um relacionamento de proxy entre elas deve ser definido na tabela do sistema `mysql.proxies_priv` (consulte [Seção 6.2.14, “Usuários Proxy”](proxy-users.html "6.2.14 Proxy Users")).

* Se o usuário Client não atua como proxy para outro usuário, mas corresponde a uma entrada `mysql.user`, a contagem usa o valor [`CURRENT_USER()`](information-functions.html#function_current-user) correspondente a essa entrada. Por exemplo, se um usuário `user1` conectando-se a partir de um host `host1.example.com` corresponde a uma entrada `user1@host1.example.com`, a contagem usa `user1@host1.example.com`. Se o usuário corresponder a uma entrada `user1@%.example.com`, `user1@%.com` ou `user1@%`, a contagem usará `user1@%.example.com`, `user1@%.com` ou `user1@%`, respectivamente.

Para os casos acabados de descrever, a tentativa de conexão corresponde a alguma entrada `mysql.user`, e o sucesso ou falha da solicitação depende se o Client fornece as credenciais de autenticação corretas. Por exemplo, se o Client apresentar uma senha incorreta, a tentativa de conexão falha.

Se a tentativa de conexão não corresponder a nenhuma entrada `mysql.user`, a tentativa falha. Neste caso, nenhum valor [`CURRENT_USER()`](information-functions.html#function_current-user) está disponível e a contagem de falhas de conexão usa o user name fornecido pelo Client e o Client host conforme determinado pelo Server. Por exemplo, se um Client tentar se conectar como usuário `user2` a partir do host `host2.example.com`, a parte do user name estará disponível na solicitação do Client e o Server determinará as informações do host. A combinação usuário/host usada para contagem é `user2@host2.example.com`.

Nota

O Server mantém informações sobre quais Client hosts podem se conectar ao Server (essencialmente a união dos valores de host para as entradas `mysql.user`). Se um Client tentar se conectar a partir de qualquer outro host, o Server rejeita a tentativa em um estágio inicial da configuração da conexão:

```sql
ERROR 1130 (HY000): Host 'host_name' is not
allowed to connect to this MySQL server
```

Como este tipo de rejeição ocorre tão cedo, o `CONNECTION_CONTROL` não a detecta e não a contabiliza.

##### Monitoramento de Falha de Conexão

Para monitorar conexões falhas, use estas fontes de informação:

* A Status Variable [`Connection_control_delay_generated`](connection-control-plugin-variables.html#statvar_Connection_control_delay_generated) indica o número de vezes que o Server adicionou um delay à sua resposta a uma tentativa de conexão falha. Isso não contabiliza as tentativas que ocorrem antes de atingir o limite (threshold) definido pela System Variable [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold).

* A tabela [`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`](information-schema-connection-control-failed-login-attempts-table.html "24.6.2 The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table") do `INFORMATION_SCHEMA` fornece informações sobre o número atual de tentativas consecutivas de conexão falhas por conta (combinação usuário/host). Isso contabiliza todas as tentativas falhas, independentemente de terem sido atrasadas.

A atribuição de um valor a [`connection_control_failed_connections_threshold`](connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold) em runtime tem estes efeitos:

* Todos os contadores acumulados de conexões falhas são redefinidos para zero.

* A Status Variable [`Connection_control_delay_generated`](connection-control-plugin-variables.html#statvar_Connection_control_delay_generated) é redefinida para zero.

* A tabela [`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`](information-schema-connection-control-failed-login-attempts-table.html "24.6.2 The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table") fica vazia.
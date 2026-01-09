#### 6.4.2.1 Instalação do Plugin de Controle de Conexão

Esta seção descreve como instalar os plugins de controle de conexão, `CONNECTION_CONTROL` e `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `connection_control`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para carregar os plugins na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que os contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=connection_control.so
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Como alternativa, para carregar os plugins em tempo de execução, use essas instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN CONNECTION_CONTROL
  SONAME 'connection_control.so';
INSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS
  SONAME 'connection_control.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

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

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico.

Se os plugins tiverem sido registrados anteriormente com `INSTALL PLUGIN` ou forem carregados com `--plugin-load-add`, você pode usar as opções `--connection-control` e `--connection-control-failed-login-attempts` no início do servidor para controlar a ativação dos plugins. Por exemplo, para carregar os plugins no início e impedir que sejam removidos durante a execução, use essas opções:

```
[mysqld]
plugin-load-add=connection_control.so
connection-control=FORCE_PLUS_PERMANENT
connection-control-failed-login-attempts=FORCE_PLUS_PERMANENT
```

Se quiser impedir que o servidor seja executado sem um plugin de controle de conexão específico, use um valor de opção de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o falhanço do início do servidor se o plugin não for inicializado com sucesso.

Nota

É possível instalar um plugin sem o outro, mas ambos devem ser instalados para ter capacidade completa de controle de conexão. Em particular, instalar apenas o plugin `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` é pouco útil, pois, sem o plugin `CONNECTION_CONTROL` para fornecer os dados que preenchem a tabela `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` (information-schema-connection-control-failed-login-attempts.html), a tabela sempre ficará vazia.

- Configuração de Retardo de Conexão
- Avaliação de Falha de Conexão
- Monitoramento de Falha de Conexão

##### Configuração de Retardo de Conexão

Para permitir a configuração de sua operação, o plugin `CONNECTION_CONTROL` expõe essas variáveis de sistema:

- `connection_control_failed_connections_threshold`: O número de tentativas consecutivas de conexão falhas permitidas para contas antes que o servidor adicione um atraso para tentativas de conexão subsequentes. Para desabilitar o contagem de conexões falhas, defina `connection_control_failed_connections_threshold` para zero.

- `connection_control_min_connection_delay`: O atraso mínimo em milissegundos para falhas de conexão acima do limite.

- `connection_control_max_connection_delay`: O atraso máximo em milissegundos para falhas de conexão acima do limite.

Se `connection_control_failed_connections_threshold` for diferente de zero, o contagem de conexões falhas está habilitada e tem as seguintes propriedades:

- O atraso é de zero até as tentativas de conexão falhas consecutivas até o limite de `connection_control_failed_connections_threshold`.

- Em seguida, o servidor adiciona um atraso crescente para tentativas consecutivas subsequentes, até que uma conexão bem-sucedida ocorra. Os atrasos iniciais não ajustados começam em 1000 milissegundos (1 segundo) e aumentam em 1000 milissegundos por tentativa. Ou seja, uma vez que o atraso foi ativado para uma conta, os atrasos não ajustados para tentativas subsequentes não bem-sucedidas são de 1000 milissegundos, 2000 milissegundos, 3000 milissegundos e assim por diante.

- O atraso real experimentado por um cliente é o atraso não ajustado, ajustado para ficar dentro dos valores das variáveis de sistema `connection_control_min_connection_delay` e `connection_control_max_connection_delay`, inclusive.

- Uma vez que o atraso tenha sido ativado para uma conta, a primeira conexão bem-sucedida subsequente pela conta também experimenta um atraso, mas o contagem de falhas é redefinida para conexões subsequentes.

Por exemplo, com o valor padrão de `connection_control_failed_connections_threshold` de 3, não há atraso para as três primeiras tentativas consecutivas de conexão falhadas por uma conta. Os atrasos ajustados reais experimentados pela conta para as quatro conexões falhas subsequentes dependem dos valores de `connection_control_min_connection_delay` e `connection_control_max_connection_delay`:

- Se `connection_control_min_connection_delay` e [`connection_control_max_connection_delay`]\(connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay] forem 1000 e 20000, os atrasos ajustados serão os mesmos dos atrasos não ajustados, até um máximo de 20000 milissegundos. As quatro e subsequentes conexões falhas serão atrasadas por 1000 milissegundos, 2000 milissegundos, 3000 milissegundos e assim por diante.

- Se `connection_control_min_connection_delay` e `connection_control_max_connection_delay` forem 1500 e 20000, os atrasos ajustados para as quatro e subsequentes conexões falhas serão de 1500 milissegundos, 2000 milissegundos, 3000 milissegundos e assim por diante, até um máximo de 20000 milissegundos.

- Se `connection_control_min_connection_delay` e [`connection_control_max_connection_delay`]\(connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay] forem 2000 e 3000, os atrasos ajustados para a quarta e conexões subsequentes falhas serão de 2000 milissegundos, 2000 milissegundos e 3000 milissegundos, com todas as conexões subsequentes falhas também atrasadas por 3000 milissegundos.

Você pode definir as variáveis de sistema `CONNECTION_CONTROL` no início ou durante o funcionamento do servidor. Suponha que você queira permitir quatro tentativas consecutivas de conexão falhas antes que o servidor comece a atrasar suas respostas, com um atraso mínimo de 2000 milissegundos. Para definir as variáveis relevantes no início do servidor, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
plugin-load-add=connection_control.so
connection-control-failed-connections-threshold=4
connection-control-min-connection-delay=2000
```

Para definir as variáveis em tempo de execução, use essas instruções:

```sql
SET GLOBAL connection_control_failed_connections_threshold = 4;
SET GLOBAL connection_control_min_connection_delay = 1500;
```

`SET GLOBAL` define o valor para a instância do MySQL em execução. Para fazer a alteração permanente, adicione uma linha no seu arquivo `my.cnf`, conforme mostrado anteriormente.

As variáveis de sistema `connection_control_min_connection_delay` e `connection_control_max_connection_delay` têm valores mínimos e máximos de 1000 e 2147483647, respectivamente. Além disso, a faixa permitida de valores de cada variável também depende do valor atual da outra:

- `connection_control_min_connection_delay` não pode ser definido maior que o valor atual de `connection_control_max_connection_delay`.

- `connection_control_max_connection_delay` não pode ser definido para menos do que o valor atual de `connection_control_min_connection_delay`.

Assim, para fazer as alterações necessárias para algumas configurações, você pode precisar definir as variáveis em uma ordem específica. Suponha que os atrasos mínimos e máximos atuais sejam 1000 e 2000, e que você queira defini-los para 3000 e 5000. Você não pode primeiro definir `connection_control_min_connection_delay` para 3000 porque isso é maior que o valor atual de `connection_control_max_connection_delay` de 2000. Em vez disso, defina `connection_control_max_connection_delay` para 5000, depois defina `connection_control_min_connection_delay` para 3000.

##### Avaliação de Falha de Conexão

Quando o plugin `CONNECTION_CONTROL` é instalado, ele verifica as tentativas de conexão e registra se elas falham ou têm sucesso. Para isso, uma tentativa de conexão falha é aquela em que o usuário e o host do cliente correspondem a uma conta MySQL conhecida, mas as credenciais fornecidas estão incorretas ou não correspondem a nenhuma conta conhecida.

O contagem de conexões falhas é baseada na combinação de usuário/host para cada tentativa de conexão. A determinação do nome de usuário e do nome do host aplicáveis leva em conta o encaminhamento e ocorre da seguinte forma:

- Se o usuário cliente proxy outro usuário, a conta para contagem de conexões falhas é do usuário que está fazendo a proxy, e não do usuário proxy. Por exemplo, se `external_user@example.com` proxy `proxy_user@example.com`, a contagem de conexões usa o usuário que está fazendo a proxy, `external_user@example.com`, e não o usuário proxy, `proxy_user@example.com`. Tanto `external_user@example.com` quanto `proxy_user@example.com` devem ter entradas válidas na tabela de sistema `mysql.user` e uma relação de proxy entre eles deve ser definida na tabela de sistema `mysql.proxies_priv` (veja Seção 6.2.14, “Usuários Proxy”).

- Se o usuário cliente não proxy outro usuário, mas corresponder a uma entrada de `mysql.user`, o contagem usa o valor de `CURRENT_USER()` correspondente a essa entrada. Por exemplo, se um usuário `user1` se conectar de um host `host1.example.com` e corresponder a uma entrada `user1@host1.example.com`, a contagem usa `user1@host1.example.com`. Se o usuário corresponder a uma entrada `user1@%.example.com`, `user1@%.com` ou `user1@%`, a contagem usa `user1@%.example.com`, `user1@%.com` ou `user1@%`, respectivamente.

Nos casos descritos acima, a tentativa de conexão corresponde a uma entrada no registro `mysql.user`. O sucesso ou fracasso da solicitação depende se o cliente fornece as credenciais de autenticação corretas. Por exemplo, se o cliente apresentar uma senha incorreta, a tentativa de conexão falhará.

Se a tentativa de conexão não corresponder a nenhuma entrada no `mysql.user`, a tentativa falha. Nesse caso, não há valor disponível para `CURRENT_USER()` e o contagem de falhas de conexão usa o nome do usuário fornecido pelo cliente e o host do cliente, conforme determinado pelo servidor. Por exemplo, se um cliente tenta se conectar como usuário `user2` a partir do host `host2.example.com`, a parte do nome de usuário está disponível na solicitação do cliente e o servidor determina as informações do host. A combinação de usuário/host usada para a contagem é `user2@host2.example.com`.

Nota

O servidor mantém informações sobre quais hosts do cliente podem se conectar ao servidor (essencialmente a união dos valores de host das entradas `mysql.user`). Se um cliente tentar se conectar de qualquer outro host, o servidor rejeita a tentativa em uma fase inicial da configuração da conexão:

```
ERROR 1130 (HY000): Host 'host_name' is not
allowed to connect to this MySQL server
```

Como esse tipo de rejeição ocorre tão cedo, o `CONNECTION_CONTROL` não a vê e não a contabiliza.

##### Monitoramento de Falha de Conexão

Para monitorar conexões falhas, use essas fontes de informações:

- A variável de status `Connection_control_delay_generated` indica o número de vezes que o servidor adicionou um atraso à sua resposta a uma tentativa de conexão falha. Isso não conta tentativas que ocorrem antes de atingir o limite definido pela variável de sistema `connection_control_failed_connections_threshold`.

- A tabela `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` fornece informações sobre o número atual de tentativas de conexão falhas consecutivas por conta (combinação de usuário/host). Isso conta todas as tentativas falhas, independentemente de elas terem sido adiadas ou

Atribuir um valor a `connection_control_failed_connections_threshold` em tempo de execução tem esses efeitos:

- Todos os contadores acumulados de conexões falhas são zerados.

- A variável de status `Connection_control_delay_generated` é zerada.

- A tabela `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` fica vazia.

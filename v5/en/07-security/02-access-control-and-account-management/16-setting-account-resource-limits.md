### 6.2.16 Configurando Limites de Recurso da Conta

Uma forma de restringir o uso de recursos do servidor MySQL pelo cliente é definir a variável de sistema global [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) para um valor diferente de zero. Isso limita o número de conexões simultâneas que podem ser feitas por qualquer conta específica, mas não impõe limites sobre o que um cliente pode fazer uma vez conectado. Além disso, definir [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) não permite o gerenciamento de contas individuais. Ambos os tipos de controle são de interesse para administradores MySQL.

Para atender a essas preocupações, o MySQL permite limites para contas individuais no uso destes recursos do servidor:

* O número de Queries que uma conta pode emitir por hora
* O número de Updates que uma conta pode emitir por hora
* O número de vezes que uma conta pode se conectar ao servidor por hora
* O número de conexões simultâneas ao servidor por uma conta

Qualquer instrução que um cliente possa emitir conta para o limite de Query, a menos que seus resultados sejam servidos a partir do `query cache`. Somente instruções que modificam Databases ou tabelas contam para o limite de Update.

Uma “conta” neste contexto corresponde a uma linha na tabela de sistema `mysql.user`. Ou seja, uma conexão é avaliada em relação aos valores de `User` e `Host` na linha da tabela `user` que se aplica à conexão. Por exemplo, uma conta `'usera'@'%.example.com'` corresponde a uma linha na tabela `user` que possui valores `User` e `Host` de `usera` e `%.example.com`, para permitir que `usera` se conecte a partir de qualquer host no domínio `example.com`. Neste caso, o servidor aplica os limites de recurso nesta linha coletivamente a todas as conexões feitas por `usera` a partir de qualquer host no domínio `example.com`, pois todas essas conexões usam a mesma conta.

Antes do MySQL 5.0, uma “conta” era avaliada em relação ao host real de onde um usuário se conectava. Este método mais antigo de contabilidade pode ser selecionado iniciando o servidor com a opção [`--old-style-user-limits`](server-options.html#option_mysqld_old-style-user-limits). Neste caso, se `usera` se conectar simultaneamente a partir de `host1.example.com` e `host2.example.com`, o servidor aplica os limites de recurso da conta separadamente a cada conexão. Se `usera` se conectar novamente a partir de `host1.example.com`, o servidor aplicará os limites para essa conexão juntamente com a conexão existente a partir desse host.

Para estabelecer limites de recurso para uma conta no momento de criação da conta, use a instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"). Para modificar os limites de uma conta existente, use [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Forneça uma cláusula `WITH` que nomeie cada recurso a ser limitado. O valor padrão para cada limite é zero (sem limite). Por exemplo, para criar uma nova conta que pode acessar o Database `customer`, mas apenas de forma limitada, emita estas instruções:

```sql
mysql> CREATE USER 'francis'@'localhost' IDENTIFIED BY 'frank'
    ->     WITH MAX_QUERIES_PER_HOUR 20
    ->          MAX_UPDATES_PER_HOUR 10
    ->          MAX_CONNECTIONS_PER_HOUR 5
    ->          MAX_USER_CONNECTIONS 2;
```

Os tipos de limite não precisam ser todos nomeados na cláusula `WITH`, mas aqueles nomeados podem estar presentes em qualquer ordem. O valor para cada limite por hora deve ser um inteiro que representa uma contagem por hora. Para `MAX_USER_CONNECTIONS`, o limite é um inteiro que representa o número máximo de conexões simultâneas pela conta. Se este limite for definido como zero, o valor da variável de sistema global [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) determina o número de conexões simultâneas. Se [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) também for zero, não há limite para a conta.

Para modificar limites de uma conta existente, use uma instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). A instrução a seguir altera o limite de Query para `francis` para 100:

```sql
mysql> ALTER USER 'francis'@'localhost' WITH MAX_QUERIES_PER_HOUR 100;
```

A instrução modifica apenas o valor do limite especificado e mantém a conta inalterada em outros aspectos.

Para remover um limite, defina seu valor como zero. Por exemplo, para remover o limite de quantas vezes por hora `francis` pode se conectar, use esta instrução:

```sql
mysql> ALTER USER 'francis'@'localhost' WITH MAX_CONNECTIONS_PER_HOUR 0;
```

Conforme mencionado anteriormente, o limite de conexão simultânea para uma conta é determinado a partir do limite `MAX_USER_CONNECTIONS` e da variável de sistema [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections). Suponha que o valor global de [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) seja 10 e três contas tenham limites de recurso individuais especificados da seguinte forma:

```sql
ALTER USER 'user1'@'localhost' WITH MAX_USER_CONNECTIONS 0;
ALTER USER 'user2'@'localhost' WITH MAX_USER_CONNECTIONS 5;
ALTER USER 'user3'@'localhost' WITH MAX_USER_CONNECTIONS 20;
```

`user1` tem um limite de conexão de 10 (o valor global de [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections)) porque tem um limite `MAX_USER_CONNECTIONS` de zero. `user2` e `user3` têm limites de conexão de 5 e 20, respectivamente, porque possuem limites `MAX_USER_CONNECTIONS` diferentes de zero.

O servidor armazena limites de recurso para uma conta na linha da tabela `user` correspondente à conta. As colunas `max_questions`, `max_updates` e `max_connections` armazenam os limites por hora, e a coluna `max_user_connections` armazena o limite `MAX_USER_CONNECTIONS`. (Veja [Seção 6.2.3, “Tabelas de Concessão”](grant-tables.html "6.2.3 Grant Tables").)

A contagem de uso de recursos ocorre quando qualquer conta tem um limite diferente de zero definido para o uso de qualquer um dos recursos.

Enquanto o servidor está em execução, ele conta o número de vezes que cada conta usa recursos. Se uma conta atingir seu limite no número de conexões dentro da última hora, o servidor rejeita outras conexões para a conta até que essa hora termine. Da mesma forma, se a conta atingir seu limite no número de Queries ou Updates, o servidor rejeita outras Queries ou Updates até que a hora termine. Em todos esses casos, o servidor emite mensagens de erro apropriadas.

A contagem de recursos ocorre por conta, não por cliente. Por exemplo, se sua conta tiver um limite de Query de 50, você não pode aumentar seu limite para 100 fazendo duas conexões de cliente simultâneas ao servidor. Queries emitidas em ambas as conexões são contadas em conjunto.

As contagens atuais de uso de recursos por hora podem ser redefinidas globalmente para todas as contas, ou individualmente para uma determinada conta:

* Para redefinir as contagens atuais para zero para todas as contas, emita uma instrução [`FLUSH USER_RESOURCES`](flush.html#flush-user-resources). As contagens também podem ser redefinidas recarregando as tabelas de concessão (por exemplo, com uma instrução [`FLUSH PRIVILEGES`](flush.html#flush-privileges) ou um comando [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program")).

* As contagens de uma conta individual podem ser redefinidas para zero, definindo novamente qualquer um dos seus limites. Especifique um valor limite igual ao valor atualmente atribuído à conta.

As redefinições de contador por hora não afetam o limite `MAX_USER_CONNECTIONS`.

Todas as contagens começam em zero quando o servidor inicia. As contagens não são transferidas após reinicializações do servidor.

Para o limite `MAX_USER_CONNECTIONS`, pode ocorrer um caso de borda (edge case) se a conta tiver atualmente aberto o número máximo de conexões permitidas: Uma desconexão seguida rapidamente por uma conexão pode resultar em um erro ([`ER_TOO_MANY_USER_CONNECTIONS`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_too_many_user_connections) ou [`ER_USER_LIMIT_REACHED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_user_limit_reached)) se o servidor não tiver processado totalmente a desconexão no momento em que a conexão ocorre. Quando o servidor conclui o processamento da desconexão, outra conexão é novamente permitida.
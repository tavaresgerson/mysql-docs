### 8.2.21 Definindo Limites de Recursos da Conta

Uma maneira de restringir o uso dos recursos do servidor MySQL pelo cliente é definir a variável de sistema `max_user_connections` global para um valor não nulo. Isso limita o número de conexões simultâneas que podem ser feitas por qualquer conta, mas não coloca limites sobre o que um cliente pode fazer uma vez conectado. Além disso, definir `max_user_connections` não habilita a gestão de contas individuais. Ambos os tipos de controle são de interesse para os administradores do MySQL.

Para abordar essas preocupações, o MySQL permite limites para contas individuais no uso desses recursos do servidor:

* O número de consultas que uma conta pode emitir por hora
* O número de atualizações que uma conta pode emitir por hora
* O número de vezes que uma conta pode se conectar ao servidor por hora

* O número de conexões simultâneas ao servidor por uma conta

Qualquer declaração que um cliente pode emitir conta para o limite de consultas. Apenas declarações que modificam bancos de dados ou tabelas contam para o limite de atualização.

Uma “conta” neste contexto corresponde a uma linha na tabela de sistema `mysql.user`. Ou seja, uma conexão é avaliada com base nos valores `User` e `Host` na linha da tabela `user` que se aplica à conexão. Por exemplo, uma conta `'usera'@'%.example.com'` corresponde a uma linha na tabela `user` que tem os valores `User` e `Host` de `usera` e `%.example.com`, para permitir que `usera` se conecte de qualquer host no domínio `example.com`. Neste caso, o servidor aplica os limites de recursos nesta linha coletivamente a todas as conexões de `usera` de qualquer host no domínio `example.com`, porque todas essas conexões usam a mesma conta.

Para estabelecer limites de recursos para uma conta no momento da criação da conta, use a instrução `CREATE USER`. Para modificar os limites de uma conta existente, use `ALTER USER`. Forneça uma cláusula `WITH` que nomeie cada recurso a ser limitado. O valor padrão para cada limite é zero (sem limite). Por exemplo, para criar uma nova conta que possa acessar o banco de dados `customer`, mas apenas de forma limitada, execute essas instruções:

```
mysql> CREATE USER 'francis'@'localhost' IDENTIFIED BY 'frank'
    ->     WITH MAX_QUERIES_PER_HOUR 20
    ->          MAX_UPDATES_PER_HOUR 10
    ->          MAX_CONNECTIONS_PER_HOUR 5
    ->          MAX_USER_CONNECTIONS 2;
```

Os tipos de limite não precisam de todos serem nomeados na cláusula `WITH`, mas aqueles nomeados podem estar presentes em qualquer ordem. O valor para cada limite por hora deve ser um inteiro representando um número por hora. Para `MAX_USER_CONNECTIONS`, o limite é um inteiro representando o número máximo de conexões simultâneas pela conta. Se este limite for definido como zero, o valor da variável de sistema `max_user_connections` global determina o número de conexões simultâneas. Se `max_user_connections` também for zero, não há limite para a conta.

Para modificar os limites de uma conta existente, use uma instrução `ALTER USER`. A seguinte instrução altera o limite de consulta para `francis` para 100:

```
mysql> ALTER USER 'francis'@'localhost' WITH MAX_QUERIES_PER_HOUR 100;
```

A instrução modifica apenas o valor do limite especificado e deixa a conta de outra forma inalterada.

Para remover um limite, defina seu valor para zero. Por exemplo, para remover o limite de quantas vezes por hora `francis` pode se conectar, use esta instrução:

```
mysql> ALTER USER 'francis'@'localhost' WITH MAX_CONNECTIONS_PER_HOUR 0;
```

Como mencionado anteriormente, o limite de conexões simultâneas para uma conta é determinado pelo limite `MAX_USER_CONNECTIONS` e pela variável de sistema `max_user_connections`. Suponha que o valor global de `max_user_connections` seja 10 e três contas tenham limites de recursos individuais especificados da seguinte forma:

```
ALTER USER 'user1'@'localhost' WITH MAX_USER_CONNECTIONS 0;
ALTER USER 'user2'@'localhost' WITH MAX_USER_CONNECTIONS 5;
ALTER USER 'user3'@'localhost' WITH MAX_USER_CONNECTIONS 20;
```

`user1` tem um limite de conexão de 10 (o valor global `max_user_connections`) porque tem um limite `MAX_USER_CONNECTIONS` de zero. `user2` e `user3` têm limites de conexão de 5 e 20, respectivamente, porque têm limites `MAX_USER_CONNECTIONS` não nulos.

O servidor armazena limites de recursos para uma conta na linha da tabela `user` correspondente à conta. As colunas `max_questions`, `max_updates` e `max_connections` armazenam os limites por hora, e a coluna `max_user_connections` armazena o limite `MAX_USER_CONNECTIONS`. (Veja a Seção 8.2.3, “Tabelas de Concessão”.)

A contagem de uso de recursos ocorre quando qualquer conta tiver um limite não nulo colocado em seu uso de qualquer um dos recursos.

À medida que o servidor é executado, ele conta o número de vezes que cada conta usa os recursos. Se uma conta atingir seu limite de número de conexões na última hora, o servidor rejeita mais conexões para a conta até que a hora termine. Da mesma forma, se a conta atingir seu limite de número de consultas ou atualizações, o servidor rejeita mais consultas ou atualizações até que a hora termine. Em todos esses casos, o servidor emite mensagens de erro apropriadas.

A contagem de recursos ocorre por conta, não por cliente. Por exemplo, se sua conta tiver um limite de consulta de 50, você não pode aumentar seu limite para 100 fazendo duas conexões simultâneas de cliente ao servidor. As consultas emitidas em ambas as conexões são contadas juntas.

Os atuais contos de uso de recursos por hora podem ser redefinidos globalmente para todas as contas, ou individualmente para uma conta específica:

* Para redefinir os contos atuais para zero para todas as contas, execute uma declaração `FLUSH USER_RESOURCES`. Os contos também podem ser redefinidos recarregando as tabelas de concessão (por exemplo, com uma declaração `FLUSH PRIVILEGES` ou um comando **mysqladmin reload**).

* Os contagem de uma conta individual podem ser zerados definindo novamente qualquer um de seus limites. Especifique um valor de limite igual ao valor atualmente atribuído à conta.

Os reajustes dos contadores por hora não afetam o limite `MAX_USER_CONNECTIONS`.

Todas as contagens começam em zero quando o servidor é iniciado. As contagens não são transferidas durante reinicializações do servidor.

Para o limite `MAX_USER_CONNECTIONS`, pode ocorrer um caso de borda se a conta tiver o número máximo de conexões atualmente permitidas: uma desconexão seguida rapidamente por uma conexão pode resultar em um erro (`ER_TOO_MANY_USER_CONNECTIONS` ou `ER_USER_LIMIT_REACHED`) se o servidor não tiver processado completamente a desconexão até o momento da conexão. Quando o servidor terminar de processar a desconexão, outra conexão será permitida novamente.
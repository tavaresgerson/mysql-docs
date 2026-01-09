#### 8.4.8.1 O Plugin do Firewall Empresarial do MySQL

Esta seção contém informações sobre o plugin do Firewall Empresarial do MySQL.

Importante

O plugin do firewall é desatualizado em favor de um componente de firewall que implementa a maioria das mesmas funcionalidades, mas utiliza a arquitetura de componente superior. Para informações gerais sobre o componente de firewall, consulte a Seção 8.4.8.2, “O Componente do Firewall Empresarial do MySQL”; para informações sobre a atualização do plugin do firewall para o componente de firewall (recomendado), consulte Atualizando para o Componente do Firewall Empresarial do MySQL.

##### 8.4.8.1.1 Elementos do Firewall Empresarial do MySQL (Plugin)

O Firewall Empresarial do MySQL é baseado em uma biblioteca de plugins que inclui esses elementos:

* Um plugin do lado do servidor chamado `MYSQL_FIREWALL` examina as instruções SQL antes de serem executadas e, com base nos perfis de firewall registrados, toma uma decisão sobre a execução ou rejeição de cada instrução.

* O plugin `MYSQL_FIREWALL`, juntamente com os plugins do lado do servidor chamados `MYSQL_FIREWALL_USERS` e `MYSQL_FIREWALL_WHITELIST`, implementa as tabelas do Schema de Desempenho e do Schema de Informações que fornecem visões sobre os perfis registrados.

* Os perfis são armazenados em cache na memória para melhor desempenho. As tabelas no banco de dados do firewall fornecem armazenamento de suporte de dados do firewall para a persistência dos perfis após reinicializações do servidor. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` (o padrão) ou um esquema personalizado (consulte Instalando o Plugin do Firewall Empresarial do MySQL).

* Os procedimentos armazenados realizam tarefas como registrar perfis de firewall, estabelecer seus modos operacionais e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente.

* As funções administrativas fornecem uma API para tarefas de nível mais baixo, como sincronizar o cache com o armazenamento persistente.

* As variáveis de sistema e as variáveis de status específicas do plugin do firewall permitem a configuração do firewall e fornecem informações operacionais em tempo real, respectivamente.

* O privilégio `FIREWALL_ADMIN` permite que os usuários administrem as regras do firewall para qualquer usuário; `FIREWALL_USER` (desatualizado) permite que os usuários administrem suas próprias regras de firewall.

**Observação**

O privilégio `FIREWALL_USER` não é suportado pelo componente MySQL Enterprise Firewall.

* O privilégio `FIREWALL_EXEMPT` isenta um usuário das restrições do firewall. Isso é útil, por exemplo, para qualquer administrador de banco de dados que configure o firewall, para evitar a possibilidade de uma configuração incorreta que até mesmo o administrador seja bloqueado e incapaz de executar instruções.

##### 8.4.8.1.2 Instalação ou Desinstalação do Plugin do Firewall do MySQL Enterprise

A instalação do plugin do firewall do MySQL Enterprise é uma operação única que instala os elementos descritos na Seção 8.4.8.1.1, “Elementos do Firewall do MySQL Enterprise (Plugin”)”). A instalação pode ser realizada usando uma interface gráfica ou manualmente:

* No Windows, o MySQL Configurator inclui uma opção para habilitar o MySQL Enterprise Firewall para você.

* O MySQL Workbench 6.3.4 ou superior pode instalar o plugin do MySQL Enterprise Firewall, habilitar ou desabilitar um firewall instalado ou desinstalar o firewall.

* A instalação manual do MySQL Enterprise Firewall envolve a execução de um script localizado no diretório `share` da sua instalação do MySQL.

**Importante**

Leia toda esta seção antes de seguir suas instruções. Parte do procedimento difere dependendo do seu ambiente.

**Observação**

Se instalado, o plugin do firewall do MySQL Enterprise envolve um overhead mínimo mesmo quando desativado. Para evitar esse overhead, não instale o plugin a menos que planeje usá-lo.

Para instruções de uso, consulte a Seção 8.4.8.1.3, “Usando o Plugin do Firewall Empresarial do MySQL”. Para informações de referência, consulte a Seção 8.4.8.1.4, “Referência do Plugin do Firewall Empresarial do MySQL”.

* Instalando o Plugin do Firewall Empresarial do MySQL
* Desinstalando o Plugin do Firewall Empresarial do MySQL

###### Instalando o Plugin do Firewall Empresarial do MySQL

Se o plugin do Firewall Empresarial do MySQL de uma versão mais antiga do MySQL já estiver instalado, desinstale-o usando as instruções fornecidas mais adiante nesta seção, e reinicie o servidor antes de instalar a versão atual. Neste caso, também é necessário registrar novamente a configuração.

No Windows, você pode usar a Seção 2.3.2, “Configuração: Usando o Configuratore do MySQL”, para instalar o plugin do Firewall Empresarial do MySQL, marcando a caixa Habilitar Firewall Empresarial do MySQL na guia “Tipo e Rede”. (A porta de firewall aberta para acesso à rede tem um propósito diferente. Refere-se ao Firewall do Windows e controla se o Windows bloqueia a porta TCP/IP na qual o servidor MySQL escuta as conexões dos clientes.)

Para instalar o plugin do firewall manualmente, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma entre os listados aqui:

* `win_install_firewall.sql`
* `linux_install_firewall.sql`

O script de instalação cria procedimentos e tabelas armazenadas no banco de dados do firewall que você especificar ao executar o script. O banco de dados do sistema `mysql` é o local padrão, mas recomendamos que você crie e use um esquema personalizado especificamente para este propósito.

Para usar o banco de dados do sistema `mysql`, execute o script da seguinte forma a partir da linha de comando. O exemplo aqui usa o script de instalação do Linux. Faça as substituições apropriadas para o seu sistema.

```
$> mysql -u root -p -D mysql < linux_install_firewall.sql
Enter password: (enter root password here)
```

Para criar e usar um esquema personalizado com o script, faça o seguinte:

1. Inicie o servidor com a opção `--loose-mysql-firewall-database=database-name`. Insira o nome do esquema personalizado a ser usado como banco de dados de firewall.

O prefixo da opção com `--loose` faz com que o servidor emita uma mensagem de aviso em vez de terminar com um erro devido à ausência (por enquanto) de tal banco de dados.

2. Inicie o programa cliente MySQL e crie o esquema personalizado no servidor, da seguinte forma:

```
   mysql> CREATE DATABASE IF NOT EXISTS database-name;
   ```

3. Execute o script de instalação, especificando pelo nome o esquema personalizado recém-criado como banco de dados de firewall:

```
   $> mysql -u root -p -D database-name < linux_install_firewall.sql
   Enter password: (enter root password here)
   ```

Instalar o MySQL Enterprise Firewall, seja usando uma interface gráfica ou manualmente, deve habilitar o firewall. Para verificar isso, conecte-se ao servidor e execute a instrução mostrada aqui:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

Se o plugin não conseguir inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Observação

Para usar o plugin MySQL Enterprise Firewall no contexto da replicação de origem/replica, Replicação em Grupo ou InnoDB Cluster, você deve preparar quaisquer nós de replicação antes de executar o script de instalação no nó de origem. Isso é necessário porque as instruções `INSTALL PLUGIN` no script não são replicadas.

1. Em cada nó de replica, extraia as instruções `INSTALL PLUGIN` do script de instalação e execute-as manualmente.

2. No nó de origem, execute o script de instalação apropriado para a sua plataforma, conforme descrito anteriormente.

###### Desinstalando o Plugin MySQL Enterprise Firewall

O plugin do Firewall Empresarial do MySQL pode ser desinstalado usando o MySQL Workbench ou manualmente.

Para desinstalar o plugin do Firewall Empresarial do MySQL usando o MySQL Workbench 6.3.4 ou versões posteriores, consulte a Interface do Firewall Empresarial do MySQL, no Capítulo 33, *MySQL Workbench*.

Para desinstalar o plugin do firewall da linha de comando, execute o script de desinstalação localizado no diretório `share` da sua instalação do MySQL. Este exemplo especifica `mysql` como a base de dados do firewall:

```
$> mysql -u root -p -D mysql < uninstall_firewall.sql
Enter password: (enter root password here)
```

Se você criou um esquema personalizado ao instalar o plugin do firewall, execute o script de desinstalação conforme mostrado aqui, substituindo o nome do esquema por ``database-name``:

```
$> mysql -u root -p -D database-name < uninstall_firewall.sql
Enter password: (enter root password here)
```

`uninstall_firewall.sql` remove todos os plugins, tabelas, funções e procedimentos armazenados associados ao plugin do Firewall Empresarial do MySQL.

##### 8.4.8.1.3 Usando o Plugin do Firewall Empresarial do MySQL

Antes de usar o plugin do Firewall Empresarial do MySQL, instale-o de acordo com as instruções fornecidas na Seção 8.4.8.1.2, “Instalando ou Desinstalando o Plugin do Firewall Empresarial do MySQL”.

Esta seção descreve como configurar o plugin do firewall usando instruções SQL. Alternativamente, o MySQL Workbench 6.3.4 e versões posteriores fornecem uma interface gráfica para o controle do firewall. Consulte a Interface do Firewall Empresarial do MySQL.

* Habilitar ou Desabilitar o Plugin do Firewall
* Agendar Recargas do Cache do Firewall
* Atribuir Privilegios de Firewall (Plugin)")
* Conceitos do Firewall
* Registrar Perfis de Grupo do Firewall
* Registrar Perfis de Conta do Firewall
* Monitorar o Firewall
* Migrar Perfis de Conta para Perfis de Grupo

Para habilitar ou desabilitar o plugin do firewall, defina a variável de sistema `mysql_firewall_mode`. Por padrão, ela está configurada como `ON` quando o plugin do firewall é instalado. Para definir o estado inicial do firewall explicitamente na inicialização do servidor, você pode definir a variável em um arquivo de opções, como `my.cnf`, da seguinte forma:

```
[mysqld]
mysql_firewall_mode=ON
```

Após modificar `my.cnf`, reinicie o servidor para que o novo ajuste entre em vigor. Consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”, para obter mais informações.

Alternativamente, para definir e persistir o ajuste do firewall em tempo de execução, execute as instruções SQL mostradas aqui:

```
SET PERSIST mysql_firewall_mode = OFF;
SET PERSIST mysql_firewall_mode = ON;
```

`SET PERSIST` define um valor para a instância MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

###### Agendamento de Recargas do Cache do Firewall

Cada vez que o plugin do lado do servidor `MYSQL_FIREWALL` é inicializado, ele carrega dados para seu cache interno das tabelas listadas aqui:

* `firewall_whitelist`
* `firewall_group_allowlist`
* `firewall_users`
* `firewall_groups`
* `firewall_membership`

Sem reiniciar o servidor ou reinstalar o plugin do lado do servidor, a modificação de dados fora do plugin não é refletida internamente. A variável de sistema `mysql_firewall_reload_interval_seconds` permite forçar recargas do cache de memória das tabelas em intervalos especificados. Por padrão, o valor do intervalo é `0`, o que desabilita tais recargas.

Para agendar reposições regulares do cache, primeiro certifique-se de que o componente `scheduler` está instalado e habilitado (consulte a Seção 7.5.5, “Componente Scheduler”). Para verificar o status do componente, execute a seguinte instrução `SHOW VARIABLES`:

```
SHOW VARIABLES LIKE 'component_scheduler%';
+-----------------------------+-------+
| Variable_name               | Value |
+-----------------------------+-------|
| component_scheduler.enabled | On    |
+-----------------------------+-------+
```

Com o plugin de firewall instalado, defina `mysql_firewall_reload_interval_seconds` no início do servidor para um número entre 60 e `INT_MAX`, cujo valor é específico da plataforma. Valores na faixa de `1` a `59` (inclusivos) são resetados para 60, com uma advertência, como mostrado aqui:

```
$> mysqld [server-options] --mysql-firewall-reload-interval-seconds=40
...
2023-08-31T17:46:35.043468Z 0 [Warning] [MY-015031] [Server] Plugin MYSQL_FIREWALL
reported: 'Invalid reload interval specified: 40. Valid values are 0 (off) or
greater than or equal to 60. Adjusting to 60.'
...
```

Alternativamente, para definir e persistir essa configuração no início, antecipe o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`, assim:

```
SET PERSIST_ONLY mysql_firewall_reload_interval_seconds = 120;
SET @@PERSIST_ONLY.mysql_firewall_reload_interval_seconds = 120;
```

Após realizar essa modificação, reinicie o servidor para que a nova configuração entre em vigor.

###### Atribuição de Privilegios de Firewall (Plugin)

Após o plugin de firewall ter sido instalado e configurado, você deve conceder privilégios apropriados à conta MySQL ou contas a serem usadas para administrá-la. A atribuição de privilégios depende das operações de firewall que uma conta deve ser permitida para realizar, conforme listadas aqui:

* Conceda o privilégio `FIREWALL_EXEMPT` a qualquer conta que deva ser isenta das restrições de firewall. Isso é útil, por exemplo, para um administrador de banco de dados que configura o firewall, para evitar a possibilidade de uma configuração incorreta causar que até mesmo o administrador seja bloqueado e incapaz de executar instruções.

* Conceda o privilégio `FIREWALL_ADMIN` a qualquer conta que deva ter acesso administrativo completo ao firewall. (Algumas funções administrativas de firewall podem ser invocadas por contas que têm `FIREWALL_ADMIN` *ou* o desatualizado privilégio `SUPER`, conforme indicado nas descrições individuais das funções.)

* Conceda o privilégio `FIREWALL_USER` (desatualizado) a qualquer conta que deva ter acesso administrativo apenas para suas próprias regras de firewall.

  Nota

  O `FIREWALL_USER` não é suportado pelo componente MySQL Enterprise Firewall.

* Conceda o privilégio `EXECUTE` para os procedimentos armazenados na base de dados do firewall. Esses procedimentos podem invocar funções administrativas, portanto, o acesso aos procedimentos armazenados também requer os privilégios indicados anteriormente necessários para essas funções. A base de dados do firewall pode ser a base de dados do sistema `mysql` ou um esquema personalizado (consulte Instalar o Plugin do MySQL Enterprise Firewall).

Nota

Os privilégios `FIREWALL_EXEMPT`, `FIREWALL_ADMIN` e `FIREWALL_USER` podem ser concedidos apenas enquanto o firewall estiver instalado, pois o plugin `MYSQL_FIREWALL` define esses privilégios.

###### Conceitos de Firewall

O servidor MySQL permite que os clientes se conectem e receba deles instruções SQL a serem executadas. Se o firewall estiver habilitado, o servidor passa para ele cada instrução de entrada que não falhe imediatamente com um erro de sintaxe. Com base no fato de o firewall aceitar a instrução, o servidor a executa ou retorna um erro ao cliente. Esta seção descreve como o firewall realiza a tarefa de aceitar ou rejeitar instruções.

* Perfis de Firewall
* Conexão de Instruções de Firewall
* Modos Operacionais do Perfil
* Gerenciamento de Instruções de Firewall Quando Vários Perfis Se Aplicam

###### Perfis de Firewall

O firewall usa um registro de perfis que determinam se a execução da instrução é permitida. Os perfis têm esses atributos:

* Uma lista de permissão. A lista de permissão é o conjunto de regras que define quais instruções são aceitáveis para o perfil.

* Um modo operacional atual. O modo permite que o perfil seja usado de diferentes maneiras. Por exemplo: o perfil pode ser colocado no modo de treinamento para estabelecer a allowlist; a allowlist pode ser usada para restringir a execução de declarações ou detecção de intrusões; o perfil pode ser desativado completamente.

* Um escopo de aplicabilidade. O escopo indica para quais conexões de clientes o perfil se aplica:

  + O firewall suporta perfis baseados em contas, de modo que cada perfil corresponda a uma conta de cliente específica (combinação de nome de usuário e nome de host do cliente). Por exemplo, você pode registrar um perfil de conta para o qual a allowlist se aplica a conexões originárias de `admin@localhost` e outro perfil de conta para o qual a allowlist se aplica a conexões originárias de `myapp@apphost.example.com`.

    Nota

    Os perfis baseados em contas são desatualizados e não são suportados pelo componente do Firewall Empresarial MySQL. Se você estiver usando perfis de conta com o plugin do firewall, pode migrá-los para perfis de grupo, conforme descrito na Migração de perfis de conta para perfis de grupo. Isso também é feito ao executar `upgrade_firewall_to_component.sql` (veja Scripts do componente do Firewall Empresarial MySQL) ou migrar do plugin do firewall para o componente usando o MySQL Configurator (veja Seção 2.3.2.1, “Configuração do Servidor MySQL com o MySQL Configurator”).

  + O firewall suporta perfis de grupo que podem ter múltiplas contas como membros, com a allowlist do perfil aplicando-se igualmente a todos os membros. Os perfis de grupo permitem uma administração mais fácil e maior flexibilidade para implantações que exigem a aplicação de um conjunto específico de regras da allowlist a múltiplas contas.

Inicialmente, não existem perfis, então, por padrão, o firewall aceita todas as declarações e não tem efeito sobre quais declarações as contas do MySQL podem executar. Para aplicar as capacidades de proteção do firewall, é necessária uma ação explícita:

* Registre um ou mais perfis com o firewall.
* Treine o firewall estabelecendo a lista de permissão para cada perfil; ou seja, os tipos de declarações que o perfil permite que os clientes executem.

* Coloque os perfis treinados no modo de proteção para reforçar o MySQL contra a execução não autorizada de declarações:

  + O MySQL associa cada sessão do cliente a uma combinação específica de nome de usuário e nome de host. Essa combinação é a *conta de sessão*.

  + Para cada conexão do cliente, o firewall usa a conta de sessão para determinar quais perfis se aplicam ao tratamento de declarações recebidas do cliente.

O firewall aceita apenas declarações permitidas pelas listas de permissão dos perfis aplicáveis.

A maioria dos princípios de firewall se aplicam de forma idêntica a perfis de grupo e perfis de conta. Os dois tipos de perfis diferem nesses aspectos:

* Uma lista de permissão de perfil de conta se aplica apenas a uma única conta. Uma lista de permissão de perfil de grupo se aplica quando a conta de sessão corresponde a qualquer conta que seja membro do grupo.

* Para aplicar uma lista de permissão a várias contas usando perfis de conta, é necessário registrar um perfil por conta e duplicar a lista de permissão em cada perfil. Isso implica treinar cada perfil de conta individualmente, pois cada um deve ser treinado usando a única conta à qual se aplica.

Um perfil de grupo allowlist aplica-se a múltiplas contas, sem necessidade de duplicá-lo para cada conta. Um perfil de grupo pode ser treinado usando qualquer uma ou todas as contas dos membros do grupo, ou o treinamento pode ser limitado a qualquer um dos membros. De qualquer forma, o allowlist se aplica a todos os membros.

* Os nomes dos perfis de conta são baseados em combinações específicas de nome de usuário e nome de host que dependem de quais clientes se conectam ao servidor MySQL. Os nomes dos perfis de grupo são escolhidos pelo administrador do firewall, sem restrições além de que sua duração deve ser de 1 a 288 caracteres.

Nota

Devido às vantagens dos perfis de grupo em relação aos perfis de conta, e porque um perfil de grupo com uma única conta de membro é logicamente equivalente a um perfil de conta para aquela conta, recomenda-se que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desatualizados e estão sujeitos à remoção em uma versão futura do MySQL. Para obter assistência na conversão de perfis de conta existentes, consulte Migrar perfis de conta para perfis de grupo. O componente de firewall não suporta perfis de conta.

A proteção baseada em perfil oferecida pelo firewall possibilita a implementação de estratégias como as listadas aqui:

* Se uma aplicação tiver requisitos de proteção únicos, faça com que ela use uma conta que não seja usada para nenhum outro propósito e configure um perfil de grupo ou perfil de conta para aquela conta.

* Se aplicações relacionadas compartilharem requisitos de proteção, associe cada aplicação à sua própria conta e, em seguida, adicione essas contas de aplicação como membros do mesmo perfil de grupo. Alternativamente, faça com que todas as aplicações usem a mesma conta e as associe a um perfil de conta para aquela conta.

###### Firewall Statement Matching

A declaração de correspondência realizada pelo firewall não utiliza declarações SQL recebidas dos clientes. Em vez disso, o servidor converte as declarações recebidas para uma forma de digest normalizada e a operação do firewall utiliza esses digests. O benefício da normalização das declarações é que permite que declarações semelhantes sejam agrupadas e reconhecidas usando um único padrão. Por exemplo, essas declarações são distintas entre si:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

Mas todas elas têm a mesma forma de digest normalizada:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

Ao usar a normalização, as listas de permissões do firewall podem armazenar digests que correspondem a muitas declarações diferentes recebidas dos clientes. Para mais informações sobre normalização e digests, consulte a Seção 29.10, “Digests de declarações do Schema de Desempenho e Amostragem”.

Aviso

Definir a variável de sistema `max_digest_length` para `0` desativa a produção de digests, o que também desativa a funcionalidade do servidor que requer digests, como o MySQL Enterprise Firewall.

###### Modos Operacionais do Perfil

Cada perfil registrado com o firewall tem seu próprio modo operacional, escolhido entre esses valores:

* `OFF`: Este modo desativa o perfil. O firewall o considera inativo e o ignora.

* `RECORDING`: Este é o modo de treinamento do firewall. Declarações recebidas de um cliente que correspondem ao perfil são consideradas aceitáveis para o perfil e tornam-se parte de sua “impressão digital.” O firewall registra a forma de digest normalizada de cada declaração para aprender os padrões de declarações aceitáveis para o perfil. Cada padrão é uma regra, e a união das regras é a lista de permissões do perfil.

Os perfis de grupo e de conta diferem na medida em que o registro de declarações para um perfil de grupo pode ser limitado a declarações recebidas de um único membro do grupo (o membro de treinamento).

* `PROTEGENDO`: Nesse modo, o perfil permite ou impede a execução de declarações. O firewall compara as declarações recebidas com a lista de permissão do perfil, aceitando apenas as que correspondem e rejeitando as que não correspondem. Após treinar um perfil no modo `RECORDANDO`, mude-o para o modo `PROTEGENDO` para reforçar o MySQL contra o acesso por declarações que se desviam da lista de permissão. Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro.

* `DETECTANDO`: Esse modo detecta, mas não bloqueia, intrusões (declarações que são suspeitas porque não correspondem a nada na lista de permissão do perfil). No modo `DETECTANDO`, o firewall escreve declarações suspeitas no log de erro, mas as aceita sem negar o acesso.

Quando um perfil recebe qualquer um dos valores de modo anteriores, o firewall armazena o modo no perfil. As operações de configuração de modo do firewall também permitem um valor de modo `RESET`, mas esse valor não é armazenado: configurar um perfil no modo `RESET` faz com que o firewall exclua todas as regras para o perfil e defina seu modo para `DESATIVADO`.

Observação

Mensagens escritas no log de erro no modo `DETECTANDO` ou porque `mysql_firewall_trace` está habilitada são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erro e não sejam descartadas, certifique-se de que a granularidade do registro de erro é suficiente para incluir mensagens de informação. Por exemplo, se você estiver usando a filtragem de log com base na prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Erro com Base na Prioridade (log_filter_internal)”), defina a variável de sistema `log_error_verbosity` para `3`.

###### Gerenciamento de Declarações do Firewall Quando Múltiplos Perfis Se Aplicam

Por simplicidade, as seções posteriores que descrevem como configurar perfis assumem que o firewall compara as declarações recebidas de um cliente apenas com um único perfil, seja ele um perfil de grupo ou um perfil de conta. Mas a operação do firewall pode ser mais complexa:

* Um perfil de grupo pode incluir múltiplas contas como membros.
* Uma conta pode ser membro de múltiplos perfis de grupo.
* Múltiplos perfis podem corresponder a um cliente específico.

A descrição a seguir abrange o caso geral de como o firewall opera, quando potencialmente múltiplos perfis se aplicam a declarações recebidas.

Como mencionado anteriormente, o MySQL associa cada sessão do cliente a uma combinação específica de nome de usuário e nome de host, conhecida como *conta de sessão*. O firewall compara a conta de sessão com perfis registrados para determinar quais perfis se aplicam ao processamento de declarações recebidas da sessão:

* O firewall ignora perfis inativos (perfis com um modo de `OFF`).
* A conta de sessão corresponde a todos os perfis de grupo ativos que incluem um membro com o mesmo usuário e host. Pode haver mais de um perfil de grupo assim.
* A conta de sessão corresponde a um perfil de conta ativo com o mesmo usuário e host, se houver. Há, no máximo, um perfil de conta assim.

Em outras palavras, a conta de sessão pode corresponder a 0 ou mais perfis de grupo ativos e 0 ou 1 perfil de conta ativo. Isso significa que 0, 1 ou múltiplos perfis de firewall são aplicáveis a uma sessão específica, para a qual o firewall processa cada declaração de entrada da seguinte forma:

* Se não houver perfil aplicável, o firewall não impõe restrições e aceita a declaração.
* Se houver perfis aplicáveis, seus modos determinam o processamento da declaração:

+ O firewall registra a declaração na lista de permissão de cada perfil aplicável que está no modo `RECORDING`.

+ O firewall escreve a declaração no log de erro para cada perfil aplicável no modo `DETECTING` para o qual a declaração é suspeita (não corresponde à lista de permissão do perfil).

+ O firewall aceita a declaração se pelo menos um perfil aplicável estiver no modo `RECORDING` ou `DETECTING` (esses modos aceitam todas as declarações) ou se a declaração corresponder à lista de permissão de pelo menos um perfil aplicável no modo `PROTECTING`. Caso contrário, o firewall rejeita a declaração (e a escreve no log de erro se a variável de sistema `mysql_firewall_trace` estiver habilitada).

Com essa descrição em mente, as seções seguintes retornam à simplicidade das situações em que um único perfil de grupo ou um único perfil de conta se aplicam e cobrem como configurar cada tipo de perfil.

###### Registro de Perfis de Firewall de Grupo

O MySQL Enterprise Firewall suporta o registro de perfis de grupo. Um perfil de grupo pode ter múltiplas contas como seus membros. Para usar um perfil de grupo de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil de grupo e coloque-o no modo `RECORDING`.

2. Adicione uma conta membro ao perfil de grupo.
3. Conecte-se ao servidor MySQL usando a conta membro e execute declarações para serem aprendidas. Isso treina o perfil de grupo e estabelece as regras que formam a lista de permissão do perfil.

4. Adicione à lista de grupo quaisquer outras contas que serão membros do grupo.

5. Mude o perfil de grupo para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando qualquer conta que seja membro do perfil de grupo, a lista de permissão do perfil restringe a execução das declarações.

6. Se for necessário treinamento adicional, mude o perfil do grupo para o modo `RECORDANDO` novamente, atualize sua lista de permissões com novos padrões de declarações, e depois mude de volta para o modo `PROTEGENDO`.

Observe essas diretrizes para referências de contas relacionadas ao plugin do Firewall Empresarial do MySQL:

* Tome nota do contexto em que as referências de contas ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como `CREATE USER` e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

O requisito de nomear contas como uma string entre aspas simples para operações de firewall significa que você não pode usar contas que tenham caracteres `@` embutidos no nome de usuário.

* O firewall avalia declarações contra contas representadas por nomes de usuário e host reais autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede:

  Suponha que exista uma conta chamada `me@%.example.org` e que um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.

  O nome da conta contém um caractere curinga `%`, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e um nome de host de `abc.example.com`, e é isso que o firewall vê.

  Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O seguinte procedimento mostra como registrar um perfil de grupo com o firewall, treinar o firewall para conhecer as declarações aceitáveis para esse perfil (sua allowlist), usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis e adicionar e remover membros do grupo. O exemplo usa um nome de perfil de grupo `fwgrp`. O perfil de exemplo é suposto para uso por clientes de uma aplicação que acessa tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta de MySQL administrativa para realizar as etapas deste procedimento, exceto aquelas etapas designadas para execução por contas de membros do perfil de grupo do firewall. Para declarações executadas por contas de membros, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie as contas que serão membros do perfil de grupo `fwgrp` e conceda-lhes os privilégios de acesso apropriados. As declarações para um membro são mostradas aqui (escolha uma senha apropriada):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_group_mode()` para registrar o perfil de grupo com o firewall e colocar o perfil no modo `RECORDING` (treinamento), como mostrado aqui:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

   Nota

   Se você instalou o MySQL Enterprise Firewall em um esquema personalizado, substitua seu nome por `mysql`. Por exemplo, se o firewall estiver instalado no esquema `fwdb`, execute o procedimento armazenado assim:

   ```
   CALL fwdb.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use o procedimento armazenado `sp_firewall_group_enlist()` para adicionar uma conta de membro inicial para uso no treinamento da allowlist do perfil de grupo:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. Para treinar o perfil do grupo usando a conta inicial do membro, conecte-se ao servidor como `member1` a partir do host do servidor para que o firewall veja uma conta de sessão para `member1@localhost`. Em seguida, execute algumas instruções consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   O firewall recebe as instruções da conta `member1@localhost`. Como essa conta é membro do perfil `fwgrp`, que está no modo `RECORDING`, o firewall interpreta as instruções como aplicáveis a `fwgrp` e registra a forma normalizada do digest dos comentários como regras na `allowlist` do `fwgrp`. Essas regras, então, se aplicam a todas as contas que são membros de `fwgrp`.

   Nota

   Até que o perfil do grupo `fwgrp` receba instruções no modo `RECORDING`, sua `allowlist` fica vazia, o que é equivalente a "denunciar tudo". Nenhuma instrução pode corresponder a uma `allowlist` vazia, o que tem essas implicações:

   * O perfil do grupo não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as instruções, proibindo efetivamente que as contas que são membros do grupo executem qualquer instrução.

   * O perfil do grupo pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as instruções, mas as registra como suspeitas.

5. Neste ponto, as informações do perfil do grupo são armazenadas em cache, incluindo seu nome, associação e `allowlist`. Para ver essas informações, consulte as tabelas do firewall do Schema de Desempenho, assim:

   ```
   mysql> SELECT MODE FROM performance_schema.firewall_groups
          WHERE NAME = 'fwgrp';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   +----------+-------------------+
   mysql> SELECT RULE FROM performance_schema.firewall_group_allowlist
          WHERE NAME = 'fwgrp';
   +----------------------------------------------------------------------+
   | RULE                                                                 |
   +----------------------------------------------------------------------+
   | SELECT @@`version_comment` LIMIT ?                                   |
   | UPDATE `actor` SET `last_update` = NOW ( ) WHERE `actor_id` = ?      |
   | SELECT `title` , `release_year` FROM `film` WHERE `film_id` = ?      |
   | SELECT `store_id` , COUNT ( * ) FROM `inventory` GROUP BY `store_id` |
   +----------------------------------------------------------------------+
   ```

   Consulte a Seção 29.12.17, “Tabelas de Firewall do Schema de Desempenho”, para obter mais informações sobre essas tabelas.

   Nota

   A regra `@@version_comment` vem de uma instrução enviada automaticamente pelo cliente **mysql** quando você se conecta ao servidor.

   Importante

Treine o firewall em condições que correspondam ao uso da aplicação. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar instruções ao servidor no início de cada sessão. Se uma aplicação normalmente for usada por meio desse conector, treine o firewall usando o conector também. Isso permite que essas instruções iniciais se tornem parte da lista de permissão para o perfil de grupo associado à aplicação.

6. Inicie novamente o `sp_set_firewall_group_mode()` para alternar o perfil de grupo para o modo `PROTECTING`:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Importante

   Alternar o perfil de grupo do modo `RECORDING` sincroniza seus dados armazenados na memória com as tabelas do banco de dados do firewall que fornecem armazenamento subjacente persistente. Se você não alternar o modo para um perfil que está sendo gravado, os dados armazenados na memória não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (consulte Instalar o Plugin do Firewall Empresarial MySQL).

7. Adicione ao perfil de grupo quaisquer outras contas que devem ser membros:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   A lista de permissão do perfil treinado usando a conta `member1@localhost` agora também se aplica às contas adicionais.

8. Para verificar a associação atualizada do grupo, execute novamente a consulta na tabela `firewall_membership`:

   ```
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   | fwgrp    | member2@localhost |
   | fwgrp    | member3@localhost |
   | fwgrp    | member4@localhost |
   +----------+-------------------+
   ```

9. Teste o perfil de grupo contra o firewall usando qualquer conta do grupo para executar algumas instruções aceitáveis e inaceitáveis. O firewall combina cada instrução da conta com a lista de permissão do perfil e a aceita ou rejeita:

   * Esta instrução não é idêntica a uma instrução de treinamento, mas produz a mesma instrução normalizada que uma delas, então o firewall a aceita:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

* Essas declarações não correspondem a nada na allowlist, então o firewall rejeita cada uma com um erro:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for 'member1@localhost'. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Essas mensagens de log podem ser úteis para identificar a origem dos ataques, caso isso seja necessário.

10. Se os membros precisarem ser removidos do perfil do grupo, use o procedimento armazenado `sp_firewall_group_delist()`, da seguinte forma:

    ```
    CALL mysql.sp_firewall_group_delist('fwgrp', 'member3@localhost');
    ```

O perfil do grupo do firewall agora está configurado para contas de membros. Quando os clientes se conectam usando qualquer conta do grupo e tentam executar declarações, o perfil protege o MySQL contra declarações que não correspondem à allowlist do perfil.

O procedimento mostrado acima adicionou apenas um membro ao perfil do grupo antes de treinar sua allowlist. Isso fornece um melhor controle sobre o período de treinamento, limitando quais contas podem adicionar novas declarações aceitáveis à allowlist. Se for necessário um treinamento adicional, você pode alternar o perfil de volta para o modo `RECORDING`:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
```

No entanto, isso permite que qualquer membro do grupo execute declarações e as adicione à allowlist. Para limitar o treinamento adicional a um único membro do grupo, chame `sp_set_firewall_group_mode_and_user()`, que é como `sp_set_firewall_group_mode()` mas recebe um argumento adicional especificando qual conta é permitida para treinar o perfil no modo `RECORDING`. Por exemplo, para habilitar o treinamento apenas por `member4@localhost`, chame `sp_set_firewall_group_mode_and_user()` como mostrado aqui:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

Isso permite o treinamento adicional pela conta especificada sem precisar remover os outros membros do grupo. Eles podem executar declarações, mas as declarações não são adicionadas à lista de permissão. Você deve ter em mente que, no modo `RECORDING`, os outros membros podem executar qualquer declaração.

Nota

Para evitar comportamento inesperado quando uma conta específica é especificada como a conta de treinamento para um perfil de grupo, certifique-se sempre de que a conta seja membro do grupo.

Após o treinamento adicional, configure o perfil de grupo de volta ao modo `PROTECTING`, da seguinte forma:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
```

A conta de treinamento estabelecida por `sp_set_firewall_group_mode_and_user()` é salva no perfil de grupo, então o firewall a lembra para caso mais treinamento seja necessário mais tarde. Assim, se você chamar `sp_set_firewall_group_mode()` (que não aceita argumento de conta de treinamento), a conta atual de treinamento, `member4@localhost`, permanece inalterada.

Para limpar a conta de treinamento, se realmente for desejado permitir que todos os membros do grupo realizem treinamento no modo `RECORDING`, chame `sp_set_firewall_group_mode_and_user()` e passe um valor `NULL` para o argumento de conta:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

É possível detectar intrusões registrando declarações não correspondentes como suspeitas sem negar o acesso. Primeiro, coloque o perfil de grupo no modo `DETECTING`:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'DETECTING');
```

Em seguida, usando uma conta de membro, execute uma declaração que não corresponda à lista de permissão do perfil de grupo. No modo `DETECTING`, o firewall permite que a declaração não correspondente seja executada:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

Além disso, o firewall escreve uma mensagem no log de erro:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'member1@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

Para desativar um perfil de grupo, mude seu modo para `OFF`:

```
CALL mysql.sp_set_firewall_group_mode(group, 'OFF');
```

Para esquecer todo o treinamento para um perfil e desativá-lo, reinicie-o:

```
CALL mysql.sp_set_firewall_group_mode(group, 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras do perfil e defina seu modo para `OFF`.

###### Registro de perfis de conta do firewall

O MySQL Enterprise Firewall permite que perfis de conta sejam registrados que correspondem a contas individuais. Para usar um perfil de conta do firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil da conta e coloque-o no modo `RECORDING`.

2. Conecte-se ao servidor MySQL usando a conta e execute declarações para serem aprendidas. Isso treina o perfil da conta e estabelece as regras que formam a allowlist do perfil.

3. Mude o perfil da conta para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando a conta, a allowlist do perfil da conta restringe a execução das declarações.

4. Se for necessário mais treinamento, mude o perfil da conta para o modo `RECORDING` novamente, atualize sua allowlist com novos padrões de declarações, e depois mude de volta para o modo `PROTECTING`.

Observe estas diretrizes para referências de contas relacionadas ao plugin MySQL Enterprise Firewall:

* Tome nota do contexto em que as referências de contas ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como `CREATE USER` e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

O requisito de nomear contas como uma string entre aspas simples para operações de firewall significa que você não pode usar contas que tenham caracteres `@` embutidos no nome do usuário.

* O firewall avalia as declarações contra contas representadas por nomes de usuário e hospedeiros reais, autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede:

  + Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do hospedeiro `abc.example.org`.

  + O nome da conta contém um caractere curinga `%`, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e um nome de hospedeiro de `abc.example.com`, e é isso que o firewall vê.

  + Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O seguinte procedimento mostra como registrar um perfil de conta com o firewall, treinar o firewall para saber as declarações aceitáveis para esse perfil (sua allowlist) e usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis pela conta. A conta de exemplo, `fwuser@localhost`, é suposta para uso por uma aplicação que acesse tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta administrativa do MySQL para realizar os passos neste procedimento, exceto aqueles passos designados para execução pela conta `fwuser@localhost` que corresponde ao perfil de conta registrado com o firewall. Para declarações executadas usando essa conta, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie a conta para executar declarações (escolha uma senha apropriada) e conceda-lhe privilégios para o banco de dados `sakila`, assim:

   ```
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_mode()` para registrar o perfil da conta com o firewall e colocar o perfil no modo `RECORDING` (treinamento), conforme mostrado aqui:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

   Observação

   Se você instalou o Firewall MySQL Enterprise usando um esquema personalizado, substitua o nome dele por `mysql` na declaração anterior. Por exemplo, se o firewall estiver instalado no esquema `fwdb`, execute o procedimento armazenado da seguinte maneira:

   ```
   CALL fwdb.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. Para treinar o perfil da conta registrado, conecte-se ao servidor como `fwuser` a partir do host do servidor para que o firewall veja uma conta de sessão para `fwuser@localhost`. Em seguida, use a conta para executar algumas instruções que serão consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

   Como o perfil está no modo `RECORDING`, o firewall registra a forma normalizada do digest dos comandos como regras na lista de permissões do perfil.

   Observação

   Até que o perfil da conta `fwuser@localhost` receba instruções no modo `RECORDING`, sua lista de permissões estará vazia, o que é equivalente a "denunciar tudo". Nenhuma instrução pode corresponder a uma lista de permissões vazia, o que tem essas implicações:

   * O perfil da conta não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as instruções, proibindo efetivamente a execução de qualquer instrução pela conta.

   * O perfil da conta pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as instruções, mas as registra como suspeitas.

4. Neste ponto, as informações do perfil da conta estão em cache. Para ver essas informações, consulte as tabelas do firewall do esquema `INFORMATION_SCHEMA`:

   ```
   mysql> SELECT MODE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS
          WHERE USERHOST = 'fwuser@localhost';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT RULE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_WHITELIST
          WHERE USERHOST = 'fwuser@localhost';
   +----------------------------------------------------------------------------+
   | RULE                                                                       |
   +----------------------------------------------------------------------------+
   | SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?  |
   | SELECT `get_customer_balance` ( ? , NOW ( ) )                              |
   | UPDATE `rental` SET `return_date` = NOW ( ) WHERE `rental_id` = ?          |
   | SELECT @@`version_comment` LIMIT ?                                         |
   +----------------------------------------------------------------------------+
   ```

   Consulte a Seção 28.7, “Tabelas do Plugin do Firewall MySQL Enterprise Schema INFORMATION_SCHEMA”, para obter mais informações sobre essas tabelas.

   Observação

A regra `@@version_comment` vem de uma declaração enviada automaticamente pelo cliente **mysql** quando ele se conecta ao servidor.

Importante

Treine o firewall sob condições que correspondam ao uso da aplicação. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar declarações para o servidor no início de cada sessão. Se uma aplicação normalmente for usada por meio desse conector, treine o firewall usando o conector também. Isso permite que essas declarações iniciais se tornem parte da lista de permissão para o perfil de conta associado à aplicação.

5. Invoque `sp_set_firewall_mode()` novamente, desta vez alternando o perfil de conta para o modo `PROTECTING`, conforme mostrado aqui:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Importante

   Alternar o perfil de conta do modo `RECORDING` sincroniza seus dados armazenados em cache com as tabelas do banco de dados do firewall que fornecem armazenamento subjacente persistente. Se você não alternar o modo para um perfil que está sendo gravado, os dados armazenados em cache não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado. O banco de dados do firewall pode ser o banco de dados do sistema **mysql** ou um esquema personalizado (consulte Instalar o Plugin do Firewall Empresarial do MySQL).

6. Teste o perfil de conta usando a conta para executar algumas declarações aceitáveis e inaceitáveis. O firewall combina cada declaração da conta com a lista de permissão do perfil e a aceita ou rejeita. Esta lista fornece alguns exemplos:

   * Esta declaração não é idêntica a uma declaração de treinamento, mas produz a mesma declaração normalizada que uma delas, então o firewall a aceita:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   * Essas declarações não correspondem a nada na lista de permissão, então o firewall rejeita cada uma com um erro:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

* Se `mysql_firewall_trace` estiver habilitado, o firewall também escreve declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Essas mensagens de log podem ser úteis para identificar a origem dos ataques, caso seja necessário.

O perfil da conta do firewall agora está treinado para a conta `fwuser@localhost`. Quando os clientes se conectam usando essa conta e tentam executar declarações, o perfil protege o MySQL contra declarações que não estão no allowlist do perfil.

É possível detectar intrusões registrando declarações não correspondentes como suspeitas, sem negar o acesso. Primeiro, coloque o perfil da conta no modo `DETECTING`:

```
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Em seguida, usando a conta, execute uma declaração que não corresponda ao allowlist do perfil. No modo `DETECTING`, o firewall permite que a declaração não correspondente seja executada:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

Além disso, o firewall escreve uma mensagem no log de erro:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

Para desabilitar um perfil de conta, mude seu modo para `OFF`:

```
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

Para esquecer todo o treinamento para um perfil e desabilitar, reinicie-o:

```
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras para o perfil e defina seu modo para `OFF`.

###### Monitoramento do Firewall

Para avaliar a atividade do firewall, examine suas variáveis de status associadas. Por exemplo, após realizar o procedimento mostrado anteriormente para treinar e proteger o perfil do grupo `fwgrp`, essas variáveis têm os valores mostrados na saída da seguinte declaração `SHOW GLOBAL STATUS`:

```
mysql> SHOW GLOBAL STATUS LIKE 'Firewall%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| Firewall_access_denied     | 3     |
| Firewall_access_granted    | 4     |
| Firewall_access_suspicious | 1     |
| Firewall_cached_entries    | 4     |
+----------------------------+-------+
```

Essas variáveis indicam o número de declarações rejeitadas, aceitas, registradas como suspeitas e adicionadas ao cache, respectivamente. O número `Firewall_access_granted` é de 4 devido à declaração `@@version_comment` enviada pelo cliente **mysql** cada uma das três vezes que a conta registrada se conectou ao servidor, além da declaração `SHOW TABLES` que não foi bloqueada no modo `DETECTING`.

###### Migrando perfis de conta para perfis de grupo

O plugin do Firewall do MySQL Enterprise suporta perfis de conta, cada um dos quais se aplica a uma única conta, bem como perfis de grupo, que podem se aplicar a várias contas. Um perfil de grupo simplifica a administração quando a mesma lista de permissão deve ser aplicada a várias contas: em vez de criar um perfil de conta para cada conta e duplicar a lista de permissões em todos esses perfis, você pode criar um único perfil de grupo e fazer com que as contas sejam membros dele. A lista de permissões do grupo, então, se aplica a todas as contas.

Um perfil de grupo com uma única conta membro é logicamente equivalente a um perfil de conta para aquela conta, portanto, é possível administrar o firewall usando perfis de grupo exclusivamente, em vez de uma mistura de perfis de conta e de grupo. Para novas instalações de firewall, isso é realizado criando novos perfis uniformemente como perfis de grupo e evitando perfis de conta.

Devido à maior flexibilidade oferecida pelos perfis de grupo, recomenda-se que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desatualizados e estarão sujeitos à remoção em uma versão futura do MySQL. (Além disso, os perfis de conta não são suportados pelo componente MySQL Enterprise Firewall.) Para atualizações de instalações de firewall que utilizam perfis de conta, o plugin MySQL Enterprise Firewall inclui um procedimento armazenado chamado `sp_migrate_firewall_user_to_group()` para ajudá-lo a converter perfis de conta em perfis de grupo. Para usá-lo, execute o procedimento a seguir como um usuário que tenha o privilégio `FIREWALL_ADMIN`:

1. Execute o script `firewall_profile_migration.sql` para instalar o procedimento armazenado `sp_migrate_firewall_user_to_group()`. O script está localizado no diretório `share` da instalação do MySQL.

   Especifique o mesmo nome da base de dados do firewall na linha de comando que você definiu anteriormente para sua instalação de firewall. O exemplo aqui especifica a base de dados do sistema, `mysql`.

   ```
   $> mysql -u root -p -D mysql < firewall_profile_migration.sql
   Enter password: (enter root password here)
   ```

   Se você instalou o plugin MySQL Enterprise Firewall usando um esquema personalizado, faça a substituição apropriada para o seu sistema.

2. Identifique quais perfis de conta existem consultando a tabela do Esquema de Informações `MYSQL_FIREWALL_USERS`, assim:

   ```
   mysql> SELECT USERHOST FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS;
   +-------------------------------+
   | USERHOST                      |
   +-------------------------------+
   | admin@localhost               |
   | local_client@localhost        |
   | remote_client@abc.example.com |
   +-------------------------------+
   ```

3. Para cada perfil de conta identificado pelo passo anterior, converta-o em um perfil de grupo. Substitua o prefixo `mysql` pelo nome da base de dados do firewall real, se necessário:

   ```
   CALL mysql.sp_migrate_firewall_user_to_group('admin@localhost', 'admins');
   CALL mysql.sp_migrate_firewall_user_to_group('local_client@localhost', 'local_clients');
   CALL mysql.sp_migrate_firewall_user_to_group('remote_client@localhost', 'remote_clients');
   ```

Em cada caso, o perfil da conta deve existir e não estar atualmente no modo `RECORDANDO`, e o perfil do grupo não deve já existir. O perfil do grupo resultante tem a conta nomeada como seu único membro inscrito, que também é definido como a conta de treinamento do grupo. O modo operacional do perfil do grupo é obtido do modo operacional do perfil da conta.

4. (*Opcional*:) Remova `sp_migrate_firewall_user_to_group()`:

   ```
   DROP PROCEDURE IF EXISTS mysql.sp_migrate_firewall_user_to_group;
   ```

   Se você instalou o plugin do Firewall do MySQL Enterprise usando um esquema personalizado, use `sname` no lugar de `mysql` na declaração anterior.

Para obter informações adicionais sobre `sp_migrate_firewall_user_to_group()`, consulte os Procedimentos Armazenados Diversos do Plugin do Firewall do MySQL Enterprise.

##### 8.4.8.1.4 Referência do Plugin do Firewall do MySQL Enterprise

As seções a seguir fornecem uma referência aos seguintes elementos do plugin do Firewall do MySQL Enterprise:

* Tabelas do Plugin do Firewall do MySQL Enterprise
* Procedimentos Armazenados do Plugin do Firewall do MySQL Enterprise
* Funções Administrativas do Plugin do Firewall do MySQL Enterprise
* Variáveis de Sistema do Plugin do Firewall do MySQL Enterprise
* Variáveis de Status do Plugin do Firewall do MySQL Enterprise

###### Tabelas do Plugin do Firewall do MySQL Enterprise

O plugin do Firewall do MySQL Enterprise mantém as informações do perfil em uma base por grupo e por conta, usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do Schema de Informações para fornecer visões de dados em cache na memória. Quando ativado, o firewall baseia as decisões operacionais nos dados em cache. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um determinado durante a instalação (veja Instalar o Plugin do Firewall do MySQL Enterprise).

As tabelas no banco de dados do firewall são abordadas nesta seção. Para informações sobre as tabelas do Esquema de Informações do Plugin do Firewall Empresarial MySQL, consulte a Seção 28.7, “Tabelas do Esquema de Informações do Plugin do Firewall Empresarial MySQL”; para informações sobre as tabelas do Esquema de Desempenho do Firewall Empresarial MySQL, consulte a Seção 29.12.17, “Tabelas de Firewall do Esquema de Desempenho”.

* Tabelas de Perfil de Grupo de Firewall
* Tabelas de Perfil de Conta de Firewall

###### Tabelas de Perfil de Grupo de Firewall

O plugin do Firewall Empresarial MySQL mantém as informações do perfil de grupo usando tabelas no banco de dados do firewall (`mysql` ou personalizado) para armazenamento persistente e tabelas do Esquema de Desempenho para fornecer visões sobre dados em cache na memória.

Cada tabela do firewall e do Esquema de Desempenho é acessível apenas por contas que têm o privilégio `SELECT` para aquela tabela.

A tabela `firewall-database.firewall_groups` lista os nomes e os modos operacionais dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela `firewall_groups` do Esquema de Desempenho tendo colunas semelhantes, mas não necessariamente idênticas):

* `NAME`

  O nome do perfil de grupo.

* `MODE`

  O modo operacional atual para o perfil. Os valores permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para informações sobre seus significados, consulte Conceitos de Firewall.

* `USERHOST`

  A conta de treinamento para o perfil de grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta no formato `user_name@host_name`:

  + Se o valor for `NULL`, as regras de lista de permissões do firewall para declarações recebidas de qualquer conta que seja membro do grupo são permitidas.

+ Se o valor não for `NULL`, as regras de allowlist do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

A tabela `firewall-database.firewall_group_allowlist` lista as regras de allowlist dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_group_allowlist` tendo colunas semelhantes, mas não necessariamente idênticas):

* `NAME`

  O nome do perfil de grupo.

* `RULE`

  Uma declaração normalizada indicando um padrão de declaração aceitável para o perfil. Uma allowlist de perfil é a união de suas regras.

* `ID`

  Um inteiro único; a chave primária da tabela.

A tabela `firewall-database.firewall_membership` lista os membros (contas) dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_membership` tendo colunas semelhantes, mas não necessariamente idênticas):

* `GROUP_ID`

  O nome do perfil de grupo.

* `MEMBER_ID`

  O nome de uma conta que é membro do perfil.

###### Tabelas de Perfil de Conta de Firewall

O MySQL Enterprise Firewall mantém as informações do perfil de conta usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do `INFORMATION_SCHEMA` para fornecer visualizações de dados em cache na memória. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (veja Instalar o Plugin do MySQL Enterprise Firewall).

Cada tabela de banco de dados padrão é acessível apenas por contas que têm o privilégio `SELECT` para ela. As tabelas do `INFORMATION_SCHEMA` são acessíveis por qualquer pessoa.

Essas tabelas estão desatualizadas e sujeitas à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

A tabela `firewall-database.firewall_users` lista nomes e modos operacionais de perfis de contas de firewall registrados. A tabela possui as seguintes colunas (com a tabela `MYSQL_FIREWALL_USERS` correspondente tendo colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

  O perfil da conta, no formato `user_name@host_name`.

* `MODE`

  O modo operacional atual do perfil. Os valores permitidos do modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para informações sobre seus significados, consulte Conceitos de Firewall.

A tabela `firewall-database.firewall_whitelist` lista regras de lista de permissão de perfis de contas de firewall registrados. A tabela possui as seguintes colunas (com a tabela `MYSQL_FIREWALL_WHITELIST` correspondente tendo colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

  O nome do perfil da conta, usando o formato `user_name@host_name`.

* `RULE`

  Uma declaração normalizada indicando um padrão de declaração aceitável para o perfil. Uma lista de permissão de perfil é a união de suas regras.

* `ID`

  Identificador único (inteiro); esta chave primária da tabela.

###### Procedimentos Armazenados do Plugin do Firewall do MySQL Enterprise

Os procedimentos armazenados do plugin do firewall do MySQL Enterprise realizam tarefas como registrar perfis com o firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente. Esses procedimentos invocam funções administrativas que fornecem uma API para tarefas de nível mais baixo.

Os procedimentos armazenados do firewall são criados no banco de dados do firewall, que pode ser o `mysql` ou outro banco de dados (consulte Instalar o Plugin do Firewall do MySQL Enterprise).

Para invocar um procedimento armazenado de firewall, faça isso enquanto a base de dados de firewall especificada é a base de dados padrão, ou qualifique o nome do procedimento com o nome da base de dados. Por exemplo, se `mysql` for a base de dados de firewall:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

Os procedimentos armazenados de firewall são transacionais; se ocorrer um erro durante a execução de um procedimento armazenado de firewall, todas as alterações feitas até aquele ponto são revertidas e um erro é relatado.

Nota

Se você instalou o MySQL Enterprise Firewall em um esquema personalizado, use seu nome no lugar de `mysql` ao invocar procedimentos armazenados de plugins de firewall. Por exemplo, se o firewall estiver instalado no esquema `fwdb`, execute o procedimento armazenado `sp_set_firewall_group_mode` da seguinte maneira:

```
CALL fwdb.sp_set_firewall_group_mode(group, mode);
```

* Procedimentos Armazenados de Perfil de Grupo de Firewall
* Procedimentos Armazenados de Perfil de Conta de Plugin de Firewall
* Procedimentos Armazenados Diversos de Plugin de Firewall

###### Procedimentos Armazenados de Perfil de Grupo de Firewall

Os procedimentos armazenados listados aqui realizam operações de gerenciamento em perfis de grupo de firewall:

* `sp_firewall_group_delist(group, user)`

Este procedimento armazenado remove uma conta de um perfil de grupo de firewall.

Se a chamada for bem-sucedida, a mudança na associação do grupo é feita tanto no cache em memória quanto no armazenamento persistente.

Argumentos:

+ *`group`*: O nome do perfil de grupo afetado.

+ *`user`*: A conta a ser removida, como uma string no formato `user_name@host_name`.

Exemplo:

```
  CALL mysql.sp_firewall_group_delist('g', 'fwuser@localhost');
  ```

* `sp_firewall_group_enlist(group, user)`

Este procedimento armazenado adiciona uma conta a um perfil de grupo de firewall. Não é necessário registrar a própria conta com o firewall antes de adicionar a conta ao grupo.

Se a chamada for bem-sucedida, a mudança na associação do grupo é feita tanto no cache em memória quanto no armazenamento persistente.

Argumentos:

  + *`group`*: O nome do perfil de grupo afetado.

  + *`user`*: A conta a ser adicionada, na forma de uma string no formato `user_name@host_name`.

  Exemplo:

  ```
  CALL mysql.sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `sp_reload_firewall_group_rules(group)`

  Este procedimento armazenado fornece controle sobre a operação do firewall para perfis de grupo individuais. O procedimento usa funções administrativas do firewall para recarregar as regras de memória para um perfil de grupo a partir das regras armazenadas na tabela `firewall-database.firewall_group_allowlist`.

  Argumentos:

  + *`group`*: O nome do perfil de grupo afetado.

  Exemplo:

  ```
  CALL mysql.sp_reload_firewall_group_rules('myapp');
  ```

  Aviso

  Este procedimento limpa as regras de memória do allowlist do perfil de grupo antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não estiver em `OFF` antes da chamada `sp_reload_firewall_group_rules()`, use `sp_set_firewall_group_mode()` para restaurá-lo ao modo anterior após recarregar as regras. Por exemplo, se o perfil estiver no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_group_rules()` e você deve defini-lo explicitamente para `PROTECTING` novamente.

* `sp_set_firewall_group_mode(group, mode)`

  Este procedimento armazenado estabelece o modo operacional para um perfil de grupo de firewall, após registrar o perfil com o firewall, se ele ainda não estiver registrado. O procedimento também invoca funções administrativas do firewall conforme necessário para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo que a variável de sistema `mysql_firewall_mode` esteja em `OFF`, embora definir o modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

Se o perfil já existia, qualquer limitação de gravação para ele permanece inalterada. Para definir ou limpar a limitação, chame `sp_set_firewall_group_mode_and_user()`.

Argumentos:

+ `group`: O nome do perfil do grupo afetado.

+ `mode`: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para detalhes sobre seus significados, consulte Conceitos de Firewall.

Exemplo:

```
  CALL mysql.sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```

* `sp_set_firewall_group_mode_and_user(group, mode, user)`

Este procedimento armazenado registra um grupo no firewall e estabelece seu modo operacional, semelhante a `sp_set_firewall_group_mode()`, mas também especifica a conta de treinamento a ser usada quando o grupo estiver no modo `RECORDING`.

Argumentos:

+ `group`: O nome do perfil do grupo afetado.

+ `mode`: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`.

+ `user`: A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

    - Se o valor for `NULL`, as regras de lista de permissão do firewall são registradas para declarações recebidas de qualquer conta que seja membro do grupo.

    - Se o valor for `não NULL`, as regras de lista de permissão do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

Exemplo:

```
  CALL mysql.sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

###### Procedimentos Armazenados de Perfil de Conta de Plugin de Firewall

Os procedimentos armazenados listados aqui realizam operações de gerenciamento em perfis de conta de firewall:

* `sp_reload_firewall_rules(user)`

Este procedimento armazenado fornece controle sobre a operação do firewall para perfis de conta individuais. O procedimento usa funções administrativas do firewall para recarregar as regras de memória para um perfil de conta a partir das regras armazenadas na tabela `firewall-database.firewall_whitelist`.

Argumentos:

+ *`user`*: O nome do perfil de conta afetado, como uma string no formato `user_name@host_name`.

Exemplo:

```
  CALL sp_reload_firewall_rules('fwuser@localhost');
  ```

Aviso

Este procedimento limpa as regras de lista de permissão de memória do perfil de conta antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não estiver em `OFF` antes da chamada `sp_reload_firewall_rules()`, use `sp_set_firewall_mode()` para restaurá-lo ao modo anterior após recarregar as regras. Por exemplo, se o perfil estiver no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_rules()` e você deve defini-lo explicitamente para `PROTECTING` novamente.

Este procedimento é desatualizado e está sujeito à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

* `sp_set_firewall_mode(user, mode)`

Este procedimento armazenado estabelece o modo operacional para um perfil de conta de firewall, após registrar o perfil com o firewall, se ele ainda não estiver registrado. O procedimento também invoca funções administrativas do firewall conforme necessário para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo se a variável de sistema `mysql_firewall_mode` estiver em `OFF`, embora definir o modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

Argumentos:

+ *`user`*: O nome do perfil de conta afetado, como uma string no formato `user_name@host_name`.

+ *`mode`*: O modo operacional para o perfil, como uma string. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

  Mudar o perfil de uma conta para qualquer modo, exceto `RECORDING`, sincroniza seus dados de cache do firewall com as tabelas do banco de dados do firewall que fornecem armazenamento subjacente persistente (`mysql` ou personalizado). Mudar o modo de `OFF` para `RECORDING` recarrega a lista de permissões da tabela `firewall-database.firewall_whitelist` para o cache.

  Se um perfil de conta tiver uma lista de permissões vazia, seu modo não pode ser definido como `PROTECTING` porque o perfil rejeitaria todas as declarações, proibindo efetivamente a execução de declarações pela conta. Em resposta a essa tentativa de definição de modo, o firewall produz uma mensagem de diagnóstico que é retornada como um conjunto de resultados em vez de como um erro SQL:

  ```
  mysql> CALL sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

  Esse procedimento é desatualizado e está sujeito à remoção em uma versão futura do MySQL. Consulte Migrar perfis de contas para perfis de grupo.

###### Procedimentos Armazenados Diversos do Plugin de Firewall

Os procedimentos armazenados listados realizam operações de gerenciamento de firewall diversas.

* `sp_migrate_firewall_user_to_group(user, group)`

  O procedimento armazenado `sp_migrate_firewall_user_to_group()` converte um perfil de conta do firewall em um perfil de grupo com a conta como seu único membro inscrito. Execute o script `firewall_profile_migration.sql` para instalá-lo. O procedimento de conversão é discutido em Migrar perfis de contas para perfis de grupo.

  Essa rotina requer o privilégio `FIREWALL_ADMIN`.

  Argumentos:

+ *`user`*: O nome do perfil de conta a ser convertido em um perfil de grupo, como uma string no formato `user_name@host_name`. O perfil de conta deve existir e não estar atualmente no modo `RECORDING`.

  + *`group`*: O nome do novo perfil de grupo, que não deve já existir. O novo perfil de grupo tem a conta nomeada como seu único membro inscrito, e esse membro é definido como a conta de treinamento do grupo. O modo operacional do perfil de grupo é obtido do modo operacional do perfil de conta.

  Exemplo:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```

###### Funções Administrativas do Plugin do Firewall do MySQL Enterprise

As funções administrativas do plugin do firewall do MySQL Enterprise fornecem uma API para tarefas de nível mais baixo, como sincronizar o cache do firewall com as tabelas do sistema subjacente.

*Em operação normal, essas funções são invocadas pelos procedimentos armazenados do firewall, e não diretamente pelos usuários.* Por essa razão, essas descrições de funções não incluem detalhes como informações sobre seus argumentos e tipos de retorno.

* Funções de Perfil de Grupo do Firewall *
* Funções de Perfil de Conta do Plugin do Firewall *
* Funções Diversas do Plugin do Firewall *

###### Funções de Perfil de Grupo do Firewall

Essas funções realizam operações de gerenciamento em perfis de grupo de firewall:

* `firewall_group_delist(group, user)`

  Esta função remove uma conta de um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

* `firewall_group_enlist(group, user)`

  Esta função adiciona uma conta a um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Não é necessário registrar a própria conta com o firewall antes de adicionar a conta ao grupo.

  Exemplo:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `read_firewall_group_allowlist(group, rule)`

Essa função agregada atualiza o cache do perfil de grupo de firewall por meio de uma instrução `SELECT` na tabela `firewall-database.firewall_group_allowlist`. Ela requer o privilégio `FIREWALL_ADMIN`.

Exemplo:

```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

* `read_firewall_groups(grupo, modo, usuário)`

Essa função agregada atualiza o cache do perfil de grupo de firewall por meio de uma instrução `SELECT` na tabela `firewall-database.firewall_groups`. Ela requer o privilégio `FIREWALL_ADMIN`.

Exemplo:

```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

* `set_firewall_group_mode(grupo, modo[, usuário])`

Essa função gerencia o cache do perfil de grupo, estabelece o modo operacional do perfil e, opcionalmente, especifica a conta de treinamento do perfil. Ela requer o privilégio `FIREWALL_ADMIN`.

Se o argumento opcional *`user`* não for fornecido, qualquer configuração anterior de *`user`* para o perfil permanece inalterada. Para alterar a configuração, chame a função com um terceiro argumento.

Se o argumento opcional *`user`* for fornecido, ele especifica a conta de treinamento do perfil de grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou o nome de uma conta no formato `user_name@host_name`:

+ Se o valor for `NULL`, as regras de lista de permissões de firewall para declarações recebidas de qualquer conta que seja membro do grupo são registradas.

+ Se o valor não for `NULL`, as regras de lista de permissões de firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

Exemplo:

```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

###### Funções de Perfil de Conta de Plugin de Firewall

As funções listadas aqui realizam operações de gerenciamento em perfis de contas de firewall:

* `read_firewall_users(usuário, modo)`

Essa função agregada atualiza o cache do perfil da conta do firewall usando uma instrução `SELECT` na tabela `firewall-database.firewall_users`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

Exemplo:

```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

Essa função está desatualizada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

* `read_firewall_whitelist(user, rule)`

  Essa função agregada atualiza o cache de declarações gravadas para o perfil de conta nomeado por meio de uma instrução `SELECT` na tabela `firewall-database.firewall_whitelist`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

  Essa função está desatualizada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

* `set_firewall_mode(user, mode)`

  Essa função gerencia o cache do perfil da conta e estabelece o modo operacional do perfil. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

  Essa função está desatualizada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

###### Funções Diversas do Plugin de Firewall

As funções listadas aqui realizam operações diversas do firewall:

* `mysql_firewall_flush_status()`

  Essa função reinicia as seguintes variáveis de status do plugin de firewall para `0`:

  + `Firewall_access_denied`
  + `Firewall_access_granted`
  + `Firewall_access_suspicious`

  Essa função requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT mysql_firewall_flush_status();
  ```

Esta função normaliza uma instrução SQL na forma de digestão usada para regras de allowlist. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

Exemplo:

```
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

Nota

A mesma funcionalidade de digestão está disponível a partir da função SQL `STATEMENT_DIGEST_TEXT()`.

###### Variáveis de Sistema do Plugin do Firewall do MySQL Enterprise

O plugin do firewall do MySQL Enterprise suporta as seguintes variáveis de sistema para controlar vários aspectos do funcionamento do firewall. Essas variáveis não estão disponíveis a menos que o plugin do firewall esteja instalado (consulte a Seção 8.4.8.1.2, “Instalando ou Desinstalando o Plugin do Firewall do MySQL Enterprise”).

* `mysql_firewall_database`

  <table frame="box" rules="all" summary="Propriedades para mysql_firewall_database"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysql-firewall-database[=value]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysql_firewall_database</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>mysql</code></td> </tr></tbody></table>

Especifica o banco de dados a partir do qual o plugin do Firewall Empresarial do MySQL lê os dados. Tipicamente, o plugin do lado do servidor `MYSQL_FIREWALL` armazena seus dados internos (tabelas, procedimentos armazenados e funções) no banco de dados do sistema `mysql`, mas você pode criar e usar um esquema personalizado (veja Instalar o Plugin do Firewall Empresarial do MySQL). Esta variável permite especificar um nome de banco de dados alternativo no momento do início.

* `mysql_firewall_mode`

  <table frame="box" rules="all" summary="Propriedades para mysql_firewall_mode"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do Sistema</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se o plugin do Firewall Empresarial do MySQL está habilitado (o padrão) ou desabilitado.

* `mysql_firewall_reload_interval_seconds`

<table frame="box" rules="all" summary="Propriedades para mysql_firewall_reload_interval_seconds">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--mysql-firewall-reload-interval-seconds[=value]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>mysql_firewall_reload_interval_seconds</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>60 (a menos que 0: OFF)</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>INT_MAX</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>segundos</td>
  </tr>
  </table>

  Especifica o intervalo (em segundos) que o plugin do lado do servidor usa para recarregar sua cache interna a partir das tabelas do firewall. Quando `mysql_firewall_reload_interval_seconds` tem um valor de zero (o padrão), não ocorre recarga periódica de dados das tabelas no tempo de execução. Valores entre `0` e `60` (1 a 59) não são reconhecidos pelo plugin. Em vez disso, esses valores ajustam-se automaticamente para `60`.

  Esta variável exige que o componente `scheduler` esteja habilitado (`ON`). Para mais informações, consulte Agendamento de Recargas de Cache do Firewall.

* `mysql_firewall_trace`

<table frame="box" rules="all" summary="Propriedades para mysql_firewall_trace">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>mysql_firewall_trace</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
</table>

  Se o rastreamento do Firewall de Rede do MySQL Enterprise está habilitado ou desabilitado (o padrão). Quando o `mysql_firewall_trace` está habilitado, para o modo `PROTECTING`, o firewall escreve declarações rejeitadas no log de erro.

###### Variáveis de Status do Plugin do Firewall de Rede do MySQL Enterprise

O plugin do Firewall de Rede do MySQL Enterprise suporta as seguintes variáveis de status que fornecem informações sobre o status operacional do firewall. Essas variáveis não estão disponíveis a menos que o plugin do firewall esteja instalado (consulte a Seção 8.4.8.1.2, “Instalando ou Desinstalando o Plugin do Firewall de Rede do MySQL Enterprise”). As variáveis de status do plugin do firewall são definidas como `0` sempre que o plugin `MYSQL_FIREWALL` estiver instalado ou o servidor estiver iniciado. Muitas delas são zeradas pela função `mysql_firewall_flush_status()` (consulte Funções Administrativas do Plugin do Firewall de Rede do MySQL Enterprise).

* `Firewall_access_denied`

O número de declarações rejeitadas pelo plugin do Firewall Empresarial MySQL.

Descontinuado.

* `Firewall_access_granted`

O número de declarações aceitas pelo plugin do Firewall Empresarial MySQL.

Descontinuado.

* `Firewall_access_suspicious`

O número de declarações registradas pelo plugin do Firewall Empresarial MySQL como suspeitas para usuários que estão no modo `DETECTING`.

Descontinuado.

* `Firewall_cached_entries`

O número de declarações registradas pelo plugin do Firewall Empresarial MySQL, incluindo duplicados.

Descontinuado.
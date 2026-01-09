#### 8.4.8.2 O Componente do Firewall Empresarial do MySQL

* Finalidade: Fornecer um firewall em nível de aplicativo que permita ao administrador do banco de dados permitir ou bloquear instruções SQL com base na comparação com padrões de instruções aceitos.

* URN: `file://component_firewall`

Mais informações sobre o componente do firewall, sua instalação (e operações semelhantes com ele) e uso podem ser encontradas nas seções a seguir, listadas aqui:

* Seção 8.4.8.2.1, “Elementos do Firewall Empresarial do MySQL (Componente”)")
* Seção 8.4.8.2.2, “Instalação do Componente do Firewall Empresarial do MySQL”
* Seção 8.4.8.2.3, “Uso do Componente do Firewall Empresarial do MySQL”
* Seção 8.4.8.2.4, “Referência do Componente do Firewall Empresarial do MySQL”

##### 8.4.8.2.1 Elementos do Firewall Empresarial do MySQL (Componente)

O componente do Firewall Empresarial do MySQL foi criado para substituir o plugin de firewall, que agora está desatualizado. A versão baseada em componentes do Firewall Empresarial do MySQL inclui os seguintes elementos:

* O componente `component_firewall`, que examina instruções SQL antes de executarem e, com base em perfis de firewall registrados, decide se executar ou rejeitar cada instrução.

* Tabelas do Schema de Desempenho que fornecem visualizações dos perfis registrados. Veja a Seção 29.12.17, “Tabelas de Firewall do Schema de Desempenho”.

* Os perfis são armazenados em cache na memória para melhor desempenho. As tabelas no banco de dados do firewall fornecem armazenamento de suporte dos dados do firewall para a persistência dos perfis após reinicializações do servidor. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` (o padrão) ou um determinado no momento da instalação (veja Instalar o Componente do Firewall Empresarial do MySQL).

* Os procedimentos armazenados realizam tarefas como registrar perfis de firewall, estabelecer seus modos operacionais e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente. Essas tarefas são descritas nos Procedimentos Armazenados do Componente do Firewall do MySQL Enterprise.

* As funções administrativas fornecem uma API para tarefas de nível mais baixo, como sincronizar o cache com o armazenamento persistente. Consulte Funções do Componente do Firewall do MySQL Enterprise para obter mais informações.

* As variáveis de sistema e as variáveis de status específicas do plugin de firewall permitem a configuração do firewall e fornecem informações operacionais em tempo de execução, respectivamente. Para descrições dessas variáveis, consulte Variáveis de Sistema do Componente do Firewall do MySQL Enterprise, bem como Variáveis de Status do Componente do Firewall do MySQL Enterprise.

* O privilégio `FIREWALL_ADMIN` permite que os usuários administrem regras de firewall para qualquer usuário.

  O privilégio `FIREWALL_EXEMPT` isenta um usuário das restrições do firewall. Isso é útil, por exemplo, para qualquer administrador de banco de dados que configure o firewall, para evitar a possibilidade de uma configuração incorreta que faça com que até mesmo o administrador seja bloqueado e incapaz de executar instruções.

  Nota

  O privilégio `FIREWALL_USER` (desatualizado) não é suportado pelo componente do Firewall do MySQL Enterprise.

* O componente do Firewall do MySQL Enterprise também fornece vários scripts SQL (no diretório `share` da instalação) que facilitam a instalação e remoção do componente, bem como as migrações entre o plugin de firewall e o componente. O Scripts do Componente do Firewall do MySQL Enterprise fornece mais informações sobre esses scripts; consulte também a Seção 8.4.8.2.2, “Instalação do Componente do Firewall do MySQL Enterprise”, para obter ajuda com o uso deles.

##### 8.4.8.2.2 Instalação do Componente do Firewall Empresarial do MySQL

Esta seção abrange tópicos relacionados à instalação e configuração do componente do Firewall Empresarial do MySQL, incluindo instalação, remoção e migração entre o componente do firewall e o plugin do firewall (desatualizado).

* Instalação do Componente do Firewall Empresarial do MySQL
* Desinstalação do Componente do Firewall Empresarial do MySQL
* Atualização para o Componente do Firewall Empresarial do MySQL
* Downgrade do Componente do Firewall Empresarial do MySQL

###### Instalação do Componente do Firewall Empresarial do MySQL

Esta seção fornece informações sobre a realização de uma nova instalação do componente do Firewall Empresarial do MySQL. Se, em vez disso, você deseja atualizar uma instalação existente baseada em plugins do MySQL Enterprise Firewall para usar o componente do firewall, consulte Atualização para o Componente do Firewall Empresarial do MySQL.

Antes de começar a instalação, você deve escolher um local para o banco de dados do firewall. Embora seja possível usar o banco de dados do sistema `mysql`, recomendamos que você use um banco de dados separado e dedicado para esse propósito. Por exemplo, para instalar o MySQL Enterprise Firewall em um novo banco de dados que não existe anteriormente, chamado `myfwdb`, execute as instruções mostradas aqui no cliente **mysql**:

```
mysql> CREATE DATABASE IF NOT EXISTS myfwdb;
Query OK, 1 row affected (0.01 sec)

mysql> USE myfwdb;
Database changed
```

Para realizar a instalação, use `install_component_firewall.sql` do diretório `share` da sua instalação do MySQL. Este script instala o banco de dados do firewall no banco de dados atual, então você deve garantir que isso seja o caso antes de prosseguir, da seguinte forma:

```
mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)
```

Este script não requer (e aceita) argumentos; simplesmente execute-o usando o comando `source` do cliente **mysql**, como mostrado aqui:

```
mysql> source ../share/install_component_firewall.sql
```

Ajuste o caminho para o diretório `share`, conforme necessário, para corresponder ao layout da sua instalação. Consulte a Seção 6.5.1.2, “Comandos do Cliente MySQL”, e a Seção 6.5.1.5, “Execução de Instruções SQL a partir de um Arquivo de Texto”, para obter mais informações sobre o uso do comando `source`.

`install_component_firewall.sql` cria todas as tabelas, procedimentos armazenados e variáveis do servidor necessárias pelo componente MySQL Enterprise Firewall. A variável de sistema `component_firewall.database` é definida para o nome do banco de dados atual (e persistido), e o firewall é habilitado, como você pode ver verificando os valores de `component_firewall.database` e `component_firewall.enabled`, da seguinte forma:

```
SELECT component_firewall.database, component_firewall.enabled;
+-----------------------------+----------------------------+
| component_firewall.database | component_firewall.enabled |
+-----------------------------+----------------------------+
|                      myfwdb |                         ON |
+-----------------------------+----------------------------+
1 row in set (0.00 sec)
```

###### Desinstalação do Componente MySQL Enterprise Firewall

Esta seção fornece informações sobre a remoção completa do componente MySQL Enterprise Firewall e seus elementos relacionados. Para obter informações sobre a desativação do componente para o plugin firewall (desatualizado), consulte Desatualizando o Componente MySQL Enterprise Firewall.

Você pode remover o componente MySQL Enterprise Firewall da sua instalação MySQL usando o script fornecido `uninstall_component_firewall.sql`, que pode ser encontrado no diretório `share`.

Importante

Antes de executar `uninstall_component_firewall.sql`, você deve garantir que não haja outras conexões com o servidor. Use `SHOW PROCESSLIST` ou consulte a tabela `processlist` do Schema de Desempenho para ajudar a determinar se esse é o caso.

Após garantir que o banco de dados atual é o banco de dados do firewall, execute este script a partir de uma sessão do cliente `mysql`. Neste exemplo, assumimos que o banco de dados do firewall é chamado `myfwdb`:

```
SELECT @@component_firewall.database;
+-------------------------------+
| @@component_firewall.database |
+-------------------------------+
|                        myfwdb |
+-------------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/uninstall_component_firewall.sql
```

Você pode precisar ajustar o caminho para o diretório `share` para corresponder ao layout da sua instalação. Para obter mais informações, consulte a Seção 6.5.1.2, “Comandos do cliente MySQL”, bem como a Seção 6.5.1.5, “Executando instruções SQL a partir de um arquivo de texto”.

###### Atualizando o componente do Firewall MySQL Enterprise

Esta seção descreve como atualizar uma instalação existente de um plugin do Firewall MySQL Enterprise para o componente do firewall.

Você pode realizar uma atualização do plugin do firewall para o componente do firewall usando o script `firewall_plugin_to_component.sql`, no diretório `share` da instalação MySQL. Este script realiza as seguintes tarefas:

* Migra quaisquer perfis de contas de plugin para perfis de grupo com usuários únicos.
* Elimina os procedimentos armazenados do plugin.
* Desinstala todos os plugins do firewall.
* Elimina todas as tabelas não usadas pelo componente.
* Altera as tabelas restantes após a eliminação das outras para conformar com as definições de tabela aceitas pelo componente do firewall.
* Traduz as variáveis do sistema do plugin para as usadas pelo componente e as persiste. Por exemplo, o valor de `mysql_firewall_database` é copiado para `component_firewall.database`.
* Instala o componente do firewall.
* Cria os procedimentos armazenados usados pelo componente.

Importante

Se o plugin do firewall foi carregado usando `--plugin-load-add`, você deve removê-lo da lista de plugins especificados para essa opção antes de executar `firewall_plugin_to_component.sql`.

Para realizar a atualização, inicie uma sessão do cliente **mysql** e garanta que o banco de dados atual seja o banco de dados do firewall (`mysql_firewall_database`). Após isso, basta executar o script. Isso é mostrado aqui:

```
mysql> SELECT @@mysql_firewall_database;
+---------------------------+
| @@mysql_firewall.database |
+---------------------------+
|                    myfwdb |
+---------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/firewall_plugin_to_component.sql
```

Usamos `myfwdb` no exemplo anterior como o nome do banco de dados do firewall; esse valor provavelmente será diferente no seu sistema. Além disso, você também pode precisar ajustar o caminho para o diretório `share`.

###### Downgrading o Componente do Firewall do MySQL Enterprise

Esta seção descreve como fazer o downgrade de uma instalação existente do componente do firewall do MySQL Enterprise para o plugin de firewall legado (desatualizado).

Um downgrade do componente do firewall para o plugin do firewall consiste em duas partes:

* Preparação para o plugin e desinstalação do componente do firewall

Isso é feito executando o script SQL `firewall_component_to_plugin.sql` em uma sessão do cliente **mysql**.

* Instalação do plugin do firewall

Isso é feito executando `linux_install_firewall.sql` ou `win_install_firewall.sql` (também no cliente **mysql**, dependendo da plataforma).

`firewall_component_to_plugin.sql` deve ser executado com o banco de dados do firewall como o banco de dados atual. Você pode garantir que isso seja o caso e, em seguida, executar o script usando o comando `source` do cliente **mysql**, como mostrado aqui:

```
SELECT @@component_firewall.database;
+-------------------------------+
| @@component_firewall.database |
+-------------------------------+
|                        myfwdb |
+-------------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/firewall_component_to_plugin.sql
```

O exemplo mostra `myfwdb` como o nome do banco de dados do firewall; esse valor provavelmente será diferente no seu sistema. Ajuste o caminho mostrado aqui para o diretório `share` conforme necessário para conformar com o layout de instalação no seu sistema.

`firewall_component_to_plugin.sql` termina com a saída mostrada aqui:

```
Restart mysqld with the following options:
--loose-mysql-firewall-database=database,
--loose-mysql-firewall-mode=mode,
--loose-mysql-firewall-reload-interval-seconds=seconds,
--loose-mysql-firewall-trace=trace,
and run win_install_firewall.sql or linux_install_firewall.sql on schema database.
```

Reinicie o servidor MySQL usando as opções e valores indicados, em seguida, inicie uma sessão do cliente **mysql** e execute `linux_install_firewall.sql` (plataformas Linux e outras Unix) ou `win_install_firewall.sql` (plataformas Windows). Veja Instalando o Plugin do Firewall do MySQL Enterprise para obter mais informações sobre como usar esses scripts para instalar o plugin do firewall.

##### 8.4.8.2.3 Usando o Componente do Firewall do MySQL Enterprise

Antes de usar o componente do Firewall do MySQL Enterprise, instale-o de acordo com as instruções fornecidas na Seção 8.4.8.2.2, “Instalação do Componente do Firewall do MySQL Enterprise”.

Esta seção descreve como configurar o componente do firewall usando instruções SQL. Alternativamente, o MySQL Workbench 6.3.4 e versões posteriores fornecem uma interface gráfica para o controle do firewall. Veja Interface do Firewall do MySQL Enterprise.

* Habilitar ou Desabilitar o Plugin do Firewall
* Agendar Recargas do Cache do Firewall
* Atribuir Privilegios de Firewall (Componente)")
* Conceitos de Firewall
* Registrar Perfis de Firewall
* Monitorar o Firewall

###### Habilitar ou Desabilitar o Plugin do Firewall

Para habilitar ou desabilitar o plugin do firewall, defina a variável de sistema `component_firewall.enabled`. Por padrão, isso é `ON` quando o componente do firewall é instalado. Para definir o estado inicial do firewall explicitamente na inicialização do servidor, você pode definir a variável em um arquivo de opção, como `my.cnf`, assim:

```
[mysqld]
component_firewall.enabled=ON
```

Após modificar `my.cnf`, você deve reiniciar o servidor para que o novo ajuste entre em vigor. Veja Seção 6.2.2.2, “Usando Arquivos de Opção”.

Alternativamente, você pode definir e persistir a configuração do firewall em tempo de execução executando uma das instruções SQL mostradas aqui:

```
SET PERSIST component_firewall.enabled = OFF;
SET PERSIST component_firewall.enabled = ON;
```

`SET PERSIST` define um valor para a instância do MySQL em execução e salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Consulte a Seção 15.7.6.1, “Sintaxe de SET para Atribuição de Variáveis”, para obter mais informações.

###### Agendamento de Recargas do Cache do Firewall

Cada vez que o componente do firewall é inicializado, ele carrega dados para seu cache interno das seguintes tabelas (consulte as Tabelas do Componente do Firewall do MySQL Enterprise):

* `firewall_group_allowlist`
* `firewall_groups`
* `firewall_membership`

Sem reiniciar o servidor ou reinstalar o plugin do lado do servidor, a modificação de dados fora do plugin não é refletida internamente. A variável de sistema `component_firewall.reload_interval_seconds` permite forçar recargas do cache de memória das tabelas em intervalos especificados. Por padrão, o valor do intervalo é `0`, o que desabilita tais recargas.

Para agendar recargas regulares do cache, primeiro certifique-se de que o componente `scheduler` está instalado e habilitado (consulte a Seção 7.5.5, “Componente Scheduler”). Para verificar o status do componente, use uma declaração `SHOW VARIABLES` semelhante a esta:

```
mysql> SHOW VARIABLES LIKE 'component_scheduler%';
+-----------------------------+-------+
| Variable_name               | Value |
+-----------------------------+-------|
| component_scheduler.enabled | On    |
+-----------------------------+-------+
```

Com o plugin do firewall instalado, defina `component_firewall.reload_interval_seconds` no início do servidor para um número entre 60 e `INT_MAX`, cujo valor é específico da plataforma. Valores na faixa de `1` a `59` (inclusivos) são resetados para 60, com uma advertência, como mostrado aqui:

```
$> mysqld [server-options] --component_firewall.reload_interval_seconds=40
...
2023-08-31T17:46:35.043468Z 0 [Warning] [MY-015031] [Server] Plugin MYSQL_FIREWALL
reported: 'Invalid reload interval specified: 40. Valid values are 0 (off) or
greater than or equal to 60. Adjusting to 60.'
...
```

Alternativamente, para definir e persistir esse valor no início, antecipe o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`, como este:

```
SET PERSIST_ONLY component_firewall.reload_interval_seconds = 120;
SET @@PERSIST_ONLY.component_firewall.reload_interval_seconds = 120;
```

Após realizar essa modificação, reinicie o servidor para que o novo ajuste entre em vigor.

###### Atribuição de Privilegios de Firewall (Componente)

Após a instalação e configuração do componente de firewall, você deve conceder os privilégios apropriados à conta ou contas de MySQL a serem usadas para administrá-lo. A atribuição de privilégios depende das operações de firewall que uma conta deve ser permitida para realizar, conforme listadas aqui:

* Conceda o privilégio `FIREWALL_EXEMPT` a qualquer conta que deva ser isenta das restrições de firewall. Isso é útil, por exemplo, para um administrador de banco de dados que configura o firewall, para evitar a possibilidade de uma configuração incorreta causar que até mesmo o administrador seja bloqueado e incapaz de executar instruções.

* Conceda o privilégio `FIREWALL_ADMIN` a qualquer conta que deva ter acesso administrativo completo ao firewall. (Algumas funções administrativas de firewall podem ser invocadas por contas que têm `FIREWALL_ADMIN` *ou* o desatualizado privilégio `SUPER`, conforme indicado nas descrições individuais das funções.)

* Conceda o privilégio `EXECUTE` para os procedimentos armazenados na base de dados do firewall (veja Procedimentos Armazenados do Componente de Firewall do MySQL Enterprise). Esses podem invocar funções administrativas, portanto, o acesso ao procedimento armazenado também requer os privilégios indicados anteriormente que são necessários para essas funções.

Observação

Os privilégios `FIREWALL_EXEMPT` e `FIREWALL_ADMIN` podem ser concedidos apenas enquanto o firewall estiver instalado, porque esses privilégios são definidos pelo `component_firewall`.

###### Conceitos de Firewall

O servidor MySQL permite que os clientes se conectem e recebe deles instruções SQL a serem executadas. Se o firewall estiver ativado, o servidor passa para ele cada instrução de entrada que não falhe imediatamente com um erro de sintaxe. Com base no fato de o firewall aceitar a instrução, o servidor a executa ou retorna um erro ao cliente. Esta seção descreve como o firewall realiza a tarefa de aceitar ou rejeitar instruções.

* Perfis de Firewall
* Conexão de Instruções de Firewall
* Modos Operacionais do Perfil
* Gerenciamento de Instruções de Firewall Quando Múltiplos Perfis Se Aplicam

###### Perfis de Firewall

O firewall usa um registro de perfis que determinam se a execução da instrução será permitida. Os perfis têm esses atributos:

* Uma lista de permissão. A lista de permissão é o conjunto de regras que define quais instruções são aceitáveis para o perfil.

* Um modo operacional atual. O modo permite que o perfil seja usado de maneiras diferentes. Por exemplo: o perfil pode ser colocado no modo de treinamento para estabelecer a lista de permissão; a lista de permissão pode ser usada para restringir a execução de instruções ou detecção de intrusão; o perfil pode ser desativado completamente.

* O firewall suporta perfis de grupo que podem ter múltiplas contas como membros, com a lista de permissão do perfil aplicando-se igualmente a todos os membros.

Inicialmente, não existem perfis, então, por padrão, o firewall aceita todas as instruções e não tem efeito sobre quais instruções as contas do MySQL podem executar. Para aplicar as capacidades de proteção do firewall, é necessária uma ação explícita. Isso inclui os seguintes passos:

* Registrar um ou mais perfis com o firewall.
* Treinar o firewall estabelecendo a lista de permissão para cada perfil; ou seja, os tipos de instruções que o perfil permite que os clientes executem.

* Coloque os perfis treinados no modo `PROTEGENDO` para endurecer o MySQL contra a execução não autorizada de declarações. Isso é feito primeiro associando cada sessão do cliente a uma combinação específica de nome de usuário e nome de host, conhecida como *conta de sessão*. Em seguida, para cada conexão do cliente, o firewall usa a conta de sessão para determinar qual perfil ou perfis se aplicam a declarações recebidas desse cliente, aceitando apenas as declarações permitidas pelas listas de permissão do perfil aplicável.

Nota

O componente de firewall não suporta perfis de conta. Para obter assistência na conversão de perfis de conta existentes antes da atualização do plugin de firewall, consulte Migrar perfis de conta para perfis de grupo.

A proteção baseada em perfis oferecida pelo firewall permite a implementação de estratégias como as listadas aqui:

* Se um aplicativo tiver requisitos de proteção únicos, faça com que ele use uma conta não usada para nenhum outro propósito e configure um perfil de grupo para essa conta.

* Se aplicativos relacionados compartilharem requisitos de proteção, associe cada aplicativo à sua própria conta e, em seguida, adicione essas contas de aplicativo como membros do mesmo perfil de grupo.

###### Conexão de Declarações do Firewall

A conexão de declarações realizada pelo firewall não usa declarações SQL recebidas dos clientes. Em vez disso, o servidor converte as declarações recebidas para uma forma de digest normalizada e a operação do firewall usa esses digests. O benefício da normalização das declarações é que ela permite que declarações semelhantes sejam agrupadas e reconhecidas usando um único padrão. Por exemplo, essas declarações são distintas entre si:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

Mas todas elas têm a mesma forma de digest normalizada, mostrada aqui:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

Ao usar a normalização, as listas de permissões do firewall podem armazenar digests que correspondem a várias declarações recebidas dos clientes. Para obter mais informações sobre normalização e digests, consulte a Seção 29.10, “Digests e Amostragem de Declarações do Schema de Desempenho”.

Aviso

Definir `max_digest_length` para `0` desativa a produção de digests, o que também desativa a funcionalidade do servidor que requer digests, como o MySQL Enterprise Firewall.

###### Modos Operacionais do Perfil

Cada perfil registrado no firewall tem seu próprio modo operacional, escolhido entre os seguintes valores:

* `OFF`: Desativa o perfil. O firewall considera o perfil inativo e o ignora.

* `RECORDING`: Modo de treinamento do firewall. Declarações recebidas de um cliente que correspondem ao perfil são consideradas aceitáveis para o perfil e tornam-se parte de sua “impressão digital”. O firewall registra a forma normalizada do digest de cada declaração para aprender os padrões de declaração aceitáveis para o perfil. Cada padrão é uma regra; a lista de permissões do perfil consiste na união de todas essas regras.

* `PROTECTING`: O perfil permite ou impede a execução de declarações. O firewall compara declarações recebidas com a lista de permissões do perfil, aceitando apenas declarações que correspondem e rejeitando aquelas que não correspondem. Após treinar um perfil no modo `RECORDING`, mude para o modo `PROTECTING` para reforçar o MySQL contra acessos por declarações que se desviam da lista de permissões. Se a variável de sistema `component_firewall.trace` estiver habilitada, o firewall também escreve quaisquer declarações rejeitadas no log de erro.

* `DESCOBRIMENTO`: Detecta, mas não bloqueia intrusões (declarações suspeitas, pois não correspondem a nada no `allowlist` do perfil). No modo `DESCOBRIMENTO`, o firewall escreve declarações suspeitas no log de erro, mas as aceita sem negar o acesso.

Quando um perfil é atribuído a qualquer um dos valores de modo anteriores, o firewall armazena o modo no perfil. As operações de configuração de modo do firewall também permitem o valor de modo `RESET`, mas este valor não é armazenado: configurar um perfil específico para o modo `RESET` faz com que o firewall exclua todas as regras para este perfil e, em seguida, configure seu modo para `DESLIGADO`.

Observação

Mensagens escritas no log de erro no modo `DESCOBRIMENTO` ou porque o `mysql_firewall_trace` está habilitado são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erro e não sejam descartadas, certifique-se de que a granularidade do registro de erro é suficiente para incluir mensagens de informação. Por exemplo, se você estiver usando a filtragem de log com base na prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Erro com Base na Prioridade (log\_filter\_internal)”), defina `log_error_verbosity` para `3`.

###### Gerenciamento de Declarações do Firewall Quando Múltiplos Perfis Se Aplicam

Por simplicidade, as seções posteriores que descrevem como configurar perfis assumem que o firewall compara declarações recebidas de um cliente apenas com um único perfil, seja um perfil de grupo ou um perfil de conta. Mas a operação do firewall pode ser mais complexa:

* Um perfil de grupo pode incluir múltiplas contas como membros.
* Uma conta pode ser membro de múltiplos perfis de grupo.
* Múltiplos perfis podem corresponder a um cliente específico.

A descrição a seguir abrange o caso geral de como o firewall opera, quando potencialmente múltiplos perfis se aplicam a declarações recebidas.

Como mencionado anteriormente, o MySQL associa cada sessão do cliente a uma combinação específica de nome de usuário e nome de host, conhecida como *conta de sessão*. O firewall compara a conta de sessão com os perfis registrados para determinar quais perfis se aplicam ao processamento de declarações recebidas da sessão:

* O firewall ignora perfis inativos (perfis com um modo de `OFF`).

* A conta de sessão corresponde a todos os perfis de grupo ativos que incluem um membro com o mesmo usuário e host. Pode haver mais de um perfil de grupo ativo.

* A conta de sessão corresponde a um perfil de conta ativo que tenha o mesmo usuário e host, se houver. Há, no máximo, um perfil de conta ativo.

Em outras palavras, a conta de sessão pode corresponder a 0 ou mais perfis de grupo ativos e 0 ou 1 perfil de conta ativo. Isso significa que 0, 1 ou vários perfis de firewall podem ser aplicáveis a uma sessão específica, para a qual o firewall processa cada declaração da seguinte forma:

* Se não houver perfil aplicável, o firewall não impõe restrições e aceita a declaração.

* Se houver perfis aplicáveis, seus modos determinam o processamento da declaração:

  + O firewall registra a declaração na lista de permissão de cada perfil aplicável que está no modo `RECORDING`.

  + O firewall escreve a declaração no log de erro para cada perfil aplicável no modo `DETECTING` para o qual a declaração é suspeita (não corresponde à lista de permissão do perfil).

+ O firewall aceita a declaração se pelo menos um perfil aplicável estiver no modo `RECORDANDO` ou `DETECTANDO` (esses modos aceitam todas as declarações) ou se a declaração corresponder à lista de permissões de pelo menos um perfil aplicável no modo `PROTEGENDO`. Caso contrário, o firewall rejeita a declaração (e a escreve no log de erro se a variável de sistema `mysql_firewall_trace` estiver habilitada).

Com essa descrição em mente, as seções seguintes retornam à simplicidade das situações em que um único perfil de grupo ou um único perfil de conta se aplicam e cobrem como configurar cada tipo de perfil.

###### Registro de Perfis de Firewall

O MySQL Enterprise Firewall suporta o registro de perfis de grupo. Um perfil de grupo pode ter múltiplas contas como seus membros. Para usar um perfil de grupo de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil e coloque-o no modo `RECORDANDO`.

2. Adicione uma conta membro ao perfil.
3. Conecte-se ao servidor MySQL usando essa conta membro e execute declarações para serem aprendidas. Isso treina o perfil e estabelece as regras que formam a lista de permissões do perfil.

4. Adicione quaisquer outras contas que serão membros do grupo ao perfil.

5. Mude o perfil para o modo `PROTEGENDO`. Quando um cliente se conecta ao servidor usando qualquer conta que seja membro do grupo, a lista de permissões do perfil restringe a execução das declarações.

6. Se for necessário mais treinamento, mude o perfil para o modo `RECORDANDO` novamente, atualize sua lista de permissões com novos padrões de declarações e, em seguida, mude de volta para o modo `PROTEGENDO`.

Observe essas diretrizes para referências de contas relacionadas ao plugin MySQL Enterprise Firewall:

* Tome nota do contexto em que as referências de contas ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como `CREATE USER` e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

  O requisito de nomear contas como uma string entre aspas simples para operações de firewall significa que você não pode usar nenhuma conta cujo nome de usuário contenha o caractere `@`.

* O firewall avalia declarações contra contas representadas por nomes de usuário e host reais autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede. As razões para isso são descritas aqui:

  + Suponha que exista uma conta chamada `me@%.example.org` e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.

  + O nome da conta contém um caractere curinga `%`, mas o servidor autentica o cliente como tendo o nome de usuário `me` e o nome do host `abc.example.com`, e é isso que o firewall vê.

  + Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O procedimento a seguir mostra como registrar um perfil de grupo com o firewall, treinar o firewall para saber as declarações aceitáveis para esse perfil (sua allowlist), usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis e adicionar e remover membros do grupo. O exemplo usa o nome do perfil de grupo `fwgrp`. O perfil exemplo é presumido para uso por clientes de uma aplicação que acessa tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta administrativa do MySQL para realizar os passos deste procedimento, exceto aqueles passos designados para execução por contas membros do perfil do grupo de firewall. Para declarações executadas por contas membros, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie as contas que serão membros do perfil do grupo `fwgrp` e conceda-lhes os privilégios de acesso apropriados. As declarações para uma conta membro são mostradas aqui (escolha uma senha apropriada):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use o procedimento armazenado `set_firewall_group_mode()` para registrar o perfil do grupo com o firewall e colocar o perfil no modo `RECORDING` (treinamento), como mostrado aqui:

   ```
   CALL firewall-database.set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use o procedimento armazenado `firewall_group_enlist()` para adicionar uma conta membro inicial para uso no treinamento do perfil de permissão do grupo:

   ```
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. Para treinar o perfil do grupo usando a conta membro inicial, conecte-se ao servidor como `member1` a partir do host do servidor para que o firewall veja uma conta de sessão para `member1@localhost`. Em seguida, execute algumas declarações que sejam consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   O firewall recebe as declarações da conta `member1@localhost`. Como essa conta é membro do perfil `fwgrp`, que está no modo `RECORDING`, o firewall interpreta as declarações como aplicáveis a `fwgrp` e registra a forma normalizada do digest dos registros como regras no `fwgrp` allowlist. Essas regras então se aplicam a todas as contas que são membros de `fwgrp`.

   Nota

Até que o perfil do grupo `fwgrp` receba declarações no modo `RECORDING`, sua lista de permissões estará vazia, o que é equivalente a "rejeitar tudo" e significa que nenhuma declaração pode corresponder. Isso tem as seguintes implicações:

* O perfil do grupo não pode ser alterado para o modo `PROTECTING`, pois ele rejeitaria todas as declarações, proibindo efetivamente que as contas que são membros do grupo executem qualquer declaração.

* O perfil do grupo pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as declarações, mas as registra como suspeitas.

5. Neste ponto, as informações do perfil do grupo são armazenadas em cache, incluindo seu nome, associação e lista de permissões. Para ver essas informações, consulte as tabelas do firewall do Schema de Desempenho, da seguinte forma:

   ```
   mysql> SELECT MODE FROM performance_schema.firewall_groups
       -> WHERE NAME = 'fwgrp';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+

   mysql> SELECT * FROM performance_schema.firewall_membership
       -> WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   +----------+-------------------+

   mysql> SELECT RULE FROM performance_schema.firewall_group_allowlist
       -> WHERE NAME = 'fwgrp';
   +----------------------------------------------------------------------+
   | RULE                                                                 |
   +----------------------------------------------------------------------+
   | SELECT @@`version_comment` LIMIT ?                                   |
   | UPDATE `actor` SET `last_update` = NOW ( ) WHERE `actor_id` = ?      |
   | SELECT `title` , `release_year` FROM `film` WHERE `film_id` = ?      |
   | SELECT `store_id` , COUNT ( * ) FROM `inventory` GROUP BY `store_id` |
   +----------------------------------------------------------------------+
   ```

   Consulte a Seção 29.12.17, “Tabelas do Firewall do Schema de Desempenho”, para obter mais informações sobre essas tabelas.

   Nota

   A regra `@@version_comment` vem de uma declaração enviada automaticamente pelo cliente **mysql** quando ele se conecta ao servidor.

   Importante

   Treine o firewall em condições que correspondam ao uso da aplicação. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar declarações ao servidor no início de cada sessão. Se uma aplicação normalmente for usada por meio desse conector, treine o firewall usando o conector também. Isso permite que essas declarações iniciais se tornem parte da lista de permissões para o perfil do grupo associado à aplicação.

6. Inicie novamente o `set_firewall_group_mode()` para alterar o perfil do grupo para o modo `PROTECTING`:

   ```
   CALL firewall-database.set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Importante

A mudança do perfil do grupo para o modo `RECORDANDO` sincroniza seus dados armazenados nas tabelas do banco de dados do firewall que fornecem armazenamento subjacente persistente. Se você não mudar o modo para um perfil que está sendo gravado, os dados armazenados não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado.

7. Adicione quaisquer outras contas que devem ser membros deste perfil do grupo, da seguinte forma:

   ```
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   O perfil allowlist treinado usando a conta `member1@localhost` agora também se aplica às contas que foram adicionadas.

8. Para verificar a associação atualizada do grupo, execute novamente a consulta na tabela `firewall_membership`:

   ```
   mysql> SELECT * FROM performance_schema.firewall_membership
       -> WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   | fwgrp    | member2@localhost |
   | fwgrp    | member3@localhost |
   | fwgrp    | member4@localhost |
   +----------+-------------------+
   ```

9. Teste o perfil do grupo contra o firewall usando qualquer conta do grupo para executar algumas declarações aceitáveis e inaceitáveis. O firewall combina cada declaração dessa conta com a lista de permissão do perfil e a aceita ou rejeita com base no resultado, conforme descrito aqui:

   * Esta declaração não é idêntica a nenhuma das declarações de treinamento, mas produz a mesma declaração normalizada que uma delas, então o firewall a aceita:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

   * Essas declarações não correspondem a nada na lista de permissão, então o firewall rejeita cada uma com um erro:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * Se `component_firewall.trace` estiver habilitado, o firewall também escreve declarações rejeitadas no log de erro. Essas mensagens de log podem ser úteis para identificar a origem dos ataques, caso seja necessário.

10. Se os membros precisarem ser removidos do perfil do grupo, use o procedimento armazenado `firewall_group_delist()`, da seguinte forma:

    ```
    CALL firewall-database.firewall_group_delist('fwgrp', 'member3@localhost');
    ```

O perfil do grupo de firewall agora está configurado para contas de membros. Quando os clientes se conectam usando qualquer conta do grupo e tentam executar instruções, o perfil protege o MySQL contra instruções que não estão no allowlist do perfil.

O procedimento mostrado acima adicionou apenas um membro ao perfil do grupo antes de treinar seu allowlist. Isso fornece um melhor controle sobre o período de treinamento, limitando quais contas podem adicionar novas instruções aceitáveis ao allowlist. Se for necessário um treinamento adicional, você pode alternar o perfil de volta para o modo `RECORDING`, da seguinte maneira:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'RECORDING');
```

Você deve ter em mente que isso permite que qualquer membro do grupo execute instruções e as adicione ao allowlist. Para limitar o treinamento adicional a um único membro do grupo, chame `set_firewall_group_mode_and_user()` em vez disso. Isso é como `set_firewall_group_mode()` mas leva um argumento adicional que especifica qual conta é permitida para treinar o perfil no modo `RECORDING`. Por exemplo, para habilitar o treinamento apenas por `member4@localhost`, chame `set_firewall_group_mode_and_user()` como mostrado aqui:

```
CALL firewall-database.set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

Isso habilita o treinamento adicional pela conta especificada sem precisar remover os outros membros do grupo. (Eles podem executar instruções, mas as instruções não são adicionadas ao allowlist.) Você também deve ter em mente que, no modo `RECORDING`, os outros membros podem executar *qualquer* instrução.

Nota

Para evitar comportamento inesperado quando uma conta específica é especificada como a conta de treinamento para um perfil de grupo, sempre garanta que a conta seja membro do grupo.

Após o treinamento adicional, configure o perfil do grupo de volta para o modo `PROTECTING`, da seguinte maneira:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'PROTECTING');
```

A conta de treinamento estabelecida por `set_firewall_group_mode_and_user()` é salva no perfil do grupo, para que o firewall a lembre caso mais treinamento seja necessário mais tarde. Assim, se você chamar `set_firewall_group_mode()` (que não aceita argumento de conta de treinamento), a conta de treinamento atual do perfil, `member4@localhost`, permanece inalterada.

Se desejar, você pode limpar a conta de treinamento e habilitar todos os membros do grupo a realizar treinamento no modo `RECORDING`, chamando `set_firewall_group_mode_and_user()` e passando `NULL` para o nome da conta, como mostrado aqui:

```
CALL firewall-database.set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

É possível detectar intrusões registrando declarações não correspondentes como suspeitas, sem negar o acesso. Primeiro, coloque o perfil do grupo no modo `DETECTING`, assim:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'DETECTING');
```

Em seguida, usando uma conta de membro, execute uma declaração que não corresponda à lista de permissões do perfil do grupo. No modo `DETECTING`, o firewall permite que a declaração não correspondente seja executada, como mostrado aqui:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

Além disso, o firewall escreve uma mensagem no log de erro.

Para desabilitar um perfil de grupo, mude seu modo para `OFF`, assim:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'OFF');
```

Para esquecer todo o treinamento para um perfil e desabilitar, reinicie-o:

```
CALL firewall-database.sp_set_firewall_group_mode('fwgrp', 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras para este perfil e defina seu modo para `OFF`.

###### Monitoramento do Firewall

Você pode avaliar a atividade do firewall examinando suas variáveis de status associadas. Por exemplo, após realizar o procedimento mostrado anteriormente para treinar e proteger o perfil do grupo `fwgrp` (veja Registrando perfis de firewall), essas variáveis têm os valores mostrados na saída da seguinte declaração `SHOW GLOBAL STATUS`:

```
mysql> SHOW GLOBAL STATUS LIKE 'firewall%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| firewall_access_denied     | 3     |
| firewall_access_granted    | 4     |
| firewall_access_suspicious | 1     |
| firewall_cached_entries    | 4     |
+----------------------------+-------+
```

Essas variáveis indicam o número de declarações rejeitadas, aceitas, registradas como suspeitas e adicionadas ao cache, respectivamente. `firewall_access_granted` é 4 devido à declaração `@@version_comment` enviada pelo cliente **mysql** cada uma das três vezes que a conta registrada se conectou ao servidor, mais a declaração `SHOW TABLES` que não foi bloqueada no modo `DETECTING`.

##### 8.4.8.2.4 Referência do Componente do Firewall Empresarial do MySQL

As seções seguintes fornecem informações de referência para elementos do componente do Firewall Empresarial do MySQL, incluindo tabelas, rotinas armazenadas, variáveis de sistema e status, e scripts SQL.

* Tabelas do Componente do Firewall Empresarial do MySQL
* Procedimentos Armazenados do Componente do Firewall Empresarial do MySQL
* Funções do Componente do Firewall Empresarial do MySQL
* Variáveis de Sistema do Componente do Firewall Empresarial do MySQL
* Variáveis de Status do Componente do Firewall Empresarial do MySQL
* Scripts do Componente do Firewall Empresarial do MySQL

###### Tabelas do Componente do Firewall Empresarial do MySQL

o componente do Firewall Empresarial do MySQL mantém informações de perfil por grupo, usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do Schema de Informações para fornecer visões sobre dados em cache na memória. Quando habilitado, o firewall baseia as decisões operacionais nos dados em cache. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um determinado durante a instalação do componente (veja Instalar o Componente do Firewall Empresarial do MySQL).

As tabelas no banco de dados do firewall são abordadas nesta seção. Para informações sobre as tabelas do Schema de Desempenho do Firewall do MySQL, consulte a Seção 29.12.17, “Tabelas de Firewall do Schema de Desempenho”.

O componente MySQL Enterprise Firewall mantém as informações do perfil do grupo usando tabelas no banco de dados do firewall para armazenamento persistente e as tabelas do Schema de Desempenho para fornecer visões sobre dados em memória e cacheados.

Cada tabela do sistema e do Schema de Desempenho é acessível apenas por contas que têm o privilégio `SELECT` para ela.

A tabela `firewall-database.firewall_groups` lista os nomes e os modos operacionais dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_groups` tendo colunas semelhantes, mas não necessariamente idênticas):

* `NAME`

  O nome do perfil do grupo.

* `MODE`

  O modo operacional atual para o perfil. Os valores permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para detalhes sobre seus significados, consulte Conceitos de Firewall.

* `USERHOST`

  A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

  + Se o valor for `NULL`, as regras de allowlist do firewall são registradas para declarações recebidas de qualquer conta que seja membro do grupo.

  + Se o valor for `não NULL`, as regras de allowlist do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

A tabela `firewall-database.firewall_group_allowlist` lista as regras de allowlist dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_group_allowlist` tendo colunas semelhantes, mas não necessariamente idênticas):

* `NAME`

  O nome do perfil do grupo.

* `RULE`

Uma declaração normalizada indicando um padrão de declaração aceitável para o perfil. Uma lista de permissões de perfil é a união de suas regras.

* `ID`

  Uma coluna inteira que é uma chave primária para a tabela.

A tabela `firewall-database.firewall_membership` lista os membros (contas) dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_membership` tendo colunas semelhantes, mas não necessariamente idênticas):

* `GROUP_ID`

  O nome do perfil de grupo.

* `MEMBER_ID`

  O nome de uma conta que é membro do perfil.

###### Procedimentos Armazenados do Componente do Firewall do MySQL Enterprise

O componente do Firewall do MySQL Enterprise fornece os seguintes procedimentos armazenados para realizar operações de gerenciamento em perfis de grupo de firewall:

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

  + *`user`*: A conta a ser adicionada, como uma string no formato `user_name@host_name`.

  Exemplo:

  ```
  CALL mysql.sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `sp_firewall_group_remove(name)`

Remove o grupo com o nome fornecido.

* `sp_firewall_group_rename(oldname, newname)`

  Renomeia o grupo chamado *`oldname`* para *`newname`*.

* `sp_reload_firewall_group_rules(group)`

  Este procedimento armazenado fornece controle sobre a operação do firewall para perfis de grupo individuais. O procedimento usa funções administrativas do firewall para recarregar as regras de memória para um perfil de grupo a partir das regras armazenadas na tabela `firewall-database.firewall_group_allowlist`.

  Argumentos:

  + *`group`*: O nome do perfil de grupo afetado.

  Exemplo:

  ```
  CALL mysql.sp_reload_firewall_group_rules('myapp');
  ```

  Aviso

  Este procedimento limpa as regras do allowlist de memória do perfil de grupo antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não era `OFF` antes da chamada `sp_reload_firewall_group_rules()`, use `sp_set_firewall_group_mode()` para restaurá-lo ao modo anterior após recarregar as regras. Por exemplo, se o perfil estava no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_group_rules()` e você deve defini-lo explicitamente para `PROTECTING` novamente.

* `sp_set_firewall_group_mode(group, mode)`

  Este procedimento armazenado estabelece o modo operacional para um perfil de grupo de firewall, após registrar o perfil com o firewall, se ele não estiver já registrado. O procedimento também invoca funções administrativas do firewall conforme necessário para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo se a variável de sistema `mysql_firewall_mode` estiver em `OFF`, embora definir o modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

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

+ `mode`: O modo operacional para o perfil, como uma string. Os valores de modo permitidos são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para detalhes sobre seus significados, consulte Conceitos de Firewall.

+ `user`: A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

    - Se o valor for `NULL`, as regras de lista de permissão do firewall são registradas para declarações recebidas de qualquer conta que seja membro do grupo.

    - Se o valor for `não NULL`, as regras de lista de permissão do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

Exemplo:

```
  CALL mysql.sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

###### Funções do Componente de Firewall Empresarial do MySQL

As funções administrativas do Firewall Empresarial do MySQL fornecem uma API para tarefas de nível mais baixo, como sincronizar a cache do firewall com as tabelas do sistema subjacente.

*Em operação normal, essas funções são invocadas pelos procedimentos armazenados do firewall, e não diretamente pelos usuários.* Por esse motivo, essas descrições de funções não incluem detalhes como informações sobre seus argumentos e tipos de retorno.

Essas funções realizam operações de gerenciamento nos perfis de grupos de firewall:

* `firewall_group_delist(grupo, usuário)`

  Essa função remove uma conta de um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

* `firewall_group_enlist(grupo, usuário)`

  Essa função adiciona uma conta a um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

  Não é necessário registrar a própria conta com o firewall antes de adicionar a conta ao grupo.

  Exemplo:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `mysql_firewall_flush_status()`

  Essa função reescreve várias variáveis de status do firewall para 0:

  + `firewall_access_denied`
  + `firewall_access_granted`
  + `firewall_access_suspicious`

  Essa função requer o privilégio `FIREWALL_ADMIN` ou o privilégio desatualizado `SUPER`.

  Exemplo:

  ```
  SELECT mysql_firewall_flush_status();
  ```

* `read_firewall_group_allowlist(grupo, regra)`

  Essa função agregada atualiza o cache de declarações registradas para o perfil de grupo nomeado por meio de uma instrução `SELECT` na tabela `firewall-database.firewall_group_allowlist`. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

* `read_firewall_groups(grupo, modo, usuário)`

  Essa função agregada atualiza o cache de perfil de grupo do firewall por meio de uma instrução `SELECT` na tabela `firewall-database.firewall_groups`. Requer o privilégio `FIREWALL_ADMIN`.

  Exemplo:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

* `set_firewall_group_mode(grupo, modo[, usuário])`

Essa função gerencia o cache do perfil do firewall, estabelece o modo operacional do perfil e, opcionalmente, especifica a conta de treinamento do perfil. Requer o privilégio `FIREWALL_ADMIN`.

Se o argumento opcional *`user`* não for fornecido, qualquer configuração anterior de *`user`* para o perfil permanece inalterada. Para alterar a configuração, chame a função com um terceiro argumento.

Se o argumento opcional *`user`* for fornecido, ele especifica a conta de treinamento do perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL` ou uma conta `não NULL` que tenha o formato `user_name@host_name`:

+ Se o valor for `NULL`, as regras de lista de permissão do firewall são registradas para declarações recebidas de qualquer conta que seja membro do grupo.

+ Se o valor for `não NULL`, as regras de lista de permissão do firewall são registradas apenas para declarações recebidas da conta nomeada (que deve ser membro do grupo).

Exemplo:

```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

###### Variáveis de Sistema do Componente do Firewall do MySQL Enterprise

O componente do firewall do MySQL Enterprise fornece as variáveis de sistema listadas nesta seção. Essas variáveis não estão disponíveis a menos que o componente seja instalado (consulte a Seção 8.4.8.1.2, “Instalando ou Desinstalando o Plugin do Firewall do MySQL Enterprise”).

* `component_firewall.database`

<table frame="box" rules="all" summary="Propriedades para o componente_firewall.database"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="firewall-component.html#sysvar_component_firewall.database">component_firewall.database</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</code></a></code> Dicas de Configuração Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">mysql</code></td> </tr></tbody></table>

  O nome da base de dados utilizada para as tabelas do componente MySQL Enterprise Firewall. Para obter mais informações sobre essas tabelas, consulte Tabelas de Componentes do MySQL Enterprise Firewall.

* `component_firewall.enabled`

  <table frame="box" rules="all" summary="Propriedades para o componente_firewall.enabled"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="firewall-component.html#sysvar_component_firewall.enabled">component_firewall.enabled</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</code></a></code> Dicas de Configuração Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  Se o componente MySQL Enterprise Firewall está habilitado.

* `component_firewall.reload_interval_seconds`

<table frame="box" rules="all" summary="Propriedades para component_firewall.reload_interval_seconds">
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="firewall-component.html#sysvar_component_firewall.reload_interval_seconds">component_firewall.reload_interval_seconds</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">60 (0 = sem recarga)</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">INT_MAX</code></td> </tr>
  <tr><th>Unidade</th> <td>segundos</td> </tr>
</table>

Tempo em segundos entre as recargas do cache interno do Firewall Empresarial MySQL. Defina para 0 para desativar. Os valores de 1 a 59, inclusive, são arredondados para 60.

* `component_firewall.trace`

<table frame="box" rules="all" summary="Propriedades para o componente_firewall.trace"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="firewall-component.html#sysvar_component_firewall.trace">component_firewall.trace</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Se o rastreamento do componente firewall está habilitado ou desabilitado (o padrão). Quando o rastreamento está habilitado, para o modo `PROTECTING`, o firewall escreve declarações rejeitadas no log de erro.

###### Variáveis de Status do Componente do Firewall do MySQL Enterprise

O componente do firewall do MySQL Enterprise fornece as variáveis de status listadas nesta seção; você pode usá-las para obter informações sobre o status operacional do componente do firewall.

As variáveis de status do componente do firewall são definidas como 0 sempre que o componente é instalado ou o servidor é iniciado.

* `firewall_access_denied`

  O número de declarações rejeitadas pelo componente do firewall do MySQL Enterprise.

* `firewall_access_granted`

  O número de declarações aceitas pelo componente do firewall do MySQL Enterprise.

* `firewall_access_suspicious`

  O número de declarações registradas pelo componente do firewall do MySQL Enterprise como suspeitas para usuários no modo `DETECTING`.

* `firewall_cached_entries`

  O número de declarações registradas pelo componente do firewall do MySQL Enterprise, incluindo duplicatas.

###### Scripts de Componentes do Firewall Empresarial do MySQL

Esta seção contém informações sobre os scripts SQL fornecidos pelo componente do Firewall Empresarial do MySQL.

* `install_component_firewall.sql`

  Este script instala todos os elementos do componente do Firewall Empresarial do MySQL, realizando as etapas listadas aqui:

  1. Verifica se o plugin do firewall está instalado; se estiver, para com um erro.

  2. Cria as tabelas do componente (consulte Tabelas do Componentes do Firewall Empresarial do MySQL).

  3. Instala o componente.

  4. Cria os procedimentos armazenados do componente (consulte Procedimentos Armazenados do Componentes do Firewall Empresarial do MySQL).

  Consulte Instalar o Componentes do Firewall Empresarial do MySQL para obter instruções de uso.

* `firewall_plugin_to_component.sql`

  Este script atualiza uma instalação existente do plugin do firewall para uma instalação do componente do firewall. Ele realiza as etapas listadas aqui:

  1. Executa `firewall_profile_migration.sql` (fornecido pelo plugin do firewall) para migrar perfis de conta para perfis de grupo. (O componente do firewall não suporta perfis de conta.)

  2. Desinstala o plugin do firewall usando `uninstall_firewall.sql` (também fornecido pelo plugin do firewall).

  3. Elimina os procedimentos armazenados e funções do plugin.

  4. Elimina as tabelas `firewall_whitelist` e `firewall_users`.

  5. Instala o componente do firewall usando `install_component_firewall.sql`, ignorando a verificação do plugin.

  Observação

  Se o plugin do firewall foi carregado usando `--plugin-load-add`, você deve removê-lo dessa opção antes de executar o script.

  Consulte Atualizar para o Componentes do Firewall Empresarial do MySQL para obter informações e instruções adicionais.

* `firewall_component_to_plugin.sql`

Este script pode ser usado para realizar uma desinstalação do componente do Firewall do MySQL Enterprise para o plugin do firewall. `firewall_component_to_plugin.sql` realiza as seguintes ações:

1. Desinstala o componente do firewall usando `uninstall_component_firewall.sql`.

2. Elimina os procedimentos e funções armazenados do componente.

3. Cria as tabelas `firewall_whitelist` e `firewall_users`.

4. Cria os procedimentos e funções armazenados do plugin.

Consulte Desconexão do componente do Firewall do MySQL Enterprise para obter informações de uso e outras informações.

* `uninstall_component_firewall.sql`

Execute este script para remover uma instalação do componente do Firewall do MySQL Enterprise. O script realiza as etapas listadas aqui:

1. Desinstala as tabelas do componente do firewall.

2. Elimina os procedimentos e funções armazenados do componente.

3. Desinstala o componente do firewall.

Para obter informações de uso, consulte Desinstalação do componente do Firewall do MySQL Enterprise.
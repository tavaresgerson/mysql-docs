#### 8.4.7.3 Usando o Firewall Empresarial do MySQL

Antes de usar o Firewall Empresarial do MySQL, instale-o de acordo com as instruções fornecidas na Seção 8.4.7.2, “Instalando ou Desinstalando o Firewall Empresarial do MySQL”.

Esta seção descreve como configurar o Firewall Empresarial do MySQL usando instruções SQL. Alternativamente, o MySQL Workbench 6.3.4 ou superior fornece uma interface gráfica para o controle do firewall. Veja a Interface do Firewall Empresarial do MySQL.

*  Habilitando ou Desabilitando o Firewall
*  Agendando Recargas do Cache do Firewall
*  Atribuindo Privilegios ao Firewall
*  Conceitos do Firewall
*  Registrando Perfis de Grupo do Firewall
*  Registrando Perfis de Conta do Firewall
*  Monitorando o Firewall
*  Migrando Perfis de Conta para Perfis de Grupo

##### Habilitando ou Desabilitando o Firewall

Para habilitar ou desabilitar o firewall, defina a variável de sistema `mysql_firewall_mode`. Por padrão, essa variável está habilitada quando o firewall é instalado. Para controlar explicitamente o estado inicial do firewall, você pode definir a variável no início do servidor. Por exemplo, para habilitar o firewall em um arquivo de opções, use essas linhas:

```
[mysqld]
mysql_firewall_mode=ON
```

Após modificar o `my.cnf`, reinicie o servidor para fazer com que o novo ajuste entre em vigor.

Alternativamente, para definir e persistir o ajuste do firewall em tempo de execução:

```
SET PERSIST mysql_firewall_mode = OFF;
SET PERSIST mysql_firewall_mode = ON;
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

##### Agendando Recargas do Cache do Firewall

Cada vez que o plugin do lado do servidor `MYSQL_FIREWALL` é inicializado, ele carrega dados dessas tabelas para seu cache interno:

* `firewall_whitelist`
* `firewall_group_allowlist`
* `firewall_users`
* `firewall_groups`
* `firewall_membership`

Sem reiniciar o servidor ou reinstalar o plugin do lado do servidor, a modificação de dados fora do plugin não é refletida internamente. A variável de sistema `mysql_firewall_reload_interval_seconds` permite forçar reposições do cache de memória das tabelas em intervalos especificados. Por padrão, o valor do intervalo periódico é definido como zero, o que desabilita as reposições.

Para agendar reposições periódicas do cache, primeiro certifique-se de que o componente `scheduler` está instalado e habilitado (consulte a Seção 7.5.5, “Componente Scheduler”). Para verificar o status do componente:

```
SHOW VARIABLES LIKE 'component_scheduler%';
+-----------------------------+-------+
| Variable_name               | Value |
+-----------------------------+-------|
| component_scheduler.enabled | On    |
+-----------------------------+-------+
```

Com o firewall instalado, defina a variável de sistema global `mysql_firewall_reload_interval_seconds` no início do servidor para um número entre 60 e o valor da macro INT_MAX da plataforma que hospeda o servidor. Valores entre zero e 60 (1 a 59) são redefinidos para 60. Por exemplo:

```
$> mysqld [server-options] --mysql-firewall-reload-interval-seconds=40
...
2023-08-31T17:46:35.043468Z 0 [Warning] [MY-015031] [Server] Plugin MYSQL_FIREWALL
reported: 'Invalid reload interval specified: 40. Valid values are 0 (off) or
greater than or equal to 60. Adjusting to 60.'
...
```

Alternativamente, para definir e persistir a configuração do firewall no início, antecipe o nome da variável de leitura somente pelo termo `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`:

```
SET PERSIST_ONLY mysql_firewall_reload_interval_seconds = 120;
SET @@PERSIST_ONLY.mysql_firewall_reload_interval_seconds = 120;
```

Após modificar a variável, reinicie o servidor para que a nova configuração entre em vigor.

##### Atribuição de Privilegios de Firewall

Com o firewall instalado, conceda os privilégios apropriados à conta MySQL ou contas a serem usadas para administrá-la. Os privilégios dependem das operações de firewall que uma conta deve ser permitida para realizar:

* Conceda o privilégio `FIREWALL_EXEMPT` a qualquer conta que deve ser isenta das restrições do firewall. Isso é útil, por exemplo, para um administrador de banco de dados que configura o firewall, para evitar a possibilidade de uma configuração incorreta causar até mesmo o bloqueio do administrador e sua incapacidade de executar instruções.
* Conceda o privilégio `FIREWALL_ADMIN` a qualquer conta que deve ter acesso administrativo completo ao firewall. (Algumas funções administrativas do firewall podem ser invocadas por contas que possuem o privilégio `FIREWALL_ADMIN` *ou* o desatualizado privilégio `SUPER`, conforme indicado nas descrições individuais das funções.)
* Conceda o privilégio `FIREWALL_USER` a qualquer conta que deve ter acesso administrativo apenas para suas próprias regras de firewall.
* Conceda o privilégio `EXECUTE` para os procedimentos armazenados do firewall na base de dados do firewall. Esses procedimentos podem invocar funções administrativas, portanto, o acesso ao procedimento armazenado também requer os privilégios indicados anteriormente que são necessários para essas funções. A base de dados do firewall pode ser a base de dados do sistema `mysql` ou um esquema personalizado (veja Instalando o Firewall Empresarial MySQL).

::: info Nota

Os privilégios `FIREWALL_EXEMPT`, `FIREWALL_ADMIN` e `FIREWALL_USER` podem ser concedidos apenas enquanto o firewall estiver instalado, porque o plugin `MYSQL_FIREWALL` define esses privilégios.

:::

##### Conceitos de Firewall

O servidor MySQL permite que os clientes se conectem e recebe deles instruções SQL a serem executadas. Se o firewall estiver habilitado, o servidor passa para ele cada instrução de entrada que não falhe imediatamente com um erro de sintaxe. Com base no fato de o firewall aceitar a instrução, o servidor a executa ou retorna um erro ao cliente. Esta seção descreve como o firewall realiza a tarefa de aceitar ou rejeitar instruções.

*  Perfis de Firewall
*  Concorrencia de Instruções de Firewall
*  Modos Operacionais do Perfil
*  Tratamento de Instruções do Firewall Quando Vários Perfis Se Aplicam

###### Perfis de Firewall
*  Perfis de Firewall
*  Concorrencia de Instruções de Firewall
*  Modos Operacionais do Perfil
*  Tratamento de Instruções do Firewall Quando Vários Perfis Se Aplicam

O firewall utiliza um registro de perfis que determina se a execução de declarações é permitida. Os perfis têm esses atributos:

* Uma lista de permissão. A lista de permissão é o conjunto de regras que define quais declarações são aceitáveis para o perfil.
* Um modo operacional atual. O modo permite que o perfil seja usado de maneiras diferentes. Por exemplo: o perfil pode ser colocado no modo de treinamento para estabelecer a lista de permissão; a lista de permissão pode ser usada para restringir a execução de declarações ou detecção de intrusões; o perfil pode ser desativado completamente.
* Um escopo de aplicabilidade. O escopo indica para quais conexões de clientes o perfil se aplica:

  + O firewall suporta perfis baseados em contas, de modo que cada perfil corresponda a uma conta de cliente específica (combinação de nome de usuário e nome de host do cliente). Por exemplo, você pode registrar um perfil de conta para o qual a lista de permissão se aplica a conexões originárias de `admin@localhost` e outro perfil de conta para o qual a lista de permissão se aplica a conexões originárias de `myapp@apphost.example.com`.
  + O firewall suporta perfis de grupo que podem ter múltiplas contas como membros, com a lista de permissão do perfil aplicando-se igualmente a todos os membros. Os perfis de grupo permitem uma administração mais fácil e maior flexibilidade para implantações que exigem a aplicação de um conjunto específico de regras da lista de permissão a múltiplas contas.

Inicialmente, não existem perfis, então, por padrão, o firewall aceita todas as declarações e não tem efeito sobre quais declarações as contas MySQL podem executar. Para aplicar as capacidades de proteção do firewall, é necessária uma ação explícita:

* Registrar um ou mais perfis com o firewall.
* Treinar o firewall estabelecendo a lista de permissão para cada perfil; ou seja, os tipos de declarações que o perfil permite que os clientes executem.
* Colocar os perfis treinados no modo de proteção para reforçar o MySQL contra a execução não autorizada de declarações:

O firewall associa cada sessão de cliente a uma combinação específica de nome de usuário e nome de host. Essa combinação é a *conta de sessão*.
Para cada conexão de cliente, o firewall usa a conta de sessão para determinar quais perfis se aplicam ao processamento de declarações recebidas do cliente.

O firewall aceita apenas declarações permitidas pelas listas de permissão do perfil aplicável.
A maioria dos princípios de firewall se aplicam de forma idêntica aos perfis de grupo e perfis de conta. Os dois tipos de perfis diferem nesses aspectos:
* Uma lista de permissão de perfil de conta aplica-se apenas a uma única conta. Uma lista de permissão de perfil de grupo aplica-se quando a conta de sessão corresponde a qualquer conta que seja membro do grupo.
* Para aplicar uma lista de permissão a várias contas usando perfis de conta, é necessário registrar um perfil por conta e duplicar a lista de permissão em cada perfil. Isso implica em treinar cada perfil de conta individualmente, pois cada um deve ser treinado usando a única conta à qual se aplica.
* Uma lista de permissão de perfil de grupo aplica-se a várias contas, sem necessidade de duplicá-la para cada conta. Um perfil de grupo pode ser treinado usando qualquer ou todas as contas membros do grupo, ou o treinamento pode ser limitado a qualquer membro individual. De qualquer forma, a lista de permissão se aplica a todos os membros.
* Os nomes dos perfis de conta são baseados em combinações específicas de nome de usuário e nome de host que dependem de quais clientes se conectam ao servidor MySQL. Os nomes dos perfis de grupo são escolhidos pelo administrador do firewall sem restrições além de que sua duração deve ser de 1 a 288 caracteres.

::: info Nota
Note

Devido às vantagens dos perfis de grupo em relação aos perfis de conta, e porque um perfil de grupo com uma única conta de membro é logicamente equivalente a um perfil de conta para essa conta, recomenda-se que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desaconselhados e estarão sujeitos à remoção em uma versão futura do MySQL. Para obter assistência na conversão de perfis de conta existentes, consulte Migrar perfis de conta para perfis de grupo.

:::

A proteção baseada em perfis oferecida pelo firewall permite a implementação de estratégias como estas:

* Se um aplicativo tiver requisitos de proteção únicos, configure-o para usar uma conta que não seja usada para nenhum outro propósito e configure um perfil de grupo ou perfil de conta para essa conta.
* Se aplicativos relacionados compartilharem requisitos de proteção, associe cada aplicativo à sua própria conta e, em seguida, adicione essas contas de aplicativo como membros do mesmo perfil de grupo. Alternativamente, configure todas as aplicações para usar a mesma conta e associe-as a um perfil de conta para essa conta.

###### Firewall Statement Matching

O matching de declarações realizado pelo firewall não usa declarações SQL recebidas dos clientes. Em vez disso, o servidor converte as declarações recebidas para uma forma normalizada de digestão e a operação do firewall usa esses digests. O benefício da normalização das declarações é que ela permite que declarações semelhantes sejam agrupadas e reconhecidas usando um único padrão. Por exemplo, essas declarações são distintas entre si:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

Mas todas elas têm a mesma forma de digestão normalizada:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

Ao usar a normalização, as listas de permissões do firewall podem armazenar digests que correspondem a muitas declarações diferentes recebidas dos clientes. Para obter mais informações sobre normalização e digests, consulte a Seção 29.10, “Digests de declarações do Schema de Desempenho e Amostragem”.

Aviso

Definir a variável de sistema `max_digest_length` como zero desativa a produção de digests, o que também desativa a funcionalidade do servidor que requer digests, como o MySQL Enterprise Firewall.

###### Modos Operacionais do Perfil

Cada perfil registrado no firewall tem seu próprio modo operacional, escolhido entre esses valores:

* `OFF`: Este modo desativa o perfil. O firewall o considera inativo e o ignora.
* `RECORDING`: Este é o modo de treinamento do firewall. As declarações recebidas de um cliente que correspondem ao perfil são consideradas aceitáveis para o perfil e tornam-se parte de sua “impressão digital”. O firewall registra a forma normalizada do digest de cada declaração para aprender os padrões de declaração aceitáveis para o perfil. Cada padrão é uma regra, e a união das regras é a lista de permissão do perfil.

A diferença entre perfis de grupo e de conta é que o registro de declarações para um perfil de grupo pode ser limitado a declarações recebidas de um único membro do grupo (o membro de treinamento).
* `PROTECTING`: Neste modo, o perfil permite ou impede a execução de declarações. O firewall compara as declarações recebidas com a lista de permissão do perfil, aceitando apenas as que correspondem e rejeitando as que não correspondem. Após treinar um perfil no modo `RECORDING`, mude-o para o modo `PROTECTING` para reforçar o MySQL contra acessos por declarações que se desviam da lista de permissão. Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro.
* `DETECTING`: Este modo detecta, mas não bloqueia, intrusões (declarações que são suspeitas porque não correspondem a nada na lista de permissão do perfil). No modo `DETECTING`, o firewall escreve declarações suspeitas no log de erro, mas as aceita sem negar o acesso.

Quando um perfil é atribuído a qualquer um dos valores de modo anteriores, o firewall armazena o modo no perfil. As operações de configuração de modo do firewall também permitem um valor de modo `RESET`, mas esse valor não é armazenado: configurar um perfil no modo `RESET` faz com que o firewall exclua todas as regras do perfil e configure seu modo para `OFF`.

::: info Nota

Mensagens escritas no log de erro no modo `DETECTING` ou porque o `mysql_firewall_trace` está habilitado são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erro e não sejam descartadas, certifique-se de que a granularidade do registro de erros é suficiente para incluir mensagens de informação. Por exemplo, se você estiver usando a filtragem de log com base na prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Erro com Base em Prioridade (log_filter_internal)”), defina a variável de sistema `log_error_verbosity` para um valor de 3.

:::

###### Gerenciamento de Declarações do Firewall Quando Múltiplos Perfis Se Aplicam

Por simplicidade, as seções posteriores que descrevem como configurar perfis assumem que o firewall combina declarações de entrada de um cliente apenas com um único perfil, seja um perfil de grupo ou perfil de conta. Mas a operação do firewall pode ser mais complexa:

* Um perfil de grupo pode incluir múltiplas contas como membros.
* Uma conta pode ser membro de múltiplos perfis de grupo.
* Múltiplos perfis podem combinar com um cliente dado.

A descrição a seguir abrange o caso geral de como o firewall opera, quando potencialmente múltiplos perfis se aplicam a declarações de entrada.

Como mencionado anteriormente, o MySQL associa cada sessão de cliente a uma combinação específica de nome de usuário e nome de host conhecida como *conta de sessão*. O firewall combina a conta de sessão com perfis registrados para determinar quais perfis se aplicam ao tratamento de declarações de entrada da sessão:

* O firewall ignora perfis inativos (perfis com o modo `OFF`).
* A conta de sessão corresponde a todos os perfis de grupo ativos que incluem um membro com o mesmo usuário e host. Pode haver mais de um perfil de grupo ativo.
* A conta de sessão corresponde a um perfil de conta ativo com o mesmo usuário e host, se houver. Há, no máximo, um perfil de conta ativo.

Em outras palavras, a conta de sessão pode corresponder a 0 ou mais perfis de grupo ativos e 0 ou 1 perfil de conta ativo. Isso significa que 0, 1 ou vários perfis de firewall podem ser aplicados a uma sessão específica, para a qual o firewall trata cada declaração de entrada da seguinte forma:

* Se não houver perfil aplicável, o firewall não impõe restrições e aceita a declaração.
* Se houver perfis aplicáveis, seus modos determinam o tratamento da declaração:

  + O firewall registra a declaração na lista de permissão de cada perfil aplicável que está no modo `RECORDING`.
  + O firewall escreve a declaração no log de erro para cada perfil aplicável no modo `DETECTING` para o qual a declaração é suspeita (não corresponde à lista de permissão do perfil).
  + O firewall aceita a declaração se pelo menos um perfil aplicável estiver no modo `RECORDING` ou `DETECTING` (esses modos aceitam todas as declarações) ou se a declaração corresponder à lista de permissão de pelo menos um perfil aplicável no modo `PROTECTING`. Caso contrário, o firewall rejeita a declaração (e escreve-a no log de erro se a variável de sistema `mysql_firewall_trace` estiver habilitada).

Com essa descrição em mente, as seções seguintes retornam à simplicidade das situações em que um único perfil de grupo ou um único perfil de conta se aplicam e cobrem como configurar cada tipo de perfil.

##### Registro de Perfis de Grupo de Firewall

O MySQL Enterprise Firewall suporta o registro de perfis de grupo. Um perfil de grupo pode ter múltiplas contas como seus membros. Para usar um perfil de grupo de firewall para proteger o MySQL contra declarações de entrada de uma conta específica, siga estes passos:

1. Registre o perfil do grupo e coloque-o no modo `RECORDANDO`.
2. Adicione uma conta de membro ao perfil do grupo.
3. Conecte-se ao servidor MySQL usando a conta de membro e execute as instruções a serem aprendidas. Isso treina o perfil do grupo e estabelece as regras que formam a allowlist do perfil.
4. Adicione à lista de membros do perfil do grupo quaisquer outras contas que serão membros do grupo.
5. Mude o perfil do grupo para o modo `PROTEGENDO`. Quando um cliente se conecta ao servidor usando qualquer conta que seja membro do perfil do grupo, a allowlist do perfil restringe a execução das instruções.
6. Se for necessário mais treinamento, mude o perfil do grupo para o modo `RECORDANDO` novamente, atualize sua allowlist com novos padrões de instruções, e depois mude de volta para o modo `PROTEGENDO`.

Observe essas diretrizes para referências de contas relacionadas a firewalls:

* Observe o contexto em que as referências de contas ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para instruções como `CREATE USER` e `GRANT`, para as quais você cita as partes usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).
* O requisito de nomear contas como uma string entre aspas simples para operações de firewall significa que você não pode usar contas que tenham caracteres `@` embutidos no nome do usuário.
* O firewall avalia as instruções contra contas representadas por nomes de usuário e host reais autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede:

Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.
+ O nome da conta contém um caractere `%` como caractere de substituição, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e um nome de host de `abc.example.com`, e é isso que o firewall vê.
+ Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O seguinte procedimento mostra como registrar um perfil de grupo com o firewall, treinar o firewall para saber as declarações aceitáveis para esse perfil (sua allowlist), usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis e adicionar e remover membros do grupo. O exemplo usa um nome de perfil de grupo de `fwgrp`. O perfil de exemplo é suposto para uso por clientes de uma aplicação que acessa tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta MySQL administrativa para realizar os passos neste procedimento, exceto aqueles passos designados para execução por contas membros do perfil de grupo do firewall. Para declarações executadas por contas membros, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie as contas que serão membros do perfil de grupo `fwgrp` e conceda-lhes os privilégios de acesso apropriados. As declarações para um membro são mostradas aqui (escolha uma senha apropriada):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```
2. Use o procedimento armazenado `sp_set_firewall_group_mode()` para registrar o perfil de grupo com o firewall e colocar o perfil no modo `RECORDING` (treinamento):

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

   ::: info Nota

   Se você instalou o MySQL Enterprise Firewall em um esquema personalizado, faça a substituição apropriada para o seu sistema. Por exemplo, se o firewall estiver instalado no esquema `fwdb`, execute os procedimentos armazenados da seguinte forma:

   ```
   CALL fwdb.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

   :::

3. Use o procedimento armazenado `sp_firewall_group_enlist()` para adicionar uma conta de membro inicial para uso no treinamento do perfil de grupo allowlist:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member1@localhost');
   ```
4. Para treinar o perfil de grupo usando a conta de membro inicial, conecte-se ao servidor como `member1` a partir do host do servidor para que o firewall veja uma conta de sessão de `member1@localhost`. Em seguida, execute algumas instruções consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   O firewall recebe as instruções da conta `member1@localhost`. Como essa conta é membro do perfil `fwgrp`, que está no modo `RECORDING`, o firewall interpreta as instruções como aplicáveis a `fwgrp` e registra a forma normalizada do digest dos comentários das instruções como regras no `fwgrp` allowlist. Essas regras, então, se aplicam a todas as contas que são membros de `fwgrp`.

   ::: info Nota

   Até que o perfil de grupo `fwgrp` receba instruções no modo `RECORDING`, seu allowlist fica vazio, o que é equivalente a "denunciar tudo". Nenhuma instrução pode corresponder a um allowlist vazio, o que tem essas implicações:

   * O perfil de grupo não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as instruções, proibindo efetivamente que as contas que são membros do grupo executem qualquer instrução.
   * O perfil de grupo pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as instruções, mas as registra como suspeitas.

   :::

5. Neste ponto, as informações do perfil de grupo são armazenadas em cache, incluindo seu nome, associação e allowlist. Para ver essas informações, consulte as tabelas do esquema de desempenho firewall:

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

   ::: info Nota

   A regra `@@version_comment` vem de uma instrução enviada automaticamente pelo cliente `mysql` quando você se conecta ao servidor.

   :::
   
   Importante

Treine o firewall em condições que correspondam ao uso da aplicação. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar instruções ao servidor no início de cada sessão. Se uma aplicação normalmente for usada por meio desse conector, treine o firewall usando o conector também. Isso permite que essas instruções iniciais se tornem parte da lista de permissão para o perfil de grupo associado à aplicação.
6. Invoque `sp_set_firewall_group_mode()` novamente para alternar o perfil de grupo para o modo `PROTECTING`:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Importante

   Alternar o perfil de grupo do modo `RECORDING` sincroniza seus dados armazenados na memória com as tabelas do banco de dados do firewall que fornecem armazenamento subjacente persistente. Se você não alternar o modo para um perfil que está sendo gravado, os dados armazenados na memória não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (consulte Instalar o Firewall de Rede MySQL Enterprise).
7. Adicione ao perfil de grupo quaisquer outras contas que devem ser membros:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   A lista de permissões do perfil treinado usando a conta `member1@localhost` agora também se aplica às contas adicionais.
8. Para verificar a associação atualizada ao grupo, execute novamente a consulta na tabela `firewall_membership`:

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
9. Teste o perfil de grupo contra o firewall usando qualquer conta do grupo para executar algumas instruções aceitáveis e inaceitáveis. O firewall combina cada instrução da conta com a lista de permissões do perfil e a aceita ou rejeita:

   * Esta instrução não é idêntica a uma instrução de treinamento, mas produz a mesma instrução normalizada que uma delas, então o firewall a aceita:
     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```
   * Essas instruções não correspondem a nada na lista de permissões, então o firewall rejeita cada uma com um erro:

```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```
* Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for 'member1@localhost'. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Essas mensagens de log podem ser úteis para identificar a origem dos ataques, caso seja necessário.
10. Se os membros precisarem ser removidos do perfil do grupo, use o procedimento armazenado `sp_firewall_group_delist()` em vez de `sp_firewall_group_enlist()`:

    ```
    CALL mysql.sp_firewall_group_delist('fwgrp', 'member3@localhost');
    ```

    O perfil do grupo do firewall agora está configurado para contas de membros. Quando os clientes se conectam usando qualquer conta do grupo e tentam executar declarações, o perfil protege o MySQL contra declarações que não estão no allowlist do perfil.

O procedimento mostrado acima adicionou apenas um membro ao perfil do grupo antes de treinar seu allowlist. Isso fornece um melhor controle sobre o período de treinamento, limitando quais contas podem adicionar novas declarações aceitáveis ao allowlist. Se for necessário um treinamento adicional, você pode voltar o perfil para o modo `RECORDING`:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
```

No entanto, isso permite que qualquer membro do grupo execute declarações e as adicione ao allowlist. Para limitar o treinamento adicional a um único membro do grupo, chame `sp_set_firewall_group_mode_and_user()`, que é como `sp_set_firewall_group_mode()` mas leva um argumento adicional especificando qual conta é permitida para treinar o perfil no modo `RECORDING`. Por exemplo, para habilitar o treinamento apenas por `member4@localhost`, faça isso:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

Isso habilita o treinamento adicional pela conta especificada sem precisar remover os outros membros do grupo. Eles podem executar declarações, mas as declarações não são adicionadas ao allowlist. (Lembre-se, no entanto, que, no modo `RECORDING`, os outros membros podem executar *qualquer* declaração.)

::: info Nota

Para evitar comportamento inesperado quando uma conta específica é especificada como a conta de treinamento para um perfil de grupo, certifique-se sempre de que a conta seja membro do grupo.

Após o treinamento adicional, defina o perfil do grupo de volta para o modo `PROTECTING` (Protegendo):

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
```

A conta de treinamento estabelecida por `sp_set_firewall_group_mode_and_user()` é salva no perfil do grupo, então o firewall a lembra caso mais treinamento seja necessário mais tarde. Assim, se você chamar `sp_set_firewall_group_mode()` (que não aceita argumento de conta de treinamento), a conta de treinamento atual, `member4@localhost`, permanece inalterada.

Para limpar a conta de treinamento, se realmente for desejado permitir que todos os membros do grupo realizem treinamento no modo `RECORDING` (Registrando), chame `sp_set_firewall_group_mode_and_user()` e passe um valor `NULL` para o argumento de conta:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

É possível detectar intrusões registrando declarações não correspondentes como suspeitas sem negar o acesso. Primeiro, coloque o perfil do grupo no modo `DETECTING` (Detecionando):

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'DETECTING');
```

Em seguida, usando uma conta de membro, execute uma declaração que não corresponda à lista de permissões do perfil do grupo. No modo `DETECTING`, o firewall permite que a declaração não correspondente seja executada:

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

Para desativar um perfil de grupo, mude seu modo para `OFF` (Desativado):

```
CALL mysql.sp_set_firewall_group_mode(group, 'OFF');
```

Para esquecer todo o treinamento para um perfil e desativá-lo, reinicie-o:

```
CALL mysql.sp_set_firewall_group_mode(group, 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras para o perfil e defina seu modo para `OFF`.

##### Registrando Profis de Conta de Firewall

O MySQL Enterprise Firewall permite que perfis sejam registrados que correspondem a contas individuais. Para usar um perfil de conta de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil da conta e coloque-o no modo `RECORDANDO`.
2. Conecte-se ao servidor MySQL usando a conta e execute as instruções a serem aprendidas. Isso treina o perfil da conta e estabelece as regras que formam a lista de permissão do perfil.
3. Mude o perfil da conta para o modo `PROTEGENDO`. Quando um cliente se conecta ao servidor usando a conta, a lista de permissão do perfil da conta restringe a execução das instruções.
4. Se for necessário mais treinamento, mude o perfil da conta para o modo `RECORDANDO` novamente, atualize sua lista de permissão com novos padrões de instruções, depois mude de volta para o modo `PROTEGENDO`.

Observe essas diretrizes para referências de contas relacionadas a firewalls:

* Tome nota do contexto em que as referências de contas ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para instruções como `CREATE USER` e `GRANT`, para as quais você cita as partes do nome da conta usuário e host separadamente (`'user_name'@'host_name'`).

O requisito de nomear contas como uma string entre aspas simples para operações de firewall significa que você não pode usar contas que tenham caracteres `@` embutidos no nome do usuário.
* O firewall avalia as instruções contra contas representadas por nomes de usuário e host reais autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede:

  Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.
  O nome da conta contém um caractere curinga `%`, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e nome de host de `abc.example.com`, e é isso que o firewall vê.
  Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O seguinte procedimento mostra como registrar um perfil de conta com o firewall, treinar o firewall para conhecer as declarações aceitáveis para esse perfil (sua allowlist) e usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis pela conta. A conta de exemplo, `fwuser@localhost`, é suposta para uso por uma aplicação que acessa tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta administrativa do MySQL para realizar os passos neste procedimento, exceto aqueles passos designados para execução pela conta `fwuser@localhost` que corresponde ao perfil de conta registrado com o firewall. Para declarações executadas usando essa conta, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie a conta para usar para executar declarações (escolha uma senha apropriada) e conceda-lhe privilégios para o banco de dados `sakila`:

   ```
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_mode()` para registrar o perfil de conta com o firewall e colocar o perfil no modo `RECORDING` (treinamento):

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

   ::: info Nota

   Se você instalou o MySQL Enterprise Firewall em um esquema personalizado, faça a substituição apropriada para o seu sistema. Por exemplo, se o firewall estiver instalado no esquema `fwdb`, execute os procedimentos armazenados da seguinte forma:

   ```
   CALL fwdb.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

   :::

3. Para treinar o perfil de conta registrado, conecte-se ao servidor como `fwuser` a partir do host do servidor para que o firewall veja uma conta de sessão de `fwuser@localhost`. Em seguida, use a conta para executar algumas declarações que serão consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

   Como o perfil está no modo `RECORDING`, o firewall registra a forma normalizada do digest dos enunciados como regras na allowlist do perfil.

   ::: info Nota

Até que o perfil da conta `fwuser@localhost` receba declarações no modo `RECORDING`, sua lista de permissões estará vazia, o que é equivalente a "rejeitar tudo". Nenhuma declaração pode corresponder a uma lista de permissões vazia, o que tem essas implicações:

   * O perfil da conta não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as declarações, proibindo efetivamente a execução de qualquer declaração pela conta.
   * O perfil da conta pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as declarações, mas as registra como suspeitas.

   :::

4. Neste ponto, as informações do perfil da conta são armazenadas em cache. Para ver essas informações, consulte as tabelas `INFORMATION_SCHEMA` do firewall:

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

   ::: info Nota

   A regra `@@version_comment` vem de uma declaração enviada automaticamente pelo cliente `mysql` quando você se conecta ao servidor.

   :::

   Importante

   Treine o firewall em condições que correspondam ao uso da aplicação. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar declarações ao servidor no início de cada sessão. Se uma aplicação normalmente for usada por meio desse conector, treine o firewall usando o conector também. Isso permite que essas declarações iniciais se tornem parte da lista de permissões para o perfil da conta associado à aplicação.
5. Inicie novamente o `sp_set_firewall_mode()`, desta vez alterando o perfil da conta para o modo `PROTECTING`:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Importante

A mudança do perfil da conta para o modo `RECORDANDO` sincroniza seus dados armazenados na memória com as tabelas do banco de dados do firewall que fornecem armazenamento persistente. Se você não mudar o modo para um perfil que está sendo gravado, os dados armazenados na memória não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado. O banco de dados do firewall pode ser o banco de dados do sistema `mysql` ou um esquema personalizado (consulte Instalar o Firewall de Entrelave MySQL).

6. Teste o perfil da conta usando a conta para executar algumas declarações aceitáveis e inaceitáveis. O firewall compara cada declaração da conta com a lista de permissão do perfil e a aceita ou rejeita:

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
   * Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Essas mensagens de log podem ser úteis para identificar a origem dos ataques, se necessário.

O perfil da conta do firewall agora está treinado para a conta `fwuser@localhost`. Quando os clientes se conectam usando essa conta e tentam executar declarações, o perfil protege o MySQL contra declarações que não correspondem à lista de permissão do perfil.

É possível detectar intrusões registrando declarações não correspondentes como suspeitas sem negar o acesso. Primeiro, coloque o perfil da conta no modo `DETECTANDO`:

```
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Em seguida, usando a conta, execute uma declaração que não corresponda à lista de permissão do perfil. No modo `DETECTANDO`, o firewall permite que a declaração não correspondente seja executada:

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

Para esquecer todo o treinamento de um perfil e desativá-lo, reinicie-o:

```
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras do perfil e defina seu modo para `OFF`.

##### Monitoramento do Firewall

Para avaliar a atividade do firewall, examine suas variáveis de status. Por exemplo, após realizar o procedimento mostrado anteriormente para treinar e proteger o perfil do grupo `fwgrp`, as variáveis ficam assim:

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

As variáveis indicam o número de declarações rejeitadas, aceitas, registradas como suspeitas e adicionadas ao cache, respectivamente. O `Firewall_access_granted` conta é de 4 devido à declaração `@@version_comment` enviada pelo cliente `mysql` cada uma das três vezes que você se conectou usando a conta registrada, além da declaração `SHOW TABLES` que não foi bloqueada no modo `DETECTING`.

##### Migração de perfis de conta para perfis de grupo

O MySQL Enterprise Firewall suporta perfis de conta que se aplicam a uma única conta e também perfis de grupo que podem se aplicar a várias contas. Um perfil de grupo permite uma administração mais fácil quando a mesma lista de permissões deve ser aplicada a várias contas: em vez de criar um perfil de conta para cada conta e duplicar a lista de permissões em todos esses perfis, crie um único perfil de grupo e faça com que as contas sejam membros dele. A lista de permissões do grupo então se aplica a todas as contas.

Um perfil de grupo com uma única conta membro é logicamente equivalente a um perfil de conta para aquela conta, portanto, é possível administrar o firewall usando perfis de grupo exclusivamente, em vez de uma mistura de perfis de conta e de grupo. Para novas instalações de firewall, isso é realizado criando novos perfis uniformemente como perfis de grupo e evitando perfis de conta.

Devido à maior flexibilidade oferecida pelos perfis de grupo, recomenda-se que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desatualizados e estarão sujeitos à remoção em uma futura versão do MySQL. Para atualizações de instalações de firewall que já contêm perfis de conta, o MySQL Enterprise Firewall inclui um procedimento armazenado chamado `sp_migrate_firewall_user_to_group()` para ajudá-lo a converter perfis de conta em perfis de grupo. Para usá-lo, execute o procedimento a seguir como um usuário que tenha o privilégio `FIREWALL_ADMIN`:

1. Execute o script `firewall_profile_migration.sql` para instalar o procedimento armazenado `sp_migrate_firewall_user_to_group()`. O script está localizado no diretório `share` da sua instalação do MySQL.

   Especifique o mesmo nome da base de dados do firewall na linha de comando que você definiu anteriormente para sua instalação de firewall. O exemplo aqui especifica a base de dados do sistema, `mysql`.

   ```
   $> mysql -u root -p -D mysql < firewall_profile_migration.sql
   Enter password: (enter root password here)
   ```

   Se você instalou o MySQL Enterprise Firewall em um esquema personalizado, faça a substituição apropriada para o seu sistema.
2. Identifique quais perfis de conta existem consultando a tabela do Esquema de Informações `MYSQL_FIREWALL_USERS`. Por exemplo:

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
3. Para cada perfil de conta identificado pelo passo anterior, converta-o em um perfil de grupo. Substitua o prefixo `mysql.` pelo nome real da base de dados do firewall, se necessário:

   ```
   CALL mysql.sp_migrate_firewall_user_to_group('admin@localhost', 'admins');
   CALL mysql.sp_migrate_firewall_user_to_group('local_client@localhost', 'local_clients');
   CALL mysql.sp_migrate_firewall_user_to_group('remote_client@localhost', 'remote_clients');
   ```

   Em cada caso, o perfil de conta deve existir e não deve estar atualmente no modo `RECORDING`, e o perfil de grupo não deve já existir. O perfil de grupo operacional é obtido do modo operacional do perfil de conta.
4. (Opcional) Remova `sp_migrate_firewall_user_to_group()`:

   ```
   DROP PROCEDURE IF EXISTS mysql.sp_migrate_firewall_user_to_group;
   ```

   Se você instalou o MySQL Enterprise Firewall em um esquema personalizado, faça a substituição apropriada para o seu sistema.

Para obter informações adicionais sobre `sp_migrate_firewall_user_to_group()`, consulte Procedimentos armazenados diversos do Firewall.
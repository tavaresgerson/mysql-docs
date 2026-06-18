#### 8.4.7.3 Usar o Firewall Empresarial do MySQL

Antes de usar o MySQL Enterprise Firewall, instale-o de acordo com as instruções fornecidas na Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”.

Esta seção descreve como configurar o MySQL Enterprise Firewall usando instruções SQL. Alternativamente, o MySQL Workbench 6.3.4 ou superior oferece uma interface gráfica para o controle do firewall. Consulte a Interface do MySQL Enterprise Firewall.

- Ativar ou desativar o firewall
- Atribuir privilégios de firewall
- Conceitos de Firewall
- Registrar perfis de grupo de firewall
- Registrar perfis de conta do firewall
- Monitoramento do Firewall
- Migrar perfis de conta para perfis de grupo

##### Ativar ou desativar o firewall

Para habilitar ou desabilitar o firewall, defina a variável de sistema `mysql_firewall_mode`. Por padrão, essa variável está habilitada quando o firewall é instalado. Para controlar o estado inicial do firewall explicitamente, você pode definir a variável no início do servidor. Por exemplo, para habilitar o firewall em um arquivo de opção, use as seguintes linhas:

```
[mysqld]
mysql_firewall_mode=ON
```

Após modificar `my.cnf`, reinicie o servidor para que o novo ajuste entre em vigor.

Alternativamente, para definir e manter a configuração do firewall em tempo de execução:

```
SET PERSIST mysql_firewall_mode = OFF;
SET PERSIST mysql_firewall_mode = ON;
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

##### Atribuir privilégios de firewall

Com o firewall instalado, conceda os privilégios apropriados à conta ou contas do MySQL a serem usadas para administrá-las. Os privilégios dependem das operações do firewall que uma conta deve ser permitida para realizar:

- Concede o privilégio `FIREWALL_EXEMPT` (disponível a partir do MySQL 8.0.27) a qualquer conta que deve ser isenta das restrições do firewall. Isso é útil, por exemplo, para um administrador de banco de dados que configura o firewall, para evitar a possibilidade de uma má configuração causar até mesmo o bloqueio do administrador e sua incapacidade de executar instruções.

- Concede o privilégio `FIREWALL_ADMIN` a qualquer conta que deva ter acesso administrativo completo ao firewall. (Algumas funções do firewall administrativo podem ser invocadas por contas que tenham o privilégio `FIREWALL_ADMIN` *ou* o privilégio desatualizado `SUPER`, conforme indicado nas descrições individuais das funções.)

- Conceda o privilégio `FIREWALL_USER` a qualquer conta que deva ter acesso administrativo apenas para suas próprias regras de firewall.

- Conceda o privilégio `EXECUTE` para os procedimentos armazenados do firewall no banco de dados do sistema `mysql`. Esses procedimentos podem invocar funções administrativas, portanto, o acesso aos procedimentos armazenados também requer os privilégios indicados anteriormente necessários para essas funções.

Nota

Os privilégios `FIREWALL_EXEMPT`, `FIREWALL_ADMIN` e `FIREWALL_USER` só podem ser concedidos enquanto o firewall estiver instalado, pois o plugin `MYSQL_FIREWALL` define esses privilégios.

##### Conceitos de Firewall

O servidor MySQL permite que os clientes se conectem e recebe deles instruções SQL a serem executadas. Se o firewall estiver ativado, o servidor passa para ele cada instrução de entrada que não falhe imediatamente com um erro de sintaxe. Com base no fato de o firewall aceitar a instrução, o servidor a executa ou retorna um erro ao cliente. Esta seção descreve como o firewall realiza a tarefa de aceitar ou rejeitar instruções.

- Perfis de Firewall
- Firewall Statement Matching
- Perfil Modos Operacionais
- Tratamento de declarações do firewall quando vários perfis são aplicados

###### Perfis de Firewall

O firewall utiliza um registro de perfis que determina se a execução da declaração deve ser permitida. Os perfis têm esses atributos:

- Uma lista de permissões. A lista de permissões é o conjunto de regras que define quais declarações são aceitáveis para o perfil.

- Um modo operacional atual. O modo permite que o perfil seja usado de diferentes maneiras. Por exemplo: o perfil pode ser colocado no modo de treinamento para estabelecer a lista de permissão; a lista de permissão pode ser usada para restringir a execução de declarações ou detecção de intrusões; o perfil pode ser desativado completamente.

- Um escopo de aplicabilidade. O escopo indica para quais conexões de cliente o perfil se aplica:

  - O firewall suporta perfis baseados em contas, de modo que cada perfil corresponda a uma conta de cliente específica (combinação de nome de usuário do cliente e nome do host). Por exemplo, você pode registrar um perfil de conta para o qual a lista de permissões se aplica a conexões que se originam de `admin@localhost` e outro perfil de conta para o qual a lista de permissões se aplica a conexões que se originam de `myapp@apphost.example.com`.

  - A partir do MySQL 8.0.23, o firewall suporta perfis de grupo que podem ter várias contas como membros, com a lista de permissões do perfil aplicando-se igualmente a todos os membros. Os perfis de grupo permitem uma administração mais fácil e maior flexibilidade para implantações que exigem a aplicação de um conjunto específico de regras de lista de permissões a várias contas.

Inicialmente, não existem perfis, então, por padrão, o firewall aceita todas as declarações e não tem efeito sobre quais declarações as contas do MySQL podem executar. Para aplicar as capacidades de proteção do firewall, é necessária uma ação explícita:

- Registre um ou mais perfis com o firewall.

- Treine o firewall estabelecendo a lista de permissão para cada perfil; ou seja, os tipos de declarações que o perfil permite que os clientes executem.

- Coloque os perfis treinados no modo de proteção para endurecer o MySQL contra a execução de declarações não autorizadas:

  - O MySQL associa cada sessão do cliente a uma combinação específica de nome de usuário e nome de host. Essa combinação é a *conta de sessão*.

  - Para cada conexão do cliente, o firewall usa a conta de sessão para determinar quais perfis se aplicam ao processamento de declarações recebidas do cliente.

    O firewall aceita apenas declarações permitidas pelas listas de permissões do perfil aplicável.

A maioria dos princípios de firewall aplica-se de forma idêntica aos perfis de grupo e aos perfis de conta. Os dois tipos de perfis diferem nesses aspectos:

- Um perfil de conta allowlist aplica-se apenas a uma conta única. Um perfil de grupo allowlist aplica-se quando a conta de sessão corresponde a qualquer conta que seja membro do grupo.

- Para aplicar uma lista de permissões a várias contas usando perfis de conta, é necessário registrar um perfil por conta e duplicar a lista de permissões em cada perfil. Isso implica em treinar cada perfil de conta individualmente, pois cada um deve ser treinado usando a única conta à qual se aplica.

  Um perfil de grupo permite que você aplique a lista de permissões a várias contas, sem a necessidade de duplicá-la para cada conta. Um perfil de grupo pode ser treinado usando qualquer uma ou todas as contas dos membros do grupo, ou o treinamento pode ser limitado a qualquer um dos membros. De qualquer forma, a lista de permissões se aplica a todos os membros.

- Os nomes dos perfis de conta são baseados em combinações específicas de nome de usuário e nome de host que dependem dos clientes que se conectam ao servidor MySQL. Os nomes dos perfis de grupo são escolhidos pelo administrador do firewall, sem restrições além do comprimento, que deve ser de 1 a 288 caracteres.

Nota

Devido às vantagens dos perfis de grupo em relação aos perfis de conta, e porque um perfil de grupo com uma única conta de membro é logicamente equivalente a um perfil de conta para essa conta, recomenda-se que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desaconselhados a partir do MySQL 8.0.26 e estão sujeitos à remoção em uma versão futura do MySQL. Para obter assistência na conversão de perfis de conta existentes, consulte Migrar perfis de conta para perfis de grupo.

A proteção baseada em perfis oferecida pelo firewall permite a implementação de estratégias como essas:

- Se um aplicativo tiver requisitos de proteção exclusivos, configure-o para usar uma conta que não seja usada para nenhum outro propósito e crie um perfil de grupo ou um perfil de conta para essa conta.

- Se as aplicações relacionadas compartilharem requisitos de proteção, associe cada aplicação à sua própria conta e, em seguida, adicione essas contas de aplicação como membros do mesmo perfil de grupo. Alternativamente, configure todas as aplicações para usar a mesma conta e associe-as a um perfil de conta para essa conta.

###### Firewall Statement Matching

A declaração de correspondência realizada pelo firewall não utiliza declarações SQL recebidas dos clientes. Em vez disso, o servidor converte as declarações recebidas em um formato de digest normalizado e a operação do firewall utiliza esses digests. O benefício da normalização das declarações é que permite que declarações semelhantes sejam agrupadas e reconhecidas usando um único padrão. Por exemplo, essas declarações são distintas umas das outras:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

Mas todos eles têm a mesma forma de digestão normalizada:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

Ao usar a normalização, as listas de permissões do firewall podem armazenar digests que correspondem a várias declarações recebidas dos clientes. Para obter mais informações sobre normalização e digests, consulte a Seção 29.10, “Digests de Declarações do Schema de Desempenho e Amostragem”.

Aviso

Definir a variável de sistema `max_digest_length` para zero desativa a produção de digestes, o que também desativa a funcionalidade do servidor que requer digestes, como o MySQL Enterprise Firewall.

###### Perfil Modos Operacionais

Cada perfil registrado no firewall tem seu próprio modo operacional, escolhido entre esses valores:

- `OFF`: Este modo desativa o perfil. O firewall o considera inativo e o ignora.

- `RECORDING`: Este é o modo de treinamento do firewall. As declarações recebidas de um cliente que correspondem ao perfil são consideradas aceitáveis para o perfil e tornam-se parte de sua “impressão digital”. O firewall registra a forma normalizada do digest de cada declaração para aprender os padrões de declaração aceitáveis para o perfil. Cada padrão é uma regra, e a união das regras é a lista de permissão do perfil.

  A diferença entre os perfis de grupo e de conta é que o registro de declarações para um perfil de grupo pode ser limitado a declarações recebidas de um único membro do grupo (o membro treinado).

- `PROTECTING`: Nesse modo, o perfil permite ou impede a execução de declarações. O firewall compara as declarações recebidas com a lista de permissão do perfil, aceitando apenas as que correspondem e rejeitando as que não correspondem. Após treinar um perfil no modo `RECORDING`, mude para o modo `PROTECTING` para proteger o MySQL contra acessos por declarações que se desviem da lista de permissão. Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro.

- `DETECTING`: Este modo detecta, mas não bloqueia, intrusões (declarações suspeitas, pois não correspondem a nada no perfil allowlist). No modo `DETECTING`, o firewall escreve declarações suspeitas no log de erro, mas as aceita sem negar o acesso.

Quando um perfil recebe qualquer um dos valores de modo anteriores, o firewall armazena o modo no perfil. As operações de configuração de modo do firewall também permitem um valor de modo de `RESET`, mas esse valor não é armazenado: configurar um perfil para o modo `RESET` faz com que o firewall exclua todas as regras do perfil e configure seu modo para `OFF`.

Nota

Mensagens escritas no log de erros no modo `DETECTING` ou porque o `mysql_firewall_trace` está ativado são escritas como Notas, que são mensagens de informações. Para garantir que essas mensagens apareçam no log de erros e não sejam descartadas, certifique-se de que a granularidade do registro de erros seja suficiente para incluir mensagens de informações. Por exemplo, se você estiver usando a filtragem de log baseada em prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Erros Baseada em Prioridade (log\_filter\_internal)”), defina a variável de sistema `log_error_verbosity` para um valor de 3.

###### Tratamento de declarações do firewall quando vários perfis são aplicados

Por simplicidade, as seções posteriores que descrevem como configurar perfis assumem que o firewall compara as declarações recebidas de um cliente apenas com um único perfil, seja um perfil de grupo ou um perfil de conta. Mas a operação do firewall pode ser mais complexa:

- Um perfil de grupo pode incluir várias contas como membros.
- Uma conta pode ser membro de vários perfis de grupo.
- Vários perfis podem corresponder a um cliente específico.

A descrição a seguir abrange o caso geral de como o firewall funciona, quando vários perfis podem ser aplicados a declarações de entrada.

Como mencionado anteriormente, o MySQL associa cada sessão do cliente a uma combinação específica de nome de usuário e nome de host, conhecida como *conta de sessão*. O firewall compara a conta de sessão com perfis registrados para determinar quais perfis são aplicáveis ao processamento de declarações recebidas da sessão:

- O firewall ignora perfis inativos (perfis com um modo de `OFF`).

- A conta de sessão corresponde a todos os perfis de grupo ativos que incluem um membro com o mesmo usuário e host. Pode haver mais de um perfil de grupo assim.

- A conta de sessão corresponde a um perfil de conta ativo que tenha o mesmo usuário e host, se houver. Há, no máximo, um perfil de conta assim.

Em outras palavras, a conta de sessão pode corresponder a 0 ou mais perfis de grupo ativos e 0 ou 1 perfil de conta ativo. Isso significa que 0, 1 ou vários perfis de firewall podem ser aplicados a uma sessão específica, para a qual o firewall trata cada declaração de entrada da seguinte forma:

- Se não houver um perfil aplicável, o firewall não impõe restrições e aceita a declaração.

- Se houver perfis aplicáveis, seus modos determinam o tratamento das declarações:

  - O firewall registra a declaração na lista de permissões de cada perfil aplicável que está no modo `RECORDING`.

  - O firewall escreve a declaração no log de erro para cada perfil aplicável no modo `DETECTING` para o qual a declaração é suspeita (não corresponde à lista de permissões do perfil).

  - O firewall aceita a declaração se pelo menos um perfil aplicável estiver no modo `RECORDING` ou `DETECTING` (esses modos aceitam todas as declarações) ou se a declaração corresponder à lista de permissões de pelo menos um perfil aplicável no modo `PROTECTING`. Caso contrário, o firewall rejeita a declaração (e a escreve no log de erros se a variável de sistema `mysql_firewall_trace` estiver habilitada).

Com essa descrição em mente, as seções seguintes voltam à simplicidade das situações em que um único perfil de grupo ou um único perfil de conta se aplicam, e cobrem como configurar cada tipo de perfil.

##### Registrar perfis de grupo de firewall

O MySQL Enterprise Firewall suporta o registro de perfis de grupo a partir do MySQL 8.0.23. Um perfil de grupo pode ter várias contas como membros. Para usar um perfil de grupo de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil do grupo e coloque-o no modo `RECORDING`.

2. Adicione uma conta de membro ao perfil do grupo.

3. Conecte-se ao servidor MySQL usando a conta do membro e execute as instruções que precisam ser aprendidas. Isso treina o perfil do grupo e estabelece as regras que formam a lista de permissões do perfil.

4. Adicione à lista de perfis do grupo quaisquer outras contas que serão membros do grupo.

5. Mude o perfil do grupo para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando qualquer conta que seja membro do perfil do grupo, a declaração de permissão do perfil permite a execução.

6. Se for necessário treinamento adicional, mude o perfil do grupo para o modo `RECORDING` novamente, atualize sua lista de permissões com novos padrões de declaração, e depois mude de volta para o modo `PROTECTING`.

Observe essas diretrizes para referências de contas relacionadas ao firewall:

- Observe o contexto em que as referências de contas ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como `CREATE USER` e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

  O requisito de nomear as contas como uma string entre aspas simples para operações de firewall significa que você não pode usar contas que tenham caracteres `@` embutidos no nome do usuário.

- O firewall avalia as declarações contra contas representadas por nomes de usuário e hospedeiro reais, autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede:

  - Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.

  - O nome da conta contém um caractere de comodínio `%`, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e um nome de host de `abc.example.com`, e é isso que o firewall vê.

  - Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O procedimento a seguir mostra como registrar um perfil de grupo com o firewall, treinar o firewall para conhecer as declarações aceitáveis para esse perfil (sua lista de permissão), usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis e adicionar e remover membros do grupo. O exemplo usa um nome de perfil de grupo de `fwgrp`. O perfil de exemplo é suposto para uso por clientes de uma aplicação que acessa tabelas no banco de dados `sakila` (disponível em <https://dev.mysql.com/doc/index-other.html>).

Use uma conta administrativa do MySQL para executar os passos deste procedimento, exceto aqueles passos designados para execução por contas membros do perfil do grupo de firewall. Para declarações executadas por contas membros, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie as contas que devem ser membros do perfil do grupo `fwgrp` e conceda-lhes os privilégios de acesso apropriados. As declarações de um membro são mostradas aqui (escolha uma senha apropriada):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_group_mode()` para registrar o perfil do grupo com o firewall e colocar o perfil no modo `RECORDING` (treinamento):

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use o procedimento armazenado `sp_firewall_group_enlist()` para adicionar uma conta de membro inicial para uso no treinamento da lista de permissão do perfil do grupo:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. Para treinar o perfil do grupo usando a conta inicial do membro, conecte-se ao servidor como `member1` do host do servidor para que o firewall veja uma conta de sessão de `member1@localhost`. Em seguida, execute algumas instruções que sejam consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   O firewall recebe as declarações da conta `member1@localhost`. Como essa conta é membro do perfil `fwgrp`, que está no modo `RECORDING`, o firewall interpreta as declarações como aplicáveis a `fwgrp` e registra a forma normalizada do digest das declarações como regras no `fwgrp` allowlist. Essas regras, por sua vez, se aplicam a todas as contas que são membros de `fwgrp`.

   Nota

   Até que o perfil do grupo `fwgrp` receba declarações no modo `RECORDING`, sua allowlist estará vazia, o que é equivalente a “denegar tudo”. Nenhuma declaração pode corresponder a uma allowlist vazia, o que tem essas implicações:

   - O perfil do grupo não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as declarações, proibindo efetivamente que as contas que são membros do grupo executem qualquer declaração.

   - O perfil do grupo pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as declarações, mas as registra como suspeitas.

5. Neste ponto, as informações do perfil do grupo são armazenadas em cache, incluindo seu nome, associação e allowlist. Para ver essas informações, consulte as tabelas do Firewall do Schema de Desempenho:

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

   Nota

   A regra `@@version_comment` vem de uma declaração enviada automaticamente pelo cliente **mysql** quando você se conecta ao servidor.

   Importante

   Treine o firewall em condições que correspondam ao uso do aplicativo. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar instruções para o servidor no início de cada sessão. Se um aplicativo for normalmente usado por meio desse conector, treine o firewall usando o conector também. Isso permite que essas instruções iniciais se tornem parte da lista de permissões para o perfil do grupo associado ao aplicativo.

6. Invoque `sp_set_firewall_group_mode()` novamente para alternar o perfil do grupo para o modo `PROTECTING`:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Importante

   A mudança do perfil do grupo do modo `RECORDING` sincroniza seus dados armazenados na memória com as tabelas do banco de dados do sistema `mysql`, que fornecem armazenamento persistente. Se você não mudar o modo para um perfil que está sendo gravado, os dados armazenados na memória não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado.

7. Adicione à descrição do grupo outras contas que devem ser membros:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   O perfil allowlist treinado usando a conta `member1@localhost` agora também se aplica às contas adicionais.

8. Para verificar a associação atualizada ao grupo, consulte novamente a tabela `firewall_membership`:

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

9. Teste o perfil do grupo contra o firewall usando qualquer conta do grupo para executar algumas declarações aceitáveis e inaceitáveis. O firewall compara cada declaração da conta com a lista de permissão do perfil e a aceita ou rejeita:

   - Essa declaração não é idêntica a uma declaração de treinamento, mas produz a mesma declaração normalizada que uma delas, então o firewall a aceita:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

   - Essas declarações não correspondem a nada na allowlist, então o firewall rejeita cada uma com um erro:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   - Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for 'member1@localhost'. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Essas mensagens de log podem ser úteis para identificar a origem dos ataques, caso isso seja necessário.

10. Se os membros precisarem ser removidos do perfil do grupo, use o procedimento armazenado `sp_firewall_group_delist()` em vez de `sp_firewall_group_enlist()`:

    ```
    CALL mysql.sp_firewall_group_delist('fwgrp', 'member3@localhost');
    ```

O perfil do grupo de firewall agora está configurado para contas de membros. Quando os clientes se conectam usando qualquer conta do grupo e tentam executar instruções, o perfil protege o MySQL contra instruções que não estão no allowlist do perfil.

O procedimento mostrado acima adicionou apenas um membro ao perfil do grupo antes de treinar sua lista de permissão. Isso proporciona um melhor controle sobre o período de treinamento, limitando quais contas podem adicionar novas declarações aceitáveis à lista de permissão. Se for necessário um treinamento adicional, você pode alternar o perfil de volta para o modo `RECORDING`:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
```

No entanto, isso permite que qualquer membro do grupo execute declarações e adicione-as à lista de permissões. Para limitar o treinamento adicional a um único membro do grupo, chame `sp_set_firewall_group_mode_and_user()`, que é como `sp_set_firewall_group_mode()`, mas leva um argumento a mais, especificando qual conta está autorizada a treinar o perfil no modo `RECORDING`. Por exemplo, para habilitar o treinamento apenas por `member4@localhost`, faça isso:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

Isso permite que o treinamento adicional seja realizado pela conta especificada sem precisar remover os outros membros do grupo. Eles podem executar declarações, mas as declarações não são adicionadas à lista de permissões. (Lembre-se, no entanto, que, no modo `RECORDING`, os outros membros podem executar *qualquer* declaração.)

Nota

Para evitar comportamentos inesperados quando uma conta específica é especificada como a conta de treinamento para um perfil de grupo, certifique-se sempre de que a conta seja membro do grupo.

Após o treinamento adicional, configure o perfil do grupo de volta para o modo \[\[`PROTECTING`]\_\_:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
```

A conta de treinamento estabelecida por `sp_set_firewall_group_mode_and_user()` é salva no perfil do grupo, então o firewall a lembra caso mais treinamento seja necessário mais tarde. Assim, se você chamar `sp_set_firewall_group_mode()` (que não aceita argumento de conta de treinamento), a conta de treinamento do perfil atual, `member4@localhost`, permanece inalterada.

Para limpar a conta de treinamento, se realmente for desejado habilitar todos os membros do grupo a realizarem o treinamento no modo `RECORDING`, chame `sp_set_firewall_group_mode_and_user()` e passe um valor `NULL` para o argumento da conta:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

É possível detectar intrusões ao registrar declarações que não correspondem como suspeitas, sem negar o acesso. Primeiro, coloque o perfil do grupo no modo `DETECTING`:

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

Para desativar um perfil de grupo, mude seu modo para `OFF`:

```
CALL mysql.sp_set_firewall_group_mode(group, 'OFF');
```

Para esquecer todo o treinamento de um perfil e desativá-lo, reinicie-o:

```
CALL mysql.sp_set_firewall_group_mode(group, 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras do perfil e defina seu modo para `OFF`.

##### Registrar perfis de conta do firewall

O MySQL Enterprise Firewall permite que perfis sejam registrados que correspondam a contas individuais. Para usar um perfil de conta de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil da conta e coloque-o no modo `RECORDING`.

2. Conecte-se ao servidor MySQL usando a conta e execute as instruções que precisam ser aprendidas. Isso treina o perfil da conta e estabelece as regras que formam a lista de permissões do perfil.

3. Mude o perfil da conta para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando a conta, o allowlist do perfil da conta restringe a execução da declaração.

4. Se for necessário treinamento adicional, mude o perfil da conta para o modo `RECORDING` novamente, atualize sua lista de permissões com novos padrões de declaração, e depois mude de volta para o modo `PROTECTING`.

Observe essas diretrizes para referências de contas relacionadas ao firewall:

- Observe o contexto em que as referências de contas ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como `CREATE USER` e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

  O requisito de nomear as contas como uma string entre aspas simples para operações de firewall significa que você não pode usar contas que tenham caracteres `@` embutidos no nome do usuário.

- O firewall avalia as declarações contra contas representadas por nomes de usuário e hospedeiro reais, autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede:

  - Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.

  - O nome da conta contém um caractere de comodínio `%`, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e um nome de host de `abc.example.com`, e é isso que o firewall vê.

  - Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O procedimento a seguir mostra como registrar um perfil de conta com o firewall, treinar o firewall para conhecer as declarações aceitáveis para esse perfil (sua lista de permissão) e usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis pela conta. A conta de exemplo, `fwuser@localhost`, é suposta para uso por uma aplicação que acessa tabelas no banco de dados `sakila` (disponível em <https://dev.mysql.com/doc/index-other.html>).

Use uma conta administrativa do MySQL para realizar os passos deste procedimento, exceto aqueles passos designados para execução pela conta `fwuser@localhost`, que corresponde ao perfil da conta registrado com o firewall. Para declarações executadas usando essa conta, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie a conta para usar para executar declarações (escolha uma senha apropriada) e conceda-lhe privilégios para o banco de dados `sakila`:

   ```
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_mode()` para registrar o perfil da conta com o firewall e colocar o perfil no modo `RECORDING` (treinamento):

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. Para treinar o perfil da conta registrada, conecte-se ao servidor como `fwuser` do host do servidor para que o firewall veja uma conta de sessão de `fwuser@localhost`. Em seguida, use a conta para executar algumas instruções que sejam consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

   Como o perfil está no modo `RECORDING`, o firewall registra a forma normalizada do digest das declarações como regras na lista de permissões do perfil.

   Nota

   Até que o perfil da conta `fwuser@localhost` receba declarações no modo `RECORDING`, sua allowlist estará vazia, o que é equivalente a “denegar tudo”. Nenhuma declaração pode corresponder a uma allowlist vazia, o que tem essas implicações:

   - O perfil da conta não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as declarações, proibindo efetivamente a execução de qualquer declaração pela conta.

   - O perfil da conta pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as declarações, mas as registra como suspeitas.

4. Neste ponto, as informações do perfil da conta são armazenadas em cache. Para ver essas informações, consulte as tabelas de firewall `INFORMATION_SCHEMA`:

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

   Nota

   A regra `@@version_comment` vem de uma declaração enviada automaticamente pelo cliente **mysql** quando você se conecta ao servidor.

   Importante

   Treine o firewall em condições que correspondam ao uso do aplicativo. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar instruções para o servidor no início de cada sessão. Se um aplicativo for normalmente usado por meio desse conector, treine o firewall usando o conector também. Isso permite que essas instruções iniciais se tornem parte da lista de permissões do perfil da conta associado ao aplicativo.

5. Invoque `sp_set_firewall_mode()` novamente, desta vez alternando o perfil da conta para o modo `PROTECTING`:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Importante

   A mudança do perfil da conta do modo `RECORDING` sincroniza seus dados armazenados em cache com as tabelas do banco de dados do sistema `mysql`, que fornecem armazenamento persistente. Se você não mudar o modo para um perfil que está sendo gravado, os dados armazenados em cache não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado.

6. Teste o perfil da conta usando a conta para executar algumas declarações aceitáveis e inaceitáveis. O firewall compara cada declaração da conta com a lista de permissão do perfil e a aceita ou rejeita:

   - Essa declaração não é idêntica a uma declaração de treinamento, mas produz a mesma declaração normalizada que uma delas, então o firewall a aceita:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   - Essas declarações não correspondem a nada na allowlist, então o firewall rejeita cada uma com um erro:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   - Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Essas mensagens de log podem ser úteis para identificar a origem dos ataques, caso isso seja necessário.

O perfil da conta do firewall agora está configurado para a conta `fwuser@localhost`. Quando os clientes se conectam usando essa conta e tentam executar instruções, o perfil protege o MySQL contra instruções que não estão no allowlist do perfil.

É possível detectar intrusões ao registrar declarações que não correspondem como suspeitas, sem negar o acesso. Primeiro, coloque o perfil da conta no modo `DETECTING`:

```
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Em seguida, usando a conta, execute uma declaração que não corresponda à lista de permissões do perfil da conta. No modo `DETECTING`, o firewall permite que a declaração não correspondente seja executada:

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

Para desativar um perfil de conta, mude seu modo para `OFF`:

```
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

Para esquecer todo o treinamento de um perfil e desativá-lo, reinicie-o:

```
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras do perfil e defina seu modo para `OFF`.

##### Monitoramento do Firewall

Para avaliar a atividade do firewall, examine suas variáveis de status. Por exemplo, após realizar o procedimento mostrado anteriormente para treinar e proteger o perfil do grupo `fwgrp`, as variáveis parecem assim:

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

As variáveis indicam o número de declarações rejeitadas, aceitas, registradas como suspeitas e adicionadas ao cache, respectivamente. O número `Firewall_access_granted` é de 4 devido à declaração `@@version_comment` enviada pelo cliente **mysql** cada uma das três vezes que você se conectou usando a conta registrada, mais a declaração `SHOW TABLES` que não foi bloqueada no modo `DETECTING`.

##### Migrar perfis de conta para perfis de grupo

Antes do MySQL 8.0.23, o MySQL Enterprise Firewall suporta apenas perfis de conta que se aplicam a uma única conta. A partir do MySQL 8.0.23, o firewall também suporta perfis de grupo que podem ser aplicados a várias contas. Um perfil de grupo permite uma administração mais fácil quando a mesma lista de permissões deve ser aplicada a várias contas: em vez de criar um perfil de conta por conta e duplicar a lista de permissões em todos esses perfis, crie um único perfil de grupo e faça com que as contas sejam membros dele. A lista de permissões do grupo, então, se aplica a todas as contas.

Um perfil de grupo com uma única conta de membro é logicamente equivalente a um perfil de conta para essa conta, portanto, é possível administrar o firewall usando perfis de grupo exclusivamente, em vez de uma mistura de perfis de conta e de grupo. Para novas instalações de firewall, isso é feito criando novos perfis uniformemente como perfis de grupo e evitando perfis de conta.

Devido à maior flexibilidade oferecida pelos perfis de grupo, recomenda-se que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desaconselhados a partir do MySQL 8.0.26 e estão sujeitos à remoção em uma versão futura do MySQL. Para atualizações de instalações de firewall que já contêm perfis de conta, o MySQL Enterprise Firewall no MySQL 8.0.26 e versões posteriores inclui um procedimento armazenado chamado `sp_migrate_firewall_user_to_group()` para ajudá-lo a converter perfis de conta em perfis de grupo. Para usá-lo, execute o procedimento a seguir como um usuário que possui o privilégio `FIREWALL_ADMIN`:

1. Execute o script `firewall_profile_migration.sql` para instalar a procedure armazenada `sp_migrate_firewall_user_to_group()`. O script está localizado no diretório `share` da sua instalação do MySQL.

   ```
   $> mysql -u root -p < firewall_profile_migration.sql
   Enter password: (enter root password here)
   ```

2. Identifique quais perfis de conta existem consultando a tabela Schema de Informações `MYSQL_FIREWALL_USERS`. Por exemplo:

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

3. Para cada perfil de conta identificado no passo anterior, converta-o em um perfil de grupo:

   ```
   CALL mysql.sp_migrate_firewall_user_to_group('admin@localhost', 'admins');
   CALL mysql.sp_migrate_firewall_user_to_group('local_client@localhost', 'local_clients');
   CALL mysql.sp_migrate_firewall_user_to_group('remote_client@localhost', 'remote_clients');
   ```

   Em cada caso, o perfil da conta deve existir e não estar atualmente no modo `RECORDING`, e o perfil do grupo não deve já existir. O perfil do grupo resultante tem a conta nomeada como seu único membro inscrito, que também é definido como a conta de treinamento do grupo. O modo operacional do perfil do grupo é obtido do modo operacional do perfil da conta.

4. (Opcional) Remova `sp_migrate_firewall_user_to_group()`:

   ```
   DROP PROCEDURE IF EXISTS mysql.sp_migrate_firewall_user_to_group;
   ```

Para obter informações adicionais sobre `sp_migrate_firewall_user_to_group()`, consulte Procedimentos Armazenados Diversos do Firewall.

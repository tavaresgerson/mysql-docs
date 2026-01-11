#### 6.4.6.3 Uso do Firewall Empresarial MySQL

Antes de usar o MySQL Enterprise Firewall, instale-o de acordo com as instruções fornecidas na Seção 6.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”. Além disso, o MySQL Enterprise Firewall não funciona com o cache de consultas; desative o cache de consultas se ele estiver ativado (consulte Seção 8.10.3.3, “Configuração do Cache de Consultas”).

Esta seção descreve como configurar o MySQL Enterprise Firewall usando instruções SQL. Alternativamente, o MySQL Workbench 6.3.4 ou superior oferece uma interface gráfica para o controle do firewall. Consulte MySQL Enterprise Firewall Interface.

- Habilitar ou desabilitar o firewall
- Atribuindo privilégios de firewall
- Conceitos de firewall
- Registrar perfis de conta do firewall
- Monitoramento do Firewall

##### Ativar ou desativar o firewall

Para habilitar ou desabilitar o firewall, defina a variável de sistema `mysql_firewall_mode`. Por padrão, essa variável está habilitada quando o firewall é instalado. Para controlar explicitamente o estado inicial do firewall, você pode definir a variável no início do servidor. Por exemplo, para habilitar o firewall em um arquivo de opções, use as seguintes linhas:

```
[mysqld]
mysql_firewall_mode=ON
```

Depois de modificar o `my.cnf`, reinicie o servidor para que o novo ajuste entre em vigor.

É também possível desativar ou ativar o firewall em tempo de execução:

```sql
SET GLOBAL mysql_firewall_mode = OFF;
SET GLOBAL mysql_firewall_mode = ON;
```

##### Atribuir privilégios de firewall

Com o firewall instalado, conceda os privilégios apropriados à conta ou contas do MySQL a serem usadas para administrá-las:

- Conceda o privilégio `EXECUTE` para os procedimentos armazenados do firewall no banco de dados do sistema `mysql`. Esses procedimentos podem invocar funções administrativas, portanto, o acesso aos procedimentos armazenados também requer os privilégios necessários para essas funções.

- Conceda o privilégio `SUPER` para que as funções administrativas do firewall possam ser executadas.

##### Conceitos de Firewall

O servidor MySQL permite que os clientes se conectem e recebe deles instruções SQL a serem executadas. Se o firewall estiver ativado, o servidor passa para ele cada instrução de entrada que não falhe imediatamente com um erro de sintaxe. Com base no fato de o firewall aceitar a instrução, o servidor a executa ou retorna um erro ao cliente. Esta seção descreve como o firewall realiza a tarefa de aceitar ou rejeitar instruções.

- Perfis de firewall
- Alinhamento de declarações de firewall
- Modos Operacionais do Perfil

###### Perfis de Firewall

O firewall utiliza um registro de perfis que determina se a execução da declaração deve ser permitida. Os perfis têm esses atributos:

- Uma lista de permissões. A lista de permissões é o conjunto de regras que define quais declarações são aceitáveis para o perfil.

- Um modo operacional atual. O modo permite que o perfil seja usado de diferentes maneiras. Por exemplo: o perfil pode ser colocado no modo de treinamento para estabelecer a lista de permissão; a lista de permissão pode ser usada para restringir a execução de declarações ou detecção de intrusões; o perfil pode ser desativado completamente.

- Um escopo de aplicabilidade. O escopo indica quais conexões de clientes o perfil se aplica.

  O firewall suporta perfis baseados em contas, de modo que cada perfil corresponda a uma conta de cliente específica (combinação de nome de usuário do cliente e nome do host). Por exemplo, você pode registrar um perfil de conta para o qual a lista de permissões se aplica a conexões que se originam de `admin@localhost` e outro perfil de conta para o qual a lista de permissões se aplica a conexões que se originam de `myapp@apphost.example.com`.

Inicialmente, não existem perfis, então, por padrão, o firewall aceita todas as declarações e não tem efeito sobre quais declarações as contas do MySQL podem executar. Para aplicar as capacidades de proteção do firewall, é necessária uma ação explícita:

- Registre um ou mais perfis com o firewall.

- Treine o firewall estabelecendo a lista de permissão para cada perfil; ou seja, os tipos de declarações que o perfil permite que os clientes executem.

- Coloque os perfis treinados no modo de proteção para endurecer o MySQL contra a execução de declarações não autorizadas:

  - O MySQL associa cada sessão do cliente a uma combinação específica de nome de usuário e nome de host. Essa combinação é a *conta de sessão*.

  - Para cada conexão do cliente, o firewall usa a conta de sessão para determinar qual perfil se aplica ao processamento de declarações recebidas do cliente.

    O firewall aceita apenas declarações permitidas pelo permitido listagem de perfil aplicável.

A proteção baseada em perfis oferecida pelo firewall permite a implementação de estratégias como essas:

- Se um aplicativo tiver requisitos de proteção exclusivos, configure-o para usar uma conta que não seja usada para nenhum outro propósito e crie um perfil para essa conta.

- Se as aplicações relacionadas compartilharem requisitos de proteção, configure todas elas para usar a mesma conta (e, portanto, o mesmo perfil de conta).

###### Firewall Statement Matching

A declaração de correspondência realizada pelo firewall não utiliza declarações SQL recebidas dos clientes. Em vez disso, o servidor converte as declarações recebidas em um formato de digest normalizado e a operação do firewall utiliza esses digests. O benefício da normalização das declarações é que permite que declarações semelhantes sejam agrupadas e reconhecidas usando um único padrão. Por exemplo, essas declarações são distintas umas das outras:

```sql
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

Mas todos eles têm a mesma forma de digestão normalizada:

```sql
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

Ao usar a normalização, as listas de permissões do firewall podem armazenar digests que correspondem a várias declarações recebidas dos clientes. Para obter mais informações sobre normalização e digests, consulte Seção 25.10, “Digests de Declarações do Schema de Desempenho”.

Aviso

Definir a variável de sistema `max_digest_length` para zero desativa a produção de digests, o que também desativa a funcionalidade do servidor que requer digests, como o MySQL Enterprise Firewall.

###### Perfil Modos Operacionais

Cada perfil registrado no firewall tem seu próprio modo operacional, escolhido entre esses valores:

- `OFF`: Este modo desativa o perfil. O firewall o considera inativo e o ignora.

- `RECORDING`: Este é o modo de treinamento do firewall. As declarações recebidas de um cliente que correspondem ao perfil são consideradas aceitáveis para o perfil e tornam-se parte de sua “impressão digital”. O firewall registra a forma normalizada do digest de cada declaração para aprender os padrões de declaração aceitáveis para o perfil. Cada padrão é uma regra, e a união das regras é a lista de permissão do perfil.

- `PROTECTING`: Nesse modo, o perfil permite ou impede a execução de declarações. O firewall compara as declarações recebidas com a lista de permissão do perfil, aceitando apenas as que correspondem e rejeitando as que não correspondem. Após treinar um perfil no modo `RECORDING`, mude para o modo `PROTECTING` para reforçar o MySQL contra o acesso por declarações que se desviam da lista de permissão. Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro.

- `DETECTING`: Este modo detecta, mas não bloqueia, intrusões (declarações suspeitas porque não correspondem a nada no perfil allowlist). No modo `DETECTING`, o firewall escreve declarações suspeitas no log de erro, mas as aceita sem negar o acesso.

Quando um perfil recebe qualquer um dos valores de modo anteriores, o firewall armazena o modo no perfil. As operações de configuração de modo do firewall também permitem um valor de modo `RESET`, mas esse valor não é armazenado: configurar um perfil no modo `RESET` faz com que o firewall exclua todas as regras do perfil e configure seu modo para `OFF`.

Nota

Mensagens escritas no log de erros no modo `DETECTING` ou porque o `mysql_firewall_trace` está habilitado são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erros e não sejam descartadas, defina a variável de sistema `log_error_verbosity` para um valor de 3.

Como mencionado anteriormente, o MySQL associa cada sessão do cliente a uma combinação específica de nome de usuário e nome de host, conhecida como *conta de sessão*. O firewall compara a conta de sessão com perfis registrados para determinar qual perfil se aplica ao processamento de declarações recebidas da sessão:

- O firewall ignora perfis inativos (perfis com um modo de `OFF`).

- A conta de sessão corresponde a um perfil de conta ativo que tenha o mesmo usuário e host, se houver. Há, no máximo, um perfil de conta assim.

Após associar a conta da sessão aos perfis registrados, o firewall processa cada declaração de entrada da seguinte forma:

- Se não houver um perfil aplicável, o firewall não impõe restrições e aceita a declaração.

- Se houver um perfil aplicável, seu modo determina o tratamento das declarações:

  - No modo `RECORDING`, o firewall adiciona a declaração às regras do allowlist do perfil e a aceita.

  - No modo `PROTECTING`, o firewall compara a declaração às regras na lista de permissões do perfil. O firewall aceita a declaração se houver uma correspondência e rejeita-a caso contrário. Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erros.

  - No modo `DETECTING`, o firewall detecta as instruções sem negar o acesso. O firewall aceita a declaração, mas também a compara com a lista de permissões do perfil, como no modo `PROTECTING`. Se a declaração for suspeita (não corresponder), o firewall a escreve no log de erros.

##### Registrar perfis de conta do firewall

O MySQL Enterprise Firewall permite que perfis sejam registrados que correspondam a contas individuais. Para usar um perfil de conta de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil da conta e coloque-o no modo `RECORDING`.

2. Conecte-se ao servidor MySQL usando a conta e execute as instruções que precisam ser aprendidas. Isso treina o perfil da conta e estabelece as regras que formam a lista de permissões do perfil.

3. Mude o perfil da conta para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando a conta, o allowlist do perfil da conta restringe a execução da declaração.

4. Se for necessário treinamento adicional, mude o perfil da conta para o modo `RECORDING` novamente, atualize sua lista de permissão com novos padrões de declaração, e depois mude de volta para o modo `PROTECTING`.

Observe essas diretrizes para referências de contas relacionadas ao firewall:

- Preste atenção ao contexto em que as referências de conta ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma string entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como `CREATE USER` e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

  O requisito de nomear contas como uma string entre aspas simples para operações de firewall significa que você não pode usar contas que tenham caracteres `@` embutidos no nome do usuário.

- O firewall avalia as declarações contra contas representadas por nomes de usuário e hospedeiro reais, autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres curinga ou máscaras de rede:

  - Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.

  - O nome da conta contém um caractere `%` como caractere de comodínio, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e um nome de host de `abc.example.com`, e é isso que o firewall vê.

  - Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O procedimento a seguir mostra como registrar um perfil de conta com o firewall, treinar o firewall para conhecer as declarações aceitáveis para esse perfil (sua lista de permissão) e usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis pela conta. A conta de exemplo, `fwuser@localhost`, é suposta para uso por uma aplicação que acesse tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta administrativa do MySQL para executar os passos deste procedimento, exceto aqueles passos designados para execução pela conta `fwuser@localhost` que corresponde ao perfil da conta registrado com o firewall. Para declarações executadas usando essa conta, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie a conta para usar para executar declarações (escolha uma senha apropriada) e conceda-lhe privilégios para o banco de dados `sakila`:

   ```sql
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_mode()` para registrar o perfil da conta com o firewall e colocar o perfil no modo `RECORDING` (treinamento):

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. Para treinar o perfil da conta registrada, conecte-se ao servidor como `fwuser` a partir do host do servidor, para que o firewall veja uma conta de sessão de `fwuser@localhost`. Em seguida, use a conta para executar algumas instruções que sejam consideradas legítimas para o perfil. Por exemplo:

   ```sql
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

   Como o perfil está no modo `RECORDING`, o firewall registra a forma normalizada do digest das declarações como regras na lista de permissões do perfil.

   Nota

   Até que o perfil da conta `fwuser@localhost` receba declarações no modo `RECORDING`, sua lista de permissões estará vazia, o que é equivalente a "rejeitar tudo". Nenhuma declaração pode corresponder a uma lista de permissões vazia, o que tem essas implicações:

   - O perfil da conta não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as declarações, proibindo efetivamente a execução de qualquer declaração pela conta.

   - O perfil da conta pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as declarações, mas as registra como suspeitas.

4. Neste ponto, as informações do perfil da conta são armazenadas em cache. Para ver essas informações, consulte as tabelas de firewall do `INFORMATION_SCHEMA`:

   ```sql
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

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Importante

   A mudança do perfil da conta do modo `RECORDING` sincroniza seus dados armazenados em cache com as tabelas do banco de dados do sistema `mysql`, que fornecem armazenamento persistente. Se você não mudar o modo para um perfil que está sendo gravado, os dados armazenados em cache não serão escritos no armazenamento persistente e serão perdidos quando o servidor for reiniciado.

6. Teste o perfil da conta usando a conta para executar algumas declarações aceitáveis e inaceitáveis. O firewall compara cada declaração da conta com a lista de permissão do perfil e a aceita ou rejeita:

   - Essa declaração não é idêntica a uma declaração de treinamento, mas produz a mesma declaração normalizada que uma delas, então o firewall a aceita:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   - Essas declarações não correspondem a nada na allowlist, então o firewall rejeita cada uma com um erro:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   - Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in whitelist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log` '
     ```

     Essas mensagens de log podem ser úteis para identificar a origem dos ataques, caso isso seja necessário.

O perfil da conta do firewall agora está configurado para a conta `fwuser@localhost`. Quando os clientes se conectam usando essa conta e tentam executar instruções, o perfil protege o MySQL contra instruções que não estão no allowlist do perfil.

É possível detectar intrusões ao registrar declarações que não correspondem como suspeitas, sem negar o acesso. Primeiro, coloque o perfil da conta no modo `DETECTING`:

```sql
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Em seguida, usando a conta, execute uma declaração que não corresponda à lista de permissões do perfil da conta. No modo `DETECTING`, o firewall permite que a declaração não correspondente seja executada:

```sql
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
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in whitelist.
Statement: SHOW TABLES LIKE ? '
```

Para desativar um perfil de conta, mude seu modo para `OFF`:

```sql
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

Para esquecer todo o treinamento de um perfil e desativá-lo, reinicie-o:

```sql
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

A operação de reinicialização faz com que o firewall exclua todas as regras do perfil e defina seu modo para `OFF`.

##### Monitoramento do Firewall

Para avaliar a atividade do firewall, examine suas variáveis de status. Por exemplo, após realizar o procedimento mostrado anteriormente para treinar e proteger a conta `fwuser@localhost`, as variáveis ficam assim:

```sql
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

As variáveis indicam o número de declarações rejeitadas, aceitas, registradas como suspeitas e adicionadas ao cache, respectivamente. O número de `Firewall_access_granted` (firewall-reference.html#statvar_Firewall_access_granted) é de 4 devido à declaração `@@version_comment` enviada pelo cliente **mysql** cada uma das três vezes que você se conectou usando a conta registrada, além da declaração `SHOW TABLES` (show-tables.html) que não foi bloqueada no modo `DETECTING`.

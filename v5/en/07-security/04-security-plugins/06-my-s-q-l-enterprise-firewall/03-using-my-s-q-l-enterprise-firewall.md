#### 6.4.6.3 Utilizando o MySQL Enterprise Firewall

Antes de utilizar o MySQL Enterprise Firewall, instale-o de acordo com as instruções fornecidas na [Seção 6.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”](firewall-installation.html "6.4.6.2 Instalando ou Desinstalando o MySQL Enterprise Firewall”). Além disso, o MySQL Enterprise Firewall não funciona em conjunto com o *query cache*; desative o *query cache* se ele estiver ativado (consulte a [Seção 8.10.3.3, “Configuração do Query Cache”](query-cache-configuration.html "8.10.3.3 Configuração do Query Cache")).

Esta seção descreve como configurar o MySQL Enterprise Firewall utilizando instruções SQL. Alternativamente, o MySQL Workbench 6.3.4 ou superior fornece uma interface gráfica para controle do *firewall*. Consulte [Interface do MySQL Enterprise Firewall](/doc/workbench/en/wb-mysql-firewall.html).

* [Ativando ou Desativando o Firewall](firewall-usage.html#firewall-enabling-disabling "Enabling or Disabling the Firewall")
* [Atribuindo Privilégios do Firewall](firewall-usage.html#firewall-privileges "Assigning Firewall Privileges")
* [Conceitos do Firewall](firewall-usage.html#firewall-concepts "Firewall Concepts")
* [Registrando Profiles de Contas do Firewall](firewall-usage.html#firewall-account-profiles "Registering Firewall Account Profiles")
* [Monitorando o Firewall](firewall-usage.html#firewall-monitoring "Monitoring the Firewall")

##### Ativando ou Desativando o Firewall

Para ativar ou desativar o *firewall*, defina a variável de sistema [`mysql_firewall_mode`](firewall-reference.html#sysvar_mysql_firewall_mode). Por padrão, esta variável é ativada quando o *firewall* é instalado. Para controlar explicitamente o estado inicial do *firewall*, você pode definir a variável na inicialização do servidor. Por exemplo, para ativar o *firewall* em um arquivo de opções, use estas linhas:

```sql
[mysqld]
mysql_firewall_mode=ON
```

Após modificar `my.cnf`, reinicie o servidor para que a nova configuração entre em vigor.

Também é possível desativar ou ativar o *firewall* em tempo de execução (*runtime*):

```sql
SET GLOBAL mysql_firewall_mode = OFF;
SET GLOBAL mysql_firewall_mode = ON;
```

##### Atribuindo Privilégios do Firewall

Com o *firewall* instalado, conceda os privilégios apropriados à conta ou contas MySQL a serem utilizadas para administrá-lo:

* Conceda o privilégio [`EXECUTE`](privileges-provided.html#priv_execute) para os *stored procedures* do *firewall* no `mysql` system Database. Eles podem invocar funções administrativas, portanto, o acesso ao *stored procedure* também requer os privilégios necessários para essas funções.

* Conceda o privilégio [`SUPER`](privileges-provided.html#priv_super) para que as funções administrativas do *firewall* possam ser executadas.

##### Conceitos do Firewall

O servidor MySQL permite que os clientes se conectem e recebe deles instruções SQL para serem executadas. Se o *firewall* estiver ativado, o servidor passa para ele cada instrução de entrada que não falhe imediatamente com um erro de sintaxe. Com base no fato de o *firewall* aceitar a instrução, o servidor a executa ou retorna um erro ao cliente. Esta seção descreve como o *firewall* realiza a tarefa de aceitar ou rejeitar instruções.

* [Profiles do Firewall](firewall-usage.html#firewall-profiles "Firewall Profiles")
* [Correspondência de Instruções do Firewall](firewall-usage.html#firewall-statement-matching "Firewall Statement Matching")
* [Modos Operacionais de Profile](firewall-usage.html#firewall-profile-modes "Profile Operational Modes")

###### Profiles do Firewall

O *firewall* utiliza um registro de *profiles* que determinam se a execução da instrução deve ser permitida. Os *profiles* possuem estes atributos:

* Um *allowlist*. O *allowlist* é o conjunto de regras que define quais instruções são aceitáveis para o *profile*.

* Um modo operacional atual. O modo permite que o *profile* seja utilizado de diferentes maneiras. Por exemplo: o *profile* pode ser colocado no modo de treinamento para estabelecer o *allowlist*; o *allowlist* pode ser usado para restringir a execução de instruções ou detecção de intrusão; o *profile* pode ser desativado por completo.

* Um escopo de aplicabilidade. O escopo indica a quais conexões de cliente o *profile* se aplica.

  O *firewall* suporta *profiles* baseados em conta, de modo que cada *profile* corresponda a uma conta de cliente específica (combinação de nome de usuário e nome de *host* do cliente). Por exemplo, você pode registrar um *profile* de conta cujo *allowlist* se aplique a conexões originadas de `admin@localhost` e outro *profile* de conta cujo *allowlist* se aplique a conexões originadas de `myapp@apphost.example.com`.

Inicialmente, não existem *profiles*, portanto, por padrão, o *firewall* aceita todas as instruções e não tem efeito sobre quais instruções as contas MySQL podem executar. Para aplicar os recursos de proteção do *firewall*, é necessária uma ação explícita:

* Registre um ou mais *profiles* no *firewall*.
* Treine o *firewall* estabelecendo o *allowlist* para cada *profile*; ou seja, os tipos de instruções que o *profile* permite que os clientes executem.

* Coloque os *profiles* treinados no modo de proteção para reforçar o MySQL contra a execução não autorizada de instruções:

  + O MySQL associa cada sessão de cliente a uma combinação específica de nome de usuário e nome de *host*. Essa combinação é a *session account* (conta de sessão).

  + Para cada conexão de cliente, o *firewall* usa a *session account* para determinar qual *profile* se aplica ao tratamento de instruções de entrada do cliente.

    O *firewall* aceita apenas instruções permitidas pelo *allowlist* do *profile* aplicável.

A proteção baseada em *profile* oferecida pelo *firewall* permite a implementação de estratégias como estas:

* Se um aplicativo tiver requisitos de proteção exclusivos, configure-o para usar uma conta não utilizada para qualquer outra finalidade e configure um *profile* para essa conta.

* Se aplicativos relacionados compartilharem requisitos de proteção, configure todos eles para usar a mesma conta (e, portanto, o mesmo *profile* de conta).

###### Correspondência de Instruções do Firewall

A correspondência de instruções (*statement matching*) realizada pelo *firewall* não utiliza as instruções SQL conforme recebidas dos clientes. Em vez disso, o servidor converte as instruções de entrada para a forma de *digest* normalizado e a operação do *firewall* utiliza estes *digests*. O benefício da normalização de instruções é que ela permite que instruções semelhantes sejam agrupadas e reconhecidas usando um único padrão. Por exemplo, estas instruções são distintas umas das outras:

```sql
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

Mas todas elas têm a mesma forma de *digest* normalizado:

```sql
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

Ao usar a normalização, os *allowlists* do *firewall* podem armazenar *digests* que correspondem a muitas instruções diferentes recebidas dos clientes. Para obter mais informações sobre normalização e *digests*, consulte a [Seção 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

Aviso

Definir a variável de sistema [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) como zero desativa a produção de *digest*, o que também desativa a funcionalidade do servidor que requer *digests*, como o MySQL Enterprise Firewall.

###### Modos Operacionais de Profile

Cada *profile* registrado no *firewall* possui seu próprio modo operacional, escolhido a partir destes valores:

* `OFF`: Este modo desativa o *profile*. O *firewall* o considera inativo e o ignora.

* `RECORDING`: Este é o modo de treinamento do *firewall*. As instruções de entrada recebidas de um cliente que corresponde ao *profile* são consideradas aceitáveis para o *profile* e se tornam parte de sua "impressão digital" (*fingerprint*). O *firewall* registra a forma de *digest* normalizado de cada instrução para aprender os padrões de instrução aceitáveis para o *profile*. Cada padrão é uma regra, e a união das regras é o *allowlist* do *profile*.

* `PROTECTING`: Neste modo, o *profile* permite ou impede a execução da instrução. O *firewall* compara as instruções de entrada com o *allowlist* do *profile*, aceitando apenas instruções que correspondam e rejeitando aquelas que não correspondam. Após treinar um *profile* no modo `RECORDING`, altere-o para o modo `PROTECTING` para reforçar o MySQL contra o acesso por instruções que se desviem do *allowlist*. Se a variável de sistema [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) estiver ativada, o *firewall* também registra as instruções rejeitadas no *error log*.

* `DETECTING`: Este modo detecta, mas não bloqueia intrusões (instruções que são suspeitas porque não correspondem a nada no *allowlist* do *profile*). No modo `DETECTING`, o *firewall* registra instruções suspeitas no *error log*, mas as aceita sem negar o acesso.

Quando um *profile* recebe qualquer um dos valores de modo precedentes, o *firewall* armazena o modo no *profile*. As operações de definição de modo do *firewall* também permitem um valor de modo `RESET`, mas este valor não é armazenado: definir um *profile* para o modo `RESET` faz com que o *firewall* exclua todas as regras para o *profile* e defina seu modo para `OFF`.

Note

As mensagens registradas no *error log* no modo `DETECTING` ou porque [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) está ativado são escritas como Notas (*Notes*), que são mensagens de informação. Para garantir que tais mensagens apareçam no *error log* e não sejam descartadas, defina a variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) para um valor de 3.

Conforme mencionado anteriormente, o MySQL associa cada sessão de cliente a uma combinação específica de nome de usuário e nome de *host* conhecida como *session account* (conta de sessão). O *firewall* compara a *session account* com os *profiles* registrados para determinar qual *profile* se aplica ao tratamento de instruções de entrada da sessão:

* O *firewall* ignora *profiles* inativos (*profiles* com modo `OFF`).

* A *session account* corresponde a um *profile* de conta ativo que tenha o mesmo usuário e *host*, se houver. Há no máximo um *profile* de conta assim.

Após corresponder a *session account* aos *profiles* registrados, o *firewall* trata cada instrução de entrada da seguinte forma:

* Se não houver *profile* aplicável, o *firewall* não impõe restrições e aceita a instrução.

* Se houver um *profile* aplicável, seu modo determina o tratamento da instrução:

  + No modo `RECORDING`, o *firewall* adiciona a instrução às regras do *allowlist* do *profile* e a aceita.

  + No modo `PROTECTING`, o *firewall* compara a instrução com as regras no *allowlist* do *profile*. O *firewall* aceita a instrução se houver correspondência e a rejeita caso contrário. Se a variável de sistema [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) estiver ativada, o *firewall* também registra as instruções rejeitadas no *error log*.

  + No modo `DETECTING`, o *firewall* detecta intrusões sem negar acesso. O *firewall* aceita a instrução, mas também a compara com o *allowlist* do *profile*, como no modo `PROTECTING`. Se a instrução for suspeita (sem correspondência), o *firewall* a registra no *error log*.

##### Registrando Profiles de Contas do Firewall

O MySQL Enterprise Firewall permite que *profiles* sejam registrados correspondendo a contas individuais. Para usar um *profile* de conta do *firewall* para proteger o MySQL contra instruções de entrada de uma determinada conta, siga estas etapas:

1. Registre o *profile* da conta e coloque-o no modo `RECORDING` (treinamento).

2. Conecte-se ao servidor MySQL usando a conta e execute instruções a serem aprendidas. Isso treina o *profile* da conta e estabelece as regras que formam o *allowlist* do *profile*.

3. Mude o *profile* da conta para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando a conta, o *allowlist* do *profile* de conta restringe a execução da instrução.

4. Caso seja necessário um treinamento adicional, mude o *profile* da conta para o modo `RECORDING` novamente, atualize seu *allowlist* com novos padrões de instrução e, em seguida, mude-o de volta para o modo `PROTECTING`.

Observe estas diretrizes para referências de contas relacionadas ao *firewall*:

* Preste atenção ao contexto em que as referências de conta ocorrem. Para nomear uma conta para operações de *firewall*, especifique-a como uma única string entre aspas (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para instruções como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), para as quais você coloca as partes do usuário e do *host* de um nome de conta entre aspas separadamente (`'user_name'@'host_name'`).

  O requisito de nomear contas como uma única *string* entre aspas para operações de *firewall* significa que você não pode usar contas que tenham o caractere `@` embutido no nome de usuário.

* O *firewall* avalia as instruções em relação às contas representadas pelos nomes reais de usuário e *host* conforme autenticados pelo servidor. Ao registrar contas em *profiles*, não use caracteres curinga (*wildcard*) ou *netmasks*:

  + Suponha que exista uma conta chamada `me@%.example.org` e um cliente a use para se conectar ao servidor a partir do *host* `abc.example.org`.

  + O nome da conta contém um caractere curinga `%`, mas o servidor autentica o cliente como tendo um nome de usuário `me` e nome de *host* `abc.example.com`, e é isso que o *firewall* vê.

  + Consequentemente, o nome da conta a ser usado para operações de *firewall* é `me@abc.example.org` em vez de `me@%.example.org`.

O procedimento a seguir mostra como registrar um *profile* de conta no *firewall*, treinar o *firewall* para conhecer as instruções aceitáveis para esse *profile* (seu *allowlist*) e usar o *profile* para proteger o MySQL contra a execução de instruções inaceitáveis pela conta. A conta de exemplo, `fwuser@localhost`, é presumida para uso por um aplicativo que acessa tabelas no Database `sakila` (disponível em [https://dev.mysql.com/doc/index-other.html](/doc/index-other.html)).

Use uma conta administrativa do MySQL para executar as etapas neste procedimento, exceto aquelas etapas designadas para execução pela conta `fwuser@localhost` que corresponde ao *profile* de conta registrado no *firewall*. Para instruções executadas usando esta conta, o *database* padrão deve ser `sakila`. (Você pode usar um *database* diferente ajustando as instruções de acordo.)

1. Se necessário, crie a conta para usar na execução de instruções (escolha uma senha apropriada) e conceda-lhe privilégios para o Database `sakila`:

   ```sql
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use o *stored procedure* `sp_set_firewall_mode()` para registrar o *profile* de conta no *firewall* e colocar o *profile* no modo `RECORDING` (treinamento):

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. Para treinar o *profile* de conta registrado, conecte-se ao servidor como `fwuser` a partir do *host* do servidor para que o *firewall* veja uma *session account* de `fwuser@localhost`. Em seguida, use a conta para executar algumas instruções a serem consideradas legítimas para o *profile*. Por exemplo:

   ```sql
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

   Como o *profile* está no modo `RECORDING`, o *firewall* registra a forma de *digest* normalizado das instruções como regras no *allowlist* do *profile*.

   Note

   Até que o *profile* da conta `fwuser@localhost` receba instruções no modo `RECORDING`, seu *allowlist* está vazio, o que é equivalente a "negar tudo" (*deny all*). Nenhuma instrução pode corresponder a um *allowlist* vazio, o que tem estas implicações:

   * O *profile* da conta não pode ser mudado para o modo `PROTECTING`. Ele rejeitaria todas as instruções, efetivamente proibindo a conta de executar qualquer instrução.

   * O *profile* da conta pode ser mudado para o modo `DETECTING`. Neste caso, o *profile* aceita todas as instruções, mas as registra como suspeitas.

4. Neste ponto, as informações do *profile* da conta são armazenadas em *cache*. Para ver essas informações, consulte as tabelas de *firewall* do `INFORMATION_SCHEMA`:

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

   Note

   A regra `@@version_comment` vem de uma instrução enviada automaticamente pelo cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") quando você se conecta ao servidor.

   Importante

   Treine o *firewall* sob condições que correspondam ao uso do aplicativo. Por exemplo, para determinar as características e capacidades do servidor, um determinado *connector* MySQL pode enviar instruções ao servidor no início de cada sessão. Se um aplicativo for normalmente usado por meio desse *connector*, treine o *firewall* usando o *connector* também. Isso permite que essas instruções iniciais se tornem parte do *allowlist* para o *profile* de conta associado ao aplicativo.

5. Invoque `sp_set_firewall_mode()` novamente, desta vez mudando o *profile* da conta para o modo `PROTECTING`:

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Importante

   Mudar o *profile* da conta para fora do modo `RECORDING` sincroniza seus dados em *cache* com as tabelas do `mysql` system Database que fornecem o armazenamento subjacente persistente. Se você não mudar o modo de um *profile* que está sendo gravado, os dados em *cache* não são gravados no armazenamento persistente e são perdidos quando o servidor é reiniciado.

6. Teste o *profile* da conta usando a conta para executar algumas instruções aceitáveis e inaceitáveis. O *firewall* compara cada instrução da conta com o *allowlist* do *profile* e a aceita ou rejeita:

   * Esta instrução não é idêntica a uma instrução de treinamento, mas produz a mesma instrução normalizada que uma delas, então o *firewall* a aceita:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   * Estas instruções não correspondem a nada no *allowlist*, então o *firewall* rejeita cada uma com um erro:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * Se a variável de sistema [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) estiver ativada, o *firewall* também registra as instruções rejeitadas no *error log*. Por exemplo:

     ```sql
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in whitelist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log` '
     ```

     Essas mensagens de *log* podem ser úteis para identificar a origem de ataques, caso seja necessário.

O *profile* de conta do *firewall* agora está treinado para a conta `fwuser@localhost`. Quando os clientes se conectam usando essa conta e tentam executar instruções, o *profile* protege o MySQL contra instruções que não correspondam ao *allowlist* do *profile*.

É possível detectar intrusões registrando instruções não correspondentes como suspeitas sem negar acesso. Primeiro, coloque o *profile* da conta no modo `DETECTING`:

```sql
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Em seguida, usando a conta, execute uma instrução que não corresponda ao *allowlist* do *profile* da conta. No modo `DETECTING`, o *firewall* permite que a instrução não correspondente seja executada:

```sql
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

Além disso, o *firewall* registra uma mensagem no *error log*:

```sql
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in whitelist.
Statement: SHOW TABLES LIKE ? '
```

Para desativar um *profile* de conta, altere seu modo para `OFF`:

```sql
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

Para esquecer todo o treinamento de um *profile* e desativá-lo, reinicie-o (*reset*):

```sql
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

A operação de *reset* faz com que o *firewall* exclua todas as regras para o *profile* e defina seu modo para `OFF`.

##### Monitorando o Firewall

Para avaliar a atividade do *firewall*, examine suas variáveis de *status*. Por exemplo, após executar o procedimento mostrado anteriormente para treinar e proteger a conta `fwuser@localhost`, as variáveis se parecem com isto:

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

As variáveis indicam o número de instruções rejeitadas, aceitas, registradas como suspeitas e adicionadas ao *cache*, respectivamente. A contagem [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted) é 4 devido à instrução `@@version_comment` enviada pelo cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") em cada uma das três vezes que você se conectou usando a conta registrada, mais a instrução [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") que não foi bloqueada no modo `DETECTING`.
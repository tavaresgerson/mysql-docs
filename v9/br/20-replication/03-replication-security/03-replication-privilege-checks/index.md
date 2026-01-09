### 19.3.3 Verificação de Privilégios de Replicação

19.3.3.1 Privilegios para a Conta de VERIFICAÇÃO_DE_PRIVILÉGIOS_USER

19.3.3.2 Verificação de Privilegios para Canais de Replicação de Grupo

19.3.3.3 Recuperação de Verificações de Privilégios de Replicação Falhas

Por padrão, a replicação do MySQL (incluindo a Replicação de Grupo) não realiza verificações de privilégios quando as transações que já foram aceitas por outro servidor são aplicadas em uma réplica ou membro do grupo. Você pode criar uma conta de usuário com os privilégios apropriados para aplicar as transações que normalmente são replicadas em um canal, e especificar essa conta como a `PRIVILEGE_CHECKS_USER` para o aplicativo de replicação, usando uma declaração `ALTERAR_FONTE_DE_REPLICAÇÃO PARA`. O MySQL então verifica cada transação contra os privilégios da conta de usuário para verificar se você autorizou a operação para esse canal. A conta também pode ser usada com segurança por um administrador para aplicar ou reaplicar transações a partir da saída de **mysqlbinlog**, por exemplo, para recuperar de um erro de replicação no canal.

O uso de uma conta `PRIVILEGE_CHECKS_USER` ajuda a proteger um canal de replicação contra o uso não autorizado ou acidental de operações privilegiadas ou indesejadas. A conta `PRIVILEGE_CHECKS_USER` fornece uma camada adicional de segurança em situações como essas:

* Você está replicando entre uma instância de servidor na rede da sua organização e uma instância de servidor em outra rede, como uma instância fornecida por um provedor de serviços em nuvem.

* Você deseja ter múltiplas implantações locais ou remotas administradas como unidades separadas, sem dar privilégios de uma conta de administrador em todas as implantações.

* Você deseja ter uma conta de administrador que permita que um administrador realize apenas operações diretamente relevantes ao canal de replicação e aos bancos de dados que ele replica, em vez de ter privilégios amplos na instância do servidor.

Você pode aumentar a segurança de um canal de replicação onde as verificações de privilégios são aplicadas adicionando uma ou ambas as opções à declaração `ALTERAR CANAL DE REPRODUÇÃO PARA`, ao especificar a conta `PRIVILEGE_CHECKS_USER` para o canal:

* A opção `REQUER_FORMATO_LINHA` faz com que o canal de replicação aceite apenas eventos de replicação baseados em linhas. Quando `REQUER_FORMATO_LINHA` está definido, você deve usar o registro binário baseado em linhas (`binlog_format=ROW`) no servidor de origem. Com o registro binário baseado em declarações, alguns privilégios de nível de administrador podem ser necessários para que a conta `PRIVILEGE_CHECKS_USER` execute transações com sucesso.

* A opção `REQUER_VERIFICAÇÃO_CHAVE_PRIMÁRIA_TABELA` faz com que o canal de replicação use sua própria política para verificações de chave primária. Definir `ON` significa que chaves primárias são sempre necessárias, e definir `OFF` significa que chaves primárias nunca são necessárias. O ajuste padrão, `STREAM`, define o valor da variável de sistema `sql_require_primary_key` da sessão usando o valor que é replicado da origem para cada transação. Quando `PRIVILEGE_CHECKS_USER` está definido, definir `REQUER_VERIFICAÇÃO_CHAVE_PRIMÁRIA_TABELA` para `ON` ou `OFF` significa que a conta de usuário não precisa de privilégios de nível de administração de sessão para definir variáveis de sessão restritas, que são necessárias para alterar o valor de `sql_require_primary_key`. Isso também normaliza o comportamento em todos os canais de replicação para diferentes fontes.

Você concede o privilégio `REPLICATION_APPLIER` para permitir que uma conta de usuário apareça como `PRIVILEGE_CHECKS_USER` para um fio de aplicativo de replicação e execute as instruções `BINLOG` de uso interno usadas pelo mysqlbinlog. O nome do usuário e o nome do host para a conta `PRIVILEGE_CHECKS_USER` devem seguir a sintaxe descrita na Seção 8.2.4, “Especificação de Nomes de Conta” e o usuário não deve ser um usuário anônimo (com um nome de usuário em branco) ou o `CURRENT_USER`. Para criar uma nova conta, use `CREATE USER`. Para conceder a essa conta o privilégio `REPLICATION_APPLIER`, use a instrução `GRANT`. Por exemplo, para criar uma conta de usuário `priv_repl`, que pode ser usada manualmente por um administrador de qualquer host no domínio `example.com`, e requer uma conexão criptografada, emita as seguintes instruções:

```
mysql> SET sql_log_bin = 0;
mysql> CREATE USER 'priv_repl'@'%.example.com' IDENTIFIED BY 'password' REQUIRE SSL;
mysql> GRANT REPLICATION_APPLIER ON *.* TO 'priv_repl'@'%.example.com';
mysql> SET sql_log_bin = 1;
```

As instruções `SET sql_log_bin` são usadas para que as instruções de gerenciamento de conta não sejam adicionadas ao log binário e enviadas para os canais de replicação (veja a Seção 15.4.1.3, “Instrução SET sql_log_bin”).

Importante

O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários (para detalhes, consulte a Seção 8.4.1.1, “Autenticação Caching SHA-2 Pluggable”). Para se conectar a um servidor usando uma conta de usuário que autentica com este plugin, você deve configurar uma conexão criptografada conforme descrito na Seção 19.3.1, “Configuração da Replicação para Usar Conexões Criptografadas” ou habilitar a conexão não criptografada para suportar a troca de senhas usando um par de chaves RSA.

Após configurar a conta de usuário, use a instrução `GRANT` para conceder privilégios adicionais para permitir que a conta de usuário faça as alterações no banco de dados que você espera que o thread do aplicável realize, como atualizar tabelas específicas mantidas no servidor. Esses mesmos privilégios permitem que um administrador use a conta se precisar executar qualquer uma dessas transações manualmente no canal de replicação. Se uma operação inesperada for realizada para a qual você não concedeu os privilégios apropriados, a operação é desabilitada e o thread do aplicável de replicação pára com um erro. A seção 19.3.3.1, “Privilégios para a Conta de Usuário PRIVILEGE_CHECKS_USER de Replicação”, explica quais privilégios adicionais a conta precisa. Por exemplo, para conceder à conta de usuário `priv_repl` o privilégio `INSERT` para adicionar linhas à tabela `cust` em `db1`, execute a seguinte instrução:

```
mysql> GRANT INSERT ON db1.cust TO 'priv_repl'@'%.example.com';
```

Você atribui a conta `PRIVILEGE_CHECKS_USER` para um canal de replicação usando uma instrução `CHANGE REPLICATION SOURCE TO`. Se a replicação estiver em execução, execute `STOP REPLICA` antes da instrução `CHANGE REPLICATION SOURCE TO` e `START REPLICA` depois. O uso do registro binário baseado em linhas é altamente recomendado quando o `PRIVILEGE_CHECKS_USER` está definido; você pode usar a instrução para definir `REQUIRE_ROW_FORMAT` para impor isso.

Quando você reiniciar o canal de replicação, os controles de privilégios dinâmicos são aplicados a partir desse ponto em diante. No entanto, os privilégios globais estáticos não estão ativos no contexto do aplicável até que você recarregue as tabelas de concessão, porque esses privilégios não são alterados para um cliente conectado. Para ativar privilégios estáticos, execute uma operação de **flush-privileges**. Isso pode ser feito emitindo uma instrução `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**.

Por exemplo, para iniciar verificações de privilégios no canal `channel_1` em uma replica em execução, execute as seguintes instruções:

```
mysql> STOP REPLICA FOR CHANNEL 'channel_1';
mysql> CHANGE REPLICATION SOURCE TO
     >    PRIVILEGE_CHECKS_USER = 'priv_repl'@'%.example.com',
     >    REQUIRE_ROW_FORMAT = 1 FOR CHANNEL 'channel_1';
mysql> FLUSH PRIVILEGES;
mysql> START REPLICA FOR CHANNEL 'channel_1';
```

Se você não especificar um canal e nenhum outro canal existir, a instrução é aplicada ao canal padrão. O nome de usuário e o nome do host para a conta `PRIVILEGE_CHECKS_USER` para um canal são exibidos na tabela `replication_applier_configuration` do Schema de Desempenho, onde são corretamente escapados para que possam ser copiados diretamente em instruções SQL para executar transações individuais.

Se você estiver usando o plugin `Rewriter`, você deve conceder à conta de usuário `PRIVILEGE_CHECKS_USER` o privilégio `SKIP_QUERY_REWRITE`. Isso impede que as instruções emitidas por esse usuário sejam reescritas. Consulte a Seção 7.6.4, “O Plugin de Reescrita de Consultas de Reescrita”, para obter mais informações.

Quando `REQUIRE_ROW_FORMAT` é definido para um canal de replicação, o aplicador de replicação não cria ou exclui tabelas temporárias, e assim não define a variável de sistema `pseudo_thread_id`. Ele não executa instruções `LOAD DATA INFILE`, e assim não tenta operações de arquivo para acessar ou excluir os arquivos temporários associados às cargas de dados (registrados como um `Format_description_log_event`). Ele não executa eventos `INTVAR`, `RAND` e `USER_VAR`, que são usados para reproduzir o estado de conexão do cliente para a replicação baseada em declarações (DML). (Uma exceção é os eventos `USER_VAR` que estão associados a consultas DDL, que são executados.) Ele não executa nenhuma instrução que seja registrada dentro de transações DML. Se o aplicador de replicação detectar algum desses tipos de evento enquanto tenta enfileirar ou aplicar uma transação, o evento não é aplicado e a replicação pára com um erro.

Você pode definir `REQUIRE_ROW_FORMAT` para um canal de replicação, independentemente de você definir uma conta `PRIVILEGE_CHECKS_USER`. As restrições implementadas ao definir essa opção aumentam a segurança do canal de replicação, mesmo sem verificações de privilégios. Você também pode especificar a opção `--require-row-format` ao usar **mysqlbinlog**, para impor eventos de replicação baseados em linhas no **mysqlbinlog** de saída.

**Contexto de Segurança.** Por padrão, quando um thread de aplicável de replicação é iniciado com uma conta de usuário especificada como `PRIVILEGE_CHECKS_USER`, o contexto de segurança é criado usando rolos padrão, ou com todos os rolos se `activate_all_roles_on_login` estiver definido como `ON`.

Você pode usar rolos para fornecer um conjunto de privilégios geral para contas que são usadas como contas `PRIVILEGE_CHECKS_USER`, como no exemplo a seguir. Aqui, em vez de conceder o privilégio `INSERT` para a tabela `db1.cust` diretamente para uma conta de usuário, como no exemplo anterior, este privilégio é concedido ao rol `priv_repl_role` junto com o privilégio `REPLICATION_APPLIER`. O rol é então usado para conceder o conjunto de privilégios a duas contas de usuário, que agora podem ser usadas como contas `PRIVILEGE_CHECKS_USER`:

```
mysql> SET sql_log_bin = 0;
mysql> CREATE USER 'priv_repa'@'%.example.com'
                  IDENTIFIED BY 'password'
                  REQUIRE SSL;
mysql> CREATE USER 'priv_repb'@'%.example.com'
                  IDENTIFIED BY 'password'
                  REQUIRE SSL;
mysql> CREATE ROLE 'priv_repl_role';
mysql> GRANT REPLICATION_APPLIER TO 'priv_repl_role';
mysql> GRANT INSERT ON db1.cust TO 'priv_repl_role';
mysql> GRANT 'priv_repl_role' TO
                  'priv_repa'@'%.example.com',
                  'priv_repb'@'%.example.com';
mysql> SET DEFAULT ROLE 'priv_repl_role' TO
                  'priv_repa'@'%.example.com',
                  'priv_repb'@'%.example.com';
mysql> SET sql_log_bin = 1;
```

Tenha em mente que, quando o thread de aplicável de replicação cria o contexto de segurança, ele verifica os privilégios para a conta `PRIVILEGE_CHECKS_USER`, mas não realiza validação de senha e não realiza verificações relacionadas à gestão de contas, como verificar se a conta está bloqueada. O contexto de segurança criado permanece inalterado durante a vida útil do thread de aplicável de replicação.
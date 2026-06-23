## 3.4 O que o processo de atualização do MySQL atualiza

A instalação de uma nova versão do MySQL pode exigir a atualização dessas partes da instalação existente:

* O esquema do sistema `mysql`, que contém tabelas que armazenam informações necessárias pelo servidor MySQL conforme ele é executado (veja Seção 7.3, “O esquema do sistema mysql”). As tabelas do esquema `mysql` se enquadram em duas categorias amplas:

+ Tabelas do dicionário de dados, que armazenam metadados de objetos de banco de dados.

+ Tabelas do sistema (ou seja, as tabelas restantes do dicionário não-dados), que são utilizadas para outros propósitos operacionais.

* Outros esquemas, alguns dos quais são construídos e podem ser considerados “de propriedade” do servidor, e outros que não são:

+ os esquemas `performance_schema`, `INFORMATION_SCHEMA`, `ndbinfo` e `sys`.

+ Esquemas de usuário.

Dois números de versão distintos estão associados às partes da instalação que podem exigir atualização:

* Versão do dicionário de dados. Isso se aplica às tabelas do dicionário de dados.

* A versão do servidor, também conhecida como versão do MySQL. Isso se aplica às tabelas e objetos do sistema em outros esquemas.

Em ambos os casos, a versão real aplicável à instalação MySQL existente é armazenada no dicionário de dados, e a versão esperada atual é compilada na nova versão do MySQL. Quando uma versão real é menor que a versão esperada atual, essas partes da instalação associadas a essa versão devem ser atualizadas para a versão atual. Se ambas as versões indicarem que uma atualização é necessária, a atualização do dicionário de dados deve ocorrer primeiro.

Como reflexo das duas versões distintas mencionadas acima, a atualização ocorre em dois passos:

* Passo 1: Atualização do dicionário de dados.

Este passo atualiza:

+ As tabelas do dicionário de dados no esquema `mysql`. Se a versão real do dicionário de dados for menor que a versão esperada atual, o servidor cria tabelas de dicionário de dados com definições atualizadas, copia metadados persistentes para as novas tabelas, substitui atômica e reiniicia o dicionário de dados.

+ O Schema de Desempenho, `INFORMATION_SCHEMA` e `ndbinfo`.

* Passo 2: Atualização do servidor.

Este passo compreende todas as outras tarefas de atualização. Se a versão do servidor da instalação existente do MySQL for menor que a versão do MySQL recém-instalado, tudo o resto deve ser atualizado:

+ As tabelas de sistema no esquema `mysql` (as demais tabelas não relacionadas ao dicionário de dados).

+ O esquema `sys`.  
  + Esquemas de usuário.

A atualização do dicionário de dados (passo 1) é da responsabilidade do servidor, que realiza essa tarefa conforme necessário no momento do início, a menos que seja invocada com uma opção que impeça isso. A opção é `--upgrade=NONE` a partir do MySQL 8.0.16, `--no-dd-upgrade` antes do MySQL 8.0.16.

Se o dicionário de dados estiver desatualizado, mas o servidor não puder ser atualizado, o servidor não será executado e, em vez disso, será encerrado com um erro. Por exemplo:

```
[ERROR] [MY-013381] [Server] Server shutting down because upgrade is
required, yet prohibited by the command line option '--upgrade=NONE'.
[ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
[ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
```

Algumas mudanças na responsabilidade do passo 2 ocorreram no MySQL 8.0.16:

* Antes do MySQL 8.0.16, o **mysql_upgrade** atualiza o Gerador de Desempenho, o `INFORMATION_SCHEMA` e os objetos descritos no passo 2. Espera-se que o DBA invoque o **mysql_upgrade** manualmente após iniciar o servidor.

* A partir do MySQL 8.0.16, o servidor realiza todas as tarefas anteriormente mantidas pelo **mysql_upgrade**. Embora a atualização permaneça uma operação de dois passos, o servidor as realiza em ambos os casos, resultando em um processo mais simples.

Dependendo da versão do MySQL para a qual você está fazendo a atualização, as instruções do Upgrade no lugar e do Upgrade lógico indicam se o servidor executa todas as tarefas de atualização ou se você também deve invocar o **mysql_upgrade** após a inicialização do servidor.

Nota

Como o servidor atualiza o Schema de Desempenho, `INFORMATION_SCHEMA`, e os objetos descritos no passo 2 a partir do MySQL 8.0.16, o **mysql_upgrade** não é necessário e é descontinuado a partir dessa versão; espere que ele seja removido em uma versão futura do MySQL.

A maioria dos aspectos do que ocorre durante a etapa 2 são os mesmos antes e a partir do MySQL 8.0.16, embora possam ser necessárias diferentes opções de comando para alcançar um efeito específico.

A partir do MySQL 8.0.16, a opção de servidor `--upgrade` controla se e como o servidor realiza uma atualização automática no início:

* Sem opção ou com `--upgrade=AUTO`, o servidor atualiza qualquer coisa que ele determine estar desatualizada (etapas 1 e 2).

* Com `--upgrade=NONE`, o servidor não faz nada (pula os passos 1 e 2), mas também sai com um erro se o dicionário de dados precisar ser atualizado. Não é possível executar o servidor com um dicionário de dados desatualizado; o servidor insiste em atualizá-lo ou sair.

* Com `--upgrade=MINIMAL`, o servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1). Observe que, após uma atualização com esta opção, a Replicação de Grupo não pode ser iniciada, porque as tabelas do sistema nas quais os recursos internos da replicação dependem não são atualizadas, e a funcionalidade reduzida também pode ser aparente em outras áreas.

* Com `--upgrade=FORCE`, o servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1), e força uma atualização de tudo o resto (passo 2). O servidor deve demorar mais para iniciar com esta opção, pois o servidor verifica todos os objetos em todos os esquemas.

`FORCE` é útil para forçar que as ações do passo 2 sejam realizadas se o servidor achar que elas não são necessárias. Uma maneira pela qual `FORCE` difere de `AUTO` é que, com `FORCE`, o servidor recria tabelas do sistema, como tabelas de ajuda ou tabelas de fuso horário, se elas estiverem ausentes.

A lista a seguir mostra os comandos de atualização anteriores ao MySQL 8.0.16 e os comandos equivalentes para o MySQL 8.0.16 e versões posteriores:

* Realize uma atualização normal (os passos 1 e 2 conforme necessário):

+ Antes do MySQL 8.0.16: **mysqld** seguido por **mysql_upgrade**

+ A partir do MySQL 8.0.16: **mysqld**
* Realize apenas o passo 1 conforme necessário:

+ Antes do MySQL 8.0.16: Não é possível realizar todas as tarefas de atualização descritas no passo 1, excluindo as descritas no passo 2. No entanto, você pode evitar a atualização dos esquemas de usuário e do esquema `sys` usando **mysqld** seguido por **mysql_upgrade** com as opções `--upgrade-system-tables` e `--skip-sys-schema`.

+ A partir do MySQL 8.0.16: [**mysqld --upgrade=MINIMAL**](mysqld.html "6.3.1 mysqld — The MySQL Server")

* Realize a etapa 1 conforme necessário e force a etapa 2:

+ Antes do MySQL 8.0.16: **mysqld** seguido por **mysql_upgrade --force**

+ a partir do MySQL 8.0.16: [**mysqld --upgrade=FORCE**](mysqld.html "6.3.1 mysqld — The MySQL Server")

Antes do MySQL 8.0.16, certas opções do **mysql_upgrade** afetam as ações que ele executa. O seguinte quadro mostra quais valores das opções do servidor `--upgrade` devem ser usados a partir do MySQL 8.0.16 para obter efeitos semelhantes. (Esses valores não são necessariamente equivalentes exatos, pois um valor de opção `--upgrade` pode ter efeitos adicionais.)

<table summary="Server --upgrade option value equivalents to certain mysql_upgrade options."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>mysql_upgrade Option</th> <th>Server Option</th> </tr></thead><tbody><tr> <td><code>--skip-sys-schema</code></td> <td><code>--upgrade=NONE</code> or <code>--upgrade=MINIMAL</code></td> </tr><tr> <td><code>--upgrade-system-tables</code></td> <td><code>--upgrade=NONE</code> or <code>--upgrade=MINIMAL</code></td> </tr><tr> <td><code>--force</code></td> <td><code>--upgrade=FORCE</code></td> </tr></tbody></table>

Observações adicionais sobre o que ocorre durante a etapa 2 de atualização:

* O Passo 2 instala o esquema `sys` se ele não estiver instalado e, caso contrário, o atualiza para a versão atual. Um erro ocorre se um esquema `sys` existir, mas não tiver uma visão `version`, assumindo que sua ausência indica um esquema criado pelo usuário:

  ```
  A sys schema exists with no sys.version view. If
  you have a user created sys schema, this must be renamed for the
  upgrade to succeed.
  ```

Para fazer uma atualização neste caso, remova ou renomeie primeiro o esquema existente `sys`. Em seguida, realize o procedimento de atualização novamente. (Pode ser necessário forçar o passo 2.)

Para evitar a verificação do esquema `sys`:

+ a partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.

+ Antes do MySQL 8.0.16: Inicie o **mysql_upgrade** com a opção `--skip-sys-schema`.

* O Passo 2 atualiza as tabelas do sistema para garantir que elas tenham a estrutura atual. Isso é verdadeiro, independentemente de o servidor ou o **mysql_upgrade** realizar o passo. Em relação ao conteúdo das tabelas de ajuda e das tabelas de fuso horário, o **mysql_upgrade** não carrega nenhum tipo de tabela, enquanto o servidor carrega as tabelas de ajuda, mas não as tabelas de fuso horário. (Ou seja, antes do MySQL 8.0.16, o servidor carrega as tabelas de ajuda apenas no momento da inicialização do diretório de dados. A partir do MySQL 8.0.16, ele carrega as tabelas de ajuda no momento da inicialização e do upgrade.) O procedimento para carregar as tabelas de fuso horário depende da plataforma e requer tomada de decisão pelo DBA, portanto, não pode ser feito automaticamente.

* A partir do MySQL 8.0.30, ao atualizar as tabelas de sistema no esquema `mysql`, a ordem dos colunas na chave primária das tabelas `mysql.db`, `mysql.tables_priv`, `mysql.columns_priv` e `mysql.procs_priv` é alterada para colocar as colunas de nome do host e nome do usuário juntas. Colocar o nome do host e o nome do usuário juntos significa que a pesquisa de índice pode ser usada, o que melhora o desempenho para as declarações `CREATE USER`, `DROP USER` e `RENAME USER`, e para as verificações de ACL para vários usuários com vários privilégios. A eliminação e a criação do índice são necessárias e podem levar algum tempo se o sistema tiver um grande número de usuários e privilégios.

* O passo 2 processa todas as tabelas em todos os esquemas do usuário conforme necessário. O verificação de tabela pode levar um longo tempo para ser concluída. Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. A verificação de tabela usa a opção `FOR UPGRADE` da declaração `CHECK TABLE`. Para detalhes sobre o que essa opção implica, consulte a Seção 15.7.3.2, “Declaração CHECK TABLE”.

Para evitar o controle de tabela:

+ a partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.

+ Antes do MySQL 8.0.16: Inicie o **mysql_upgrade** com a opção `--upgrade-system-tables`.

Para forçar a verificação da tabela:

+ a partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=FORCE`.

+ Antes do MySQL 8.0.16: Inicie o **mysql_upgrade** com a opção `--force`.

* O passo 2 salva o número da versão do MySQL em um arquivo chamado `mysql_upgrade_info` no diretório de dados.

Ignorar o arquivo `mysql_upgrade_info` e realizar a verificação independentemente:

+ a partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=FORCE`.

+ Antes do MySQL 8.0.16: Inicie o **mysql_upgrade** com a opção `--force`.

Nota

O arquivo `mysql_upgrade_info` é desatualizado; espere que ele seja removido em uma versão futura do MySQL.

* A etapa 2 marca todas as tabelas verificadas e reparadas com o número atual da versão do MySQL. Isso garante que, na próxima vez que a verificação de atualização ocorrer com a mesma versão do servidor, pode ser determinado se há necessidade de verificar ou reparar novamente uma determinada tabela.
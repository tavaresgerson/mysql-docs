## 3.4 O que o processo de atualização do MySQL atualiza

A instalação de uma nova versão do MySQL pode exigir a atualização dessas partes da instalação existente:

- O esquema do sistema `mysql` contém tabelas que armazenam informações necessárias para o servidor MySQL conforme ele está em execução (veja a Seção 7.3, “O esquema do sistema mysql”). As tabelas do esquema `mysql` se enquadram em duas categorias amplas:

  - Tabelas de dicionário de dados, que armazenam metadados de objetos de banco de dados.

  - Tabelas do sistema (ou seja, as tabelas restantes que não fazem parte do dicionário de dados), que são usadas para outros fins operacionais.

- Outros esquemas, alguns dos quais são construídos dentro do servidor e podem ser considerados "de propriedade" do servidor, e outros que não são:

  - Os esquemas `performance_schema`, `INFORMATION_SCHEMA`, `ndbinfo` e `sys`.

  - Esquemas de usuários.

Dois números de versão distintos estão associados a partes da instalação que podem exigir uma atualização:

- A versão do dicionário de dados. Isso se aplica às tabelas do dicionário de dados.

- A versão do servidor, também conhecida como versão do MySQL. Isso se aplica às tabelas e objetos do sistema em outros esquemas.

Em ambos os casos, a versão real aplicável à instalação existente do MySQL é armazenada no dicionário de dados, e a versão atual esperada é compilada na nova versão do MySQL. Quando uma versão real é menor que a versão atual esperada, essas partes da instalação associadas a essa versão devem ser atualizadas para a versão atual. Se ambas as versões indicarem que uma atualização é necessária, a atualização do dicionário de dados deve ocorrer primeiro.

Como reflexo das duas versões distintas mencionadas, a atualização ocorre em dois passos:

- Passo 1: Atualização do dicionário de dados.

  Essa etapa atualiza:

  - As tabelas do dicionário de dados no esquema `mysql`. Se a versão atual do dicionário de dados for menor que a versão esperada atual, o servidor cria tabelas do dicionário de dados com definições atualizadas, copia metadados persistentes para as novas tabelas, substitui as tabelas antigas de forma atômica pelas novas e reinicia o dicionário de dados.

  - O Schema de Desempenho, `INFORMATION_SCHEMA` e `ndbinfo`.

- Passo 2: Atualização do servidor.

  Essa etapa inclui todas as outras tarefas de atualização. Se a versão do servidor da instalação existente do MySQL for menor que a versão do MySQL recém-instalado, tudo o mais deve ser atualizado:

  - As tabelas do sistema no esquema `mysql` (as tabelas restantes que não fazem parte do dicionário de dados).

  - O esquema `sys`.

  - Esquemas de usuários.

A atualização do dicionário de dados (passo 1) é responsabilidade do servidor, que realiza essa tarefa conforme necessário ao iniciar, a menos que seja invocado com uma opção que impeça isso. A opção é `--upgrade=NONE` a partir do MySQL 8.0.16, `--no-dd-upgrade` antes do MySQL 8.0.16.

Se o dicionário de dados estiver desatualizado, mas o servidor não puder ser atualizado, o servidor não será executado e encerrará com um erro. Por exemplo:

```
[ERROR] [MY-013381] [Server] Server shutting down because upgrade is
required, yet prohibited by the command line option '--upgrade=NONE'.
[ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
[ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
```

Algumas mudanças na responsabilidade do passo 2 ocorreram no MySQL 8.0.16:

- Antes do MySQL 8.0.16, o **mysql\_upgrade** atualiza o Schema de Desempenho, o `INFORMATION_SCHEMA` e os objetos descritos no passo 2. Espera-se que o DBA invoque o **mysql\_upgrade** manualmente após iniciar o servidor.

- A partir do MySQL 8.0.16, o servidor executa todas as tarefas anteriormente gerenciadas pelo **mysql\_upgrade**. Embora a atualização ainda seja uma operação de duas etapas, o servidor executa ambas, resultando em um processo mais simples.

Dependendo da versão do MySQL para a qual você está fazendo a atualização, as instruções no Upgradao Local e no Upgradao Lógico indicam se o servidor executa todas as tarefas de atualização ou se você também deve chamar o **mysql\_upgrade** após a inicialização do servidor.

Nota

Como o servidor atualiza o Schema de Desempenho, `INFORMATION_SCHEMA`, e os objetos descritos no passo 2 a partir do MySQL 8.0.16, o **mysql\_upgrade** não é mais necessário e está desatualizado a partir dessa versão; espere que ele seja removido em uma versão futura do MySQL.

A maioria dos aspectos do que ocorre durante a etapa 2 é a mesma antes e a partir do MySQL 8.0.16, embora possam ser necessárias diferentes opções de comando para alcançar um efeito específico.

A partir do MySQL 8.0.16, a opção de servidor `--upgrade` controla se e como o servidor realiza uma atualização automática ao iniciar:

- Sem opção ou com `--upgrade=AUTO`, o servidor atualiza qualquer coisa que ele determine estar desatualizada (passos 1 e 2).

- Com `--upgrade=NONE`, o servidor não faz nenhuma atualização (pula os passos 1 e 2), mas também sai com um erro se o dicionário de dados precisar ser atualizado. Não é possível executar o servidor com um dicionário de dados desatualizado; o servidor insiste em atualizá-lo ou sair.

- Com `--upgrade=MINIMAL`, o servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1). Observe que, após uma atualização com essa opção, a Replicação em Grupo não pode ser iniciada, pois as tabelas do sistema nas quais dependem os recursos internos da replicação não são atualizadas, e a funcionalidade reduzida também pode ser aparente em outras áreas.

- Com `--upgrade=FORCE`, o servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1), e obriga a atualização de tudo o mais (passo 2). O tempo de inicialização do servidor pode ser maior com essa opção, pois o servidor verifica todos os objetos em todos os esquemas.

`FORCE` é útil para forçar que as ações do passo 2 sejam executadas se o servidor achar que elas não são necessárias. Uma maneira pela qual `FORCE` difere de `AUTO` é que, com `FORCE`, o servidor recria tabelas do sistema, como tabelas de ajuda ou tabelas de fuso horário, se estiverem ausentes.

A lista a seguir mostra os comandos de atualização anteriores ao MySQL 8.0.16 e os comandos equivalentes para o MySQL 8.0.16 e versões posteriores:

- Realize uma atualização normal (faça os passos 1 e 2 conforme necessário):

  - Antes do MySQL 8.0.16: **mysqld** seguido de **mysql\_upgrade**

  - A partir do MySQL 8.0.16: **mysqld**

- Realize apenas a etapa 1 conforme necessário:

  - Antes do MySQL 8.0.16: Não é possível realizar todas as tarefas de atualização descritas no passo 1, excluindo as descritas no passo 2. No entanto, você pode evitar a atualização dos esquemas de usuários e do esquema `sys` usando **mysqld** seguido de **mysql\_upgrade** com as opções `--upgrade-system-tables` e `--skip-sys-schema`.

  - A partir do MySQL 8.0.16: **mysqld --upgrade=MINIMAL**

- Realize a etapa 1 conforme necessário e force a etapa 2:

  - Antes do MySQL 8.0.16: **mysqld** seguido por **mysql\_upgrade --force**

  - A partir do MySQL 8.0.16: **mysqld --upgrade=FORCE**

Antes do MySQL 8.0.16, certas opções do **mysql\_upgrade** afetam as ações que ele executa. A tabela a seguir mostra quais valores das opções do servidor `--upgrade` devem ser usados a partir do MySQL 8.0.16 para obter efeitos semelhantes. (Esses valores não são necessariamente equivalentes exatos, pois um valor de opção `--upgrade` pode ter efeitos adicionais.)

<table summary="Valores equivalentes à opção [[`Server --upgrade`]] em certas opções do [[`mysql_upgrade`]]."><thead><tr> <th>Opção mysql_upgrade</th> <th>Opção de servidor</th> </tr></thead><tbody><tr> <td>[[<code>--skip-sys-schema</code>]]</td> <td>[[PH_HTML_CÓDIGO_<code>--upgrade=NONE</code>] ou [[PH_HTML_CÓDIGO_<code>--upgrade=MINIMAL</code>]</td> </tr><tr> <td>[[<code>--upgrade-system-tables</code>]]</td> <td>[[<code>--upgrade=NONE</code>]] ou [[<code>--upgrade=MINIMAL</code>]]</td> </tr><tr> <td>[[<code>--force</code>]]</td> <td>[[<code>--upgrade=FORCE</code>]]</td> </tr></tbody></table>

Observações adicionais sobre o que ocorre durante a etapa 2 da atualização:

- O passo 2 instala o esquema `sys` se ele não estiver instalado e, caso contrário, o atualiza para a versão atual. Um erro ocorre se um esquema `sys` existir, mas não tiver uma vista `version`, assumindo que sua ausência indica um esquema criado pelo usuário:

  ```
  A sys schema exists with no sys.version view. If
  you have a user created sys schema, this must be renamed for the
  upgrade to succeed.
  ```

  Para fazer a atualização neste caso, remova ou renomeie primeiro o esquema existente `sys`. Em seguida, execute o procedimento de atualização novamente. (Pode ser necessário forçar o passo 2.)

  Para evitar a verificação do esquema `sys`:

  - A partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.

  - Antes do MySQL 8.0.16: Inicie o **mysql\_upgrade** com a opção `--skip-sys-schema`.

- O passo 2 atualiza as tabelas do sistema para garantir que tenham a estrutura atual. Isso é verdadeiro se o servidor ou o **mysql\_upgrade** executar o passo. Com relação ao conteúdo das tabelas de ajuda e das tabelas de fuso horário, o **mysql\_upgrade** não carrega nenhum tipo de tabela, enquanto o servidor carrega as tabelas de ajuda, mas não as tabelas de fuso horário. (Ou seja, antes do MySQL 8.0.16, o servidor carrega as tabelas de ajuda apenas no momento da inicialização do diretório de dados. A partir do MySQL 8.0.16, ele carrega as tabelas de ajuda no momento da inicialização e da atualização.) O procedimento para carregar as tabelas de fuso horário depende da plataforma e requer a tomada de decisões pelo DBA, portanto, não pode ser feito automaticamente.

- A partir do MySQL 8.0.30, ao atualizar as tabelas de sistema no esquema `mysql`, a ordem das colunas na chave primária das tabelas `mysql.db`, `mysql.tables_priv`, `mysql.columns_priv` e `mysql.procs_priv` é alterada para colocar as colunas de nome do host e nome do usuário juntas. Colocar o nome do host e o nome do usuário juntos significa que a consulta de índice pode ser usada, o que melhora o desempenho para as instruções `CREATE USER`, `DROP USER` e `RENAME USER` e para as verificações de ACL para múltiplos usuários com múltiplos privilégios. A remoção e a criação do índice são necessárias e podem levar algum tempo se o sistema tiver um grande número de usuários e privilégios.

- O passo 2 processa todas as tabelas em todos os esquemas de usuário conforme necessário. A verificação da tabela pode levar muito tempo para ser concluída. Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. A verificação da tabela usa a opção `FOR UPGRADE` da instrução `CHECK TABLE`. Para obter detalhes sobre o que essa opção implica, consulte a Seção 15.7.3.2, “Instrução CHECK TABLE”.

  Para evitar a verificação da tabela:

  - A partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.

  - Antes do MySQL 8.0.16: Inicie o **mysql\_upgrade** com a opção `--upgrade-system-tables`.

  Para forçar a verificação da tabela:

  - A partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=FORCE`.

  - Antes do MySQL 8.0.16: Inicie o **mysql\_upgrade** com a opção `--force`.

- A etapa 2 salva o número da versão do MySQL em um arquivo chamado `mysql_upgrade_info` no diretório de dados.

  Ignorar o arquivo `mysql_upgrade_info` e realizar a verificação independentemente:

  - A partir do MySQL 8.0.16: Inicie o servidor com a opção `--upgrade=FORCE`.

  - Antes do MySQL 8.0.16: Inicie o **mysql\_upgrade** com a opção `--force`.

  Nota

  O arquivo `mysql_upgrade_info` está desatualizado; espere-se que ele seja removido em uma versão futura do MySQL.

- A etapa 2 marca todas as tabelas verificadas e reparadas com o número atual da versão do MySQL. Isso garante que, na próxima vez que a verificação de atualização ocorrer com a mesma versão do servidor, será possível determinar se há necessidade de verificar ou reparar novamente uma determinada tabela.

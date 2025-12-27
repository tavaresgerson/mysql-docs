## 3.4 O que o processo de atualização do MySQL atualiza

Instalar uma nova versão do MySQL pode exigir a atualização dessas partes da instalação existente:

* O esquema `mysql` do sistema, que contém tabelas que armazenam informações necessárias para o servidor MySQL conforme ele está em execução (veja a Seção 7.3, “O esquema do sistema mysql”). As tabelas do esquema `mysql` se enquadram em duas categorias amplas:

  + Tabelas do dicionário de dados, que armazenam metadados de objetos de banco de dados.

  + Tabelas do sistema (ou seja, as tabelas restantes que não são do dicionário de dados), que são usadas para outros propósitos operacionais.

* Outros esquemas, alguns dos quais são construídos e podem ser considerados “de propriedade” do servidor, e outros que não são:

  + Os esquemas `performance_schema`, `INFORMATION_SCHEMA`, `ndbinfo` e `sys`.

  + Esquemas de usuário.

Duas versões distintas estão associadas a partes da instalação que podem exigir atualização:

* A versão do dicionário de dados. Isso se aplica às tabelas do dicionário de dados.

* A versão do servidor, também conhecida como versão do MySQL. Isso se aplica às tabelas e objetos do sistema em outros esquemas.

Em ambos os casos, a versão real aplicável à instalação existente do MySQL é armazenada no dicionário de dados, e a versão atual esperada é compilada na nova versão do MySQL. Quando uma versão real é menor que a versão atual esperada, essas partes da instalação associadas a essa versão devem ser atualizadas para a versão atual. Se ambas as versões indicarem que uma atualização é necessária, a atualização do dicionário de dados deve ocorrer primeiro.

Como reflexo das duas versões distintas mencionadas, a atualização ocorre em duas etapas:

* Etapa 1: Atualização do dicionário de dados.

  Esta etapa atualiza:

+ As tabelas do dicionário de dados no esquema `mysql`. Se a versão real do dicionário de dados for menor que a versão esperada atual, o servidor cria tabelas de dicionário de dados com definições atualizadas, copia metadados persistentes para as novas tabelas, substitui as tabelas antigas atomicamente pelas novas e reinicializa o dicionário de dados.

+ O Schema de Desempenho, `INFORMATION_SCHEMA` e `ndbinfo`.

* Passo 2: Atualização do servidor.

Este passo compreende todas as outras tarefas de atualização. Se a versão do servidor da instalação MySQL existente for menor que a versão do MySQL recém-instalado, tudo o mais deve ser atualizado:

+ As tabelas do sistema no esquema `mysql` (as tabelas não de dicionário de dados restantes).

+ O esquema `sys`.
+ Esquemas de usuários.

A atualização do dicionário de dados (passo 1) é responsabilidade do servidor, que realiza essa tarefa conforme necessário ao iniciar, a menos que seja invocado com uma opção que o impeça de fazer isso. A opção é `--upgrade=NONE`.

Se o dicionário de dados estiver desatualizado, mas o servidor for impedido de atualizá-lo, o servidor não será executado e encerrará com um erro. Por exemplo:

```
[ERROR] [MY-013381] [Server] Server shutting down because upgrade is
required, yet prohibited by the command line option '--upgrade=NONE'.
[ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
[ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
```

A opção de servidor `--upgrade` controla se e como o servidor realiza uma atualização automática ao iniciar:

* Sem opção ou com `--upgrade=AUTO`, o servidor atualiza qualquer coisa que ele determine estar desatualizada (passos 1 e 2).

* Com `--upgrade=NONE`, o servidor não atualiza nada (pula os passos 1 e 2), mas também encerrará com um erro se o dicionário de dados precisar ser atualizado. Não é possível executar o servidor com um dicionário de dados desatualizado; o servidor insiste em atualizá-lo ou encerrar.

* Com `--upgrade=MINIMAL`, o servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1). Observe que, após uma atualização com essa opção, a Replicação de Grupo não pode ser iniciada, pois as tabelas do sistema nas quais dependem os recursos internos da replicação não são atualizadas, e a funcionalidade reduzida também pode ser aparente em outras áreas.

* Com `--upgrade=FORCE`, o servidor atualiza o dicionário de dados, o Schema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (passo 1), e força a atualização de tudo o mais (passo 2). A espera para o servidor ser iniciado pode ser mais longa com essa opção, pois o servidor verifica todos os objetos em todos os esquemas.

`FORCE` é útil para forçar que as ações do passo 2 sejam executadas se o servidor achar que elas não são necessárias. Uma maneira pela qual `FORCE` difere de `AUTO` é que, com `FORCE`, o servidor recria tabelas do sistema, como tabelas de ajuda ou tabelas de fuso horário, se estiverem ausentes.

Observações adicionais sobre o que ocorre durante o passo 2 da atualização:

* O passo 2 instala o esquema `sys` se ele não estiver instalado e o atualiza para a versão atual caso contrário. Um erro ocorre se um esquema `sys` existir, mas não tiver uma visão `version`, assumindo que sua ausência indica um esquema criado pelo usuário:

  ```
  A sys schema exists with no sys.version view. If
  you have a user created sys schema, this must be renamed for the
  upgrade to succeed.
  ```

  Para atualizar nesse caso, remova ou renomeie primeiro o esquema `sys` existente. Em seguida, execute o procedimento de atualização novamente. (Pode ser necessário forçar o passo 2.)

  Para evitar a verificação do esquema `sys`, inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.

* O Passo 2 atualiza as tabelas do sistema para garantir que tenham a estrutura atual, e isso inclui as tabelas de ajuda, mas não as tabelas de fuso horário. O procedimento para carregar as tabelas de fuso horário depende da plataforma e requer a tomada de decisões pelo DBA, portanto, não pode ser feito automaticamente.

* Quando o Passo 2 está atualizando as tabelas do sistema no esquema `mysql`, a ordem dos colunas na chave primária das tabelas `mysql.db`, `mysql.tables_priv`, `mysql.columns_priv` e `mysql.procs_priv` é alterada para colocar as colunas do nome do host e do nome do usuário juntas. Colocar o nome do host e o nome do usuário juntos significa que o índice pode ser usado, o que melhora o desempenho para as instruções `CREATE USER`, `DROP USER` e `RENAME USER`, e para as verificações de ACL para vários usuários com vários privilégios. A remoção e a criação do índice são necessárias e podem levar algum tempo se o sistema tiver um grande número de usuários e privilégios.

* O Passo 2 processa todas as tabelas em todos os esquemas de usuário conforme necessário. A verificação da tabela pode levar muito tempo para ser concluída. Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. A verificação da tabela usa a opção `FOR UPGRADE` da instrução `CHECK TABLE`. Para obter detalhes sobre o que essa opção implica, consulte a Seção 15.7.3.2, “Instrução CHECK TABLE”.

* Para evitar a verificação da tabela, inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.

* Para forçar a verificação da tabela, inicie o servidor com a opção `--upgrade=FORCE`.

* A etapa 2 marca todas as tabelas verificadas e reparadas com o número atual da versão do MySQL. Isso garante que, na próxima vez que a verificação de atualização ocorrer com a mesma versão do servidor, pode ser determinado se há necessidade de verificar ou reparar novamente uma determinada tabela.
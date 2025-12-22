## 3.4 O que o processo de atualização do MySQL atualiza

A instalação de uma nova versão do MySQL pode exigir a atualização destas partes da instalação existente:

- O esquema de sistema `mysql`, que contém tabelas que armazenam informações necessárias ao servidor MySQL enquanto ele é executado (veja Seção 7.3, "O esquema de sistema mysql").

  - Tabelas de dicionário de dados, que armazenam metadados de objetos de banco de dados.
  - Tabelas de sistema (isto é, as restantes tabelas não pertencentes ao dicionário de dados), que são utilizadas para outros fins operacionais.
- Outros esquemas, alguns dos quais são incorporados e podem ser considerados "de propriedade" do servidor, e outros que não são:

  - Os esquemas `performance_schema`, `INFORMATION_SCHEMA`, `ndbinfo`, e `sys`.
  - Esquemas de utilizador.

São associados dois números de versão distintos às partes da instalação que possam necessitar de modernização:

- A versão do dicionário de dados, aplicável às tabelas do dicionário de dados.
- A versão do servidor, também conhecida como versão MySQL. Isso se aplica às tabelas do sistema e objetos em outros esquemas.

Em ambos os casos, a versão real aplicável à instalação MySQL existente é armazenada no dicionário de dados, e a versão atual esperada é compilada na nova versão do MySQL. Quando uma versão real é inferior à versão atual esperada, as partes da instalação associadas a essa versão devem ser atualizadas para a versão atual. Se ambas as versões indicarem que uma atualização é necessária, a atualização do dicionário de dados deve ocorrer primeiro.

Como reflexo das duas versões distintas mencionadas acima, a atualização ocorre em duas etapas:

- Etapa 1: Atualização do dicionário de dados.

  Esta etapa atualiza:

  - Se a versão real do dicionário de dados for menor do que a versão atual esperada, o servidor cria tabelas de dicionário de dados com definições atualizadas, copia os metadados persistentes para as novas tabelas, substitui atomicamente as tabelas antigas pelas novas e reinicializa o dicionário de dados.
  - O Esquema de Desempenho, `INFORMATION_SCHEMA`, e `ndbinfo`.
- Passo 2: Atualização do servidor.

  Esta etapa inclui todas as outras tarefas de atualização. Se a versão do servidor da instalação do MySQL existente for inferior à da nova versão instalada do MySQL, todo o resto deve ser atualizado:

  - As tabelas do sistema no esquema \[`mysql`] (as restantes tabelas não pertencentes ao dicionário de dados).
  - O `sys` esquema.
  - Esquemas de utilizador.

A atualização do dicionário de dados (etapa 1) é responsabilidade do servidor, que executa essa tarefa conforme necessário na inicialização, a menos que seja invocada com uma opção que impeça isso. A opção é `--upgrade=NONE`.

Se o dicionário de dados estiver desatualizado, mas o servidor for impedido de atualizá-lo, o servidor não será executado e sairá com um erro.

```
[ERROR] [MY-013381] [Server] Server shutting down because upgrade is
required, yet prohibited by the command line option '--upgrade=NONE'.
[ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
[ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
```

A opção do servidor `--upgrade` controla se e como o servidor executa uma atualização automática na inicialização:

- Sem opção ou com `--upgrade=AUTO`, o servidor atualiza qualquer coisa que determine estar desatualizado (passos 1 e 2).
- Com `--upgrade=NONE`, o servidor não atualiza nada (salta as etapas 1 e 2), mas também sai com um erro se o dicionário de dados for atualizado. Não é possível executar o servidor com um dicionário de dados desatualizado; o servidor insiste em atualizá-lo ou sair.
- Com `--upgrade=MINIMAL`, o servidor atualiza o dicionário de dados, o Esquema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1).
- Com `--upgrade=FORCE`, o servidor atualiza o dicionário de dados, o Esquema de Desempenho e o `INFORMATION_SCHEMA`, se necessário (etapa 1), e força uma atualização de tudo o mais (etapa 2).

O `FORCE` é útil para forçar ações do passo 2 a serem executadas se o servidor achar que elas não são necessárias. Uma maneira que o `FORCE` difere do `AUTO` é que com o `FORCE`, o servidor recria tabelas do sistema, como tabelas de ajuda ou tabelas de fuso horário, se elas estiverem faltando.

Notas adicionais sobre o que ocorre durante a etapa 2:

- A etapa 2 instala o `sys` esquema se não estiver instalado, e atualiza-o para a versão atual caso contrário. Um erro ocorre se um `sys` esquema existe, mas não tem nenhuma `version` visualização, na suposição de que sua ausência indica um esquema criado pelo usuário:

  ```
  A sys schema exists with no sys.version view. If
  you have a user created sys schema, this must be renamed for the
  upgrade to succeed.
  ```

  Para atualizar neste caso, remova ou renomeie o esquema existente primeiro. Em seguida, execute o procedimento de atualização novamente (pode ser necessário forçar o passo 2).

  Para evitar a verificação do esquema `sys`, inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.
- A etapa 2 atualiza as tabelas do sistema para garantir que elas tenham a estrutura atual, e isso inclui as tabelas de ajuda, mas não as tabelas de fuso horário. O procedimento para carregar tabelas de fuso horário é dependente da plataforma e requer a tomada de decisão pelo DBA, portanto, não pode ser feito automaticamente.
- Quando a Etapa 2 está atualizando as tabelas do sistema no esquema `mysql`, a ordem das colunas na chave primária das tabelas `mysql.db`, `mysql.tables_priv`, `mysql.columns_priv` e `mysql.procs_priv` é alterada para colocar o nome do host e as colunas do nome do usuário juntas. Colocar o nome do host e o nome do usuário juntos significa que a pesquisa de índice pode ser usada, o que melhora o desempenho para as instruções `CREATE USER`, `DROP USER`, e `RENAME USER`, e para verificações de ACL para vários usuários com múltiplos privilégios. Perder e recriar o índice é necessário e pode levar algum tempo se o sistema tiver um grande número de usuários e privilégios.
- A etapa 2 processa todas as tabelas em todos os esquemas de usuário conforme necessário. A verificação de tabela pode levar muito tempo para ser concluída. Cada tabela está bloqueada e, portanto, não está disponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. A verificação de tabela usa a opção `FOR UPGRADE` da instrução `CHECK TABLE`.

  Para evitar a verificação de tabelas, inicie o servidor com a opção `--upgrade=NONE` ou `--upgrade=MINIMAL`.

  Para forçar a verificação da tabela, inicie o servidor com a opção `--upgrade=FORCE`.
- O passo 2 marca todas as tabelas verificadas e reparadas com o número de versão atual do MySQL. Isso garante que a próxima vez que a verificação de atualização ocorra com a mesma versão do servidor, possa ser determinado se há necessidade de verificar ou reparar uma determinada tabela novamente.

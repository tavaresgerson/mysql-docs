### 5.8.4 Rastreando mysqld Usando DTrace

[5.8.4.1 Referência de Probe do DTrace do mysqld](dba-dtrace-mysqld-ref.html)

O suporte para DTrace está obsoleto (deprecated) no MySQL 5.7 e foi removido no MySQL 8.0.

As Probes DTrace no servidor MySQL são projetadas para fornecer informações sobre a execução de Queries dentro do MySQL e as diferentes áreas do sistema que estão sendo utilizadas durante esse processo. A organização e o acionamento das Probes significam que a execução de uma Query inteira pode ser monitorada com um nível de Probes (`query-start` e `query-done`), mas ao monitorar outras Probes, você pode obter informações sucessivamente mais detalhadas sobre a execução da Query em termos dos Locks utilizados, métodos de classificação e até mesmo informações de execução linha a linha (row-by-row) e de nível de Storage Engine.

As Probes DTrace são organizadas de modo que você possa acompanhar todo o processo da Query, desde o ponto de conexão de um cliente, passando pela execução da Query, operações de nível de linha (row-level) e o retorno. Você pode considerar que as Probes são acionadas em uma sequência específica durante uma sequência típica de conexão/execução/desconexão do cliente, conforme mostrado na figura a seguir.

**Figura 5.1 Sequência de Probes DTrace**

![Exemplo de uma sequência de Probe DTrace durante uma sequência típica de conexão, execução e desconexão do cliente.](images/dtrace-groups.png)

Informações globais são fornecidas nos argumentos das Probes DTrace em vários níveis. Informações globais, ou seja, o ID de conexão, usuário/host e, onde relevante, a Query string, são fornecidas em níveis chave (`connection-start`, `command-start`, `query-start` e `query-exec-start`). À medida que você se aprofunda nas Probes, presume-se que você está interessado apenas nas execuções individuais (Probes de nível de linha fornecem informações apenas sobre o Database e nome da Table), ou que você pretende combinar as Probes de nível de linha com as Probes parentais nocionais para fornecer as informações sobre uma Query específica. Exemplos disso são fornecidos conforme o formato e os argumentos de cada Probe são detalhados.

O MySQL inclui suporte para Probes DTrace nestas plataformas:

* Solaris 10 Update 5 (Solaris 5/08) nas plataformas SPARC, x86 e x86_64
* OS X / macOS 10.4 e superior
* Oracle Linux 6 e superior com kernel UEK (a partir do MySQL 5.7.5)

A habilitação das Probes deve ser automática nessas plataformas. Para habilitar ou desabilitar explicitamente as Probes durante a compilação (building), use a opção [`-DENABLE_DTRACE=1`](source-configuration-options.html#option_cmake_enable_dtrace) ou [`-DENABLE_DTRACE=0`](source-configuration-options.html#option_cmake_enable_dtrace) para o **CMake**.

Se uma plataforma que não seja Solaris incluir suporte DTrace, a compilação (building) do [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") nessa plataforma incluirá suporte DTrace.

#### Recursos Adicionais

* Para mais informações sobre DTrace e a escrita de scripts DTrace, leia o [DTrace User Guide](http://docs.oracle.com/cd/E19253-01/819-5488/).
* Para uma introdução ao DTrace, consulte o artigo do MySQL Dev Zone [Getting started with DTracing MySQL](http://dev.mysql.com/tech-resources/articles/mysql-cluster-7.2.html).
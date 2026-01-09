### 5.8.4 Rastreamento do mysqld usando o DTrace

Referência da sonda DTrace mysqld DTrace (5.8.4.1)

O suporte para DTrace é descontinuado no MySQL 5.7 e será removido no MySQL 8.0.

As sondas DTrace no servidor MySQL são projetadas para fornecer informações sobre a execução de consultas no MySQL e as diferentes áreas do sistema que estão sendo utilizadas durante esse processo. A organização e o disparo das sondas permitem que a execução de uma consulta inteira seja monitorada com um nível de sondas (`query-start` e `query-done`), mas ao monitorar outras sondas, é possível obter informações cada vez mais detalhadas sobre a execução da consulta, em termos de bloqueios usados, métodos de ordenação e até mesmo informações de execução nível de linha por linha e nível de mecanismo de armazenamento.

As sondas DTrace são organizadas para que você possa acompanhar todo o processo de consulta, desde o ponto de conexão de um cliente, passando pela execução da consulta, operações em nível de linha e voltando novamente. Você pode pensar nas sondas como sendo disparadas dentro de uma sequência específica durante uma sequência típica de conexão/execução/desconexão do cliente, conforme mostrado na figura a seguir.

**Figura 5.1 Sequência de Amostra DTrace**

![Exemplo de uma sequência de sonda DTrace durante uma sequência típica de conexão, execução e desconexão do cliente.](images/dtrace-groups.png)

As informações globais são fornecidas nos argumentos das sondagens DTrace em vários níveis. As informações globais, ou seja, o ID de conexão e o usuário/host, e, quando relevante, a string de consulta, são fornecidas em níveis-chave (`connection-start`, `command-start`, `query-start` e `query-exec-start`). À medida que você se aprofunda nas sondagens, presume-se que você esteja interessado apenas nas execuções individuais (as sondagens de nível de linha fornecem informações apenas sobre o nome do banco de dados e da tabela), ou que você pretenda combinar as sondagens de nível de linha com as sondagens parentais conceituais para fornecer informações sobre uma consulta específica. Exemplos disso são fornecidos, pois o formato e os argumentos de cada sonda são fornecidos.

O MySQL inclui suporte para as ferramentas DTrace nessas plataformas:

- Solaris 10 Update 5 (Solaris 5/08) nas plataformas SPARC, x86 e x86_64

- OS X/macOS 10.4 e superior

- Oracle Linux 6 e superior com kernel UEK (a partir do MySQL 5.7.5)

A habilitação das sondas deve ser automática nessas plataformas. Para habilitar ou desabilitar explicitamente as sondas durante a construção, use a opção `-DENABLE_DTRACE=1` ou `-DENABLE_DTRACE=0` no **CMake**.

Se uma plataforma que não é Solaris incluir suporte ao DTrace, a construção do **mysqld** nessa plataforma incluirá suporte ao DTrace.

#### Recursos adicionais

- Para obter mais informações sobre o DTrace e sobre como escrever scripts DTrace, leia o Guia do Usuário do DTrace.

- Para uma introdução ao DTrace, consulte o artigo da MySQL Dev Zone Começando com DTracing MySQL.

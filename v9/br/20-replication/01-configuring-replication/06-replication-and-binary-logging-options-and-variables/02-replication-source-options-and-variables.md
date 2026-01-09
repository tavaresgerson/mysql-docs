#### 19.1.6.2 Opções e Variáveis de Fonte de Replicação

Esta seção descreve as opções do servidor e as variáveis do sistema que você pode usar nos servidores de fonte de replicação. Você pode especificar as opções na linha de comando ou em um arquivo de opções. Você pode especificar os valores das variáveis do sistema usando `SET`.

No servidor de origem e em cada replica, você deve definir a variável do sistema `server_id` para estabelecer um ID de replicação único. Para cada servidor, você deve escolher um número inteiro positivo único no intervalo de 1 a 232 - 1, e cada ID deve ser diferente de todos os outros IDs em uso por qualquer outra fonte ou replica na topologia de replicação. Exemplo: `server-id=3`.

Para opções usadas na fonte para controlar o registro binário, consulte a Seção 19.1.6.4, “Opções e Variáveis de Registro Binário”.

##### Opções de Inicialização para Servidores de Fonte de Replicação

A lista a seguir descreve as opções de inicialização para controlar os servidores de fonte de replicação. As variáveis do sistema relacionadas à replicação são discutidas mais adiante nesta seção.

* `--show-replica-auth-info`

  <table frame="box" rules="all" summary="Propriedades para show-replica-auth-info"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--show-replica-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Use `--show-replica-auth-info`, que exibe os nomes e senhas dos usuários de replicação na saída do `SHOW REPLICAS` no servidor de origem para replicas iniciadas com as opções `--report-user` e `--report-password`.

* `--show-slave-auth-info`

<table frame="box" rules="all" summary="Propriedades para mostrar-slave-auth-info">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
  </table>

  Alias desatualizado para `--show-replica-auth-info`.

##### Variáveis de Sistema Usadas nos Servidores de Fonte de Replicação

As seguintes variáveis de sistema são usadas para ou por servidores de fonte de replicação:

* `auto_increment_increment`

  <table frame="box" rules="all" summary="Propriedades para auto_increment_increment">
  <tbody>
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--auto-increment-increment=#</code></td>
    </tr>
    <tr>
      <th>Variável de Sistema</th>
      <td><a class="link" href="replication-options-source.html#sysvar_auto_increment_increment">auto_increment_increment</a></td>
    </tr>
    <tr>
      <th>Alcance</th>
      <td>Global, Sessão</td>
    </tr>
    <tr>
      <th>Dinâmica</th>
      <td>Sim</td>
    </tr>
    <tr>
      <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code class="literal">SET_VAR</code></a> Hint Aplica-se</th>
      <td>Sim</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code class="literal">1</code></td>
    </tr>
    <tr>
      <th>Valor Mínimo</th>
      <td><code class="literal">1</code></td>
    </tr>
    <tr>
      <th>Valor Máximo</th>
      <td><code class="literal">65535</code></td>
    </tr>
  </tbody>
</table>

`auto_increment_increment` e `auto_increment_offset` são destinados para uso com replicação circular (de origem para destino) e podem ser usados para controlar o funcionamento das colunas `AUTO_INCREMENT`. Ambas as variáveis têm valores globais e de sessão, e cada uma pode assumir um valor inteiro entre 1 e 65.535, inclusive. Definir o valor de qualquer uma dessas duas variáveis para 0 faz com que seu valor seja definido para 1. Tentar definir o valor de qualquer uma dessas duas variáveis para um valor inteiro maior que 65.535 ou menor que 0 faz com que seu valor seja definido para 65.535. Tentar definir o valor de `auto_increment_increment` ou `auto_increment_offset` para um valor não inteiro produz um erro, e o valor real da variável permanece inalterado.

  Nota

  `auto_increment_increment` também é suportado para uso com tabelas `NDB`.

  Quando a Replicação em Grupo é iniciada em um servidor, o valor de `auto_increment_increment` é alterado para o valor de `group_replication_auto_increment_increment`, que tem o valor padrão de 7, e o valor de `auto_increment_offset` é alterado para o ID do servidor. As alterações são revertidas quando a Replicação em Grupo é parada. Essas alterações são feitas e revertidas apenas se `auto_increment_increment` e `auto_increment_offset` tiverem seu valor padrão de 1. Se seus valores já tiverem sido modificados do padrão, a Replicação em Grupo não os altera. Essas variáveis de sistema também não são modificadas quando a Replicação em Grupo está no modo de único primário, onde apenas um servidor escreve.

  `auto_increment_increment` e `auto_increment_offset` afetam o comportamento da coluna `AUTO_INCREMENT` da seguinte forma:

  + `auto_increment_increment` controla o intervalo entre os valores sucessivos da coluna. Por exemplo:

    ```
    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 1     |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc1
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
      Query OK, 0 rows affected (0.04 sec)

    mysql> SET @@auto_increment_increment=10;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.01 sec)

    mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc1;
    +-----+
    | col |
    +-----+
    |   1 |
    |  11 |
    |  21 |
    |  31 |
    +-----+
    4 rows in set (0.00 sec)
    ```

`auto_increment_offset` determina o ponto de partida para o valor da coluna `AUTO_INCREMENT`. Considere o seguinte, assumindo que essas instruções são executadas durante a mesma sessão que o exemplo dado na descrição para `auto_increment_increment`:

```
    mysql> SET @@auto_increment_offset=5;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 5     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc2
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
    Query OK, 0 rows affected (0.06 sec)

    mysql> INSERT INTO autoinc2 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc2;
    +-----+
    | col |
    +-----+
    |   5 |
    |  15 |
    |  25 |
    |  35 |
    +-----+
    4 rows in set (0.02 sec)
    ```

Quando o valor de `auto_increment_offset` for maior que o de `auto_increment_increment`, o valor de `auto_increment_offset` será ignorado.

Se qualquer uma dessas variáveis for alterada e novas linhas forem inseridas em uma tabela que contenha uma coluna `AUTO_INCREMENT`, os resultados podem parecer contra-intuitivos porque a série dos valores `AUTO_INCREMENT` é calculada sem considerar quaisquer valores já presentes na coluna, e o próximo valor inserido é o menor valor na série que é maior que o valor máximo existente na coluna `AUTO_INCREMENT`. A série é calculada da seguinte forma:

`auto_increment_offset` + *`N`* × `auto_increment_increment`

onde *`N`* é um valor inteiro positivo na série [1, 2, 3, ...]. Por exemplo:

```
  mysql> SHOW VARIABLES LIKE 'auto_inc%';
  +--------------------------+-------+
  | Variable_name            | Value |
  +--------------------------+-------+
  | auto_increment_increment | 10    |
  | auto_increment_offset    | 5     |
  +--------------------------+-------+
  2 rows in set (0.00 sec)

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  +-----+
  4 rows in set (0.00 sec)

  mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
  Query OK, 4 rows affected (0.00 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  |  35 |
  |  45 |
  |  55 |
  |  65 |
  +-----+
  8 rows in set (0.00 sec)
  ```

Os valores mostrados para `auto_increment_increment` e `auto_increment_offset` geram a série 5 + *`N`* × 10, ou seja, [5, 15, 25, 35, 45, ...]. O valor mais alto presente na coluna `col` antes do `INSERT` é 31, e o próximo valor disponível na série `AUTO_INCREMENT` é 35, então os valores inseridos para `col` começam nesse ponto e os resultados são como mostrados na consulta `SELECT`.

Não é possível restringir os efeitos dessas duas variáveis a uma única tabela; essas variáveis controlam o comportamento de todas as colunas `AUTO_INCREMENT` em *todas* as tabelas no servidor MySQL. Se o valor global de qualquer uma dessas variáveis for definido, seus efeitos persistem até que o valor global seja alterado ou substituído definindo o valor da sessão, ou até que o **mysqld** seja reiniciado. Se o valor local for definido, o novo valor afeta as colunas `AUTO_INCREMENT` para todas as tabelas nas quais novas linhas são inseridas pelo usuário atual durante a duração da sessão, a menos que os valores sejam alterados durante essa sessão.

O valor padrão de `auto_increment_increment` é

1. Veja a Seção 19.5.1.1, “Replicação e AUTO_INCREMENT”.

* `auto_increment_offset`

<table frame="box" rules="all" summary="Propriedades para auto_increment_offset"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--auto-increment-offset=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-source.html#sysvar_auto_increment_offset">auto_increment_offset</a></code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Definição de Variáveis"><code class="literal">SET_VAR</a></code> Dicas Aplicam-se</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

Esta variável tem um valor padrão de 1. Se for deixada com seu valor padrão e a Replicação em Grupo for iniciada no servidor no modo multi-primário, ela é alterada para o ID do servidor. Para mais informações, consulte a descrição para `auto_increment_increment`.

Nota

`auto_increment_offset` também é suportado para uso com tabelas `NDB`.

* `immediate_server_version`

  <table frame="box" rules="all" summary="Propriedades para immediate_server_version"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-source.html#sysvar_immediate_server_version">immediate_server_version</a></code></td> </tr><tr><th>Âmbito</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code class="literal">SET_VAR</a></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">999999</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">999999</code></td> </tr></tbody></table>

  Para uso interno pela replicação. Esta variável do sistema de sessão contém o número de versão do MySQL Server do servidor que é a fonte imediata em uma topologia de replicação (por exemplo, `90500` para uma instância de servidor MySQL 9.5.0). Se este servidor imediato estiver em uma versão que não suporte a variável do sistema de sessão, o valor da variável é definido como 0 (`UNKNOWN_SERVER_VERSION`).

O valor da variável é replicado de uma fonte para uma réplica. Com essas informações, a réplica pode processar corretamente os dados originados de uma fonte em uma versão anterior, reconhecendo onde ocorreram mudanças de sintaxe ou mudanças semânticas entre as versões envolvidas e tratando essas mudanças de forma apropriada. As informações também podem ser usadas em um ambiente de Replicação por Grupo, onde um ou mais membros do grupo de replicação estão em uma versão mais recente do que os outros. O valor da variável pode ser visualizado no log binário para cada transação (como parte do `Gtid_log_event`, ou `Anonymous_gtid_log_event` se os GTIDs não estiverem em uso no servidor), e poderia ser útil no depuração de problemas de replicação entre versões.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”). No entanto, note que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

* `original_server_version`

<table frame="box" rules="all" summary="Propriedades para original_server_version"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-source.html#sysvar_original_server_version">original_server_version</a></code></td> </tr><tr><th>Âmbito</th> <td>Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Definição de Variável"><code class="literal">SET_VAR</a></code> Dicas Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">999999</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">999999</code></td> </tr></tbody></table>

  Para uso interno pela replicação. Esta variável de sistema de sessão contém o número de versão do servidor MySQL do servidor onde uma transação foi originalmente comprometida (por exemplo, `90500` para uma instância de servidor MySQL 9.5.0). Se este servidor original estiver em uma versão que não suporte a variável de sistema de sessão, o valor da variável é definido como 0 (`UNKNOWN_SERVER_VERSION`). Note que, quando um número de versão é definido pelo servidor original, o valor da variável é redefinido para 0 se o servidor imediato ou qualquer outro servidor intermediário na topologia de replicação não suportar a variável de sistema de sessão, e, portanto, não replica seu valor.

O valor da variável é definido e utilizado da mesma forma que para a variável de sistema `immediate_server_version`. Se o valor da variável for o mesmo que o da variável de sistema `immediate_server_version`, apenas esta última será registrada no log binário, com um indicador de que a versão do servidor original é a mesma.

Em um ambiente de Replicação por Grupo, os eventos do log de visualização de alterações são marcados com a versão do servidor do membro do grupo que está agendando a transação, que é o mesmo que a versão do servidor do membro do grupo que está agendando a transação. Isso garante que o membro que está se juntando saiba a versão do servidor do doador original. Como os eventos do log de visualização de alterações agendados para uma determinada alteração de visualização têm o mesmo GTID em todos os membros, apenas nesse caso, instâncias do mesmo GTID podem ter uma versão do servidor original diferente.

Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”). No entanto, observe que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

* `rpl_semi_sync_master_enabled`

<table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_enabled">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--rpl-semi-sync-master-enabled[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim (removido na versão 9.5.0)</td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code class="literal"><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_enabled">rpl_semi_sync_master_enabled</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>

Sinônimo desatualizado de `rpl_semi_sync_source_enabled`.

<table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_timeout">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--rpl-semi-sync-master-timeout=#</code></td> </tr>
  <tr><th>Desatualizado</th> <td>Sim (removido na versão 9.5.0)</td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_timeout">rpl_semi_sync_master_timeout</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">10000</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>milissegundos</td> </tr>
</table>

Sinônimo desatualizado de `rpl_semi_sync_source_timeout`.

<table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_trace_level">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--rpl-semi-sync-master-trace-level=#</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim (removido na versão 9.5.0)</td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level">rpl_semi_sync_master_trace_level</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">32</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code class="literal">0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code class="literal">4294967295</code></td>
  </tr>
</table>

Sinônimo desatualizado de `rpl_semi_sync_source_trace_level`.

<table frame="box" rules="all" summary="Propriedades para rpl_semi_sync_master_wait_for_slave_count">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--rpl-semi-sync-master-wait-for-slave-count=#</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim (removido na versão 9.5.0)</td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_wait-for-slave-count">rpl_semi_sync_master_wait-for-slave-count</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">1</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code class="literal">1</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code class="literal">65535</code></td>
  </tr>
</table>

  Símbolo desatualizado para `rpl_semi_sync_source_wait-for-replica`.

* `rpl_semi_sync_master_wait-no-slave`

  <table frame="box" rules="all" summary="Propriedades para show-slave-auth-info">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td>
    </tr>
    <tr>
      <th>Desatualizado</th>
      <td>Sim</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code class="literal">OFF</code></td>
    </tr>
  </table>0

  Símbolo desatualizado para `rpl_semi_sync_source_wait-no-replica`.

* `rpl_semi_sync_master_wait-point`

<table frame="box" rules="all" summary="Propriedades para mostrar-slave-auth-info"><tr><th>Formato de linha de comando</th> <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr></table>1

Sinônimo de `rpl_semi_sync_source_wait_point` para `rpl_semi_sync_source`.

* `rpl_semi_sync_source_enabled`

<table frame="box" rules="all" summary="Propriedades para mostrar-slave-auth-info"><tr><th>Formato de linha de comando</th> <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr></table>2

`rpl_semi_sync_source_enabled` está disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) foi instalado no replica para configurar a replicação semiesincronizada.

`rpl_semi_sync_source_enabled` controla se a replicação semiesincronizada está habilitada no servidor de origem. Para habilitar ou desabilitar o plugin, defina essa variável para `ON` ou `OFF` (ou 1 ou 0), respectivamente. O valor padrão é `OFF`.

* `rpl_semi_sync_source_timeout`

<table frame="box" rules="all" summary="Propriedades para mostrar-slave-auth-info">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>4

`rpl_semi_sync_source_timeout` está disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisynsync_source.so`) é instalado na replica.

`rpl_semi_sync_source_timeout` controla quanto tempo a fonte espera por um confirmação de uma replica antes de expirar e reverter para replicação assíncrona. O valor é especificado em milissegundos, e o valor padrão é 10000 (10 segundos).

* `rpl_semi_sync_source_trace_level`

<table frame="box" rules="all" summary="Propriedades para mostrar-slave-auth-info">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>5

`rpl_semi_sync_source_trace_level` está disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisynsync_source.so`) é instalado na replica.

`rpl_semi_sync_source_trace_level` especifica o nível de depuração da replicação semisíncrona no servidor fonte. Quatro níveis são definidos:

+ 1 = nível geral (por exemplo, falhas na função de tempo)
+ 16 = nível de detalhes (informações mais verbais)
+ 32 = nível de espera de rede (mais informações sobre as esperas de rede)

+ 64 = nível de função (informações sobre a entrada e saída da função)

* `rpl_semi_sync_source_wait_for_replica_count`

  <table frame="box" rules="all" summary="Propriedades para mostrar-auth-info-escravo"><tr><th>Formato de linha de comando</th> <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr> </table>5

  `rpl_semi_sync_source_wait_for_replica_count` está disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) é instalado na replica para configurar a replicação semiconsoante.

  `rpl_semi_sync_source_wait_for_replica_count` especifica o número de confirmações de replica recebidas pelo fonte por transação antes de prosseguir. Por padrão, `rpl_semi_sync_source_wait_for_replica_count` é `1`, o que significa que a replicação semiconsoante prossegue após receber uma única confirmação de replica. O desempenho é melhor para valores pequenos dessa variável.

  Por exemplo, se `rpl_semi_sync_source_wait_for_replica_count` for `2`, então 2 réplicas devem confirmar a recepção da transação antes do período de tempo máximo configurado por `rpl_semi_sync_source_timeout` para que a replicação semiconsoante prossiga. Se menos réplicas confirmarem a recepção da transação durante o período de tempo máximo, o fonte retorna à replicação normal.

  Nota

  Esse comportamento também depende de `rpl_semi_sync_source_wait_no_replica`.

* `rpl_semi_sync_source_wait_no_replica`

<table frame="box" rules="all" summary="Propriedades para mostrar-slave-auth-info">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>

`rpl_semi_sync_source_wait_no_replica` está disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) é instalado na replica.

`rpl_semi_sync_source_wait_no_replica` controla se a fonte aguarda o período de tempo limite configurado por `rpl_semi_sync_source_timeout`, mesmo que o número de replicas caia para menos que o número de replicas configurado por `rpl_semi_sync_source_wait_for_replica_count` durante o período de tempo limite.

Quando o valor de `rpl_semi_sync_source_wait_no_replica` é `ON` (o padrão), é permitido que o número de replicas caia para menos que `rpl_semi_sync_source_wait_for_replica_count` durante o período de tempo limite. Enquanto houver réplicas suficientes reconhecendo a transação antes do período de tempo limite expirar, a replicação semissíncrona continua.

Quando o valor de `rpl_semi_sync_source_wait_no_replica` é `OFF`, se o número de replicas cair para menos que o número configurado em `rpl_semi_sync_source_wait_for_replica_count` em qualquer momento durante o período de tempo limite configurado por `rpl_semi_sync_source_timeout`, a fonte retorna à replicação normal.

* `rpl_semi_sync_source_wait_point`

<table frame="box" rules="all" summary="Propriedades para mostrar-auth-info-escravo">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--show-slave-auth-info[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
</table>

`rpl_semi_sync_source_wait_point` está disponível quando o plugin `rpl_semi_sync_source` (`biblioteca semisync_source.so`) é instalado na replica.

`rpl_semi_sync_source_wait_point` controla o ponto em que um servidor de fonte de replicação semi-sincronizada espera pela confirmação da replica da recepção da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

+ `AFTER_SYNC` (o padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte espera pela confirmação da recepção da transação da replica após a sincronização. Ao receber a confirmação, a fonte compromete a transação no motor de armazenamento e retorna um resultado ao cliente, que então pode prosseguir.

+ `AFTER_COMMIT`: A fonte escreve cada transação em seu log binário e na replica, sincroniza o log binário e compromete a transação no motor de armazenamento. A fonte espera pela confirmação da recepção da transação da replica após o comprometimento. Ao receber a confirmação, a fonte retorna um resultado ao cliente, que então pode prosseguir.

As características de replicação desses ajustes diferem da seguinte forma:

+ Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo: Depois de ser reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

No caso de falha da fonte, todas as transações comprometidas na fonte foram replicadas para a replica (salvadas em seu log de retransmissão). Uma saída inesperada do servidor da fonte e a transição para a replica são perdidas porque a replica está atualizada. No entanto, é importante notar que a fonte não pode ser reiniciada neste cenário e deve ser descartada, porque seu log binário pode conter transações não comprometidas que causariam um conflito com a replica quando externalizadas após a recuperação do log binário.

+ Com `AFTER_COMMIT`, o cliente que emite a transação recebe um status de retorno apenas após o servidor comprometer o motor de armazenamento e receber o reconhecimento da replica. Após o comprometimento e antes do reconhecimento da replica, outros clientes podem ver a transação comprometida antes do cliente que comprometeu.

Se algo der errado de forma que a replica não processe a transação, então, no caso de uma saída inesperada do servidor da fonte e a transição para a replica, é possível que esses clientes vejam uma perda de dados em relação ao que viram na fonte.
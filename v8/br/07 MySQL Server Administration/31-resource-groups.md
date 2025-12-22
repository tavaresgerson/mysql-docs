### 7.1.16 Grupos de recursos

O MySQL suporta a criação e gerenciamento de grupos de recursos, e permite atribuir threads executados dentro do servidor a grupos específicos para que os threads executem de acordo com os recursos disponíveis para o grupo.

Atualmente, o tempo da CPU é um recurso gerenciável, representado pelo conceito de CPU virtual como um termo que inclui núcleos de CPU, hiperthreads, threads de hardware, e assim por diante. O servidor determina no início quantos CPUs virtuais estão disponíveis, e os administradores de banco de dados com privilégios apropriados podem associar essas CPUs a grupos de recursos e atribuir threads a grupos.

Por exemplo, para gerenciar a execução de trabalhos em lote que não precisam ser executados com alta prioridade, um DBA pode criar um grupo de recursos `Batch` e ajustar sua prioridade para cima ou para baixo dependendo de quão ocupado o servidor está.

As seções a seguir descrevem aspectos do uso de grupos de recursos no MySQL:

- Elementos do grupo de recursos
- Atributos do grupo de recursos
- Gestão de grupos de recursos
- Replicação de grupos de recursos
- Restrições de grupo de recursos importantes

Em algumas plataformas ou configurações de servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações.

#### Elementos do grupo de recursos

Estas capacidades fornecem a interface SQL para o gerenciamento de grupos de recursos no MySQL:

- As instruções SQL permitem a criação, alteração e eliminação de grupos de recursos e permitem a atribuição de threads a grupos de recursos.
- Os privilégios de grupo de recursos fornecem controle sobre quais usuários podem executar operações de grupo de recursos.
- A tabela do Esquema de Informação `RESOURCE_GROUPS` expõe informações sobre as definições de grupos de recursos e a tabela do Esquema de Desempenho `threads` mostra a atribuição de grupos de recursos para cada thread.
- As variáveis de estado fornecem contagens de execução para cada instrução SQL de gerenciamento.

#### Atributos do grupo de recursos

Os grupos de recursos têm atributos que definem o grupo. Todos os atributos podem ser definidos no momento da criação do grupo. Alguns atributos são fixos no momento da criação; outros podem ser modificados a qualquer momento.

Estes atributos são definidos no momento da criação do grupo de recursos e não podem ser modificados:

- Cada grupo tem um nome. Nomes de grupos de recursos são identificadores como nomes de tabelas e colunas, e não precisam ser citados em instruções SQL a menos que contenham caracteres especiais ou sejam palavras reservadas. Nomes de grupos não são sensíveis a maiúsculas e minúsculas e podem ter até 64 caracteres.
- Cada grupo tem um tipo, que é `SYSTEM` ou `USER`. O tipo de grupo de recursos afeta o intervalo de valores de prioridade atribuíveis ao grupo, como descrito mais adiante. Este atributo, juntamente com as diferenças nas prioridades permitidas, permite identificar threads do sistema para protegê-los da disputa por recursos da CPU contra threads de usuários.

  Os tópicos do sistema e do usuário correspondem aos tópicos de fundo e de primeiro plano, conforme listados na tabela do Esquema de Desempenho `threads`.

Estes atributos são definidos no momento da criação do grupo de recursos e podem ser modificados em qualquer momento posteriormente:

- A afinidade da CPU é o conjunto de CPUs virtuais que o grupo de recursos pode usar.
- A prioridade de thread é a prioridade de execução para threads atribuídos ao grupo de recursos. Os valores de prioridade variam de -20 (maior prioridade) a 19 (menor prioridade). A prioridade padrão é 0, tanto para o sistema quanto para os grupos de usuários.

  Os grupos de sistema têm uma prioridade mais elevada do que os grupos de utilizadores, garantindo que os threads de utilizadores nunca tenham uma prioridade mais elevada do que os threads de sistema:

  - Para os grupos de recursos do sistema, o intervalo de prioridade permitido é de -20 a 0.
  - Para os grupos de recursos de utilizadores, o intervalo de prioridade permitido é de 0 a 19.
- Cada grupo pode ser ativado ou desativado, permitindo aos administradores o controle sobre a atribuição de threads.

#### Gestão de grupos de recursos

Por padrão, há um grupo de sistema e um grupo de usuários, nomeados `SYS_default` e `USR_default`, respectivamente.

Os tópicos de sistema e usuário recém-criados são atribuídos aos grupos `SYS_default` e `USR_default`, respectivamente.

Para grupos de recursos definidos pelo usuário, todos os atributos são atribuídos no momento da criação do grupo. Depois de um grupo ter sido criado, seus atributos podem ser modificados, com exceção dos atributos nome e tipo.

Para criar e gerenciar grupos de recursos definidos pelo usuário, use estas instruções SQL:

- `CREATE RESOURCE GROUP` cria um novo grupo. Ver Secção 15.7.2.2, "CREATE RESOURCE GROUP Statement".
- `ALTER RESOURCE GROUP` modifica um grupo existente. Ver secção 15.7.2.1, DECLARAÇÃO DO GRUPO DE RESOURCES ALTERADOS.
- `DROP RESOURCE GROUP` elimina um grupo existente. Ver secção 15.7.2.3, DROP RESOURCE GROUP Statement.

Essas instruções requerem o privilégio `RESOURCE_GROUP_ADMIN`.

Para gerenciar atribuições de grupos de recursos, use essas capacidades:

- `SET RESOURCE GROUP` atribui tópicos a um grupo. Ver Seção 15.7.2.4, SET RESOURCE GROUP Statement.
- A sugestão do otimizador \[`RESOURCE_GROUP`] atribui instruções individuais a um grupo.

Essas operações requerem o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

As definições de grupo de recursos são armazenadas na tabela de dicionário de dados `resource_groups` para que os grupos persistam durante as reinicializações do servidor. Como `resource_groups` é parte do dicionário de dados, não é diretamente acessível pelos usuários. As informações do grupo de recursos estão disponíveis usando a tabela de Esquema de Informação `RESOURCE_GROUPS`, que é implementada como uma visualização na tabela de dicionário de dados.

Inicialmente, a tabela `RESOURCE_GROUPS` tem estas linhas descrevendo os grupos padrão:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.RESOURCE_GROUPS\G
*************************** 1. row ***************************
   RESOURCE_GROUP_NAME: USR_default
   RESOURCE_GROUP_TYPE: USER
RESOURCE_GROUP_ENABLED: 1
              VCPU_IDS: 0-3
       THREAD_PRIORITY: 0
*************************** 2. row ***************************
   RESOURCE_GROUP_NAME: SYS_default
   RESOURCE_GROUP_TYPE: SYSTEM
RESOURCE_GROUP_ENABLED: 1
              VCPU_IDS: 0-3
       THREAD_PRIORITY: 0
```

Os valores `THREAD_PRIORITY` são 0, indicando a prioridade padrão. Os valores `VCPU_IDS` mostram um intervalo que inclui todas as CPUs disponíveis. Para os grupos padrão, o valor exibido varia dependendo do sistema no qual o servidor MySQL é executado.

Uma discussão anterior mencionou um cenário envolvendo um grupo de recursos chamado `Batch` para gerenciar a execução de tarefas em lote que não precisam ser executadas com alta prioridade. Para criar tal grupo, use uma instrução semelhante a esta:

```
CREATE RESOURCE GROUP Batch
  TYPE = USER
  VCPU = 2-3            -- assumes a system with at least 4 CPUs
  THREAD_PRIORITY = 10;
```

Para verificar se o grupo de recursos foi criado como esperado, verifique a tabela `RESOURCE_GROUPS`:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.RESOURCE_GROUPS
       WHERE RESOURCE_GROUP_NAME = 'Batch'\G
*************************** 1. row ***************************
   RESOURCE_GROUP_NAME: Batch
   RESOURCE_GROUP_TYPE: USER
RESOURCE_GROUP_ENABLED: 1
              VCPU_IDS: 2-3
       THREAD_PRIORITY: 10
```

Se o valor `THREAD_PRIORITY` for 0 em vez de 10, verifique se a sua plataforma ou configuração do sistema limita a capacidade do grupo de recursos; veja Restrições do Grupo de Recursos.

Para atribuir um thread ao grupo `Batch`, faça o seguinte:

```
SET RESOURCE GROUP Batch FOR thread_id;
```

Posteriormente, as instruções no thread nomeado executam com recursos do grupo `Batch`.

Se o próprio thread atual de uma sessão estiver no grupo `Batch`, execute esta instrução dentro da sessão:

```
SET RESOURCE GROUP Batch;
```

Posteriormente, as instruções na sessão são executadas com recursos do grupo `Batch`.

Para executar uma única instrução usando o grupo `Batch`, use a sugestão do optimizador `RESOURCE_GROUP`:

```
INSERT /*+ RESOURCE_GROUP(Batch) */ INTO t2 VALUES(2);
```

Os threads atribuídos ao grupo `Batch` executam com seus recursos, que podem ser modificados conforme desejado:

- Para momentos em que o sistema está altamente carregado, diminua o número de CPUs atribuídos ao grupo, abaixe sua prioridade ou (como mostrado) ambos:

  ```
  ALTER RESOURCE GROUP Batch
    VCPU = 3
    THREAD_PRIORITY = 19;
  ```
- Para momentos em que o sistema está levemente carregado, aumente o número de CPUs atribuídos ao grupo, aumente sua prioridade ou (como mostrado) ambos:

  ```
  ALTER RESOURCE GROUP Batch
    VCPU = 0-3
    THREAD_PRIORITY = 0;
  ```

#### Replicação de grupos de recursos

O gerenciamento do grupo de recursos é local para o servidor em que ocorre. As instruções SQL do grupo de recursos e as modificações na tabela do dicionário de dados `resource_groups` não são escritas no log binário e não são replicadas.

#### Restrições de grupos de recursos

Em algumas plataformas ou configurações de servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações:

- Os grupos de recursos não estão disponíveis se o plugin do pool de tópicos estiver instalado.
- Grupos de recursos não estão disponíveis no macOS, que não fornece API para vincular CPUs a um thread.
- No FreeBSD e no Solaris, as prioridades de threads de grupos de recursos são ignoradas. (Eficazmente, todos os threads são executados com prioridade 0.) As tentativas de mudar prioridades resultam em um aviso:

  ```
  mysql> ALTER RESOURCE GROUP abc THREAD_PRIORITY = 10;
  Query OK, 0 rows affected, 1 warning (0.18 sec)

  mysql> SHOW WARNINGS;
  +---------+------+-------------------------------------------------------------+
  | Level   | Code | Message                                                     |
  +---------+------+-------------------------------------------------------------+
  | Warning | 4560 | Attribute thread_priority is ignored (using default value). |
  +---------+------+-------------------------------------------------------------+
  ```
- No Linux, as prioridades de threads de grupos de recursos são ignoradas a menos que a capacidade `CAP_SYS_NICE` esteja definida. A concessão da capacidade `CAP_SYS_NICE` a um processo permite uma série de privilégios; consulte \[<http://man7.org/linux/man-pages/man7/capabilities.7.html>] para a lista completa. Por favor, tenha cuidado ao habilitar esta capacidade.

  Nas plataformas Linux que usam o suporte do systemd e do kernel para Capacidades Ambientes (Linux 4.3 ou mais recente), a maneira recomendada de habilitar a capacidade `CAP_SYS_NICE` é modificar o arquivo de serviço MySQL e deixar o `mysqld` binário não modificado. Para ajustar o arquivo de serviço para MySQL, use este procedimento:

  1. Execute o comando apropriado para a sua plataforma:

     - Sistemas Oracle Linux, Red Hat e Fedora:

       ```
       $> sudo systemctl edit mysqld
       ```
     - Sistemas SUSE, Ubuntu e Debian:

       ```
       $> sudo systemctl edit mysql
       ```
  2. Usando um editor, adicione o seguinte texto ao arquivo de serviço:

     ```
     [Service]
     AmbientCapabilities=CAP_SYS_NICE
     ```
  3. Reinicie o serviço MySQL.

  Se você não puder habilitar o recurso `CAP_SYS_NICE` como descrito, ele pode ser definido manualmente usando o comando **setcap**, especificando o nome do caminho para o executável `mysqld` (isso requer acesso **sudo**). Você pode verificar os recursos usando **getcap**. Por exemplo:

  ```
  $> sudo setcap cap_sys_nice+ep /path/to/mysqld
  $> getcap /path/to/mysqld
  /path/to/mysqld = cap_sys_nice+ep
  ```

  Como medida de segurança, restringir a execução do `mysqld` binário para o usuário `root` e usuários com `mysql` grupo de membros:

  ```
  $> sudo chown root:mysql /path/to/mysqld
  $> sudo chmod 0750 /path/to/mysqld
  ```

  Importância

  Se for necessária a utilização manual do \*\* setcap \*\*, esta deve ser efectuada após cada reinstalação.
- No Windows, os tópicos são executados em um dos cinco níveis de prioridade de tópico. O intervalo de prioridade de tópico do grupo de recursos de -20 a 19 mapeia para esses níveis, conforme indicado na tabela a seguir.

  **Tabela 7.6 Prioridade do tópico do grupo de recursos no Windows**

  <table><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>Intervalo de prioridade</th> <th>Nível de prioridade do Windows</th> </tr></thead><tbody><tr> <td>-20 para -10</td> <td>[[<code>THREAD_PRIORITY_HIGHEST</code>]]</td> </tr><tr> <td>- De 9 para 1</td> <td>[[<code>THREAD_PRIORITY_ABOVE_NORMAL</code>]]</td> </tr><tr> <td>0 0</td> <td>[[<code>THREAD_PRIORITY_NORMAL</code>]]</td> </tr><tr> <td>1 a 10</td> <td>[[<code>THREAD_PRIORITY_BELOW_NORMAL</code>]]</td> </tr><tr> <td>11 a 19</td> <td>[[<code>THREAD_PRIORITY_LOWEST</code>]]</td> </tr></tbody></table>

### 7.1.16 Grupos de recursos

O MySQL suporta a criação e a gestão de grupos de recursos e permite atribuir threads que estão em execução no servidor a grupos específicos, para que as threads sejam executadas de acordo com os recursos disponíveis para o grupo. Os atributos do grupo permitem controlar os seus recursos, para habilitar ou restringir o consumo de recursos por threads no grupo. Os administradores de banco de dados podem modificar esses atributos conforme necessário para diferentes cargas de trabalho.

Atualmente, o tempo da CPU é um recurso gerenciável, representado pelo conceito de “CPU virtual”, que inclui núcleos de CPU, hiperthreads, threads de hardware e assim por diante. O servidor determina, ao iniciar, quantos CPUs virtuais estão disponíveis, e os administradores de banco de dados com privilégios apropriados podem associar essas CPUs a grupos de recursos e atribuir threads a grupos.

Por exemplo, para gerenciar a execução de trabalhos em lote que não precisam ser executados com alta prioridade, um DBA pode criar um grupo de recursos `Batch` e ajustar sua prioridade para cima ou para baixo, dependendo da carga de trabalho do servidor. (Talvez os trabalhos em lote atribuídos ao grupo devam ser executados com prioridade menor durante o dia e com prioridade maior durante a noite.) O DBA também pode ajustar o conjunto de CPUs disponíveis para o grupo. Os grupos podem ser habilitados ou desabilitados para controlar se os threads podem ser atribuídos a eles.

As seções a seguir descrevem aspectos do uso do grupo de recursos no MySQL:

- Elementos do Grupo de Recursos
- Atributos do Grupo de Recursos
- Gestão de Grupos de Recursos
- Replicação de Grupo de Recursos
- Restrições de grupo de recursos

Importante

Em algumas plataformas ou configurações do servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações. Em particular, os sistemas Linux podem exigir uma etapa manual para alguns métodos de instalação. Para obter detalhes, consulte Restrições de grupos de recursos.

#### Elementos do Grupo de Recursos

Essas funcionalidades fornecem a interface SQL para a gestão de grupos de recursos no MySQL:

- As instruções SQL permitem criar, alterar e excluir grupos de recursos, além de atribuir threads a grupos de recursos. Uma dica de otimização permite atribuir instruções individuais a grupos de recursos.

- Os privilégios dos grupos de recursos permitem controlar quais usuários podem realizar operações nos grupos de recursos.

- A tabela Schema de Informações `RESOURCE_GROUPS` exibe informações sobre as definições dos grupos de recursos, e a tabela Schema de Desempenho `threads` mostra a atribuição do grupo de recursos para cada thread.

- As variáveis de status fornecem contagens de execução para cada instrução SQL de gerenciamento.

#### Atributos do Grupo de Recursos

Os grupos de recursos têm atributos que definem o grupo. Todos os atributos podem ser definidos no momento da criação do grupo. Alguns atributos são fixos no momento da criação; outros podem ser modificados a qualquer momento após isso.

Esses atributos são definidos no momento da criação do grupo de recursos e não podem ser modificados:

- Cada grupo tem um nome. Os nomes dos grupos de recursos são identificadores, como nomes de tabelas e colunas, e não precisam ser citados em declarações SQL, a menos que contenham caracteres especiais ou sejam palavras reservadas. Os nomes dos grupos não são sensíveis ao maiúsculas e podem ter até 64 caracteres.

- Cada grupo tem um tipo, que pode ser `SYSTEM` ou `USER`. O tipo do grupo de recursos afeta a faixa de valores de prioridade atribuíveis ao grupo, conforme descrito mais adiante. Este atributo, juntamente com as diferenças nas prioridades permitidas, permite identificar os threads do sistema para protegê-los da concorrência por recursos da CPU contra os threads dos usuários.

  Os threads do sistema e dos usuários correspondem aos threads de plano de fundo e de plano de execução, conforme listados na tabela do Schema de Desempenho `threads`.

Esses atributos são definidos no momento da criação do grupo de recursos e podem ser modificados a qualquer momento após isso:

- A afinidade da CPU é o conjunto de CPUs virtuais que o grupo de recursos pode usar. Uma afinidade pode ser qualquer subconjunto não vazio das CPUs disponíveis. Se um grupo não tiver afinidade, ele pode usar todas as CPUs disponíveis.

- A prioridade do fio é a prioridade de execução para os fios atribuídos ao grupo de recursos. Os valores de prioridade variam de -20 (maior prioridade) a 19 (menor prioridade). A prioridade padrão é 0, tanto para grupos de sistema quanto de usuário.

  Os grupos de sistema têm prioridade maior do que os grupos de usuários, garantindo que os tópicos de usuário nunca tenham prioridade maior que os tópicos de sistema:

  - Para os grupos de recursos do sistema, a faixa de prioridade permitida é de -20 a 0.

  - Para os grupos de recursos do usuário, a faixa de prioridade permitida é de 0 a 19.

- Cada grupo pode ser ativado ou desativado, permitindo que os administradores controlem a atribuição de threads. As threads só podem ser atribuídas a grupos ativados.

#### Gestão de Grupos de Recursos

Por padrão, há um grupo de sistema e um grupo de usuários, com os nomes `SYS_default` e `USR_default`, respectivamente. Esses grupos padrão não podem ser removidos e seus atributos não podem ser modificados. Cada grupo padrão não tem afinidade de CPU e prioridade 0.

Os novos sistemas e os tópicos de usuário são atribuídos aos grupos `SYS_default` e `USR_default`, respectivamente.

Para grupos de recursos definidos pelo usuário, todos os atributos são atribuídos no momento da criação do grupo. Após a criação de um grupo, seus atributos podem ser modificados, com exceção dos atributos Nome e Tipo.

Para criar e gerenciar grupos de recursos definidos pelo usuário, use as seguintes instruções SQL:

- `CREATE RESOURCE GROUP` cria um novo grupo. Veja a Seção 15.7.2.2, “Instrução CREATE RESOURCE GROUP”.

- `ALTER RESOURCE GROUP` modifica um grupo existente. Veja a Seção 15.7.2.1, “Instrução ALTER RESOURCE GROUP”.

- `DROP RESOURCE GROUP` exclui um grupo existente. Veja a Seção 15.7.2.3, “Instrução DROP RESOURCE GROUP”.

Essas declarações exigem o privilégio `RESOURCE_GROUP_ADMIN`.

Para gerenciar as atribuições de grupos de recursos, use essas capacidades:

- `SET RESOURCE GROUP` atribui threads a um grupo. Veja a Seção 15.7.2.4, “Instrução SET RESOURCE GROUP”.

- A dica de otimização `RESOURCE_GROUP` atribui instruções individuais a um grupo. Veja a Seção 10.9.3, “Dicas de Otimização”.

Essas operações exigem o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

As definições dos grupos de recursos são armazenadas na tabela do dicionário de dados `resource_groups` para que os grupos persistirem após reinicializações do servidor. Como o `resource_groups` faz parte do dicionário de dados, ele não é diretamente acessível pelos usuários. As informações dos grupos de recursos estão disponíveis usando a tabela do esquema de informações `RESOURCE_GROUPS`, que é implementada como uma visão na tabela do dicionário de dados. Veja a Seção 28.3.26, “A Tabela INFORMATION\_SCHEMA RESOURCE\_GROUPS”.

Inicialmente, a tabela `RESOURCE_GROUPS` tem essas linhas descrevendo os grupos padrão:

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

Os valores `THREAD_PRIORITY` indicam a prioridade padrão. Os valores `VCPU_IDS` mostram uma faixa que inclui todas as CPUs disponíveis. Para os grupos padrão, o valor exibido varia conforme o sistema em que o servidor MySQL está sendo executado.

Em uma discussão anterior, foi mencionado um cenário envolvendo um grupo de recursos chamado `Batch` para gerenciar a execução de trabalhos em lote que não precisam ser executados com alta prioridade. Para criar tal grupo, use uma declaração semelhante a esta:

```
CREATE RESOURCE GROUP Batch
  TYPE = USER
  VCPU = 2-3            -- assumes a system with at least 4 CPUs
  THREAD_PRIORITY = 10;
```

Para verificar se o grupo de recursos foi criado conforme o esperado, verifique a tabela `RESOURCE_GROUPS`:

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

Se o valor `THREAD_PRIORITY` for 0 em vez de 10, verifique se a configuração da sua plataforma ou do sistema limita a capacidade do grupo de recursos; consulte Restrições de Grupo de Recursos.

Para atribuir um tópico ao grupo `Batch`, faça o seguinte:

```
SET RESOURCE GROUP Batch FOR thread_id;
```

A partir daí, as declarações na thread nomeada são executadas com os recursos do grupo `Batch`.

Se o próprio thread atual de uma sessão deve estar no grupo `Batch`, execute esta instrução dentro da sessão:

```
SET RESOURCE GROUP Batch;
```

A partir daí, as declarações na sessão executam com os recursos do grupo `Batch`.

Para executar uma única instrução usando o grupo `Batch`, use a dica de otimização `RESOURCE_GROUP`:

```
INSERT /*+ RESOURCE_GROUP(Batch) */ INTO t2 VALUES(2);
```

Os threads atribuídos ao grupo `Batch` executam com seus recursos, que podem ser modificados conforme desejado:

- Para momentos em que o sistema está muito carregado, diminua o número de CPUs atribuídas ao grupo, reduza sua prioridade ou (como mostrado) ambos:

  ```
  ALTER RESOURCE GROUP Batch
    VCPU = 3
    THREAD_PRIORITY = 19;
  ```

- Para momentos em que o sistema está com carga leve, aumente o número de CPUs atribuídas ao grupo, aumente sua prioridade ou (como mostrado) ambos:

  ```
  ALTER RESOURCE GROUP Batch
    VCPU = 0-3
    THREAD_PRIORITY = 0;
  ```

#### Replicação de Grupo de Recursos

A gestão de grupos de recursos é local para o servidor em que ocorre. As instruções SQL do grupo de recursos e as modificações na tabela do dicionário de dados `resource_groups` não são escritas no log binário e não são replicadas.

#### Restrições de grupo de recursos

Em algumas plataformas ou configurações do servidor MySQL, os grupos de recursos não estão disponíveis ou têm limitações:

- Os grupos de recursos não estão disponíveis se o plugin de pilha de threads estiver instalado.

- Os grupos de recursos não estão disponíveis no macOS, que não oferece nenhuma API para vincular CPUs a um fio.

- No FreeBSD e no Solaris, as prioridades de threads de grupo de recursos são ignoradas. (Na prática, todas as threads são executadas com prioridade 0.) Tentativas de alterar as prioridades resultam em um aviso:

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

- No Linux, as prioridades dos grupos de recursos são ignoradas, a menos que a capacidade `CAP_SYS_NICE` seja definida. A concessão da capacidade `CAP_SYS_NICE` a um processo habilita uma série de privilégios; consulte <http://man7.org/linux/man-pages/man7/capabilities.7.html> para a lista completa. Tenha cuidado ao habilitar essa capacidade.

  Em plataformas Linux que utilizam o systemd e o suporte ao Ambient Capabilities (Linux 4.3 ou versões mais recentes), a maneira recomendada de habilitar a capacidade `CAP_SYS_NICE` é modificar o arquivo do serviço MySQL e deixar o binário **mysqld** inalterado. Para ajustar o arquivo do serviço do MySQL, use o seguinte procedimento:

  1. Execute o comando apropriado para sua plataforma:

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

  Se você não puder habilitar a capacidade `CAP_SYS_NICE` conforme descrito, ela pode ser configurada manualmente usando o comando **setcap**, especificando o nome do caminho para o executável **mysqld** (isso requer acesso **sudo**). Você pode verificar as capacidades usando **getcap**. Por exemplo:

  ```
  $> sudo setcap cap_sys_nice+ep /path/to/mysqld
  $> getcap /path/to/mysqld
  /path/to/mysqld = cap_sys_nice+ep
  ```

  Como medida de segurança, restrinja a execução do binário **mysqld** ao usuário `root` e aos usuários com a associação ao grupo `mysql`:

  ```
  $> sudo chown root:mysql /path/to/mysqld
  $> sudo chmod 0750 /path/to/mysqld
  ```

  Importante

  Se for necessário o uso manual do **setcap**, ele deve ser executado após cada reinstalação.

- No Windows, os threads funcionam em um dos cinco níveis de prioridade de thread. A faixa de prioridade de thread do grupo de recursos de -20 a 19 corresponde a esses níveis, conforme indicado na tabela a seguir.

  **Tabela 7.6 Prioridade de Fio do Grupo de Recursos no Windows**

  <table summary="Faixas de prioridade para os threads do grupo de recursos no Windows."><thead><tr> <th>Faixa de prioridade</th> <th>Nível de Prioridade do Windows</th> </tr></thead><tbody><tr> <td>-20 a -10</td> <td>[[<code>THREAD_PRIORITY_HIGHEST</code>]]</td> </tr><tr> <td>-9 a -1</td> <td>[[<code>THREAD_PRIORITY_ABOVE_NORMAL</code>]]</td> </tr><tr> <td>0</td> <td>[[<code>THREAD_PRIORITY_NORMAL</code>]]</td> </tr><tr> <td>1 a 10</td> <td>[[<code>THREAD_PRIORITY_BELOW_NORMAL</code>]]</td> </tr><tr> <td>11 a 19</td> <td>[[<code>THREAD_PRIORITY_LOWEST</code>]]</td> </tr></tbody></table>

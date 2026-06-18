#### 14.18.1.4 Funções para inspecionar e definir a versão do protocolo de comunicação de replicação de grupo

As seguintes funções permitem que você inspecione e configure a versão do protocolo de comunicação de Replicação de Grupo que é usada por um grupo de replicação.

- As versões do MySQL 5.7.14 permitem a compressão de mensagens (consulte a Seção 20.7.4, “Compressão de Mensagens”).

- As versões do MySQL 8.0.16 também permitem a fragmentação de mensagens (consulte a Seção 20.7.5, “Fragmentação de Mensagens”).

- As versões do MySQL 8.0.27 também permitem que o mecanismo de comunicação de grupo opere com um único líder de consenso quando o grupo estiver no modo de único primário e o `group_replication_paxos_single_leader` estiver definido como verdadeiro (consulte a Seção 20.7.3, “Líder de Consenso Único”).

- `group_replication_get_communication_protocol()`

  Verifique a versão do protocolo de comunicação de replicação de grupo que está sendo usada atualmente para um grupo.

  Sintaxe:

  ```
  STRING group_replication_get_communication_protocol()
  ```

  Esta função não tem parâmetros.

  Valor de retorno:

  A versão mais antiga do servidor MySQL que pode se juntar a este grupo e usar o protocolo de comunicação do grupo. Observe que a função `group_replication_get_communication_protocol()` retorna a versão mínima do MySQL que o grupo suporta, o que pode diferir do número de versão passado para `group_replication_set_communication_protocol()` e da versão do servidor MySQL instalada no membro onde você usa a função.

  Se o protocolo não puder ser inspecionado porque essa instância do servidor não pertence a um grupo de replicação, um erro é retornado como uma string.

  Exemplo:

  ```
  SELECT group_replication_get_communication_protocol();
  +------------------------------------------------+
  | group_replication_get_communication_protocol() |
  +------------------------------------------------+
  | 8.0.44                                          |
  +------------------------------------------------+
  ```

  Para obter mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

- `group_replication_set_communication_protocol()`

  Desgrade o protocolo de comunicação da replicação de grupo da versão de um grupo para que os membros de versões anteriores possam se juntar, ou atualize o protocolo de comunicação da replicação de grupo de um grupo após a atualização do MySQL Server em todos os membros. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar essa função, e todos os membros do grupo existentes devem estar online quando você emitir a declaração, sem perda da maioria.

  Nota

  Para o clúster MySQL InnoDB, a versão do protocolo de comunicação é gerenciada automaticamente sempre que a topologia do clúster é alterada usando operações da AdminAPI. Você não precisa usar essas funções diretamente para um clúster InnoDB.

  Sintaxe:

  ```
  STRING group_replication_set_communication_protocol(version)
  ```

  Argumentos:

  - `version`: Para uma desativação, especifique a versão do servidor MySQL do futuro membro do grupo que tenha a versão do servidor instalada mais antiga. Neste caso, o comando faz com que o grupo volte a um protocolo de comunicação compatível com essa versão do servidor, se possível. A versão mínima do servidor que você pode especificar é MySQL 5.7.14. Para uma atualização, especifique a nova versão do servidor MySQL para a qual os membros do grupo existentes foram atualizados.

  Valor de retorno:

  Uma cadeia que contém o resultado da operação, por exemplo, se foi bem-sucedida ou

  Exemplo:

  ```
  SELECT group_replication_set_communication_protocol("5.7.25");
  ```

  Para obter mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

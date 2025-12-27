#### 14.18.1.4 Funções para Inspecionar e Definir a Versão do Protocolo de Comunicação da Replicação de Grupo

As seguintes funções permitem que você inspecione e configure a versão do protocolo de comunicação da Replicação de Grupo que é usada por um grupo de replicação.

* Seção 20.7.4, “Compactação de Mensagens”
* Seção 20.7.5, “Fragmentação de Mensagens”
* Seção 20.7.3, “Líder de Consenso Único”

* `group_replication_get_communication_protocol()`

  Inspecionar a versão do protocolo de comunicação da Replicação de Grupo que está atualmente em uso para um grupo.

  Sintaxe:

  ```
  STRING group_replication_get_communication_protocol()
  ```

  Esta função não tem parâmetros.

  Valor de retorno:

  A versão mais antiga do servidor MySQL que pode se juntar a este grupo e usar o protocolo de comunicação do grupo. Note que a função `group_replication_get_communication_protocol()` retorna a versão mínima do MySQL que o grupo suporta, o que pode diferir do número de versão que foi passado para `group_replication_set_communication_protocol()`, e da versão do servidor MySQL que está instalada no membro onde você usa a função.

  Se o protocolo não puder ser inspecionado porque essa instância do servidor não pertence a um grupo de replicação, um erro é retornado como uma string.

  Exemplo:

  ```
  SELECT group_replication_get_communication_protocol();
  +------------------------------------------------+
  | group_replication_get_communication_protocol() |
  +------------------------------------------------+
  | 8.4.6                                          |
  +------------------------------------------------+
  ```

  Para mais informações, consulte a Seção 20.5.1.4, “Definir a Versão do Protocolo de Comunicação de um Grupo”.

* `group_replication_set_communication_protocol()`

  Desgradar a versão do protocolo de comunicação da Replicação de Grupo de um grupo para que membros em versões anteriores possam se juntar, ou atualizar a versão do protocolo de comunicação da Replicação de Grupo de um grupo após a atualização do MySQL Server em todos os membros. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar esta função, e todos os membros do grupo existentes devem estar online quando você emitir a declaração, sem perda da maioria.

  ::: info Nota

Para o clúster MySQL InnoDB, a versão do protocolo de comunicação é gerenciada automaticamente sempre que a topologia do clúster é alterada usando operações da AdminAPI. Você não precisa usar essas funções diretamente para um clúster InnoDB.


:::


Sintaxe:


```
  STRING group_replication_set_communication_protocol(version)
  ```


Argumentos:


+ *`version`*: Para uma desvantagem, especifique a versão do Servidor MySQL do membro do grupo com o servidor mais antigo instalado. Neste caso, o comando faz o grupo voltar a um protocolo de comunicação compatível com essa versão do servidor, se possível. A versão mínima do servidor que você pode especificar é MySQL 5.7.14. Para uma atualização, especifique a nova versão do Servidor MySQL para a qual os membros do grupo existentes foram atualizados.


Valor de retorno:


Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.


Exemplo:


```
  SELECT group_replication_set_communication_protocol("5.7.25");
  ```


Para obter mais informações, consulte a Seção 20.5.1.4, “Definir a Versão do Protocolo de Comunicação de um Grupo”.
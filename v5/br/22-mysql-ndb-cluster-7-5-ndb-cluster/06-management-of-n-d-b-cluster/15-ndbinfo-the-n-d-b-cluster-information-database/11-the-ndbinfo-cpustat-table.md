#### 21.6.15.11 A Tabela ndbinfo cpustat

A tabela `cpustat` fornece estatísticas de CPU por *thread*, coletadas a cada segundo, para cada *thread* em execução no *kernel* `NDB`.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

  ID do *Node* onde o *thread* está em execução

* `thr_no`

  ID do *Thread* (específico para este *node*)

* `OS_user`

  Tempo de usuário do OS

* `OS_system`

  Tempo de sistema do OS

* `OS_idle`

  Tempo ocioso do OS

* `thread_exec`

  Tempo de execução do *Thread*

* `thread_sleeping`

  Tempo de sono (*sleep*) do *Thread*

* `thread_spinning`

  Tempo de *spin* do *Thread*

* `thread_send`

  Tempo de envio (*send*) do *Thread*

* `thread_buffer_full`

  Tempo de *buffer* cheio do *Thread*

* `elapsed_time`

  Tempo decorrido (*Elapsed time*)

##### Notas

Esta tabela foi adicionada no NDB 7.5.2.
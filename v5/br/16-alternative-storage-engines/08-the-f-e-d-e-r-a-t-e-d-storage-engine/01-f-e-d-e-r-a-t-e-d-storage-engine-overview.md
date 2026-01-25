### 15.8.1 Visão Geral do Storage Engine FEDERATED

Ao criar uma Table usando um dos standard Storage Engines (como `MyISAM`, `CSV` ou `InnoDB`), a Table consiste na definição da Table e nos dados associados. Ao criar uma Table `FEDERATED`, a definição da Table é a mesma, mas o armazenamento físico dos dados é gerenciado em um Server remoto.

Uma Table `FEDERATED` consiste em dois elementos:

* Um *Server remoto* com uma Database Table, que por sua vez consiste na definição da Table (armazenada no arquivo `.frm`) e na Table associada. O tipo de Table da Table remota pode ser qualquer tipo suportado pelo mysqld Server remoto, incluindo `MyISAM` ou `InnoDB`.

* Um *Server local* com uma Database Table, onde a definição da Table corresponde à Table no Server remoto. A definição da Table é armazenada no arquivo `.frm`. No entanto, não há arquivo de dados (data file) no Server local. Em vez disso, a definição da Table inclui uma connection string que aponta para a Table remota.

Ao executar Queries e statements em uma Table `FEDERATED` no Server local, as operações que normalmente Insert, Update ou Delete informações de um data file local são, em vez disso, enviadas ao Server remoto para execução, onde elas atualizam o data file no Server remoto ou retornam as rows correspondentes do Server remoto.

A estrutura básica de uma configuração de Table `FEDERATED` é mostrada na Figura 15.2, “Estrutura da Table FEDERATED”.

**Figura 15.2 Estrutura da Table FEDERATED**

![O conteúdo é descrito no texto circundante.](images/se-federated-structure.png)

Quando um Client emite um SQL statement que se refere a uma Table `FEDERATED`, o fluxo de informações entre o Server local (onde o SQL statement é executado) e o Server remoto (onde os dados são armazenados fisicamente) é o seguinte:

1. O Storage Engine examina cada Column que a Table `FEDERATED` possui e constrói um SQL statement apropriado que se refere à Table remota.

2. O statement é enviado para o Server remoto usando a MySQL Client API.

3. O Server remoto processa o statement e o Server local recupera qualquer resultado que o statement produza (uma contagem de affected-rows ou um result set).

4. Se o statement produzir um result set, cada Column é convertida para o formato interno do Storage Engine que o engine `FEDERATED` espera e pode usar para exibir o resultado ao Client que emitiu o statement original.

O Server local se comunica com o Server remoto usando as funções da MySQL Client C API. Ele invoca `mysql_real_query()` para enviar o statement. Para ler um result set, ele usa `mysql_store_result()` e busca rows, uma de cada vez, usando `mysql_fetch_row()`.
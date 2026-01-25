#### 21.6.15.21 A Tabela ndbinfo error_messages

A tabela `error_messages` fornece informações sobre

A tabela `error_messages` contém as seguintes colunas:

* `error_code`

  Código de erro numérico

* `error_description`

  Descrição do erro

* `error_status`

  Código de status de erro

* `error_classification`

  Código de classificação de erro

##### Notas

`error_code` é um código de erro NDB numérico. Este é o mesmo código de erro que pode ser fornecido a [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") ou [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") [`--ndb`](perror.html#option_perror_ndb).

`error_description` fornece uma descrição básica da condição que causa o erro.

A coluna `error_status` fornece informações de status relacionadas ao erro. Os valores possíveis para esta coluna estão listados aqui:

* `Sem erro`
* `Connect string inválida`
* `Handle de servidor inválido`
* `Resposta inválida do servidor`
* `Número de nodes inválido`
* `Status de node inválido`
* `Sem memória`
* `Management server não conectado`
* `Não foi possível conectar ao socket`
* `Falha na inicialização`
* `Falha na parada`
* `Falha na reinicialização`
* `Não foi possível iniciar o backup`
* `Não foi possível abortar o backup`
* `Não foi possível entrar no modo de usuário único`
* `Não foi possível sair do modo de usuário único`
* `Falha ao concluir a mudança de configuração`
* `Falha ao obter a configuração`
* `Erro de uso`
* `Sucesso`
* `Erro permanente`
* `Erro temporário`
* `Resultado desconhecido`
* `Erro temporário, reiniciar node`
* `Erro permanente, ação externa necessária`
* `Erro de file system Ndbd, reiniciar node inicial`

* `Desconhecido`

A coluna `error_classification` mostra a classificação do erro. Consulte [NDB Error Classifications](/doc/ndbapi/en/ndb-error-classifications.html) para obter informações sobre os códigos de classificação e seus significados.

A tabela `error_messages` foi adicionada no NDB 7.6.
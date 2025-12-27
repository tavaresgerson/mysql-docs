#### 25.6.15.34 Tabelas de mensagens de erro ndbinfo

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

`error_code` é um código de erro NDB numérico. Este é o mesmo código de erro que pode ser fornecido ao **ndb\_perror**.

`error_description` fornece uma descrição básica da condição que causa o erro.

A coluna `error_status` fornece informações de status relacionadas ao erro. Os valores possíveis para esta coluna estão listados aqui:

* `Sem erro`
* `String de conexão ilegal`
* `Handle do servidor ilegal`
* `Resposta do servidor ilegal`
* `Número de nós ilegal`
* `Status do nó ilegal`
* `Sem memória`
* `Servidor de gerenciamento não conectado`
* `Não foi possível conectar ao socket`
* `Início falhou`
* `Parar falhou`
* `Reiniciar falhou`
* `Não foi possível iniciar a cópia de segurança`
* `Não foi possível interromper a cópia de segurança`
* `Não foi possível entrar no modo de usuário único`
* `Não foi possível sair do modo de usuário único`
* `Falha ao completar a alteração de configuração`
* `Não foi possível obter a configuração`
* `Erro de uso`
* `Sucesso`
* `Erro permanente`
* `Erro temporário`
* `Resultado desconhecido`
* `Erro temporário, reinicie o nó`
* `Erro permanente, ação externa necessária`
* `Erro do sistema de arquivos NDB, reinicie o nó inicial`

* `Desconhecido`

A coluna `error_classification` mostra a classificação do erro. Consulte Classificações de Erros NDB para obter informações sobre os códigos de classificação e seus significados.
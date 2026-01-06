#### 21.6.15.21 Tabela de mensagens de erro ndbinfo\_messages

A tabela `mensagens_de_erro` fornece informações sobre

A tabela `error_messages` contém as seguintes colunas:

- `código_de_erro`

  Código de erro numérico

- `descrição_do_erro`

  Descrição do erro

- `status_erro`

  Código de status de erro

- `classificação_de_erro`

  Código de classificação de erro

##### Notas

`error_code` é um código de erro numérico do NDB. Este é o mesmo código de erro que pode ser fornecido ao **ndb\_perror** ou ao **perror** `--ndb` (perror.html#option\_perror\_ndb).

`error_description` fornece uma descrição básica da condição que está causando o erro.

A coluna `error_status` fornece informações de status relacionadas ao erro. Os valores possíveis para esta coluna estão listados aqui:

- `Sem erro`

- `String de conexão ilegal`

- `Endereço de servidor ilegal`

- "Resposta ilegal do servidor"

- "Número ilegal de nós"

- "Status de nó ilegal"

- "Sem memória"

- `Servidor de gerenciamento não conectado`

- `Não consegui conectar ao soquete`

- `Início falhou`

- `A parada falhou`

- `Reinício falhou`

- `Não foi possível iniciar o backup`

- `Não foi possível interromper o backup`

- `Não foi possível entrar no modo de usuário único`

- `Não foi possível sair do modo de usuário único`

- `Não foi possível completar a alteração da configuração`

- `Não foi possível obter a configuração`

- Erro de uso

- "Sucesso"

- "Erro permanente"

- "Erro temporário"

- `Resultado desconhecido`

- `Erro temporário, reinicie o nó`

- `Erro permanente, ação externa necessária`

- Erro do sistema de arquivos Ndbd, reinicie o nó inicial

- "Desconhecido"

A coluna error\_classification mostra a classificação do erro. Consulte Classificações de Erros do NDB para obter informações sobre os códigos de classificação e seus significados.

A tabela `error_messages` foi adicionada no NDB 7.6.

#### 5.5.5.1 Tokens de versão Elementos

Version Tokens é baseado em uma biblioteca de plugins que implementa esses elementos:

- Um plugin do lado do servidor chamado `version_tokens` contém a lista de tokens de versão associados ao servidor e se inscreve para receber notificações sobre eventos de execução de declarações. O plugin `version_tokens` usa a API do plugin de auditoria para monitorar as declarações recebidas dos clientes e compara a lista de tokens de versão específicos de sessão de cada cliente com a lista de tokens de versão do servidor. Se houver uma correspondência, o plugin permite que a declaração seja processada e o servidor continua a processá-la. Caso contrário, o plugin retorna um erro ao cliente e a declaração falha.

- Um conjunto de funções carregáveis fornece uma API em nível SQL para manipular e inspecionar a lista de tokens de versão do servidor mantidos pelo plugin. O privilégio `SUPER` é necessário para chamar qualquer uma das funções de Token de Versão.

- Uma variável de sistema permite que os clientes especifiquem a lista de tokens de versão que registram o estado do servidor necessário. Se o servidor tiver um estado diferente quando um cliente envia uma declaração, o cliente receberá um erro.

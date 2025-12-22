#### 7.6.6.1 Elementos de Tokens de Versão

O Version Tokens é baseado em uma biblioteca de plugins que implementa esses elementos:

- Um plugin do lado do servidor chamado `version_tokens` detém a lista de tokens de versão associados ao servidor e assina notificações para eventos de execução de instruções. O plugin `version_tokens` usa a API do plugin de auditoria para monitorar instruções de entrada de clientes e combina a lista de tokens de versão específica de cada sessão do cliente com a lista de tokens de versão do servidor. Se houver uma correspondência, o plugin deixa a instrução passar e o servidor continua a processá-la. Caso contrário, o plugin retorna um erro para o cliente e a instrução falha.
- Um conjunto de funções carregáveis fornece uma API de nível SQL para manipular e inspecionar a lista de tokens de versão do servidor mantidos pelo plugin. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio depreciado `SUPER`) é necessário para chamar qualquer uma das funções de Token de Versão.
- Quando o plug-in `version_tokens` é carregado, ele define o privilégio dinâmico `VERSION_TOKEN_ADMIN`.
- Uma variável de sistema permite que os clientes especifiquem a lista de tokens de versão que registam o estado do servidor necessário. Se o servidor tiver um estado diferente quando um cliente envia uma instrução, o cliente recebe um erro.

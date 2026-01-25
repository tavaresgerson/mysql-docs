#### 5.5.5.1 Elementos de Version Tokens

Version Tokens é baseado em uma biblioteca de plugin que implementa estes elementos:

*   Um plugin do lado do server chamado `version_tokens` mantém a lista de version tokens associada ao server e se inscreve para notificações de eventos de execução de statement. O plugin `version_tokens` usa a [audit plugin API](/doc/extending-mysql/5.7/en/plugin-types.html#audit-plugin-type) para monitorar statements de entrada de clients e compara a lista de version tokens específica da session de cada client com a lista de version tokens do server. Se houver uma correspondência, o plugin permite a passagem do statement e o server continua a processá-lo. Caso contrário, o plugin retorna um erro ao client e o statement falha.

*   Um conjunto de funções carregáveis fornece uma API em nível SQL para manipular e inspecionar a lista de version tokens do server mantida pelo plugin. O privilege [`SUPER`](privileges-provided.html#priv_super) é exigido para chamar qualquer uma das funções de Version Token.

*   Uma variável de sistema permite que os clients especifiquem a lista de version tokens que registram o estado de server exigido. Se o server estiver em um estado diferente quando um client envia um statement, o client recebe um erro.
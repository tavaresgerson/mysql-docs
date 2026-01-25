### 8.15.1 Uso Típico

Para realizar o rastreamento do otimizador (optimizer tracing), siga os seguintes passos:

1. Habilite o rastreamento executando `SET` `optimizer_trace="enabled=ON"`.

2. Execute o Statement a ser rastreado. Consulte a Seção 8.15.3, “Statements Rastreáveis”, para uma lista dos Statements que podem ser rastreados.

3. Examine o conteúdo da tabela `INFORMATION_SCHEMA.OPTIMIZER_TRACE`.

4. Para examinar traces de múltiplas Queries, repita as duas etapas anteriores conforme necessário.

5. Para desabilitar o rastreamento quando finalizar, execute `SET optimizer_trace="enabled=OFF"`.

Você pode rastrear apenas Statements que são executados dentro da Session atual; você não pode visualizar traces de outras Sessions.
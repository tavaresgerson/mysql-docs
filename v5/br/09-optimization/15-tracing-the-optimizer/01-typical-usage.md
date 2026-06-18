### 8.15.1 Uso típico

Para realizar o rastreamento do otimizador, é necessário seguir os seguintes passos:

1. Ative o rastreamento executando `SET` `optimizer_trace="enabled=ON"`.

2. Execute a declaração a ser rastreada. Consulte a Seção 8.15.3, “Declarações Rastreadas”, para uma lista de declarações que podem ser rastreadas.

3. Examine o conteúdo da tabela `INFORMATION_SCHEMA.OPTIMIZER_TRACE`.

4. Para examinar as pistas para várias consultas, repita os dois passos anteriores conforme necessário.

5. Para desativar o rastreamento após terminar, execute `SET optimizer_trace="enabled=OFF"`.

Você pode rastrear apenas declarações que são executadas dentro da sessão atual; você não pode ver rastros de outras sessões.

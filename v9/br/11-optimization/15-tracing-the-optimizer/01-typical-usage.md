### 10.15.1 Uso típico

Para realizar o rastreamento do otimizador, siga os seguintes passos:

1. Ative o rastreamento executando `SET` `optimizer_trace="enabled=ON"`.

2. Execute a instrução a ser rastreada. Consulte a Seção 10.15.3, “Instruções rastreáveis”, para uma lista de instruções que podem ser rastreadas.

3. Examine o conteúdo da tabela `INFORMATION_SCHEMA.OPTIMIZER_TRACE`.

4. Para examinar os rastros de várias consultas, repita os dois passos anteriores conforme necessário.

5. Para desativar o rastreamento após terminar, execute `SET optimizer_trace="enabled=OFF"`.

Você pode rastrear apenas as instruções executadas dentro da sessão atual; não é possível ver rastros de outras sessões.
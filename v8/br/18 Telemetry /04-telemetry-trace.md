## 35.3 OpenTelemetry Trace

O rastreamento de telemetria permite que você visualize o fluxo de qualquer ação de processamento conforme ela é processada através do seu servidor. Os dados de cada ação, uma faixa, incluem informações de possíveis erros e dados de temporização. As faixas são geradas para comandos `COM_QUERY` executados, incluindo comandos não de consulta, como `COM_PING` ou `COM_STMT_CLOSE`. As faixas de declarações de consulta também têm um atributo de texto SQL associado.

O rastreamento de telemetria é implementado em:

* Componente de Telemetria da Edição Empresarial do MySQL
* Cliente da Edição Empresarial do MySQL
* Conectadores do MySQL
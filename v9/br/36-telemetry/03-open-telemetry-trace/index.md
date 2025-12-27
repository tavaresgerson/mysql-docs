## 35.3 Trace de OpenTelemetry

35.3.1 Configurando o Trace de Telemetria

35.3.2 Formato do Trace

O rastreamento de telemetria permite que você visualize o fluxo de qualquer ação de processamento conforme ela é processada pelo seu servidor. Os dados de cada ação, um intervalo, incluem informações de possíveis erros e dados de temporização. Os traces são gerados para comandos `COM_QUERY` executados, incluindo comandos não de consulta, como `COM_PING` ou `COM_STMT_CLOSE`. Os traces de declarações de consulta também têm um atributo de texto SQL associado.

O rastreamento de telemetria é implementado em:

* Componente de Telemetria da Edição Empresarial do MySQL
* Cliente da Edição Empresarial do MySQL
* Conectadores do MySQL
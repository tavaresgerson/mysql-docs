# Capítulo 35 Telemetria

**Índice**

35.1 Instalando Suporte OpenTelemetry

35.2 Variáveis de Telemetria

35.3 OpenTelemetry Trace:   35.3.1 Configurando Telemetria de Rastreamento

    35.3.2 Formato de Rastreamento

35.4 OpenTelemetry Metrics:   35.4.1 Configurando Telemetria de Métricas

    35.4.2 Medidores de Servidor

    35.4.3 Métricas de Servidor

35.5 OpenTelemetry Logging:   35.5.1 Configurando Telemetria de Log

O projeto OpenTelemetry (OTel) é uma estrutura de observabilidade de código aberto e neutra em relação aos fornecedores, fornecendo um padrão comum de observabilidade. Ele permite que os usuários instrumen suas aplicações para exportar dados de observabilidade: rastros, métricas e logs, possibilitando uma maior granularidade no depuração e teste.

Nota

O suporte OpenTelemetry é um componente incluído na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

Este capítulo assume familiaridade com a [Documentação OpenTelemetry](https://opentelemetry.io/).
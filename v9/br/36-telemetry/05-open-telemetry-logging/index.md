## 35.5 Registro de Telemetria de OpenTelemetry

35.5.1 Configurando o Registro de Telemetria

O Registro de Telemetria de OpenTelemetry do MySQL permite que você exporte logs de telemetria do seu Servidor MySQL para backends de OpenTelemetry para análise. Essa funcionalidade é implementada das seguintes maneiras:

* Componente de Registro de Telemetria: (Apenas MySQL Enterprise Edition e MySQL HeatWave) coleta eventos de log instrumentados do servidor, formata-os no formato OTLP da OpenTelemetry e exporta os logs para o ponto de destino definido usando o protocolo de rede OTLP da OpenTelemetry. O processo que está ouvindo no ponto de destino pode ser um coletor de OpenTelemetry ou qualquer outro backend compatível com o OpenTelemetry. Se você deseja exportar para vários backends, deve usar um coletor de OpenTelemetry.

  Veja a Seção 35.1, “Instalando Suporte de OpenTelemetry”.

* Interface de Registro de Telemetria: (MySQL Community Server, MySQL Enterprise Edition e MySQL HeatWave) uma API que permite que você defina e integre seus próprios componentes de Registro de Telemetria de OpenTelemetry. Essa interface possibilita a descoberta da instrumentação de registro disponível, a habilitação de registradores, a geração de registros e a extração dos contextos de rastreamento associados.

  A interface não fornece registro. Você deve usar a MySQL Enterprise Edition, MySQL HeatWave ou desenvolver seu próprio componente para fornecer registro.

  Para obter informações sobre a interface e o código de exemplo do componente, consulte as seções *Serviço de logs de telemetria do servidor* da Documentação do MySQL Server Doxygen.
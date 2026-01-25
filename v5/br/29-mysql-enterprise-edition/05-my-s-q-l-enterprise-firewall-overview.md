## 28.5 Visão Geral do MySQL Enterprise Firewall

O MySQL Enterprise Edition inclui o MySQL Enterprise Firewall, um *Firewall* de nível de aplicação que permite aos administradores de *Database* autorizar ou negar a execução de comandos *SQL* com base na correspondência contra *allowlists* de padrões de comandos aceitos. Isso ajuda a fortalecer o MySQL Server contra ataques como *SQL injection* ou tentativas de explorar aplicações usando-as fora das características legítimas de sua carga de trabalho (*workload*) de *Query*.

Cada conta MySQL registrada no *Firewall* tem sua própria *allowlist* de comandos, permitindo que a proteção seja personalizada por conta. Para uma determinada conta, o *Firewall* pode operar nos modos de gravação (*recording*) ou proteção (*protecting*), para treinamento nos padrões de comandos aceitos ou para proteção contra comandos inaceitáveis.

Para mais informações, consulte a Seção 6.4.6, “MySQL Enterprise Firewall”.
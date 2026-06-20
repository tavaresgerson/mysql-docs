## 28.5 Visão geral do firewall empresarial do MySQL

A Edição Empresarial do MySQL inclui o MySQL Enterprise Firewall, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de consulta.

Cada conta do MySQL registrada no firewall tem sua própria declaração allowlist, permitindo que a proteção seja adaptada por conta. Para uma conta específica, o firewall pode operar no modo de gravação ou proteção, para treinamento nos padrões de declarações aceitos ou proteção contra declarações inaceitáveis.

Para mais informações, consulte a Seção 6.4.6, “Firewall Empresarial MySQL”.
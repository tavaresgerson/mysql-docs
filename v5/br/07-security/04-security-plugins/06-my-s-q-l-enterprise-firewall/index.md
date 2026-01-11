### 6.4.6 Firewall Empresarial MySQL

Nota

O MySQL Enterprise Firewall é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Firewall, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negociem a execução de instruções SQL com base em listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de trabalho de consultas.

Cada conta do MySQL registrada no firewall tem sua própria lista de permissões, permitindo que a proteção seja adaptada para cada conta. Para uma conta específica, o firewall pode operar no modo de gravação, proteção ou detecção, para treinamento nos padrões de declarações aceitos, proteção ativa contra declarações inaceitáveis ou detecção passiva de declarações inaceitáveis. O diagrama ilustra como o firewall processa as declarações recebidas em cada modo.

**Figura 6.1 Operação do Firewall Empresarial MySQL**

![Diagrama de fluxo mostrando como o MySQL Enterprise Firewall processa declarações SQL de entrada nos modos de gravação, proteção e detecção](images/firewall-diagram-1.png)

As seções a seguir descrevem os elementos do MySQL Enterprise Firewall, discutem como instalá-lo e usá-lo, e fornecem informações de referência para seus elementos.

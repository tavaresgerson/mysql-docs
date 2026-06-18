### 8.4.7 Firewall empresarial MySQL

8.4.7.1 Elementos do Firewall Empresarial MySQL

8.4.7.2 Instalação ou Desinstalação do Firewall Empresarial MySQL

8.4.7.3 Uso do Firewall Empresarial do MySQL

8.4.7.4 Referência do Firewall Empresarial do MySQL

Nota

O MySQL Enterprise Firewall é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Firewall, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negociem a execução de instruções SQL com base em listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de trabalho de consultas.

Cada conta do MySQL registrada no firewall tem sua própria lista de permissões, permitindo que a proteção seja adaptada para cada conta. Para uma conta específica, o firewall pode operar no modo de gravação, proteção ou detecção, para treinamento nos padrões de declarações aceitos, proteção ativa contra declarações inaceitáveis ou detecção passiva de declarações inaceitáveis. O diagrama ilustra como o firewall processa as declarações recebidas em cada modo.

**Figura 8.1 Operação do Firewall Empresarial MySQL**

![Flow chart showing how MySQL Enterprise Firewall processes incoming SQL statements in recording, protecting, and detecting modes.](images/firewall-diagram-1.png)

As seções a seguir descrevem os elementos do MySQL Enterprise Firewall, discutem como instalá-lo e usá-lo, e fornecem informações de referência para seus elementos.

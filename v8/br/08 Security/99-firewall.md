### 8.4.7 Firewall Empresarial MySQL

::: info Nota

O Firewall Empresarial MySQL é uma extensão incluída na Edição Empresarial MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

A Edição Empresarial MySQL inclui o Firewall Empresarial MySQL, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negociem a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora das características legítimas de carga de trabalho de consulta.

Cada conta MySQL registrada com o firewall tem sua própria lista de permissão de instruções, permitindo que a proteção seja adaptada por conta. Para uma conta específica, o firewall pode operar no modo de registro, proteção ou detecção, para treinamento nos padrões de instruções aceitos, proteção ativa contra instruções inaceitáveis ou detecção passiva de instruções inaceitáveis. O diagrama ilustra como o firewall processa as instruções recebidas em cada modo.

**Figura 8.1 Operação do Firewall Empresarial MySQL**

![Diagrama de fluxo mostrando como o Firewall Empresarial MySQL processa instruções SQL recebidas nos modos de registro, proteção e detecção.](images/firewall-diagram-1.png)

As seções seguintes descrevem os elementos do Firewall Empresarial MySQL, discutem como instalá-lo e usá-lo, e fornecem informações de referência para seus elementos.
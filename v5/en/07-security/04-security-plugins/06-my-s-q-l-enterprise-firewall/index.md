### 6.4.6 MySQL Enterprise Firewall

[6.4.6.1 Elementos do MySQL Enterprise Firewall](firewall-elements.html)

[6.4.6.2 Instalação ou Desinstalação do MySQL Enterprise Firewall](firewall-installation.html)

[6.4.6.3 Utilizando o MySQL Enterprise Firewall](firewall-usage.html)

[6.4.6.4 Referência do MySQL Enterprise Firewall](firewall-reference.html)

Nota

O MySQL Enterprise Firewall é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O MySQL Enterprise Edition inclui o MySQL Enterprise Firewall, um Firewall de nível de aplicação que permite aos administradores de Database permitir ou negar a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitas. Isso ajuda a proteger o MySQL Server contra ataques como SQL injection ou tentativas de explorar aplicações, utilizando-as fora de suas características legítimas de workload de Query.

Cada conta MySQL registrada no Firewall possui sua própria allowlist de instruções, permitindo que a proteção seja personalizada por conta. Para uma determinada conta, o Firewall pode operar nos modos recording, protecting ou detecting, para treinamento nos padrões de instruções aceitas, proteção ativa contra instruções inaceitáveis ou detecção passiva de instruções inaceitáveis. O diagrama ilustra como o Firewall processa as instruções de entrada em cada modo.

**Figura 6.1 Operação do MySQL Enterprise Firewall**

![Fluxograma mostrando como o MySQL Enterprise Firewall processa as instruções SQL de entrada nos modos recording, protecting e detecting.](images/firewall-diagram-1.png)

As seções a seguir descrevem os elementos do MySQL Enterprise Firewall, discutem como instalá-lo e utilizá-lo, e fornecem informações de referência para seus elementos.
### 8.4.8 Firewall Empresarial MySQL

8.4.8.1 O Plugin do Firewall Empresarial MySQL

8.4.8.2 O Componente do Firewall Empresarial MySQL

Nota

O Firewall Empresarial MySQL é uma extensão incluída na Edição Empresarial MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O Firewall Empresarial MySQL é um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com listas de padrões de instruções aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de trabalho de consultas.

No MySQL 9.5, o Firewall Empresarial MySQL está disponível como um plugin (consulte a Seção 8.4.8.1, “O Plugin do Firewall Empresarial MySQL”) e como um componente (consulte a Seção 8.4.8.2, “O Componente do Firewall Empresarial MySQL”). O plugin do firewall está desatualizado. Recomendamos que você faça a atualização do plugin para o componente do firewall o mais rápido possível, pois o plugin está sujeito à remoção em uma futura versão do MySQL. Consulte Atualizando para o Componente do Firewall Empresarial MySQL, para obter ajuda com a migração para o componente do Firewall Empresarial MySQL.

O plugin de firewall e o componente de firewall fornecem a mesma funcionalidade, com exceção dos perfis de conta, que são desatualizados no plugin de firewall e não são suportados pelo componente. Se você estiver usando perfis de conta com o plugin de firewall, pode migrá-los para perfis de grupo usando a ferramenta de migração, conforme descrito em Migrar perfis de conta para perfis de grupo. Isso é feito automaticamente ao migrar do plugin de firewall para o componente de firewall, executando `upgrade_firewall_to_component.sql` (veja Scripts do Componente do Firewall do MySQL Enterprise) ou o MySQL Configurator (veja Seção 2.3.2.1, “Configuração do Servidor MySQL com o MySQL Configurator”).

Cada conta MySQL registrada com o firewall tem sua própria lista de permissões, permitindo que a proteção seja adaptada por conta. Para uma conta específica, o firewall pode operar no modo de gravação, proteção ou detecção, para treinamento nos padrões de declarações aceitos, proteção ativa contra declarações inaceitáveis ou detecção passiva de declarações inaceitáveis. O diagrama ilustra como o firewall processa declarações recebidas em cada modo.

**Figura 8.1 Operação do Firewall do MySQL Enterprise**

![Diagrama de fluxo mostrando como o Firewall do MySQL Enterprise processa declarações SQL recebidas nos modos de gravação, proteção e detecção.](images/firewall-diagram-1.png)

As duas seções seguintes descrevem, respectivamente, o plugin MySQL Enterprise Firewall e o componente MySQL Enterprise Firewall, discutindo como instalar e usar cada um deles, além de fornecer informações de referência para os elementos de cada um. A atualização para o componente MySQL Enterprise Firewall e a desatualização do componente MySQL Enterprise Firewall fornecem informações sobre a migração entre as versões do plugin e do componente do MySQL Enterprise Firewall.
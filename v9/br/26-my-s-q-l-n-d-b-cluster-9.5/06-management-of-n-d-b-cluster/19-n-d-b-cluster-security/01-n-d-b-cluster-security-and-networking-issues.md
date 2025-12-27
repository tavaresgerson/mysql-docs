#### 25.6.19.1 Problemas de Segurança e Networking do NDB Cluster

Nesta seção, discutimos os problemas básicos de segurança da rede, conforme eles se relacionam com o NDB Cluster. É extremamente importante lembrar que, por padrão, o NDB Cluster não é seguro; você ou seu administrador de rede deve tomar as medidas adequadas para garantir que seu cluster não possa ser comprometido pela rede.

Por padrão, não são usadas criptografia ou medidas de segurança semelhantes nas comunicações entre os nós do cluster; conexões criptografadas são suportadas, mas devem ser habilitadas usando as informações e instruções encontradas na Seção 25.6.19.5, “Criptografia de Link TLS para NDB Cluster”.

Você deve estar ciente de que, se as conexões criptografadas não forem usadas, não haverá verificação do endereço IP de origem ao acessar o cluster em nenhum dos seguintes casos:

* Nós SQL ou API usando “faixas livres” criadas por seções `[mysqld]` ou `[api]` vazias no arquivo `config.ini`

Isso significa que, se houver quaisquer seções `[mysqld]` ou `[api]` vazias no arquivo `config.ini`, então quaisquer nós API (incluindo nós SQL) que conheçam o nome do host (ou endereço IP) e a porta do servidor de gerenciamento podem se conectar ao cluster e acessar seus dados sem restrição. (Veja a Seção 25.6.19.2, “Privilégios do NDB Cluster e MySQL”, para mais informações sobre isso e questões relacionadas.)

Você pode exercer algum controle sobre o acesso de nós SQL e API ao cluster quando as conexões criptografadas não estão em uso, especificando um parâmetro `HostName` para cada seção `[mysqld]` e `[api]` no arquivo `config.ini`. No entanto, isso também significa que, caso você queira conectar um nó API ao cluster a partir de um host anteriormente não utilizado, você deve adicionar uma seção `[api]` contendo seu nome de host ao arquivo `config.ini`.

Consulte a Seção 25.4.1, “Configuração Rápida do NDB Cluster”, para exemplos de configuração usando `HostName` com nós da API.

* Qualquer cliente **ndb\_mgm**

  Isso significa que qualquer cliente de gerenciamento de cluster que receber o nome do host (ou endereço IP) do servidor de gerenciamento e a porta (se não for a porta padrão) pode se conectar ao cluster e executar qualquer comando do cliente de gerenciamento. Isso inclui comandos como `ALL STOP` e `SHUTDOWN`.

  Você pode exigir TLS para conexões iniciando o servidor de gerenciamento com `--ndb-mgm-tls=strict`. Consulte a Seção 25.6.19.5.3, “Usando Conexões TLS”, para detalhes.

Por essas razões, é necessário proteger o cluster, seja exigindo conexões criptografadas, seja em nível de rede usando uma configuração que isole as conexões entre os nós do NDB Cluster de qualquer outra comunicação de rede. Aqui, discutimos a solução baseada em rede, que pode ser realizada por qualquer um dos seguintes métodos:

1. Manter os nós do cluster em uma rede que é fisicamente separada de quaisquer redes públicas. Esta opção é a mais confiável; no entanto, é a mais cara de implementar.

   Mostramos um exemplo de configuração de um NDB Cluster usando uma rede fisicamente segregada aqui:

   **Figura 25.7 NDB Cluster com Firewall de Hardware**

   ![O conteúdo é descrito no texto ao redor.](images/cluster-security-network-1.png)

   Esta configuração tem duas redes, uma privada (caixa sólida) para os servidores de gerenciamento do cluster e os nós de dados, e uma pública (caixa pontilhada) onde os nós SQL residem. (Mostramos os nós de gerenciamento e dados conectados usando um switch Gigabit, pois isso proporciona o melhor desempenho.) Ambas as redes são protegidas do exterior por um firewall de hardware, às vezes também conhecido como firewall baseado em rede.

Essa configuração de rede é a mais segura porque nenhum pacote pode alcançar os nós de gerenciamento ou de dados do clúster de fora da rede — e nenhuma das comunicações internas do clúster pode alcançar o exterior — sem passar pelos nós SQL, desde que os nós SQL não permitam que nenhum pacote seja encaminhado. Isso significa, claro, que todos os nós SQL devem ser protegidos contra tentativas de hacking.

Importante

Em relação às potenciais vulnerabilidades de segurança, um nó SQL não é diferente de qualquer outro servidor MySQL. Consulte a Seção 8.1.3, “Protegendo o MySQL contra Ataque de Hackers”, para uma descrição das técnicas que você pode usar para proteger os servidores MySQL.

2. Usar um ou mais firewalls de software (também conhecidos como firewalls baseados em host) para controlar quais pacotes passam para o clúster de partes da rede que não precisam de acesso a ele. Neste tipo de configuração, um firewall de software deve ser instalado em cada host no clúster que, de outra forma, poderia ser acessado de fora da rede local.

A opção baseada em host é a menos dispendiosa de implementar, mas depende puramente de software para fornecer proteção e, portanto, é a mais difícil de manter segura.

Este tipo de configuração de rede para o NDB Cluster é ilustrado aqui:

**Figura 25.8 NDB Cluster com Firewalls de Software**

![O conteúdo é descrito no texto ao redor.](images/cluster-security-network-2.png)

Usar esse tipo de configuração de rede significa que existem duas zonas de hosts do NDB Cluster. Cada host do cluster deve ser capaz de se comunicar com todas as outras máquinas do cluster, mas apenas aqueles que hospedam nós SQL (caixa pontilhada) podem ter qualquer contato com o exterior, enquanto aqueles na zona que contém os nós de dados e os nós de gerenciamento (caixa sólida) devem ser isolados de quaisquer máquinas que não fazem parte do cluster. As aplicações que utilizam o cluster e os usuários dessas aplicações não devem ter acesso direto aos hosts dos nós de gerenciamento e dados.

Para isso, você deve configurar firewalls de software que limitem o tráfego ao tipo ou tipos mostrados na tabela a seguir, de acordo com o tipo de nó que está sendo executado em cada computador host do cluster:

**Tabela 25.40 Tipos de nó em uma configuração de firewall baseada em host**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Tipo de Nó</th> <th>Tráfego Permitido</th> </tr></thead><tbody><tr> <td>Nó SQL ou API</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Origina-se do endereço IP de um nó de gerenciamento ou de dados (usando qualquer porta TCP ou UDP). </p></li><li class="listitem"><p> Origina-se da rede na qual o clúster reside e está na porta que sua aplicação está usando. </p></li></ul> </div> </td> </tr><tr> <td>Nó de Dados ou Nó de Gerenciamento</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Origina-se do endereço IP de um nó de gerenciamento ou de dados (usando qualquer porta TCP ou UDP). </p></li><li class="listitem"><p> Origina-se do endereço IP de um nó SQL ou API. </p></li></ul> </div> </td> </tr></tbody></table>

Qualquer tráfego que não seja mostrado na tabela para um determinado tipo de nó deve ser negado.

Os detalhes da configuração de um firewall variam de acordo com o aplicativo de firewall, e estão além do escopo deste Manual. **iptables** é um aplicativo de firewall muito comum e confiável, que é frequentemente usado com **APF** como uma interface para facilitar a configuração. Você pode (e deve) consultar a documentação do firewall de software que você emprega, caso opte por implementar uma configuração de rede do NDB Cluster deste tipo, ou de um tipo “misturado” conforme discutido no próximo item.

3. Também é possível utilizar uma combinação dos dois primeiros métodos, usando tanto hardware quanto software para proteger o clúster — ou seja, usando tanto firewalls baseados em rede quanto baseados em hosts. Esse é o terceiro esquema em termos de nível de segurança e custo. Esse tipo de configuração de rede mantém o clúster atrás do firewall de hardware, mas permite que os pacotes de entrada passem além do roteador que conecta todos os hosts do clúster para alcançar os nós SQL.

Uma possível implantação de rede de um NDB Cluster usando firewalls de hardware e software em combinação é mostrada aqui:

**Figura 25.9 NDB Cluster com uma Combinação de Firewalls de Hardware e Software**

![O conteúdo é descrito no texto ao redor.](images/cluster-security-network-3.png)

Neste caso, você pode definir as regras no firewall de hardware para negar qualquer tráfego externo, exceto para os nós SQL e os nós API, e então permitir o tráfego para eles apenas nas portas necessárias pelo seu aplicativo.

Se você estiver usando uma distribuição comercial do NDB Cluster, também pode usar o MySQL Enterprise Firewall para restringir as instruções SQL feitas pelos clientes MySQL a um conjunto aprovado. Consulte a Seção 8.4.8, “MySQL Enterprise Firewall”, para mais informações.

Independentemente da configuração de rede que você usar, lembre-se de que seu objetivo, do ponto de vista de manter o clúster seguro, permanece o mesmo — impedir que qualquer tráfego não essencial chegue ao clúster, garantindo ao mesmo tempo a comunicação mais eficiente entre os nós do clúster.

Como o NDB Cluster requer um grande número de portas abertas para comunicações entre os nós, a opção recomendada é usar uma rede segregada. Isso representa a maneira mais simples de impedir que o tráfego indesejado chegue ao clúster.

Nota

Se você deseja administrar um NDB Cluster remotamente (ou seja, de fora da rede local), a maneira recomendada de fazer isso é usar o **ssh** ou outro shell de login seguro para acessar um host de nó SQL. A partir desse host, você pode então executar o cliente de gerenciamento para acessar o servidor de gerenciamento com segurança, dentro da própria rede local do cluster.

Embora seja possível fazer isso em teoria, **não** é recomendado usar o **ndb\_mgm** para gerenciar um Cluster diretamente de fora da rede local em que o Cluster está sendo executado. Como nem a autenticação nem a criptografia ocorrem entre o cliente de gerenciamento e o servidor de gerenciamento, isso representa um meio extremamente inseguro de gerenciar o cluster, e é quase certo que seja comprometido mais cedo ou mais tarde.
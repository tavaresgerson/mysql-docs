#### 21.6.18.1 Problemas de segurança e de rede do cluster NDB

Nesta seção, discutimos questões básicas de segurança de rede relacionadas ao NDB Cluster. É extremamente importante lembrar que o NDB Cluster "pronto para uso" não é seguro; você ou seu administrador de rede deve tomar as medidas adequadas para garantir que seu cluster não possa ser comprometido pela rede.

Os protocolos de comunicação em cluster são inerentemente inseguros, e nenhuma criptografia ou medidas de segurança semelhantes são usadas nas comunicações entre os nós do cluster. Como a velocidade da rede e a latência têm um impacto direto na eficiência do cluster, também não é aconselhável usar SSL ou outras criptografias para conexões de rede entre os nós, pois esses esquemas efetivamente retardam as comunicações.

Também é verdade que nenhuma autenticação é usada para controlar o acesso do nó da API a um NDB Cluster. Assim como na criptografia, o custo adicional de impor requisitos de autenticação teria um impacto negativo no desempenho do Cluster.

Além disso, não há verificação do endereço IP de origem para nenhum dos seguintes casos ao acessar o clúster:

- Nodos SQL ou API que utilizam "locais livres" criados por seções vazias de `[mysqld]` ou `[api]` no arquivo `config.ini`

  Isso significa que, se houver quaisquer seções vazias de `[mysqld]` ou `[api]` no arquivo `config.ini`, então quaisquer nós da API (incluindo nós SQL) que conheçam o nome do host (ou o endereço IP) e a porta do servidor de gerenciamento podem se conectar ao clúster e acessar seus dados sem restrições. (Consulte Seção 21.6.18.2, “Clúster NDB e Permissões do MySQL” para obter mais informações sobre isso e questões relacionadas.)

  Nota

  Você pode exercer algum controle sobre o acesso do nó SQL e API ao cluster, especificando um parâmetro `HostName` para todas as seções `[mysqld]` e `[api]` no arquivo `config.ini`. No entanto, isso também significa que, se você desejar conectar um nó API ao cluster a partir de um host anteriormente não utilizado, você precisa adicionar uma seção `[api]` contendo o nome do host ao arquivo `config.ini`.

  Mais informações estão disponíveis em outro lugar neste capítulo sobre o parâmetro `HostName`. Veja também Seção 21.4.1, “Configuração Rápida do NDB Cluster”, para exemplos de configuração usando `HostName` com nós da API.

- Qualquer cliente **ndb\_mgm**

  Isso significa que qualquer cliente de gerenciamento de clúster que receber o nome do host (ou o endereço IP) do servidor de gerenciamento e a porta (se não for a porta padrão) pode se conectar ao clúster e executar qualquer comando do cliente de gerenciamento. Isso inclui comandos como `ALL STOP` e `SHUTDOWN`.

Por essas razões, é necessário proteger o clúster em nível de rede. A configuração de rede mais segura para o Cluster é aquela que isola as conexões entre os nós do Cluster de qualquer outra comunicação de rede. Isso pode ser feito por qualquer um dos seguintes métodos:

1. Manter os nós do cluster em uma rede que esteja fisicamente separada de qualquer rede pública. Esta opção é a mais confiável; no entanto, é a mais cara de implementar.

   Mostramos um exemplo de configuração de um cluster NDB usando uma rede fisicamente segregada aqui:

   **Figura 21.9. NDB Cluster com Firewall de Hardware**

   ![O conteúdo é descrito no texto ao redor.](images/cluster-security-network-1.png)

   Essa configuração tem duas redes, uma privada (caixa sólida) para os servidores de gerenciamento do clúster e os nós de dados, e uma pública (caixa pontilhada) onde residem os nós do SQL. (Mostramos os nós de gerenciamento e de dados conectados usando um switch Gigabit, pois isso proporciona o melhor desempenho.) Ambas as redes são protegidas do exterior por um firewall de hardware, também conhecido como firewall baseado em rede.

   Essa configuração de rede é a mais segura porque nenhum pacote pode alcançar os nós de gerenciamento ou de dados do clúster de fora da rede — e nenhuma das comunicações internas do clúster pode alcançar o exterior — sem passar pelos nós SQL, desde que os nós SQL não permitam que nenhum pacote seja encaminhado. Isso significa, claro, que todos os nós SQL devem ser protegidos contra tentativas de hacking.

   Importante

   Em relação a potenciais vulnerabilidades de segurança, um nó SQL não difere de qualquer outro servidor MySQL. Consulte Seção 6.1.3, “Protegendo o MySQL contra Ataque” para obter uma descrição das técnicas que você pode usar para proteger os servidores MySQL.

2. Usar um ou mais firewalls de software (também conhecidos como firewalls baseados em hosts) para controlar quais pacotes passam para o clúster a partir de partes da rede que não precisam de acesso a ele. Nesse tipo de configuração, um firewall de software deve ser instalado em cada host do clúster, que, de outra forma, poderia ser acessado de fora da rede local.

   A opção baseada no host é a menos dispendiosa de implementar, mas depende exclusivamente de software para fornecer proteção e, portanto, é a mais difícil de manter segura.

   Este tipo de configuração de rede para o NDB Cluster é ilustrado aqui:

   **Figura 21.10. NDB Cluster com Firewalls de Software**

   ![O conteúdo é descrito no texto ao redor.](images/cluster-security-network-2.png)

   Usar esse tipo de configuração de rede significa que existem duas zonas de hosts do NDB Cluster. Cada host do cluster deve ser capaz de se comunicar com todas as outras máquinas do cluster, mas apenas aqueles que hospedam nós SQL (caixa pontilhada) podem ter qualquer contato com o exterior, enquanto aqueles na zona que contém os nós de dados e os nós de gerenciamento (caixa sólida) devem ser isolados de quaisquer máquinas que não fazem parte do cluster. As aplicações que utilizam o cluster e os usuários dessas aplicações não devem ter acesso direto aos hosts dos nós de gerenciamento e dados.

   Para isso, você deve configurar firewalls de software que limitem o tráfego para o tipo ou tipos mostrados na tabela a seguir, de acordo com o tipo de nó que está sendo executado em cada computador hospedeiro do clúster:

   **Tabela 21.62 Tipos de nós em uma configuração de clúster de firewall baseado em host**

   <table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Tipo de nó</th> <th>Permitido o tráfego</th> </tr></thead><tbody><tr> <td>Núcleo SQL ou API</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Ele origina-se do endereço IP de um nó de gerenciamento ou de dados (usando qualquer porta TCP ou UDP).</p></li><li class="listitem"><p>Ele se origina dentro da rede na qual o cluster reside e está no porto que sua aplicação está usando.</p></li></ul> </div> </td> </tr><tr> <td>Núcleo de dados ou Núcleo de gerenciamento</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p>Ele origina-se do endereço IP de um nó de gerenciamento ou de dados (usando qualquer porta TCP ou UDP).</p></li><li class="listitem"><p>Ele origina-se do endereço IP de um nó SQL ou API.</p></li></ul> </div> </td> </tr></tbody></table>

   Qualquer tráfego que não seja o mostrado na tabela para um determinado tipo de nó deve ser negado.

   As especificidades da configuração de um firewall variam de acordo com o aplicativo de firewall, e estão além do escopo deste Manual. **iptables** é um aplicativo de firewall muito comum e confiável, que é frequentemente usado com **APF** como uma interface para facilitar a configuração. Você pode (e deve) consultar a documentação do firewall do software que você utiliza, caso opte por implementar uma configuração de rede do NDB Cluster deste tipo ou de um tipo "misturado", conforme discutido no próximo item.

3. Também é possível utilizar uma combinação dos dois primeiros métodos, usando tanto hardware quanto software para proteger o clúster — ou seja, usando tanto firewalls baseados em rede quanto baseados no host. Esse tipo de configuração de rede mantém o clúster atrás do firewall de hardware, mas permite que os pacotes de entrada passem além do roteador que conecta todos os hosts do clúster para alcançar os nós do SQL.

   Uma possível implantação de rede de um NDB Cluster usando firewalls de hardware e software em combinação é mostrada aqui:

   **Figura 21.11. NDB Cluster com uma combinação de firewalls de hardware e software**

   ![O conteúdo é descrito no texto ao redor.](images/cluster-security-network-3.png)

   Nesse caso, você pode definir as regras no firewall de hardware para negar qualquer tráfego externo, exceto para os nós SQL e os nós API, e, em seguida, permitir o tráfego para eles apenas nas portas necessárias para sua aplicação.

Independentemente da configuração de rede que você usar, lembre-se de que seu objetivo, do ponto de vista da segurança do cluster, permanece o mesmo: impedir que qualquer tráfego desnecessário chegue ao cluster, garantindo ao mesmo tempo a comunicação mais eficiente entre os nós do cluster.

Como o NDB Cluster exige que um grande número de portas esteja aberto para as comunicações entre os nós, a opção recomendada é usar uma rede segregada. Isso representa a maneira mais simples de impedir que o tráfego indesejado chegue ao cluster.

Nota

Se você deseja administrar um NDB Cluster remotamente (ou seja, de fora da rede local), a maneira recomendada de fazer isso é usar o **ssh** ou outro shell de login seguro para acessar um host de nó SQL. A partir desse host, você pode então executar o cliente de gerenciamento para acessar o servidor de gerenciamento com segurança, dentro da própria rede local do cluster.

Embora seja possível fazer isso em teoria, **não** é recomendado usar **ndb\_mgm** para gerenciar um Cluster diretamente de fora da rede local em que o Cluster está sendo executado. Como nem a autenticação nem a criptografia ocorrem entre o cliente de gerenciamento e o servidor de gerenciamento, isso representa um meio extremamente inseguro de gerenciar o cluster, e é quase certo que seja comprometido mais cedo ou mais tarde.

#### 21.6.18.1 Questões de Segurança e Rede do NDB Cluster

Nesta seção, discutimos questões básicas de segurança de rede relacionadas ao NDB Cluster. É extremamente importante lembrar que o NDB Cluster "pronto para uso" (out of the box) não é seguro; você ou seu administrador de rede devem tomar as medidas adequadas para garantir que seu Cluster não possa ser comprometido pela rede.

Os protocolos de comunicação do Cluster são inerentemente inseguros, e nenhuma encryption ou medidas de segurança semelhantes são usadas nas comunicações entre os nodes no Cluster. Como a velocidade e a latency da rede têm um impacto direto na eficiência do Cluster, também não é aconselhável empregar SSL ou outra encryption para as conexões de rede entre os nodes, pois tais esquemas efetivamente retardam as comunicações.

Também é verdade que nenhuma authentication é usada para controlar o acesso de API nodes a um NDB Cluster. Assim como ocorre com a encryption, o overhead de impor requisitos de authentication teria um impacto adverso no performance do Cluster.

Além disso, não há verificação do source IP address para nenhum dos seguintes casos ao acessar o Cluster:

* SQL nodes ou API nodes usando “slots livres” criados por seções `[mysqld]` ou `[api]` vazias no arquivo `config.ini`.

  Isso significa que, se houver quaisquer seções `[mysqld]` ou `[api]` vazias no arquivo `config.ini`, então quaisquer API nodes (incluindo SQL nodes) que conheçam o host name (ou IP address) e o port do management server podem se conectar ao Cluster e acessar seus dados sem restrição. (Consulte [Seção 21.6.18.2, “NDB Cluster e Privilégios MySQL”](mysql-cluster-security-mysql-privileges.html "21.6.18.2 NDB Cluster e Privilégios MySQL"), para obter mais informações sobre esta e questões relacionadas.)

  Note

  Você pode exercer algum controle sobre o acesso de SQL nodes e API nodes ao Cluster especificando um parâmetro `HostName` para todas as seções `[mysqld]` e `[api]` no arquivo `config.ini`. No entanto, isso também significa que, caso você deseje conectar um API node ao Cluster a partir de um host previamente não utilizado, você precisará adicionar uma seção `[api]` contendo o host name dele ao arquivo `config.ini`.

  Mais informações estão disponíveis [em outro lugar neste capítulo](mysql-cluster-api-definition.html#ndbparam-api-hostname) sobre o parâmetro `HostName`. Consulte também [Seção 21.4.1, “Configuração Rápida de Teste do NDB Cluster”](mysql-cluster-quick.html "21.4.1 Quick Test Setup of NDB Cluster"), para exemplos de configuração usando `HostName` com API nodes.

* Qualquer cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client").

  Isso significa que qualquer cliente de gerenciamento de Cluster que receba o host name (ou IP address) e o port do management server (se não for o port padrão) pode se conectar ao Cluster e executar qualquer comando do cliente de gerenciamento. Isso inclui comandos como [`ALL STOP`](mysql-cluster-mgm-client-commands.html#ndbclient-stop) e [`SHUTDOWN`](mysql-cluster-mgm-client-commands.html#ndbclient-shutdown).

Por essas razões, é necessário proteger o Cluster no nível da rede. A configuração de rede mais segura para o Cluster é aquela que isola as conexões entre os Cluster nodes de quaisquer outras comunicações de rede. Isso pode ser realizado por qualquer um dos seguintes métodos:

1. Manter os Cluster nodes em uma rede fisicamente separada de quaisquer redes públicas. Esta opção é a mais confiável; no entanto, é a mais cara de implementar.

   Mostramos aqui um exemplo de configuração de NDB Cluster usando uma rede fisicamente segregada:

   **Figura 21.9 NDB Cluster com Hardware Firewall**

   ![O conteúdo é descrito no texto circundante.](images/cluster-security-network-1.png)

   Esta configuração possui duas redes, uma privada (caixa sólida) para os management servers do Cluster e data nodes, e uma pública (caixa pontilhada) onde residem os SQL nodes. (Mostramos os management nodes e data nodes conectados usando um switch gigabit, pois isso proporciona o melhor performance.) Ambas as redes são protegidas do exterior por um hardware firewall, às vezes também conhecido como firewall baseado em rede.

   Esta configuração de rede é a mais segura porque nenhum packet pode alcançar os management nodes ou data nodes do Cluster vindo de fora da rede — e nenhuma das comunicações internas do Cluster pode alcançar o exterior — sem passar pelos SQL nodes, desde que os SQL nodes não permitam que quaisquer packets sejam encaminhados. Isso significa, é claro, que todos os SQL nodes devem ser protegidos contra tentativas de hacking.

   Importante

   Com relação a potenciais vulnerabilidades de segurança, um SQL node não é diferente de qualquer outro MySQL server. Consulte [Seção 6.1.3, “Tornando o MySQL Seguro Contra Atacantes”](security-against-attack.html "6.1.3 Making MySQL Secure Against Attackers"), para uma descrição das técnicas que você pode usar para proteger os MySQL servers.

2. Usar um ou mais software firewalls (também conhecidos como firewalls baseados em host) para controlar quais packets passam para o Cluster a partir de partes da rede que não exigem acesso a ele. Neste tipo de configuração, um software firewall deve ser instalado em cada host no Cluster que, de outra forma, poderia ser acessível de fora da rede local.

   A opção baseada em host é a menos cara de implementar, mas depende puramente de software para fornecer proteção e, portanto, é a mais difícil de manter segura.

   Este tipo de configuração de rede para NDB Cluster é ilustrado aqui:

   **Figura 21.10 NDB Cluster com Software Firewalls**

   ![O conteúdo é descrito no texto circundante.](images/cluster-security-network-2.png)

   Usar este tipo de configuração de rede significa que existem duas zonas de hosts do NDB Cluster. Cada host do Cluster deve ser capaz de se comunicar com todas as outras máquinas no Cluster, mas apenas aquelas que hospedam SQL nodes (caixa pontilhada) podem ter permissão para ter qualquer contato com o exterior, enquanto aquelas na zona que contém os data nodes e management nodes (caixa sólida) devem ser isoladas de quaisquer máquinas que não façam parte do Cluster. Aplicações que usam o Cluster e usuários dessas aplicações *não* devem ter permissão para ter acesso direto aos hosts de management node e data node.

   Para conseguir isso, você deve configurar software firewalls que limitem o tráfego ao tipo ou tipos mostrados na tabela a seguir, de acordo com o tipo de node que está sendo executado em cada computador host do Cluster:

   **Tabela 21.62 Tipos de node em uma configuração de Cluster com firewall baseado em host**

   <table><thead><tr> <th>Tipo de Node</th> <th>Tráfego Permitido</th> </tr></thead><tbody><tr> <td>SQL node ou API node</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Origina-se do IP address de um management node ou data node (usando qualquer port TCP ou UDP). </p></li><li class="listitem"><p> Origina-se de dentro da rede na qual o Cluster reside e está no port que sua aplicação está usando. </p></li></ul> </div> </td> </tr><tr> <td>Data node ou Management node</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Origina-se do IP address de um management node ou data node (usando qualquer port TCP ou UDP). </p></li><li class="listitem"><p> Origina-se do IP address de um SQL node ou API node. </p></li></ul> </div> </td> </tr></tbody></table>

   Qualquer tráfego diferente do que é mostrado na tabela para um determinado tipo de node deve ser negado.

   Os detalhes da configuração de um firewall variam de aplicação de firewall para aplicação de firewall e estão além do escopo deste Manual. O **iptables** é uma aplicação de firewall muito comum e confiável, que é frequentemente usada com **APF** como um front end para facilitar a configuração. Você pode (e deve) consultar a documentação do software firewall que você emprega, caso opte por implementar uma configuração de rede NDB Cluster deste tipo, ou de um tipo “misto”, conforme discutido no próximo item.

3. Também é possível empregar uma combinação dos dois primeiros métodos, usando hardware e software para proteger o Cluster — ou seja, usando firewalls baseados em rede e baseados em host. Isso fica entre os dois primeiros esquemas em termos de nível de segurança e custo.

   Este tipo de configuração de rede mantém o Cluster atrás do hardware firewall, mas permite que os packets de entrada viajem além do router que conecta todos os hosts do Cluster para alcançar os SQL nodes.

   Uma possível implantação de rede de um NDB Cluster usando hardware e software firewalls em combinação é mostrada aqui:

   **Figura 21.11 NDB Cluster com uma Combinação de Hardware e Software Firewalls**

   ![O conteúdo é descrito no texto circundante.](images/cluster-security-network-3.png)

   Neste caso, você pode definir as regras no hardware firewall para negar qualquer tráfego externo, exceto para SQL nodes e API nodes, e então permitir o tráfego para eles apenas nos ports exigidos pela sua aplicação.

Independentemente da configuração de rede que você usar, lembre-se de que seu objetivo do ponto de vista de manter o Cluster seguro permanece o mesmo — impedir que qualquer tráfego não essencial alcance o Cluster, garantindo ao mesmo tempo a comunicação mais eficiente entre os nodes no Cluster.

Como o NDB Cluster exige que um grande número de ports esteja aberto para comunicações entre os nodes, a opção recomendada é usar uma rede segregada. Isso representa a maneira mais simples de impedir que tráfego indesejado alcance o Cluster.

Note

Se você deseja administrar um NDB Cluster remotamente (ou seja, de fora da rede local), a maneira recomendada de fazer isso é usar **ssh** ou outro secure login shell para acessar um host de SQL node. A partir deste host, você pode então executar o management client para acessar o management server com segurança, de dentro da própria rede local do Cluster.

Embora seja teoricamente possível, *não* é recomendado usar [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") para gerenciar um Cluster diretamente de fora da rede local na qual o Cluster está sendo executado. Visto que nem authentication nem encryption ocorrem entre o management client e o management server, isso representa um meio extremamente inseguro de gerenciar o Cluster e é quase certo que será comprometido mais cedo ou mais tarde.
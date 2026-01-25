## 21.3 Instalação do NDB Cluster

[21.3.1 Instalação do NDB Cluster no Linux](mysql-cluster-install-linux.html)

[21.3.2 Instalação do NDB Cluster no Windows](mysql-cluster-install-windows.html)

[21.3.3 Configuração Inicial do NDB Cluster](mysql-cluster-install-configuration.html)

[21.3.4 Inicialização Inicial do NDB Cluster](mysql-cluster-install-first-start.html)

[21.3.5 Exemplo de NDB Cluster com Tabelas e Dados](mysql-cluster-install-example-data.html)

[21.3.6 Desligamento e Reinicialização Segura do NDB Cluster](mysql-cluster-install-shutdown-restart.html)

[21.3.7 Atualização (Upgrading) e Reversão (Downgrading) do NDB Cluster](mysql-cluster-upgrade-downgrade.html)

[21.3.8 O Auto-Instalador do NDB Cluster (NDB 7.5) (NÃO MAIS SUPORTADO)](mysql-cluster-install-auto.html)

[21.3.9 O Auto-Instalador do NDB Cluster (NÃO MAIS SUPORTADO)](mysql-cluster-installer.html)

Esta seção descreve o básico para planejar, instalar, configurar e executar um NDB Cluster. Embora os exemplos na [Seção 21.4, “Configuração do NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuração do NDB Cluster") forneçam informações mais detalhadas sobre uma variedade de opções de clustering e configuração, o resultado de seguir as diretrizes e procedimentos aqui descritos deve ser um NDB Cluster utilizável que atenda aos requisitos *mínimos* de disponibilidade e proteção de dados.

Para obter informações sobre atualização (upgrading) ou reversão (downgrading) de um NDB Cluster entre versões, consulte a [Seção 21.3.7, “Atualização (Upgrading) e Reversão (Downgrading) do NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Atualização (Upgrading) e Reversão (Downgrading) do NDB Cluster").

Esta seção aborda requisitos de hardware e software; questões de rede; instalação do NDB Cluster; questões básicas de configuração; iniciar, parar e reiniciar o cluster; carregamento de um Database de exemplo; e execução de Queries.

**Pressupostos.** As seções a seguir fazem uma série de pressupostos em relação à configuração física e de rede do cluster. Esses pressupostos são discutidos nos próximos parágrafos.

**Nodes do Cluster e computadores Host.** O cluster consiste em quatro nodes, cada um em um computador host separado, e cada um com um endereço de rede fixo em uma rede Ethernet típica, conforme mostrado aqui:

**Tabela 21.4 Endereços de rede dos nodes no cluster de exemplo**

<table><thead><tr> <th>Node</th> <th>Endereço IP</th> </tr></thead><tbody><tr> <td>Management node (<span><strong>mgmd</strong></span>)</td> <td>198.51.100.10</td> </tr><tr> <td>SQL node (<span><strong>mysqld</strong></span>)</td> <td>198.51.100.20</td> </tr><tr> <td>Data node "A" (<span><strong>ndbd</strong></span>)</td> <td>198.51.100.30</td> </tr><tr> <td>Data node "B" (<span><strong>ndbd</strong></span>)</td> <td>198.51.100.40</td> </tr></tbody></table>

Esta configuração também é mostrada no diagrama a seguir:

**Figura 21.4 Configuração Multi-Computador do NDB Cluster**

![O conteúdo principal é descrito no texto circundante. Os quatro nodes se conectam a um switch central que se conecta a uma rede.](images/multi-comp-1.png)

**Endereçamento de rede.**

No interesse da simplicidade (e confiabilidade), este *How-To* utiliza apenas endereços IP numéricos. No entanto, se a resolução DNS estiver disponível em sua rede, é possível usar nomes de host em vez de endereços IP ao configurar o Cluster. Alternativamente, você pode usar o arquivo `hosts` (tipicamente `/etc/hosts` para Linux e outros sistemas operacionais tipo Unix, `C:\WINDOWS\system32\drivers\etc\hosts` no Windows, ou o equivalente do seu sistema operacional) para fornecer um meio de realizar a pesquisa de host, se disponível.

**Possíveis problemas com o arquivo hosts.** Um problema comum ao tentar usar nomes de host para os nodes do Cluster surge devido à forma como alguns sistemas operacionais (incluindo algumas distribuições Linux) configuram o nome de host do próprio sistema em `/etc/hosts` durante a instalação. Considere duas máquinas com os nomes de host `ndb1` e `ndb2`, ambas no domínio de rede `cluster`. O Red Hat Linux (incluindo alguns derivados como CentOS e Fedora) coloca as seguintes entradas nos arquivos `/etc/hosts` dessas máquinas:

```sql
#  ndb1 /etc/hosts:
127.0.0.1   ndb1.cluster ndb1 localhost.localdomain localhost
```

```sql
#  ndb2 /etc/hosts:
127.0.0.1   ndb2.cluster ndb2 localhost.localdomain localhost
```

O SUSE Linux (incluindo o OpenSUSE) coloca estas entradas nos arquivos `/etc/hosts` das máquinas:

```sql
#  ndb1 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb1.cluster ndb1
```

```sql
#  ndb2 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb2.cluster ndb2
```

Em ambas as instâncias, `ndb1` roteia `ndb1.cluster` para um endereço IP de loopback, mas obtém um endereço IP público do DNS para `ndb2.cluster`, enquanto `ndb2` roteia `ndb2.cluster` para um endereço de loopback e obtém um endereço público para `ndb1.cluster`. O resultado é que cada Data node se conecta ao Management server, mas não consegue saber quando outros Data nodes se conectaram, e assim os Data nodes parecem travar durante a inicialização.

Atenção

Você não pode misturar `localhost` e outros nomes de host ou endereços IP no `config.ini`. Por estas razões, a solução em tais casos (além de usar endereços IP para *todas* as entradas `HostName` no `config.ini`) é remover os nomes de host totalmente qualificados de `/etc/hosts` e usá-los no `config.ini` para todos os hosts do cluster.

**Tipo de computador Host.** Cada computador host em nosso cenário de instalação é um PC desktop baseado em Intel executando um sistema operacional suportado, instalado em disco em uma configuração padrão e sem serviços desnecessários em execução. O sistema operacional central com capacidades de rede TCP/IP padrão deve ser suficiente. Também por uma questão de simplicidade, assumimos que os sistemas de arquivos em todos os hosts estão configurados de forma idêntica. Caso não estejam, você deve adaptar estas instruções de acordo.

**Hardware de rede.** Placas Ethernet padrão de 100 Mbps ou 1 gigabit estão instaladas em cada máquina, juntamente com os drivers apropriados para as placas, e todos os quatro hosts estão conectados por meio de um dispositivo de rede Ethernet padrão, como um switch. (Todas as máquinas devem usar placas de rede com a mesma taxa de transferência. Ou seja, todas as quatro máquinas no cluster devem ter placas de 100 Mbps *ou* todas as quatro máquinas devem ter placas de 1 Gbps.) O NDB Cluster funciona em uma rede de 100 Mbps; no entanto, o Ethernet gigabit oferece melhor performance.

Importante

O NDB Cluster *não* se destina ao uso em uma rede cuja taxa de transferência seja inferior a 100 Mbps ou que experimente um alto grau de latência. Por esta razão (entre outras), tentar executar um NDB Cluster através de uma rede de longa distância como a Internet não deve ser bem-sucedido e não é suportado em produção.

**Dados de exemplo.** Usamos o Database `world`, que está disponível para download no site do MySQL (consulte [https://dev.mysql.com/doc/index-other.html](/doc/index-other.html)). Assumimos que cada máquina tem memória suficiente para executar o sistema operacional, os processos necessários do NDB Cluster e (nos Data nodes) armazenar o Database.

Para informações gerais sobre a instalação do MySQL, consulte [Capítulo 2, *Instalando e Atualizando o MySQL*](installing.html "Capítulo 2 Instalando e Atualizando o MySQL"). Para informações sobre a instalação do NDB Cluster no Linux e outros sistemas operacionais tipo Unix, consulte a [Seção 21.3.1, “Instalação do NDB Cluster no Linux”](mysql-cluster-install-linux.html "21.3.1 Instalação do NDB Cluster no Linux"). Para informações sobre a instalação do NDB Cluster em sistemas operacionais Windows, consulte a [Seção 21.3.2, “Instalação do NDB Cluster no Windows”](mysql-cluster-install-windows.html "21.3.2 Instalação do NDB Cluster no Windows").

Para informações gerais sobre os requisitos de hardware, software e rede do NDB Cluster, consulte a [Seção 21.2.3, “Requisitos de Hardware, Software e Rede do NDB Cluster”](mysql-cluster-overview-requirements.html "21.2.3 Requisitos de Hardware, Software e Rede do NDB Cluster").
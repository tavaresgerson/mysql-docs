## 25.3 Instalação do NDB Cluster

25.3.1 Instalação do NDB Cluster no Linux

25.3.2 Instalação do NDB Cluster no Windows

25.3.3 Configuração Inicial do NDB Cluster

25.3.4 Inicialização do NDB Cluster

25.3.5 Exemplo de NDB Cluster com Tabelas e Dados

25.3.6 Sair e Reiniciar com Segurança o NDB Cluster

25.3.7 Atualização e Downgrade do NDB Cluster

Esta seção descreve os conceitos básicos para planejar, instalar, configurar e executar um NDB Cluster. Embora os exemplos na Seção 25.4, “Configuração do NDB Cluster”, forneçam informações mais detalhadas sobre várias opções de clustering e configuração, o resultado de seguir as diretrizes e procedimentos descritos aqui deve ser um NDB Cluster utilizável que atenda aos requisitos *mínimos* para disponibilidade e proteção dos dados.

Para informações sobre a atualização ou downgrade de um NDB Cluster entre versões de lançamento, consulte a Seção 25.3.7, “Atualização e Downgrade do NDB Cluster”.

Esta seção abrange os requisitos de hardware e software; questões de rede; instalação do NDB Cluster; questões de configuração básica; inicialização, parada e reinício do cluster; carregamento de um banco de dados de amostra; e execução de consultas.

**Pressupostos.** As seções a seguir fazem uma série de pressupostos sobre a configuração física e de rede do cluster. Esses pressupostos são discutidos nos próximos parágrafos.

**Nodos do cluster e computadores hospedeiros.** O cluster consiste em quatro nós, cada um em um computador hospedeiro separado, e cada um com um endereço de rede fixo em uma rede Ethernet típica, conforme mostrado aqui:

**Tabela 25.4 Endereços de rede dos nós no cluster de exemplo**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Nível</th> <th>Endereço IP</th> </tr></thead><tbody><tr> <td>Nível de gerenciamento (<span class="command"><strong>mgmd</strong></span>)</td> <td>198.51.100.10</td> </tr><tr> <td>Nível de SQL (<a class="link" href="mysqld.html" title="6.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a>)</td> <td>198.51.100.20</td> </tr><tr> <td>Nível de dados "A" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="25.5.1 ndbd — O Daemon de Nó de Dados do NDB Cluster"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.30</td> </tr><tr> <td>Nível de dados "B" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="25.5.1 ndbd — O Daemon de Nó de Dados do NDB Cluster"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.40</td> </tr></tbody></table>

Essa configuração também é mostrada no seguinte diagrama:

**Figura 25.4 Configuração de Nível de Cluster NDB de Vários Computadores**

![A maior parte do conteúdo é descrita no texto ao redor. Os quatro níveis se conectam a um switch central que se conecta a uma rede.](images/multi-comp-1.png)

**Endereçamento de rede.**

Por simplicidade (e confiabilidade), este *Como Fazer* usa apenas endereços IP numéricos. No entanto, se a resolução de DNS estiver disponível na sua rede, é possível usar nomes de host em vez de endereços IP na configuração do Cluster. Alternativamente, você pode usar o arquivo `hosts` (tipicamente `/etc/hosts` para Linux e outros sistemas operacionais Unix-like, `C:\WINDOWS\system32\drivers\etc\hosts` no Windows, ou o equivalente do seu sistema operacional) para fornecer um meio de fazer a busca de host, se estiver disponível.

O *NDB* 9.5 suporta IPv6 para conexões entre todos os nós do Cluster NDB.

**Problemas com o arquivo hosts.** Um problema comum ao tentar usar nomes de host para nós do cluster ocorre devido à maneira como alguns sistemas operacionais (incluindo algumas distribuições Linux) configuram o próprio nome de host do sistema no `/etc/hosts` durante a instalação. Considere duas máquinas com os nomes de host `ndb1` e `ndb2`, ambas no domínio de rede `cluster`. O Red Hat Linux (incluindo algumas derivadas como CentOS e Fedora) coloca as seguintes entradas nos arquivos `/etc/hosts` dessas máquinas:

```
# ndb1 /etc/hosts:
127.0.0.1   ndb1.cluster ndb1 localhost.localdomain localhost
```

```
# ndb2 /etc/hosts:
127.0.0.1   ndb2.cluster ndb2 localhost.localdomain localhost
```

O SUSE Linux (incluindo o OpenSUSE) coloca essas entradas nos arquivos `/etc/hosts` das máquinas:

```
# ndb1 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb1.cluster ndb1
```

```
# ndb2 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb2.cluster ndb2
```

Em ambos os casos, `ndb1` redireciona `ndb1.cluster` para um endereço de IP de loopback, mas obtém um endereço IP público do DNS para `ndb2.cluster`, enquanto `ndb2` redireciona `ndb2.cluster` para um endereço de loopback e obtém um endereço público para `ndb1.cluster`. O resultado é que cada nó de dados se conecta ao servidor de gerenciamento, mas não consegue saber quando outros nós de dados se conectaram, e assim os nós de dados parecem ficar presos ao iniciar.

Cuidado

Você não pode misturar `localhost` e outros nomes de host ou endereços IP no `config.ini`. Por essas razões, a solução nesses casos (exceto usar endereços IP para todas as entradas `HostName` no `config.ini`) é remover os nomes de host totalmente qualificados do `/etc/hosts` e usá-los no `config.ini` para todos os hosts do cluster.

**Tipo de computador hospedeiro.** Cada computador hospedeiro em nosso cenário de instalação é um PC desktop baseado em Intel com um sistema operacional compatível instalado em disco em uma configuração padrão, sem nenhum serviço desnecessário. O sistema operacional principal com capacidades padrão de rede TCP/IP deve ser suficiente. Além disso, para simplicidade, também assumimos que os sistemas de arquivos em todos os hosts estejam configurados de forma idêntica. Caso contrário, você deve adaptar essas instruções conforme necessário.

**Hardware de rede.** Cartões Ethernet padrão de 100 Mbps ou 1 Gbps são instalados em cada máquina, juntamente com os drivers apropriados para os cartões, e que todos os quatro hosts estejam conectados por meio de um dispositivo de rede Ethernet padrão, como um switch. (Todas as máquinas devem usar placas de rede com o mesmo desempenho. Ou seja, todas as quatro máquinas no clúster devem ter placas de 100 Mbps *ou* todas as quatro máquinas devem ter placas de 1 Gbps.) O NDB Cluster funciona em uma rede de 100 Mbps; no entanto, o Ethernet de gigabit oferece melhor desempenho.

Importante

O NDB Cluster *não* é destinado para uso em uma rede para a qual o desempenho seja inferior a 100 Mbps ou que apresente um alto grau de latência. Por essa razão (entre outras), tentar executar um NDB Cluster em uma rede de área ampla, como a Internet, provavelmente não será bem-sucedido e não é suportado em produção.

**Dados de amostra.** Usamos o banco de dados `world`, que está disponível para download no site do MySQL (veja https://dev.mysql.com/doc/index-other.html). Assumimos que cada máquina tem memória suficiente para executar o sistema operacional, os processos necessários do NDB Cluster e (nos nós de dados) armazenar o banco de dados.

Para obter informações gerais sobre a instalação do MySQL, consulte o Capítulo 2, *Instalando o MySQL*. Para informações sobre a instalação do NDB Cluster no Linux e em outros sistemas operacionais Unix-like, consulte a Seção 25.3.1, “Instalação do NDB Cluster no Linux”. Para informações sobre a instalação do NDB Cluster em sistemas operacionais Windows, consulte a Seção 25.3.2, “Instalando o NDB Cluster no Windows”.

Para obter informações gerais sobre os requisitos de hardware, software e redes do NDB Cluster, consulte a Seção 25.2.3, “Requisitos de Hardware, Software e Redes do NDB Cluster”.
## 21.3 Instalação do Cluster NDB

21.3.1 Instalação do NDB Cluster no Linux

21.3.2 Instalação do NDB Cluster no Windows

21.3.3 Configuração Inicial do NDB Cluster

21.3.4 Inicialização do NDB Cluster

Exemplo de cluster NDB com tabelas e dados

21.3.6 Desligamento e Reinício Seguro do NDB Cluster

21.3.7 Atualização e Downgrade do NDB Cluster

21.3.8 O instalador automático do NDB Cluster (NDB 7.5) (já não é suportado)

21.3.9 O instalador automático do NDB Cluster (já não é suportado)

Esta seção descreve os conceitos básicos para planejar, instalar, configurar e executar um NDB Cluster. Embora os exemplos em Seção 21.4, “Configuração do NDB Cluster” forneçam informações mais detalhadas sobre várias opções e configurações de cluster, o resultado de seguir as diretrizes e procedimentos descritos aqui deve ser um NDB Cluster utilizável que atenda aos requisitos *mínimos* para disponibilidade e proteção dos dados.

Para obter informações sobre a atualização ou a desatualização de um NDB Cluster entre versões de lançamento, consulte Seção 21.3.7, “Atualização e Desatualização do NDB Cluster”.

Esta seção abrange os requisitos de hardware e software; problemas de rede; instalação do NDB Cluster; problemas de configuração básica; inicialização, parada e reinício do cluster; carregamento de um banco de dados de amostra; e execução de consultas.

**Premissas.** As seções a seguir fazem várias premissas sobre a configuração física e de rede do cluster. Essas premissas são discutidas nos próximos parágrafos.

**Nodos do cluster e computadores anfitriões.** O cluster é composto por quatro nós, cada um em um computador anfitrião separado, e cada um com um endereço de rede fixo em uma rede Ethernet típica, conforme mostrado aqui:

**Tabela 21.4 Endereços de rede dos nós no cluster de exemplo**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Nó</th> <th>Endereço IP</th> </tr></thead><tbody><tr> <td>Núcleo de gestão (<span class="command"><strong>mgmd</strong></span>)</td> <td>198.51.100.10</td> </tr><tr> <td>nó SQL (<a class="link" href="mysqld.html" title="4.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a>)</td> <td>198.51.100.20</td> </tr><tr> <td>Núcleo de dados "A" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="21.5.1 ndbd — O daemon do nó de dados do clúster NDB"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.30</td> </tr><tr> <td>Nodo de dados "B" (<a class="link" href="mysql-cluster-programs-ndbd.html" title="21.5.1 ndbd — O daemon do nó de dados do clúster NDB"><span class="command"><strong>ndbd</strong></span></a>)</td> <td>198.51.100.40</td> </tr></tbody></table>

Essa configuração também é mostrada no diagrama a seguir:

**Figura 21.4 Configuração de Cluster NDB com Múltiplos Computadores**

![A maioria do conteúdo é descrita no texto ao redor. Os quatro nós estão conectados a um switch central que se conecta a uma rede.](images/multi-comp-1.png)

**Endereçamento de rede.**

Por simplicidade (e confiabilidade), este *Como Fazer* usa apenas endereços IP numéricos. No entanto, se a resolução DNS estiver disponível na sua rede, é possível usar nomes de host em vez de endereços IP na configuração do Cluster. Alternativamente, você pode usar o arquivo `hosts` (geralmente `/etc/hosts` para Linux e outros sistemas operacionais Unix-like, `C:\WINDOWS\system32\drivers\etc\hosts` no Windows, ou o equivalente do seu sistema operacional) para fornecer uma maneira de fazer a busca de host, se estiver disponível.

**Problemas com o arquivo de hosts.** Um problema comum ao tentar usar nomes de host para nós do Cluster surge devido à maneira como alguns sistemas operacionais (incluindo algumas distribuições Linux) configuram o próprio nome de host do sistema no `/etc/hosts` durante a instalação. Considere duas máquinas com os nomes de host `ndb1` e `ndb2`, ambas no domínio de rede `cluster`. O Red Hat Linux (incluindo algumas derivadas como CentOS e Fedora) coloca as seguintes entradas nos arquivos `/etc/hosts` dessas máquinas:

```sql
#  ndb1 /etc/hosts:
127.0.0.1   ndb1.cluster ndb1 localhost.localdomain localhost
```

```sql
#  ndb2 /etc/hosts:
127.0.0.1   ndb2.cluster ndb2 localhost.localdomain localhost
```

O SUSE Linux (incluindo o OpenSUSE) coloca essas entradas nos arquivos `/etc/hosts` das máquinas:

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

Em ambos os casos, o `ndb1` redireciona `ndb1.cluster` para um endereço IP de loopback, mas obtém um endereço IP público do DNS para `ndb2.cluster`, enquanto o `ndb2` redireciona `ndb2.cluster` para um endereço de loopback e obtém um endereço público para `ndb1.cluster`. O resultado é que cada nó de dados se conecta ao servidor de gerenciamento, mas não consegue saber quando outros nós de dados se conectaram, e assim os nós de dados parecem ficar pendurados durante o processo de inicialização.

Cuidado

Você não pode misturar `localhost` e outros nomes de host ou endereços IP na `config.ini`. Por essas razões, a solução nesses casos (exceto o uso de endereços IP para todas as entradas `HostName` na `config.ini`) é remover os nomes de host totalmente qualificados do `/etc/hosts` e usá-los na `config.ini` para todos os hosts do cluster.

**Tipo de computador hospedeiro.** Cada computador hospedeiro em nosso cenário de instalação é um PC de mesa baseado em Intel, executando um sistema operacional suportado instalado em disco em uma configuração padrão, sem nenhum serviço desnecessário. O sistema operacional principal com capacidades padrão de rede TCP/IP deve ser suficiente. Além disso, para simplificar, também assumimos que os sistemas de arquivos em todos os hosts estejam configurados de forma idêntica. Caso contrário, você deve adaptar essas instruções conforme necessário.

**Hardware de rede.** Cartões padrão de 100 Mbps ou 1 gigabit Ethernet são instalados em cada máquina, juntamente com os drivers adequados para os cartões, e que todos os quatro hosts estejam conectados por meio de um dispositivo de rede Ethernet padrão, como um switch. (Todas as máquinas devem usar cartões de rede com o mesmo desempenho. Ou seja, todas as quatro máquinas no clúster devem ter cartões de 100 Mbps *ou* todas as quatro máquinas devem ter cartões de 1 Gbps.) O NDB Cluster funciona em uma rede de 100 Mbps; no entanto, o Ethernet de gigabit oferece melhor desempenho.

Importante

O NDB Cluster *não* é destinado para uso em uma rede para a qual o desempenho seja inferior a 100 Mbps ou que apresente um alto grau de latência. Por essa razão (entre outras), tentar executar um NDB Cluster em uma rede de área ampla, como a Internet, provavelmente não será bem-sucedido e não é suportado em produção.

**Dados de amostra.** Usamos o banco de dados `world`, que está disponível para download no site do MySQL (consulte https://dev.mysql.com/doc/index-other.html). Assumemos que cada máquina tem memória suficiente para executar o sistema operacional, os processos necessários do NDB Cluster e (nos nós de dados) armazenar o banco de dados.

Para obter informações gerais sobre a instalação do MySQL, consulte Capítulo 2, *Instalando e Atualizando o MySQL*. Para informações sobre a instalação do NDB Cluster no Linux e em outros sistemas operacionais Unix-like, consulte Seção 21.3.1, “Instalação do NDB Cluster no Linux”. Para informações sobre a instalação do NDB Cluster em sistemas operacionais Windows, consulte Seção 21.3.2, “Instalando o NDB Cluster no Windows”.

Para obter informações gerais sobre os requisitos de hardware, software e redes do NDB Cluster, consulte Seção 21.2.3, “Requisitos de Hardware, Software e Redes do NDB Cluster”.

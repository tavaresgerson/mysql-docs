## 2.5 Instalando o MySQL no Linux

2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

2.5.2 Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL

2.5.3 Instalando o MySQL no Linux Usando o Repositório APT do MySQL

2.5.4 Instalando o MySQL no Linux Usando o Repositório SLES do MySQL

2.5.5 Instalando o MySQL no Linux Usando Pacotes RPM da Oracle

2.5.6 Instalando o MySQL no Linux Usando Pacotes Debian da Oracle

2.5.7 Implantando o MySQL no Linux com Docker

2.5.8 Instalando o MySQL no Linux a partir dos Repositórios Nativos de Software

2.5.9 Instalando o MySQL no Linux com Juju

2.5.10 Gerenciando o MySQL Server com systemd

O Linux suporta diversas soluções diferentes para a instalação do MySQL. Recomendamos que você utilize uma das distribuições da Oracle, para as quais vários métodos de instalação estão disponíveis:

**Tabela 2.8 Métodos e Informações de Instalação do Linux**

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Tipo</th> <th>Método de Configuração</th> <th>Informações Adicionais</th> </tr></thead><tbody><tr> <th>Apt</th> <td>Habilite o repositório Apt do MySQL</td> <td>Documentação</td> </tr><tr> <th>Yum</th> <td>Habilite o repositório Yum do MySQL</td> <td>Documentação</td> </tr><tr> <th>Zypper</th> <td>Habilite o repositório SLES do MySQL</td> <td>Documentação</td> </tr><tr> <th>RPM</th> <td>Faça o Download de um pacote específico</td> <td>Documentação</td> </tr><tr> <th>DEB</th> <td>Faça o Download de um pacote específico</td> <td>Documentação</td> </tr><tr> <th>Generic</th> <td>Faça o Download de um pacote generic</td> <td>Documentação</td> </tr><tr> <th>Source</th> <td>Compile a partir do source</td> <td>Documentação</td> </tr><tr> <th>Docker</th> <td>Use o Oracle Container Registry. Você também pode usar o My Oracle Support para a MySQL Enterprise Edition.</td> <td>Documentação</td> </tr><tr> <th>Oracle Unbreakable Linux Network</th> <td>Use canais ULN</td> <td>Documentação</td> </tr> </tbody></table>

Como alternativa, você pode usar o package manager em seu sistema para baixar e instalar o MySQL automaticamente com pacotes dos repositórios nativos de software de sua distribuição Linux. Esses pacotes nativos geralmente estão várias versões atrás do release atualmente disponível. Normalmente, você também não pode instalar os *development milestone releases* (DMRs), pois estes geralmente não são disponibilizados nos repositórios nativos. Para mais informações sobre o uso dos instaladores de pacote nativos, consulte a Seção 2.5.8, “Instalando o MySQL no Linux a partir dos Repositórios Nativos de Software”.

Nota

Em muitas instalações Linux, você pode querer configurar o MySQL para ser iniciado automaticamente quando sua máquina for ligada. Muitas das instalações de pacotes nativos realizam essa operação para você, mas para soluções de source, binárias e RPM, talvez seja necessário configurar isso separadamente. O script necessário, **mysql.server**, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de source do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para o startup e shutdown automático do MySQL. Consulte a Seção 4.3.3, “mysql.server — Script de Startup do MySQL Server”.
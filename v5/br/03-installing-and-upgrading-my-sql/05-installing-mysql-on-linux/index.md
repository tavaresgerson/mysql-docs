## 2.5 Instalar o MySQL no Linux

2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

2.5.2 Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório Yum do MySQL

2.5.3 Instalando o MySQL no Linux Usando o Repositório APT do MySQL

2.5.4 Instalando o MySQL no Linux Usando o Repositório SLES do MySQL

2.5.5 Instalando o MySQL no Linux usando pacotes RPM da Oracle

2.5.6 Instalando o MySQL no Linux usando pacotes do Debian da Oracle

2.5.7 Implantação do MySQL no Linux com Docker

2.5.8 Instalando o MySQL no Linux a partir dos repositórios de software nativo

2.5.9 Instalando o MySQL no Linux com o Juju

2.5.10 Gerenciando o servidor MySQL com o systemd

O Linux suporta várias soluções diferentes para instalar o MySQL. Recomendamos que você use uma das distribuições da Oracle, para as quais estão disponíveis vários métodos de instalação:

**Tabela 2.8 Métodos e informações de instalação do Linux**

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th scope="col">Tipo</th> <th scope="col">Método de configuração</th> <th scope="col">Informações Adicionais</th> </tr></thead><tbody><tr> <th scope="row">Apartamento</th> <td>Ative o<a class="ulink" href="https://dev.mysql.com/downloads/repo/apt/" target="_top">Repositório MySQL Apt</a></td> <td><a class="link" href="linux-installation-apt-repo.html" title="2.5.3 Instalar o MySQL no Linux usando o repositório APT do MySQL">Documentação</a></td> </tr><tr> <th scope="row">Yum</th> <td>Ative o<a class="ulink" href="https://dev.mysql.com/downloads/repo/yum/" target="_top">Repositório Yum do MySQL</a></td> <td><a class="link" href="linux-installation-yum-repo.html" title="2.5.1 Instalar o MySQL no Linux usando o repositório Yum do MySQL">Documentação</a></td> </tr><tr> <th scope="row">Zypper</th> <td>Ative o<a class="ulink" href="https://dev.mysql.com/downloads/repo/suse/" target="_top">Repositório MySQL SLES</a></td> <td><a class="link" href="linux-installation-sles-repo.html" title="2.5.4 Instalando o MySQL no Linux usando o repositório MySQL SLES">Documentação</a></td> </tr><tr> <th scope="row">RPM</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Baixar</a>um pacote específico</td> <td><a class="link" href="linux-installation-rpm.html" title="2.5.5 Instalar o MySQL no Linux usando pacotes RPM da Oracle">Documentação</a></td> </tr><tr> <th scope="row">DEB</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Baixar</a>um pacote específico</td> <td><a class="link" href="linux-installation-debian.html" title="2.5.6 Instalar o MySQL no Linux usando pacotes do Debian da Oracle">Documentação</a></td> </tr><tr> <th scope="row">Genérico</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Baixar</a>um pacote genérico</td> <td><a class="link" href="binary-installation.html" title="2.2 Instalar o MySQL no Unix/Linux usando binários genéricos">Documentação</a></td> </tr><tr> <th scope="row">Fonte:</th> <td>Compilar a partir de<a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">fonte</a></td> <td><a class="link" href="source-installation.html" title="2.8 Instalando o MySQL a partir da fonte">Documentação</a></td> </tr><tr> <th scope="row">Docker</th> <td>Utilize o símbolo<a class="ulink" href="https://container-registry.oracle.com/" target="_blank">Oracle Container Registry</a>Você também pode usar<a class="ulink" href="https://support.oracle.com/" target="_blank">Meu Suporte do Oracle</a>para a Edição Empresarial do MySQL.</td> <td><a class="link" href="linux-installation-docker.html" title="2.5.7 Implantação do MySQL no Linux com Docker">Documentação</a></td> </tr><tr> <th scope="row">Oracle Unbreakable Linux Network</th> <td>Use canais ULN</td> <td><a class="link" href="uln-installation.html" title="2.6 Instalação do MySQL usando Unbreakable Linux Network (ULN)">Documentação</a></td> </tr></tbody></table>

Como alternativa, você pode usar o gerenciador de pacotes do seu sistema para baixar e instalar o MySQL automaticamente com pacotes dos repositórios de software nativo da sua distribuição Linux. Esses pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Normalmente, você também não pode instalar versões de marcos de desenvolvimento (DMRs), pois essas versões geralmente não estão disponíveis nos repositórios nativos. Para obter mais informações sobre como usar os instaladores de pacotes nativos, consulte a Seção 2.5.8, “Instalando o MySQL no Linux a partir dos Repositórios de Software Nativo”.

Nota

Para muitas instalações do Linux, você pode querer configurar o MySQL para ser iniciado automaticamente quando a máquina for ligada. Muitas das instalações de pacotes nativos realizam essa operação por você, mas para soluções de código-fonte, binários e RPM, você pode precisar configurá-la separadamente. O script necessário, **mysql.server**, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em um repositório de código-fonte do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para inicialização e desligamento automáticos do MySQL. Veja a Seção 4.3.3, “mysql.server — Script de Inicialização do Servidor MySQL”.

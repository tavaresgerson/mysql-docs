## 2.5 Instalando o MySQL no Linux

2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

2.5.2 Instalando o MySQL no Linux Usando o Repositório APT do MySQL

2.5.3 Usando o Repositório SLES do MySQL

2.5.4 Instalando o MySQL no Linux Usando Pacotes RPM da Oracle

2.5.5 Instalando o MySQL no Linux Usando Pacotes Debian da Oracle

2.5.6 Implementando o MySQL no Linux com Contenedores Docker

2.5.7 Instalando o MySQL no Linux a partir dos Repositórios de Software Nativos

2.5.8 Instalando o MySQL no Linux com o Juju

2.5.9 Gerenciando o Servidor MySQL com o systemd

O Linux suporta várias soluções diferentes para a instalação do MySQL. Recomendamos que você use uma das distribuições da Oracle, para as quais estão disponíveis vários métodos de instalação:

**Tabela 2.9 Métodos e Informações de Instalação do Linux**

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Tipo</th> <th>Método de Configuração</th> <th>Informações Adicionais</th> </tr></thead><tbody><tr> <th>Apt</th> <td>Ative o <a class="ulink" href="https://dev.mysql.com/downloads/repo/apt/" target="_top">repositório MySQL Apt</a></td> <td><a class="link" href="linux-installation-apt-repo.html" title="2.5.2 Instalando o MySQL no Linux usando o repositório MySQL Apt">Documentação</a></td> </tr><tr> <th>Yum</th> <td>Ative o <a class="ulink" href="https://dev.mysql.com/downloads/repo/yum/" target="_top">repositório MySQL Yum</a></td> <td><a class="link" href="linux-installation-yum-repo.html" title="2.5.1 Instalando o MySQL no Linux usando o repositório MySQL Yum">Documentação</a></td> </tr><tr> <th>Zypper</th> <td>Ative o <a class="ulink" href="https://dev.mysql.com/downloads/repo/suse/" target="_top">repositório SLES MySQL</a></td> <td><a class="link" href="linux-installation-sles-repo.html" title="2.5.3 Usando o repositório MySQL SLES">Documentação</a></td> </tr><tr> <th>RPM</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Baixe</a> um pacote específico</td> <td><a class="link" href="linux-installation-rpm.html" title="2.5.4 Instalando o MySQL no Linux usando pacotes RPM da Oracle">Documentação</a></td> </tr><tr> <th>DEB</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Baixe</a> um pacote específico</td> <td><a class="link" href="linux-installation-debian.html" title="2.5.5 Instalando o MySQL no Linux usando pacotes Debian da Oracle">Documentação</a></td> </tr><tr> <th>Geral</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Baixe</a> um pacote genérico</td> <td><a class="link" href="binary-installation.html" title="2.2 Instalando o MySQL no Unix/Linux usando binários genéricos">Documentação</a></td> </tr><tr> <th>Fonte</th> <td>Compile do <a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">código-fonte</a></td> <td><a class="link" href="source-installation.html" title="2.8 Instalando o MySQL a partir do código-fonte">Documentação</a></td> </tr><tr> <th>Docker</th> <td>Use o <a class="ulink" href="https://container-registry.oracle.com/" target="_blank">Oracle Container Registry</a>. Você também pode usar <a class="ulink" href="https://support.oracle.com/" target="_blank">O My Oracle Support</a> para a Edição Empresarial do MySQL.</td> <td><a class="link" href="linux-installation-docker.html" title="2.5.6 Deployando o MySQL no Linux com Contêineres Docker">Documentação</a></td> </tr><tr> <th>Oracle Unbreakable Linux Network</th> <td>Use os canais ULN</td> <td><a class="link" href="uln-installation.html" title="2.6 Instalando o MySQL usando o Oracle Unbreakable Linux Network (ULN)">Documentação</a></td> </tr></tbody></table>

Como alternativa, você pode usar o gerenciador de pacotes do seu sistema para baixar e instalar automaticamente o MySQL com pacotes dos repositórios de software nativo da sua distribuição Linux. Esses pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Normalmente, você também não pode instalar versões de inovação, pois elas geralmente não estão disponíveis nos repositórios nativos. Para obter mais informações sobre como usar os instaladores de pacotes nativos, consulte a Seção 2.5.7, “Instalando o MySQL no Linux a partir dos Repositórios de Software Nativo”.

Observação

Para muitas instalações Linux, você deseja configurar o MySQL para ser iniciado automaticamente quando a máquina for ligada. Muitos dos instaladores de pacotes nativos realizam essa operação por você, mas para soluções de código-fonte, binários e RPM, você pode precisar configurá-la separadamente. O script necessário, **mysql.server**, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de código-fonte do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para inicialização e desligamento automáticos do MySQL. Consulte a Seção 6.3.3, “mysql.server — Script de Inicialização do Servidor MySQL”.
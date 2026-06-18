## 2.5 Instalar o MySQL no Linux

2.5.1 Instalando o MySQL no Linux Usando o Repositório Yum do MySQL

2.5.2 Instalando o MySQL no Linux Usando o Repositório APT do MySQL

2.5.3 Instalando o MySQL no Linux Usando o Repositório SLES do MySQL

2.5.4 Instalando o MySQL no Linux usando pacotes RPM da Oracle

2.5.5 Instalando o MySQL no Linux usando pacotes do Debian da Oracle

2.5.6 Implantação do MySQL no Linux com Contenedores Docker

2.5.7 Instalando o MySQL no Linux a partir dos repositórios de software nativo

2.5.8 Instalando o MySQL no Linux com o Juju

2.5.9 Gerenciando o servidor MySQL com o systemd

O Linux suporta várias soluções diferentes para instalar o MySQL. Recomendamos que você use uma das distribuições da Oracle, para as quais estão disponíveis vários métodos de instalação:

**Tabela 2.8 Métodos e informações de instalação do Linux**

<table><thead><tr> <th scope="col">Tipo</th> <th scope="col">Método de configuração</th> <th scope="col">Informações Adicionais</th> </tr></thead><tbody><tr> <th>Apartamento</th> <td>Ative o repositório MySQL Apt</td> <td>Documentação</td> </tr><tr> <th>Yum</th> <td>Ative o repositório MySQL Yum</td> <td>Documentação</td> </tr><tr> <th>Zypper</th> <td>Ative o repositório MySQL SLES</td> <td>Documentação</td> </tr><tr> <th>RPM</th> <td>Baixe um pacote específico</td> <td>Documentação</td> </tr><tr> <th>DEB</th> <td>Baixe um pacote específico</td> <td>Documentação</td> </tr><tr> <th>Genérico</th> <td>Baixe um pacote genérico</td> <td>Documentação</td> </tr><tr> <th>Fonte:</th> <td>Compilar a partir da fonte</td> <td>Documentação</td> </tr><tr> <th>Docker</th> <td>Use o Oracle Container Registry. Você também pode usar o My Oracle Support para a Edição Empresarial do MySQL.</td> <td>Documentação</td> </tr><tr> <th>Oracle Unbreakable Linux Network</th> <td>Use canais ULN</td> <td>Documentação</td> </tr></tbody></table>

Como alternativa, você pode usar o gerenciador de pacotes do seu sistema para baixar e instalar o MySQL automaticamente com pacotes dos repositórios de software nativo da sua distribuição Linux. Esses pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Normalmente, você também não pode instalar versões de inovação, pois elas geralmente não estão disponíveis nos repositórios nativos. Para obter mais informações sobre como usar os instaladores de pacotes nativos, consulte a Seção 2.5.7, “Instalando o MySQL no Linux a partir dos Repositórios de Software Nativo”.

Nota

Para muitas instalações do Linux, você deseja configurar o MySQL para ser iniciado automaticamente quando a máquina for ligada. Muitas das instalações de pacotes nativos realizam essa operação por você, mas para soluções de código-fonte, binários e RPM, você pode precisar configurá-la separadamente. O script necessário, **mysql.server**, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de código-fonte do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para inicialização e desligamento automáticos do MySQL. Veja a Seção 6.3.3, “mysql.server — Script de Inicialização do Servidor MySQL”.

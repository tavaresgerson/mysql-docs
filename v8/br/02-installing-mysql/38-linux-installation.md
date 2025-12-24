## 2.5 Instalação do MySQL no Linux

O Linux suporta várias soluções diferentes para instalar o MySQL. Recomendamos que você use uma das distribuições da Oracle, para as quais vários métodos de instalação estão disponíveis:

**Tabela 2.9 Métodos e informações de instalação do Linux**

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th scope="col">Tipo do produto</th> <th scope="col">Método de configuração</th> <th scope="col">Informações adicionais</th> </tr></thead><tbody><tr> <th>Apto</th> <td>Ativar o repositório MySQL Apt</td> <td>Documentação</td> </tr><tr> <th>- Sim, sim.</th> <td>Ativar o repositório MySQL Yum</td> <td>Documentação</td> </tr><tr> <th>Zypper</th> <td>Ativar o repositório MySQL SLES</td> <td>Documentação</td> </tr><tr> <th>RPM</th> <td>Descarregar um pacote específico</td> <td>Documentação</td> </tr><tr> <th>DEB</th> <td>Descarregar um pacote específico</td> <td>Documentação</td> </tr><tr> <th>Produtos genéricos</th> <td>Descarregar um pacote genérico</td> <td>Documentação</td> </tr><tr> <th>Fonte</th> <td>Compilar a partir da fonte</td> <td>Documentação</td> </tr><tr> <th>Docker</th> <td>Use o Registro de Contêineres Oracle. Você também pode usar o My Oracle Support para a MySQL Enterprise Edition.</td> <td>Documentação</td> </tr><tr> <th>Oracle Unbreakable Linux Network (Rede Linux Indestrutível da Oracle)</th> <td>Utilização de canais ULN</td> <td>Documentação</td> </tr></tbody></table>

Como alternativa, você pode usar o gerenciador de pacotes em seu sistema para baixar e instalar automaticamente o MySQL com pacotes dos repositórios de software nativos de sua distribuição Linux.

::: info Note

Para muitas instalações do Linux, você deseja configurar o MySQL para ser iniciado automaticamente quando sua máquina é iniciada. Muitas das instalações de pacotes nativos executam essa operação para você, mas para soluções de código-fonte, binário e RPM você pode precisar configurar isso separadamente. O script necessário, `mysql.server`, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de origem do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para inicialização e desligamento automáticos do MySQL. Veja Seção 6.3.3, mysql.server  MySQL Server Startup Script.

:::
